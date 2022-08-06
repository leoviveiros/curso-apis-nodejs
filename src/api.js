import { loadConfig } from './helpers/config-helper.js';

loadConfig();

import { Server } from '@hapi/hapi';

import { ContextStrategy } from './db/strategies/base/context-strategy.js';

import { MongoDB } from './db/strategies/mongodb/mongodb.js';
import { HeroisModel } from './db/strategies/mongodb/model/herois-model.js';

import { PostgresDB } from './db/strategies/postgres/postgres.js';
import { UsuarioModel } from './db/strategies/postgres/model/usuario-model.js';

import { HeroisRoutes } from './routes/herois-routes.js';
import { AuthRoutes } from './routes/auth-routes.js';

import HapiJwt from '@hapi/jwt';
import Vision from '@hapi/vision';
import Inert from '@hapi/inert';
import HapiSwagger from 'hapi-swagger';

import Joi from 'joi';


const JWT_SECRET = process.env.JWT_SECRET;

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]());
}

async function startApp() {
    const app = new Server({
        port: process.env.PORT,
    });

    const mongoConnection = await MongoDB.connect();
    const mongoContext = new ContextStrategy(new MongoDB(mongoConnection, HeroisModel));

    const postgresConnection = await PostgresDB.connect();
    const usuarioModel = await PostgresDB.defineModel(postgresConnection, UsuarioModel);
    const postgresContext = new ContextStrategy(new PostgresDB(postgresConnection, usuarioModel));

    const swaggerOptions = {
        info: {
            title: 'API Herois',
            version: 'v1.0'
        }
    }

    await app.register([
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions 
        }
    ]);

    app.validator(Joi);

    app.auth.strategy('jwt_strategy', 'jwt', {
        keys: {
            key: JWT_SECRET,
            algorithms: ['HS256']
        },
        verify: {
            aud: false,
            iss: false,
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15
        },
        validate: async (artifacts, request, h) => {
            // pode verificar se o usuário continua ativo e válido
            const username = artifacts.decoded.payload.username;
            const [usuario] = await postgresContext.read({ username: username.toLowerCase() });
            
            return {
                isValid: usuario !== undefined,
                credentials: { user: username }
            }
        }
    });

    app.auth.default('jwt_strategy');

    app.route([
        ...mapRoutes(new AuthRoutes(JWT_SECRET, postgresContext), AuthRoutes.methods()),
        ...mapRoutes(new HeroisRoutes(mongoContext), HeroisRoutes.methods()),
    ]);

    await app.start();

    console.log(`Server running on port ${app.info.port}`);

    app.events.on('stop',  async () => {
        await mongoContext.disconnect();
        await postgresContext.disconnect();
    });

    return app;
}

export default startApp();
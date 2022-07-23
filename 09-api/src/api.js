import { Server } from '@hapi/hapi';
import { MongoDB } from './db/strategies/mongodb/mongodb.js';
import { ContextStrategy } from './db/strategies/base/context-strategy.js';
import { HeroisModel } from './db/strategies/mongodb/model/herois-model.js';
import { HeroisRoutes } from './routes/herois-routes.js';
import { AuthRoutes } from './routes/auth-routes.js';

import HapiJwt from '@hapi/jwt';
import Vision from '@hapi/vision';
import Inert from '@hapi/inert';
import HapiSwagger from 'hapi-swagger';

import Joi from 'joi';

const JWT_SECRET = 'secret-jwt-key';

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]());
}

async function startApp() {
    const app = new Server({
        port: 3000
    });

    const connection = await MongoDB.connect();
    const context = new ContextStrategy(new MongoDB(connection, HeroisModel));

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

    app.auth.strategy('jwt', 'jwt', {
        keys: JWT_SECRET,
        verify: {
            aud: 'urn:audience:test',
            iss: 'urn:issuer:test',
            sub: false,
            nbf: true,
            exp: true,
            maxAgeSec: 14400, // 4 hours
            timeSkewSec: 15
        },
        validate: (decoded, request) => {
            // verifica se o usuário continua ativo e válido

            return {
                isValid: true
            }
        }
    });

    app.auth.default('jwt');

    app.route([
        ...mapRoutes(new HeroisRoutes(context), HeroisRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET), AuthRoutes.methods())
    ]);

    await app.start();

    console.log(`Server running on port ${app.info.port}`);

    app.events.on('stop', () => {
        connection.close();
    });

    return app;
}

export default startApp();
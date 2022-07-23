import { Server } from '@hapi/hapi';
import { MongoDB } from './db/strategies/mongodb/mongodb.js';
import { ContextStrategy } from './db/strategies/base/context-strategy.js';
import { HeroisModel } from './db/strategies/mongodb/model/herois-model.js';
import { HeroisRoutes } from './routes/herois-routes.js';

import Vision from '@hapi/vision';
import Inert from '@hapi/inert';
import HapiSwagger from 'hapi-swagger';

import Joi from 'joi';

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
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions 
        }
    ]);

    app.validator(Joi);

    app.route([
        ...mapRoutes(new HeroisRoutes(context), HeroisRoutes.methods())
    ]);

    await app.start();

    console.log(`Server running on port ${app.info.port}`);

    return app;
}

export default startApp();
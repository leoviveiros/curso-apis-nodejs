import { Server } from '@hapi/hapi';
import { MongoDB } from './db/strategies/mongodb/mongodb.js';
import { ContextStrategy } from './db/strategies/base/context-strategy.js';
import { HeroisModel } from './db/strategies/mongodb/model/herois-model.js';
import { HeroisRoutes } from './routes/herois-routes.js';

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

    app.validator(Joi);

    app.route([
        ...mapRoutes(new HeroisRoutes(context), HeroisRoutes.methods())
    ]);

    await app.start();

    console.log(`Server running on port ${app.info.port}`);

    return app;
}

export default startApp();
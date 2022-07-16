import { BaseRoute } from "./base-route.js";
import Joi from 'joi';

export class HeroisRoutes extends BaseRoute {

    constructor(db) {
        super();
        this.db = db;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    failAction: (request, h, error) => {
                        throw error;
                    },
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: (request) => {
                try {
                    const { skip, limit, nome } = request.query;
                    const query = nome ? { nome } : undefined;

                    return this.db.read(query, skip, limit);
                } catch (error) {
                    console.error(error);
                    return 'Erro ao listar os heróis';
                }
            }
        }
    }
}
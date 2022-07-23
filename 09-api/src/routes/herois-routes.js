import { BaseRoute } from "./base-route.js";
import Joi from 'joi';

export class HeroisRoutes extends BaseRoute {

    constructor(db) {
        super();
        this.db = db;
    }

    _failAction(request, h, error) {
        throw error;
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    failAction: this._failAction,
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
                    const query = nome ? { nome: { $regex: `.*${nome}*.`} } : {};

                    return this.db.read(query, skip, limit);
                } catch (error) {
                    console.error(error);
                    return 'Erro ao listar os heróis';
                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                validate: {
                    failAction: this._failAction,
                    payload: {
                        nome: Joi.string().min(3).max(100).required(),
                        poder: Joi.string().min(2).max(30).required()
                    }
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload;
                    const result = await this.db.create({ nome, poder });

                    return result;
                } catch (error) {
                    console.error(error);
                    return 'Erro ao criar o herói';
                }
            }
        }
    }
}
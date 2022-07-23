import { BaseRoute } from "./base-route.js";
import Joi from 'joi';
import { internal, preconditionFailed } from '@hapi/boom';

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
                    return internal();
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
                    return internal();
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    failAction: this._failAction,
                    params: {
                        id: Joi.string().required()
                    },
                    payload: {
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(30)
                    }
                },
                handler: async (request) => {
                    try {
                        const { payload } = request;
                        
                        const result = await this.db.update(request.params.id, payload);

                        if (result.modifiedCount) {
                            return {
                                message: 'Herói atualizado com sucesso'
                            }
                        }

                        return preconditionFailed('Herói não encontrado');
                    } catch (error) {
                        console.error(error);
                        return internal();
                    }
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                validate: {
                    failAction: this._failAction,
                    params: {
                        id: Joi.string().required()
                    }
                },
                handler: async (request) => {
                    try {
                        const result = await this.db.delete(request.params.id);

                        if (result.deletedCount) {
                            return {
                                message: 'Herói removido com sucesso'
                            }
                        }

                        return preconditionFailed('Herói não encontrado');
                    } catch (error) {
                        console.error(error);
                        return internal();
                    }
                }
            }
        }
    }
}
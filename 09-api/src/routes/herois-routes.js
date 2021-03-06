import { BaseRoute } from "./base-route.js";
import Joi from 'joi';
import { internal, preconditionFailed } from '@hapi/boom';

const headers = Joi.object({
    Authorization: Joi.string().optional().token('Bearer').description('Bearer token')
}).unknown(true);

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
                tags: ['api'],
                description: 'Lista todos os heróis',
                notes: 'Retorna uma lista de heróis',
                validate: {
                    failAction: this._failAction,
                    headers,
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
                tags: ['api'],
                description: 'Cria um novo herói',
                validate: {
                    failAction: this._failAction,
                    headers,
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
                tags: ['api'],
                description: 'Atualiza um herói',
                validate: {
                    failAction: this._failAction,
                    headers,
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
                tags: ['api'],
                description: 'Remove um herói',
                validate: {
                    failAction: this._failAction,
                    headers,
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
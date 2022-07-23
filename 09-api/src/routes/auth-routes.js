import { BaseRoute } from "./base-route.js";
import { unauthorized } from "@hapi/boom";
import HapiJwt from '@hapi/jwt';
// import Jwt from 'jsonwebtoken';

import Joi from 'joi';

const ADMIN = {
    username: 'admin',
    password: '123'
}

export class AuthRoutes extends BaseRoute {

    constructor(secret) {
        super();
        this.secret = secret;
    }

    _failAction(request, h, error) {
        throw error;
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                tags: ['api'],
                description: 'Faz o login do usuário',
                notes: 'Retorna um token de autenticação',
                validate: {
                    failAction: this._failAction,
                    payload: {
                        username: Joi.string().min(3).max(20).required(),
                        password: Joi.string().min(3).required()
                    }
                }
            },
            handler: async (request) => {
                const { username, password } = request.payload;

                if (username.toLowerCase() !== ADMIN.username || password !== ADMIN.password) {
                    return unauthorized('Usuário ou senha inválidos');
                }

                // const token = Jwt.sign({ username }, this.secret);

                const token = HapiJwt.token.generate(
                    {
                        username
                    },
                    {
                        key: this.secret,
                        algorithm: 'HS256'
                    },
                    {
                        ttlSec: 14400 // 4 hours
                    }
                );

                return {
                    token
                };
            }
        }
    }
}
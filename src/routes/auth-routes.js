import { BaseRoute } from "./base-route.js";
import { unauthorized } from "@hapi/boom";
import HapiJwt from '@hapi/jwt';
import Joi from 'joi';

import { PasswordHelper } from '../helpers/password-helper.js';

const ADMIN = {
    username: 'admin',
    password: '123'
}

export class AuthRoutes extends BaseRoute {

    constructor(secret, db) {
        super();
        this.secret = secret;
        this.db = db;
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

                const [usuario] = await this.db.read({ username: username.toLowerCase() });

                if (!usuario) {
                    return unauthorized('Usuário ou senha inválidos');
                }

                const isValid = await PasswordHelper.compare(password, usuario.password);

                if (!isValid) {
                    return unauthorized('Usuário ou senha inválidos');
                }

                const token = HapiJwt.token.generate(
                    { username },
                    { key: this.secret, algorithm: 'HS256' },
                    { ttlSec: 14400 } // 4 hours
                );

                return {
                    token
                };
            }
        }
    }
}
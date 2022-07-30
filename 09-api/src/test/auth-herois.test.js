import { equal, ok } from 'assert';

import _api from '../api.js';

import { PostgresDB } from '../db/strategies/postgres/postgres.js';
import { ContextStrategy } from '../db/strategies/base/context-strategy.js';
import { UsuarioModel } from '../db/strategies/postgres/model/usuario-model.js';

import { PasswordHelper } from '../helpers/password-helper.js';

describe('Auth Herois test', () => {

    let api;
    let context;
    let admin;

    before(async () => {
        api = await _api;

        const connection = await PostgresDB.connect();
        const usuarioModel = await PostgresDB.defineModel(connection, UsuarioModel);
        context = new ContextStrategy(new PostgresDB(connection, usuarioModel));
    });

    after(async () => {
        await context.disconnect();
        await api.stop();
    });

    beforeEach(async () => {
        const password = await PasswordHelper.hash('123');

        admin = await context.create({
            username: 'admin',
            password,
        });
    });

    afterEach(async () => {
        await context.delete(admin.id);
    });

    it('deve obter um token', async () => {
        const result = await api.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'admin',
                password: '123'
            }
        });

        const { statusCode, payload } = result;

        equal(statusCode, 200);

        const token = JSON.parse(payload).token;
        
        ok(token);
        ok(token.length > 10);
    });

    it('deve retornar um erro ao obter um token com senha incorreta', async () => {
        const result = await api.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'admin',
                password: '321'
            }
        });

        const { statusCode } = result;

        equal(statusCode, 401);
    })

});
import { equal, ok } from 'assert';

import _api from '../api.js';

import { PostgresDB } from '../db/strategies/postgres/postgres.js';
import { ContextStrategy } from '../db/strategies/base/context-strategy.js';
import { UsuarioModel } from '../db/strategies/postgres/model/usuario-model.js';

import { PasswordHelper } from '../helpers/password-helper.js';

describe('Auth Herois test', () => {

    let api;
    let context;
    let connection;
    let admin;

    before(async () => {
        api = await _api;

        connection = await PostgresDB.connect();
        const usuarioModel = await PostgresDB.defineModel(connection, UsuarioModel);
        context = new ContextStrategy(new PostgresDB(connection, usuarioModel));
    });

    after(async () => {
        await connection.close();
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
    })

});
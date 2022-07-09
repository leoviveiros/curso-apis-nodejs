import { equal, ok } from 'assert';
import _api from '../api.js';
import mongoose from 'mongoose';

describe.only('API Herois test', () => {
    
    let api;

    before(async () => {
        api = await _api;
    });

    after(async () => {
        await api.stop();
        await mongoose.connection.close();
    });

    it('listar', async () => {
        const result = await api.inject({
            method: 'GET',
            url: '/herois'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        equal(statusCode, 200);
        ok(Array.isArray(dados));
    })
});
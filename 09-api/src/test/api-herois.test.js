import { equal, ok } from 'assert';
import _api from '../api.js';
import mongoose from 'mongoose';

import { MongoDB } from '../db/strategies/mongodb/mongodb.js';
import { ContextStrategy } from '../db/strategies/base/context-strategy.js';
import { HeroisModel } from '../db/strategies/mongodb/model/herois-model.js';

describe('API Herois test', () => {
    
    let api;
    let context;

    before(async () => {
        api = await _api;
        context = new ContextStrategy(new MongoDB(mongoose.connection, HeroisModel));
    });

    after(async () => {
        await api.stop();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await context.delete();
    })

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

    it('listar somente 10 itens', async () => {
        for (let i = 0; i < 15; i++) {
            await context.create({
                nome: `Heroi ${i}`,
                poder: 'Voo'
            });
        }

        const result = await api.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        equal(statusCode, 200);
        equal(dados.length, 10);
    })

    it('filtrar por nome', async () => {
        for (let i = 0; i < 5; i++) {
            await context.create({
                nome: `Heroi_${i}`,
                poder: 'Voo'
            });
        }

        const result = await api.inject({
            method: 'GET',
            url: '/herois?nome=Heroi_2'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        equal(statusCode, 200);
        equal(dados.length, 1);
        equal(dados[0].nome, 'Heroi_2');
    })

});
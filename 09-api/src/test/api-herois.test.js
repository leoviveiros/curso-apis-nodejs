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
        await context.create({ nome: `Homem Aranha`, poder: 'Teia' });
        await context.create({ nome: `Super Homem`, poder: 'Força' });

        const result = await api.inject({
            method: 'GET',
            url: '/herois?nome=Super Homem'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        equal(statusCode, 200);
        equal(dados.length, 1);
        equal(dados[0].nome, 'Super Homem');
    })

    it('filtrar por nome parcial', async () => {
        await context.create({ nome: `Homem Aranha`, poder: 'Teia' });
        await context.create({ nome: `Super Homem`, poder: 'Força' });

        const result = await api.inject({
            method: 'GET',
            url: '/herois?nome=Aranha'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        equal(statusCode, 200);
        equal(dados.length, 1);
        equal(dados[0].nome, 'Homem Aranha');
    })

    it('faz uma request invalida', async () => {
        const result = await api.inject({
            method: 'GET',
            url: '/herois?skip=y'
        });

        const statusCode = result.statusCode;

        equal(statusCode, 400);
    })

});
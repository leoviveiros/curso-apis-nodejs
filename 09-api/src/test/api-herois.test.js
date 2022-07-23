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

    it('cadastrar um heroi', async () => {
        const heroi = {
            nome: 'Homem Aranha',
            poder: 'Teia'
        };

        const result = await api.inject({
            method: 'POST',
            url: '/herois',
            payload: heroi
        });

        const statusCode = result.statusCode;
        const heroiResult = JSON.parse(result.payload);

        equal(statusCode, 200);
        ok(heroiResult._id);
        equal(heroiResult.nome, heroi.nome);
        equal(heroiResult.poder, heroi.poder);
    })

    it('deve atualizar um heroi', async () => {
        const heroi = await context.create({ nome: `Homem Aranha`, poder: 'Teia' });

        const result = await api.inject({
            method: 'PATCH',
            url: `/herois/${heroi._id}`,
            payload: {
                nome: 'Mulher Aranha'
            }
        });

        const statusCode = result.statusCode;

        equal(statusCode, 200);

        const [heroiAtualizado] = await context.read({ _id: heroi._id });

        equal(heroiAtualizado._id.toString(), heroi._id.toString());
        equal(heroiAtualizado.nome, 'Mulher Aranha');
        equal(heroiAtualizado.poder, heroi.poder);
    })

    it('não deve atualizar um heroi inexistente', async () => {
        const result = await api.inject({
            method: 'PATCH',
            url: `/herois/62dc2704a97ab6183fb3afa6`,
            payload: {
                nome: 'Mulher Aranha'
            }
        });

        const statusCode = result.statusCode;

        equal(statusCode, 412);
    })

    it('deve remover um heroi', async () => {
        const heroi = await context.create({ nome: `Homem Aranha`, poder: 'Teia' });

        const result = await api.inject({
            method: 'DELETE',
            url: `/herois/${heroi._id}`
        });

        const statusCode = result.statusCode;

        equal(statusCode, 200);

        const herois = await context.read({ _id: heroi._id });

        equal(herois.length, 0);
    });

    it('não deve remover um heroi inexistente', async () => {
        const result = await api.inject({
            method: 'DELETE',
            url: `/herois/62dc2704a97ab6183fb3afa6`
        });

        const statusCode = result.statusCode;

        equal(statusCode, 412);
    });

});
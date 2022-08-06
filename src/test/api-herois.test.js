import { equal, ok } from 'assert';
import _api from '../api.js';
import mongoose from 'mongoose';
import HapiJwt from '@hapi/jwt';

import { MongoDB } from '../db/strategies/mongodb/mongodb.js';
import { ContextStrategy } from '../db/strategies/base/context-strategy.js';
import { HeroisModel } from '../db/strategies/mongodb/model/herois-model.js';

import { PostgresDB } from '../db/strategies/postgres/postgres.js';
import { UsuarioModel } from '../db/strategies/postgres/model/usuario-model.js';

import { PasswordHelper } from '../helpers/password-helper.js';

describe('API Herois test', () => {
    
    let api;
    let mongoContext;
    let headers;
    let testUser;
    let postgresContext;

    before(async () => {
        api = await _api;
        mongoContext = new ContextStrategy(new MongoDB(mongoose.connection, HeroisModel));

        const pgConnection = await PostgresDB.connect();
        const usuarioModel = await PostgresDB.defineModel(pgConnection, UsuarioModel);
        postgresContext = new ContextStrategy(new PostgresDB(pgConnection, usuarioModel));

        const password = await PasswordHelper.hash('123');

        testUser = await postgresContext.create({
            username: 'teste',
            password,
        });
        
        const token = HapiJwt.token.generate(
            { username: 'teste' },
            { key: 'secret-jwt-key', algorithm: 'HS256' },
            { ttlSec: 14400 }
        );

        headers = { 'Authorization': `Bearer ${token}` };
    });

    after(async () => {
        await api.stop();
        await mongoContext.disconnect();

        await postgresContext.delete(testUser.id);
        await postgresContext.disconnect();
    });

    afterEach(async () => {
        await mongoContext.delete();
    })

    it('listar', async () => {
        const result = await api.inject({
            method: 'GET',
            headers,
            url: '/herois'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        equal(statusCode, 200);
        ok(Array.isArray(dados));
    })

    it('listar somente 10 itens', async () => {
        for (let i = 0; i < 15; i++) {
            await mongoContext.create({
                nome: `Heroi ${i}`,
                poder: 'Voo'
            });
        }

        const result = await api.inject({
            method: 'GET',
            headers,
            url: '/herois?skip=0&limit=10'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        equal(statusCode, 200);
        equal(dados.length, 10);
    })

    it('filtrar por nome', async () => {
        await mongoContext.create({ nome: `Homem Aranha`, poder: 'Teia' });
        await mongoContext.create({ nome: `Super Homem`, poder: 'Força' });

        const result = await api.inject({
            method: 'GET',
            headers,
            url: '/herois?nome=Super Homem'
        });

        const dados = JSON.parse(result.payload);
        const statusCode = result.statusCode;

        equal(statusCode, 200);
        equal(dados.length, 1);
        equal(dados[0].nome, 'Super Homem');
    })

    it('filtrar por nome parcial', async () => {
        await mongoContext.create({ nome: `Homem Aranha`, poder: 'Teia' });
        await mongoContext.create({ nome: `Super Homem`, poder: 'Força' });

        const result = await api.inject({
            method: 'GET',
            headers,
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
            headers,
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
            headers,
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
        const heroi = await mongoContext.create({ nome: `Homem Aranha`, poder: 'Teia' });

        const result = await api.inject({
            method: 'PATCH',
            url: `/herois/${heroi._id}`,
            headers,
            payload: {
                nome: 'Mulher Aranha'
            }
        });

        const statusCode = result.statusCode;

        equal(statusCode, 200);

        const [heroiAtualizado] = await mongoContext.read({ _id: heroi._id });

        equal(heroiAtualizado._id.toString(), heroi._id.toString());
        equal(heroiAtualizado.nome, 'Mulher Aranha');
        equal(heroiAtualizado.poder, heroi.poder);
    })

    it('não deve atualizar um heroi inexistente', async () => {
        const result = await api.inject({
            method: 'PATCH',
            url: `/herois/62dc2704a97ab6183fb3afa6`,
            headers,
            payload: {
                nome: 'Mulher Aranha'
            }
        });

        const statusCode = result.statusCode;

        equal(statusCode, 412);
    })

    it('deve remover um heroi', async () => {
        const heroi = await mongoContext.create({ nome: `Homem Aranha`, poder: 'Teia' });

        const result = await api.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${heroi._id}`
        });

        const statusCode = result.statusCode;

        equal(statusCode, 200);

        const herois = await mongoContext.read({ _id: heroi._id });

        equal(herois.length, 0);
    });

    it('não deve remover um heroi inexistente', async () => {
        const result = await api.inject({
            method: 'DELETE',
            headers,
            url: `/herois/62dc2704a97ab6183fb3afa6`
        });

        const statusCode = result.statusCode;

        equal(statusCode, 412);
    });

});
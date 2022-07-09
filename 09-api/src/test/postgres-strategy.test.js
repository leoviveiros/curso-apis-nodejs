import { equal, ok } from 'assert';
import { ContextStrategy } from '../db/strategies/base/context-strategy.js';
import { PostgresDB } from '../db/strategies/postgres/postgres.js';
import { HeroisModel  } from '../db/strategies/postgres/model/herois-model.js';

const HEROI_CADASTRO = {
    nome: 'Chapolin',
    poder: 'Marreta'
}

const HEROI_UPDATE = {
    nome: 'Batman',
    poder: 'Dinheiro'
}

describe('Postgres Strategy', async function () {
 
    let context = {};

    before(async () => {
        const connection = await PostgresDB.connect();
        const model = await PostgresDB.defineModel(connection, HeroisModel);

        context = new ContextStrategy(new PostgresDB(connection, model));
    })

    beforeEach(async () => {
        // exclui todos
        await context.delete();
    });

    after(async () => {
        await context.disconnect();
    });

    it('PostgreSQL Connection', async function () {
        const actual = await context.isConnected();

        equal(actual, true);
    })

    it('cadastro', async function () {
        const actual = await context.create(HEROI_CADASTRO);

        ok(actual.id);
        equal(actual.nome, HEROI_CADASTRO.nome);
        equal(actual.poder, HEROI_CADASTRO.poder);
    })

    it('listar', async function () {
        await context.create(HEROI_CADASTRO);
        
        const [result] = await context.read({ nome: HEROI_CADASTRO.nome });

        equal(result.nome, HEROI_CADASTRO.nome);
        equal(result.poder, HEROI_CADASTRO.poder);
    })

    it('atualizar', async () => {
        await context.create(HEROI_UPDATE);

        const [heroiAtualizacao] = await context.read({ nome: HEROI_UPDATE.nome });

        const heroiAtualizado = {
            ...heroiAtualizacao,
            nome: 'Mulher Maravilha'
        }

        await context.update(heroiAtualizacao.id, heroiAtualizado);

        const [result] = await context.read({ nome: heroiAtualizado.nome });

        equal(result.nome, heroiAtualizado.nome);
        equal(result.poder, heroiAtualizado.poder);
    })

    it('excluir', async () => {
        await context.create(HEROI_CADASTRO);

        const [heroiCadastrado] = await context.read({ nome: HEROI_CADASTRO.nome });

        const count = await context.delete(heroiCadastrado.id);

        equal(1, count)

        const result = await context.read({ nome: HEROI_CADASTRO.nome });

        equal(0, result.length);
    });

});
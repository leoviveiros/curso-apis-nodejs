import { equal, ok } from 'assert';
import { PostgresDB } from '../db/strategies/postgres.js';
import { ContextStrategy } from '../db/strategies/base/context-strategy.js';

const context = new ContextStrategy(new PostgresDB());

const HEROI_CADASTRO = {
    nome: 'Chapolin',
    poder: 'Marreta'
}

const HEROI_UPDATE = {
    nome: 'Batman',
    poder: 'Dinheiro'
}

describe('Postgres Strategy', function () {
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

});
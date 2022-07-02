import { equal, ok } from 'assert';
import { MongoDB } from '../db/strategies/mongodb.js';
import { ContextStrategy } from '../db/strategies/base/context-strategy.js';

const context = new ContextStrategy(new MongoDB());

const HEROI_CADASTRO = {
    nome: 'Chapolin',
    poder: 'Marreta'
}

const HEROI_UPDATE = {
    nome: 'Batman',
    poder: 'Dinheiro'
}

describe('MongoDB Strategy', function () {

    beforeEach(async () => {
        // await context.delete();
    });

    it('verifica a conexao', async function () {
        const actual = await context.isConnected();

        equal(actual, true);
    })

    it('cadastro', async function () {
        const actual = await context.create(HEROI_CADASTRO);

        ok(actual.id);
        equal(actual.nome, HEROI_CADASTRO.nome);
        equal(actual.poder, HEROI_CADASTRO.poder);
    })

})
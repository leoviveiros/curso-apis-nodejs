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

    it.only('verifica a conexao', async function () {
        const actual = await context.isConnected();

        equal(actual, true);
    })
})
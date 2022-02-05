const { deepEqual, ok } = require('assert');

const database = require('./database');

const HERO_FLASH = {
    id: 1,
    name: 'Flash',
    power: 'Speed',
}

describe('Suite de manipulacao de herois', () => {

    it('deve pesquisar um heroi, usando arquivos', async () => {
        const expected = HERO_FLASH;
        const actual = await database.buscarPorId(expected.id);

        deepEqual(actual, expected);
    });

    it('deve pesquisar listar os herois, usando arquivos', async () => {
        const expected = [HERO_FLASH];
        const actual = await database.listar();

        deepEqual(actual, expected);
    });

    xit('deve cadastrar um heroi, usando arquivos', async () => {
        const expected = HERO_FLASH;

        ok(null, expected);
    });

});
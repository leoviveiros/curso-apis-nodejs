const { deepEqual, ok } = require('assert');

const database = require('./database');

const HERO_FLASH = {
    id: 1,
    name: 'Flash',
    power: 'Speed',
}

describe('Suite de manipulacao de herois', () => {

    afterEach(async () => {
        await database.limparDados();
    });

    describe('listar, buscar e remover herois', () => {
        beforeEach(async () => {
            await database.escreverArquivo([HERO_FLASH]);
        });

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

        it('deve remover um heroi, usando arquivos', async () => {            
            const result = await database.remover(HERO_FLASH.id);

            ok(result);

            const expected = null;
            const actual = await database.buscarPorId(HERO_FLASH.id);

            deepEqual(actual, expected);
        });
    });

    it('deve cadastrar um heroi, usando arquivos', async () => {
        const expected = { id: 2, name: 'Batman', power: 'Money' };

        await database.cadastrar(expected);

        const actual = await database.buscarPorId(expected.id);

        deepEqual(actual, expected);
    });

});
const { readFile } = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(readFile);

class Database {

    constructor() {
        this.NOME_ARQUIVO = 'herois.json'
    }

    async obterDadosArquivo() {
        const arquivo = await readFileAsync(this.NOME_ARQUIVO, 'utf8');

        return JSON.parse(arquivo.toString());
    }

    escreverArquivo() {

    }

    async buscarPorId(id) {
        const dados = await this.obterDadosArquivo();
        const [result] = dados.filter(item => item.id === id);
        return result;
    }

    listar() {
        return this.obterDadosArquivo();
    }

}

module.exports = new Database();
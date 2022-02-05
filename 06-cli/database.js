const { readFile, writeFile } = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

class Database {

    constructor() {
        this.NOME_ARQUIVO = 'herois.json'
    }

    async obterDadosArquivo() {
        const arquivo = await readFileAsync(this.NOME_ARQUIVO, 'utf8');

        return JSON.parse(arquivo.toString());
    }

    async escreverArquivo(dados) {
        await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados));
        return true;
    }

    async cadastrar(heroi) {
        const dados = await this.obterDadosArquivo();
        const id = heroi.id ? heroi.id : Date.now();

        const heroiComId = {
            id,
            ...heroi
        }

        dados.push(heroiComId);

        return await this.escreverArquivo(dados);
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
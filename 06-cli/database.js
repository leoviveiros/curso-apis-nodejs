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

        return JSON.parse(arquivo ? arquivo.toString() : '[]');
    }

    async escreverArquivo(dados) {
        await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados));
        return true;
    }

    async cadastrar(heroi) {
        const dados = await this.obterDadosArquivo() || [];
        const id = heroi.id !== undefined ? heroi.id : Date.now();

        const heroiComId = {
            ...heroi,
            id
        }

        dados.push(heroiComId);

        return await this.escreverArquivo(dados);
    }

    async buscarPorId(id) {
        if (!id) {
            throw Error('É necessário informar o id do heroi');
        }

        const dados = await this.obterDadosArquivo();
        const [result] = dados.filter(item => item.id === parseInt(id));

        return result;
    }

    async listar() {
        return this.obterDadosArquivo();
    }

    async remover(id) {
        if (!id) {
            throw Error('É necessário informar o id do heroi');
        }
        
        const dados = await this.obterDadosArquivo();
        const indice = dados.findIndex(item => item.id === parseInt(id));

        if (indice === -1) {
            throw Error('O heroi não existe');
        }

        dados.splice(indice, 1);

        return await this.escreverArquivo(dados);
    }

    async atualizar(id, heroi) {
        if (!id) {
            throw Error('É necessário informar o id do heroi');
        }
        
        const dados = await this.obterDadosArquivo();
        const indice = dados.findIndex(item => item.id === parseInt(id));

        if (indice === -1) {
            throw Error('O heroi não existe');
        }

        const atual = dados[indice];
        dados[indice] = {...atual, ...heroi, id: parseInt(id)};

        return await this.escreverArquivo(dados);
    }

    async limparDados() {
        return this.escreverArquivo([]);
    }

}

module.exports = new Database();
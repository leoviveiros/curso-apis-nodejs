const { get } = require('axios');

const base_url = 'https://swapi.dev/api';

async function obterPessoa(nome) {
    const url = `${base_url}/people/?search=${nome}&format=json`;
    const response = await get(url);

    return response.data.results.map(mapearPessoa);
}

function mapearPessoa(item) {
    return {
        nome: item.name,
        altura: item.height
    }
}

module.exports = {
    obterPessoa
}
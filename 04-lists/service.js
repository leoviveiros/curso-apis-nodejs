const axios = require('axios');
const base_url = 'https://swapi.dev/api';

async function obterPessoas(nome) {
    const url = `${base_url}/people/?search=${nome}&format=json`;
    const response = await axios.get(url);

    return response.data;
}

module.exports = {
    obterPessoas
}
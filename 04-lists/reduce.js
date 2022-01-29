const { obterPessoas } = require('./service');

async function main() {
    try {
        const { results } = await obterPessoas('a');   
       
        const alturas = results.map(pessoa => parseInt(pessoa.height));
        const total = alturas.reduce((anterior, proximo) => anterior + proximo);

        console.log('total', total);
    } catch (error) {
        console.error(error);
    }
}

main();
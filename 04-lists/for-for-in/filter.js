const { obterPessoas } = require('./service');

async function main() {
    try {
        const { results } = await obterPessoas('a');   
       
        const familiaLars = results.filter(pessoa => pessoa.name.toLowerCase().includes('lars'));
        const names = familiaLars.map(pessoa => pessoa.name);

        console.log(names);
    } catch (error) {
        console.error(error);
    }
}

main();
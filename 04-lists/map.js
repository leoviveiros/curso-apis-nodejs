const service = require('./service');

async function main() {
    try {
        const result = await service.obterPessoas('a');   
        // const names = [];

        // result.results.forEach(pessoa => {
        //     names.push(pessoa.name);
        // });

        const names = result.results.map(pessoa => pessoa.name);

        console.log(names);
    } catch (error) {
        console.error(error);
    }
}

main();
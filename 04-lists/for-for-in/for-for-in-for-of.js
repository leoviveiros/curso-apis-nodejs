const service = require('./service');

async function main() {
    try {
        const result = await service.obterPessoas('a');   
        const names = [];

        console.time('for')
        for (let i = 0; i < result.results.length - 1; i++) {
            const pessoa = result.results[i];
            const nome = pessoa.name;
            names.push(nome);
        }
        console.timeEnd('for') // 0.641ms

        console.time('for-in')
        for (let i in result.results) {
            const pessoa = result.results[i];
            names.push(pessoa.name);
        }
        console.timeEnd('for-in') // 0.606ms

        console.time('for-of')
        for (let pessoa of result.results) {
            names.push(pessoa.name);
        }
        console.timeEnd('for-of') // 0584ms

        console.log(names);
    } catch (error) {
        console.error(error);
    }
}

main();
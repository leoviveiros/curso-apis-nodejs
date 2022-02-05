const { program } = require('commander');
const Database = require('./database');
const Heroi = require('./heroi');

async function main() {
    program
        .version('v1.0.0')
        .option('-n, --name [value]', 'Nome do herói')
        .option('-p, --power [value]', 'Poder do herói')
        .option('-i, --id [value]', 'Id do herói')
        .option('-c --cadastrar', 'Cadastra um novo herói')
        .parse(process.argv);
    
    try {
        const options = program.opts();
        const heroi = new Heroi(options);

        if (options.cadastrar) {
            await Database.cadastrar(heroi);
            console.log('Herói cadastrado com sucesso!');
        }    
    } catch (error) {
        console.error(error);
    }
}

main()
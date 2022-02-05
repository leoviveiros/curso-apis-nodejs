const { program } = require('commander');
const Database = require('./database');
const Heroi = require('./heroi');

async function main() {
    program
        .version('v1.0.0')
        .option('-n, --name [value]', 'Nome do herói')
        .option('-p, --power [value]', 'Poder do herói')
        .option('-i, --id [value]', 'Id do herói')
        .option('-l, --list', 'Listar todos os heróis')
        .option('-c --cadastrar', 'Cadastra um novo herói')
        .option('-r --remover', 'Remove um herói pelo id')
        .parse(process.argv);
    
    try {
        const options = program.opts();
        const heroi = new Heroi(options);

        if (options.cadastrar) {
            await Database.cadastrar(heroi);
            console.log('Herói cadastrado com sucesso!');
            return
        }    

        if (options.list) {
            const dados = await Database.listar();
            console.log(dados);
            return
        }

        if (options.remover) {
            await Database.remover(options.id);
            console.log('Herói removido com sucesso!');
            return
        }
    } catch (error) {
        console.error(error);
    }
}

main()
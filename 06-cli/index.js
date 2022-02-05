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
        .option('-a --atualizar', 'Atualiza um herói pelo id')
        .option('-b --buscar', 'Busca um herói pelo id')
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
            await Database.remover(heroi.id);
            console.log('Herói removido com sucesso!');
            return
        }

        if (options.atualizar) {
            const dadosHeroi = JSON.parse(JSON.stringify(heroi)); // limpa undefinded
            await Database.atualizar(heroi.id, dadosHeroi);
            console.log('Herói atualizado com sucesso!');
            return
        }

        if (options.buscar) {
            const result = await Database.buscarPorId(heroi.id);

            if (!result) {
                console.log('O heroi não existe');
                return
            }

            console.log(result);
            return
        }
    } catch (error) {
        console.error(error);
    }
}

main()
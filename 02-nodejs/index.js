/*
0 Obter um usuário
1 Obter o número de telefone de um usuário a partir de seu ID
2 Obter o endereço do usuário pelo ID
 */
const util = require('util');
const obterEnderecoAsync = util.promisify(obterEndereco);

function obterUsuario() {
    return new Promise(resolve => { 
        setTimeout(() => {
            return resolve({
                id: 1,
                nome: 'Fulano',
                dataNascimento: new Date()
            });
        }, 1000);
    });
}

function obterTelefone(idUsuario) {
    return new Promise(resolve => {
        setTimeout(() => {
            return resolve({
                ddd: 32,
                telefone: '9876-4321'
            });
        }, 2000);
    });
}

function obterEndereco(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            rua: 'Rua dos bobos',
            numero: 0
        });
    }, 2000);
}

async function main() {
    try {
        console.time('medida-promise');

        const usuario = await obterUsuario();

        const resultado = await Promise.all([
            obterTelefone(usuario.id),
            obterEnderecoAsync(usuario.id)
        ]);
        
        const telefone = resultado[0];
        const endereco = resultado[1];

        console.log(`
            Nome: ${usuario.nome},
            Telefone: (${telefone.ddd}) ${telefone.telefone},
            Endereço: ${endereco.rua}, ${endereco.numero}
        `);

        console.timeEnd('medida-promise');
    } catch (error) {
        console.error('DEU RUIM', error);
    }
}

main();

/* Codigo antigo usando promises
const usuarioPromise = obterUsuario();

usuarioPromise
    .then(usuario => obterTelefone(usuario.id)
        .then(telefone => {
            return { ...usuario, ...telefone };
        })
        .then(resultado => obterEnderecoAsync(resultado.id)
            .then(endereco => {
                return { ...resultado, ...endereco };
            })
        ))
    .then(usuario => {
        console.log(`
            Nome: ${usuario.nome},
            Telefone: (${usuario.ddd}) ${usuario.telefone},
            Endereço: ${usuario.rua}, ${usuario.numero}
        `);
    })
    .catch(erro => console.log('Deu ruim: ', erro)); */


/* Codigo antigo usando callbacks
obterUsuario(function resolverUsuario(erroUsuario, usuario) {
    if (erroUsuario) {
        console.error('DEU RUIM pro usuario', erroUsuario);
        return;
    }

    obterTelefone(usuario.id, function resolverTelefone(erroTelefone, telefone) {
        if (erroTelefone) {
            console.error('DEU RUIM pro telefone', erroTelefone);
            return;
        }
    
        obterEndereco(usuario.id, function resolverEndereco(erroEndereco, endereco) {
            if (erroEndereco) {
                console.error('DEU RUIM pro endereco', erroEndereco);
                return;
            }

            console.log(`
                Nome: ${usuario.nome},
                Telefone: (${telefone.ddd}) ${telefone.telefone},
                Endereço: ${endereco.rua}, ${endereco.numero}
            `);
        });
    });
}); */
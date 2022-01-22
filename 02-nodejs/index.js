/*
0 Obter um usuário
1 Obter o número de telefone de um usuário a partir de seu ID
2 Obter o endereço do usuário pelo ID
 */

function obterUsuario(callback) {
    setTimeout(() => {
        return callback(null, {
            id: 1,
            nome: 'Fulano',
            dataNascimento: new Date()
        });
    }, 1000);
}

function obterTelefone(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            ddd: 32,
            telefone: '9876-4321'
        });
    }, 2000);
}

function obterEndereco(idUsuario, callback) {
    setTimeout(() => {
        return callback(null, {
            rua: 'Rua dos bobos',
            numero: 0
        });
    }, 2000);
}

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
});
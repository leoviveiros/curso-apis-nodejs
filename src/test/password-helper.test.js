import { equal, ok, notEqual } from 'assert';
import { PasswordHelper } from '../helpers/password-helper.js';

describe('PasswordHelper Suite', () => {

    const SENHA = '123@Qwerty';
    const HASH = '$2b$04$FbIBQUiIJVqtWziPAJjjUuewabco320gG/vDMPxYsKn0cWbcU5582';
    
    it('deve gerar um hash de uma senha', async () => {
        const result = await PasswordHelper.hash(SENHA);

        ok(result)
        notEqual(result, SENHA);
        ok(result.length > 10)
    });

    it('deve comparar uma senha com um hash', async () => {
        const result = await PasswordHelper.compare(SENHA, HASH);

        ok(result)
    });

});
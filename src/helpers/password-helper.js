import bcrypt from 'bcrypt';

export class PasswordHelper {
    static SALT = parseInt(process.env.PWD_SALT);

    static hash(password) {
        return bcrypt.hash(password, PasswordHelper.SALT);
    }

    static compare(password, hash) {
        return bcrypt.compare(password, hash);
    }

}
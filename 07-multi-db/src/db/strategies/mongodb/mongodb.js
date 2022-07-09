import { Crud } from '../base/crud.js';
import mongoose from 'mongoose';

const { connect, connection } = mongoose;

export class MongoDB extends Crud {

    constructor(connection, model) {
        super();

        this._connection = connection;
        this._model = model;
    }

    static connect() {
        connect('mongodb://admin:admin@localhost:27017/heroes', error => {
            if (error) {
                console.error('Falha ao conectar!', error);
            }
        });

        connection.once('open', () => console.log('mongodb rodando!'));

        return connection;
    }

    async isConnected() {
        let connected = this._connection.readyState === 1;

        if (!connected) {
            await new Promise(resolve => setTimeout(resolve, 500));

            connected = this._connection.readyState === 1;
        }

        return connected;
    }

    create(item) {
        return this._model.create(item);
    }

    read(query = {}) {
        return this._model.find(query);
    }

    update(id, item) {
        return this._model.updateOne({ _id: id }, { $set: item });
    }

    delete(id) {
        if (id) {
            return this._model.deleteOne({ _id: id });
        } else {
            return this._model.deleteMany({});
        }
    }

    disconnect() {
        return this._connection.close();
    }

}
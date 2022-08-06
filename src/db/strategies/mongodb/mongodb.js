import { Crud } from '../base/crud.js';
import mongoose from 'mongoose';

const { connect, connection } = mongoose;

export class MongoDB extends Crud {

    constructor(connection, model) {
        super();

        this._connection = connection;
        this._model = model;
    }

    static async connect() {
        return new Promise((resolve, reject) => {
            connect(process.env.MONGODB_URL, error => {
                if (error) {
                    console.error('Falha ao conectar!', error);
                    reject(error);
                }
            });

            connection.once('open', () => resolve(connection));
        });
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

    read(query = {}, skip = 0, limit = 10) {
        return this._model.find(query).skip(skip).limit(limit);
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
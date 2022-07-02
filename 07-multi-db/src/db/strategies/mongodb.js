import { Crud } from './base/crud.js';
import mongoose from 'mongoose';

const { connect, connection, model, Schema } = mongoose;

export class MongoDB extends Crud {
    constructor() {
        super();
        this._connect();
        this._defineModel();
    }

    _connect() {
        connect('mongodb://admin:admin@localhost:27017/heroes', error => {
            if (error) {
                console.error('Falha ao conectar!', error);
            }
        });

        connection.once('open', () => console.log('mongodb rodando!'));
    }

    _defineModel() {
        const heroisSchema = new Schema({
            nome: { type: String, required: true },
            poder: { type: String, required: true },
            insertedAt: { type: Date, default: new Date() }
        });

        this.Herois = model('heroes', heroisSchema);
    }

    async isConnected() {
        let connected = connection.readyState === 1;

        if (!connected) {
            await new Promise(resolve => setTimeout(resolve, 500));

            connected = connection.readyState === 1;
        }

        return connected;
    }

    create(item) {
        return this.Herois.create(item);
    }

    read(query = {}) {
        return this.Herois.find(query);
    }

    update(id, item) {
        return this.Herois.updateOne({ _id: id }, { $set: item });
    }

    disconnect() {
        return connection.close();
    }

}
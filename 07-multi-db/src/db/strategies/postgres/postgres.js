import { Crud } from '../base/crud.js';
import { Sequelize } from 'sequelize';

export class PostgresDB extends Crud {
    constructor(connection, model) {
        super();
        this._connection = connection;
        this._model = model;
    }

    static async connect() {
        const connection = new Sequelize('heroes', 'postgres', 'postgres', {
            host: 'localhost',
            dialect: 'postgres',
            quoteIdentifiers: false,
            logging: false,
        });

        return connection;
    }

    static async defineModel(connection, model) {
        const heroisModel = connection.define(model.name, model.schema, model.options);

        await heroisModel.sync();

        return heroisModel;
    }

    async isConnected() {
        try {
            await this._connection.authenticate();
            return true
        } catch (error) {
            console.error('error:', error);
            return false;
        }
    }

    async create(item) {
        const { dataValues } = await this._model.create(item);

        return dataValues;
    }

    async read(query = {}) {
        return this._model.findAll({where: query, raw: true });
    }

    async update(id, item) {
        return this._model.update(item, { where: { id: id } });
    }

    async delete(id) {
        const query = id ? { id } : {};

        return this._model.destroy({ where: query });
    }

    async disconnect() {
        return this._connection.close();
    }
}
import { Crud } from './base/crud.js';
import { Sequelize } from 'sequelize';

export class PostgresDB extends Crud {
    constructor() {
        super();
        this._connect();
        this._defineModel();
    }

    _connect() {
        this.driver = new Sequelize('heroes', 'postgres', 'postgres', {
            host: 'localhost',
            dialect: 'postgres',
            quoteIdentifiers: false
        });
    }

    async _defineModel() {
        this.Herois = this.driver.define('herois', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                required: true
            },
            nome: {
                type: Sequelize.STRING,
                required: true
            },
            poder: {
                type: Sequelize.STRING,
                required: true
            }
        }, {
            tableName: 'TB_HEROIS',
            freezeTableName: false,
            timestamps: false
        });

        await this.Herois.sync();
    }

    async isConnected() {
        try {
            await this.driver.authenticate();
            return true
        } catch (error) {
            console.error('error:', error);
            return false;
        }
    }

    async create(item) {
        const { dataValues } = await this.Herois.create(item);
        
        return dataValues;
    }

    async read(query = {}) {
        return this.Herois.findAll({where: query, raw: true });
    }

    async update(id, item) {
        return this.Herois.update(item, { where: { id: id }})
    }
}
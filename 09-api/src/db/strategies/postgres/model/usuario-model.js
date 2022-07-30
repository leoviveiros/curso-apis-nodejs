import { Sequelize } from 'sequelize';

export const UsuarioModel = {
    name: 'usuarios',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            required: true
        },
        username: {
            type: Sequelize.STRING,
            required: true,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            required: true
        }
    },
    options: {
        tableName: 'TB_USUARIOS',
        freezeTableName: false,
        timestamps: false
    }
}
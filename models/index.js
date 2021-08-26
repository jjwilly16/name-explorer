/* eslint import/prefer-default-export: 0 */
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';
import NameModel from './Name';
import NameByYearModel from './NameByYear';

// Models
export const Name = NameModel({ Sequelize, sequelize, DataTypes });
export const NameByYear = NameByYearModel({ Sequelize, sequelize, DataTypes });
export const instance = sequelize;
export default Sequelize;

// Relationships
Name.hasMany(NameByYear, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
        allowNull: false,
        name: 'nameid',
    },
});
NameByYear.belongsTo(Name, {
    foreignKey: {
        allowNull: false,
        name: 'nameid',
    },
});

export async function sync() {
    await sequelize.sync({
        force: true,
        // alter: {
        //     drop: false,
        // },
    });
}

// need to call this from app initialization
export async function authenticate() {
    try {
        await sequelize.authenticate();
        // if (debug.development) {
        //     await sync();
        // }
        return sequelize;
    } catch (e) {
        console.error('Database connection failed', e);
        return null;
    }
}

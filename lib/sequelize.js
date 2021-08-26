import { Sequelize } from 'sequelize';
import 'mariadb';

export default new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    dialect: 'mariadb',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
});

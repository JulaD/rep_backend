import { Sequelize } from 'sequelize';

require('dotenv').config();

const DB: string = process.env.DB || 'parameter_database';
const USER: string = process.env.MYSQLUSER || 'root';
const PASSWORD: string = process.env.PASSWORD || 'password';
const HOST: string = process.env.HOST || 'localhost';

const sequelize = new Sequelize(
  DB,
  USER,
  PASSWORD,
  {
    host: HOST,
    dialect: 'mysql',
    dialectOptions: {
      multipleStatements: true,
    },
    logging: false,
  },
);

export default sequelize;

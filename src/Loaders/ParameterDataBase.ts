import { Sequelize } from 'sequelize';

const DB: string = process.env.DB || 'core_database';
const USER: string = process.env.USER || 'root';
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

import { Sequelize } from 'sequelize';

const DB: string = process.env.DB || 'parameter_database';
const USER: string = process.env.USER || 'root';
const PASSWORD: string = process.env.PASSWORD || 'Comfortablynumb.07';
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

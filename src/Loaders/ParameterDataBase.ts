import { Sequelize } from 'sequelize';
import { DBConfig } from '../Config/DBConfig';

const sequelize = new Sequelize(
  DBConfig.DB,
  DBConfig.USER,
  DBConfig.PASSWORD,
  {
    host: DBConfig.HOST,
    dialect: 'mysql',
    dialectOptions: {
      multipleStatements: true,
    },
  },
);

export default sequelize;

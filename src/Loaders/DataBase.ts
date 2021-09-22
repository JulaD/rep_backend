import fs from 'fs';
import { Sequelize } from 'sequelize';
import { DBConfig } from '../Config/DBConfig';

function initDataBase(): Sequelize {
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
  const loadQuery: string = fs.readFileSync('/DBLoader.sql').toString();
  sequelize.query(loadQuery);
  return sequelize;
}

export default { initDataBase };

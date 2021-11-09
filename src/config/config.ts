require('dotenv').config();

export const development = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
};

export const secret = {
  auth: 'HN$t@2*?mDusFsT!',
};

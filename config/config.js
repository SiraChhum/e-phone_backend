import dotenv from "dotenv";


dotenv.config();

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DATABASE_URL, PORT, NODE_ENV } = process.env;

export default {
  development: {
    username:DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres'
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME + '_test',
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres'
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres'
  }
};

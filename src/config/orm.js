import dotenv from "dotenv";
import { Sequelize } from 'sequelize';


dotenv.config();

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DATABASE_URL, PORT, NODE_ENV } = process.env;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
});
try {
  await db.authenticate();
  console.log(' Connected to PostgreSQL');
} catch (error) {
  console.error(' Unable to connect to the database:', error);
}

export default db;
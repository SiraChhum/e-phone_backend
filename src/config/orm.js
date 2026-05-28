import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const {
  DATABASE_URL,
  DB_USER,
  DB_HOST,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} = process.env;

// Initialize Sequelize, preferring DATABASE_URL if provided
const db = DATABASE_URL
  ? new Sequelize(DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: { ssl: { rejectUnauthorized: false } },
    })
  : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT ? Number(DB_PORT) : 5432,
      dialect: "postgres",
      dialectOptions: { ssl: { rejectUnauthorized: false } },
    });

// Test connection at startup
(async () => {
  try {
    await db.authenticate();
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ Unable to connect to PostgreSQL:", err);
  }
})();

export default db;
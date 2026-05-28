import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const {
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  PORT,
  NODE_ENV,
} = process.env;

// Configure PostgreSQL connection, preferring DATABASE_URL if provided
export const db = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: DB_HOST,
      port: DB_PORT ? Number(DB_PORT) : 5432,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      ssl: { rejectUnauthorized: false },
    });

export const server = {
  port: PORT ? Number(PORT) : 3000,
  nodeEnv: NODE_ENV || "development",
};

import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DATABASE_URL, PORT, NODE_ENV } = process.env;

export const db = DATABASE_URL
  ? new Pool({ connectionString: DATABASE_URL })
  : new Pool({
      user: DB_USER,
      host: DB_HOST,
      database: DB_NAME,
      password: DB_PASSWORD,
      port: DB_PORT ? Number(DB_PORT) : 5432,
    });

export const server = {
  port: PORT ? Number(PORT) : 3000,
  nodeEnv: NODE_ENV || "development",
};

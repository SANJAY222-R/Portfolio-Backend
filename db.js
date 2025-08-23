import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text, params) => pool.query(text, params);

export const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      reset_token VARCHAR(255),
      reset_token_expires BIGINT
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Users table is ready.");
  } catch (err) {
    console.error("Error creating users table:", err);
    process.exit(1);
  }
};

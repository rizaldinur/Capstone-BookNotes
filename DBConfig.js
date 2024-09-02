import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
// const { Pool } = pkg;

export const itemsPool = new pkg.Pool({
  connectionString: process.env.DBConfigLink,
  ssl: false,
});

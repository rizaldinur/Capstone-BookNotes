import pkg from "pg";

const { Pool } = pkg;

export const itemsPool = new Pool({
  connectionString: process.env.DBConfigLink,
  ssl: {
    rejectUnauthorized: false,
  },
});

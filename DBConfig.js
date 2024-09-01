import { Pool } from "pg";

const itemsPool = new Pool({
  connectionString: process.env.DBConfigLink,
  ssl: {
    rejectUnauthorized: false,
  },
});
module.exports = itemsPool;

import pkg from "pg";

const { Pool } = pkg;

const itemsPool = new Pool({
  connectionString: process.env.DBConfigLink,
  ssl: {
    rejectUnauthorized: false,
  },
});
module.exports = itemsPool;

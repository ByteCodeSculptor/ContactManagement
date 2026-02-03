const { Pool } = require('pg');
require('dotenv').config();

// Debugging: This will tell you if the variable is actually loaded
if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is not defined in environment variables!");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
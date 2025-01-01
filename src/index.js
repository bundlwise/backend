const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database successfully!');
    pool.end();
  })
  .catch(err => {
    console.error('Connection error:', err.stack);
  });

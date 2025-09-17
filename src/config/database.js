const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'it_asset_inventory',
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD) || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => console.log('✅ PostgreSQL connected'));
pool.on('error', (err) => console.error('❌ PostgreSQL error:', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
  end: () => pool.end()
};
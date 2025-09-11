require('dotenv').config();
const db = require('../config/database');

const createStudentsTable = `
  CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER NOT NULL,
    course VARCHAR(100) NOT NULL,
    level VARCHAR(10) NOT NULL,
    sex VARCHAR(10) NOT NULL,
    department VARCHAR(100) NOT NULL,
    picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

async function migrate() {
  try {
    console.log('Running database migrations...');
    await db.query(createStudentsTable);
    console.log('✅ Students table created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
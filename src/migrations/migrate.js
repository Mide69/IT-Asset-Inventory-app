require('dotenv').config();
const db = require('../config/database');

const createStudentsTable = `
  CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 16 AND age <= 100),
    course VARCHAR(100) NOT NULL,
    level VARCHAR(10) NOT NULL CHECK (level IN ('100', '200', '300', '400', '500')),
    sex VARCHAR(10) NOT NULL CHECK (sex IN ('Male', 'Female')),
    department VARCHAR(100) NOT NULL CHECK (department IN ('Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 'Science')),
    picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
  CREATE INDEX IF NOT EXISTS idx_students_level ON students(level);
  CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
`;

async function migrate() {
  try {
    console.log('🔄 Running database migrations...');
    await db.query(createStudentsTable);
    console.log('✅ Students table created with indexes');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
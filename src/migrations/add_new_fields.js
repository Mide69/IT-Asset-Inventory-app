require('dotenv').config();
const db = require('../config/database');

const addNewFields = async () => {
  try {
    console.log('Adding new fields to students table...');
    
    // Add new columns
    await db.run('ALTER TABLE students ADD COLUMN level TEXT');
    await db.run('ALTER TABLE students ADD COLUMN sex TEXT');
    await db.run('ALTER TABLE students ADD COLUMN department TEXT');
    await db.run('ALTER TABLE students ADD COLUMN picture TEXT');
    
    console.log('✅ New fields added successfully');
    process.exit(0);
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('✅ Fields already exist');
      process.exit(0);
    }
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

addNewFields();
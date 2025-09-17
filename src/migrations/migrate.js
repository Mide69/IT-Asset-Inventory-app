require('dotenv').config();
const db = require('../config/database');

const createAssetsTable = `
  CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Laptop', 'Desktop', 'Server', 'Network', 'Mobile', 'Printer', 'Monitor', 'Other')),
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Maintenance', 'Disposed', 'Lost')),
    location VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL CHECK (department IN ('IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Management')),
    assigned_to VARCHAR(100),
    purchase_date DATE,
    warranty_expiry DATE,
    cost DECIMAL(10,2),
    notes TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_assets_asset_tag ON assets(asset_tag);
  CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
  CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
  CREATE INDEX IF NOT EXISTS idx_assets_department ON assets(department);
  CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(location);
`;

async function migrate() {
  try {
    console.log('🔄 Running database migrations...');
    await db.query(createAssetsTable);
    console.log('✅ Assets table created with indexes');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
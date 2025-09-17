-- Initialize IT Asset Inventory Database
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_asset_tag ON assets(asset_tag);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_department ON assets(department);
CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(location);

-- Insert sample data
INSERT INTO assets (asset_tag, name, category, brand, model, serial_number, status, location, department, assigned_to, purchase_date, warranty_expiry, cost, notes) VALUES
('LAP001', 'Dell Latitude 7420', 'Laptop', 'Dell', 'Latitude 7420', 'DL7420001', 'Active', 'Office Floor 2', 'IT', 'John Doe', '2023-01-15', '2026-01-15', 1200.00, 'Primary development laptop'),
('DSK001', 'HP EliteDesk 800', 'Desktop', 'HP', 'EliteDesk 800 G6', 'HP800001', 'Active', 'Office Floor 1', 'Finance', 'Jane Smith', '2023-02-10', '2026-02-10', 800.00, 'Accounting workstation'),
('SRV001', 'Dell PowerEdge R740', 'Server', 'Dell', 'PowerEdge R740', 'PE740001', 'Active', 'Data Center Rack A1', 'IT', NULL, '2022-12-01', '2025-12-01', 5000.00, 'Main application server'),
('NET001', 'Cisco Catalyst 2960', 'Network', 'Cisco', 'Catalyst 2960-X', 'C2960001', 'Active', 'Network Closet Floor 1', 'IT', NULL, '2023-03-20', '2028-03-20', 600.00, '24-port switch'),
('MOB001', 'iPhone 14 Pro', 'Mobile', 'Apple', 'iPhone 14 Pro', 'IP14001', 'Active', 'Mobile', 'Management', 'CEO Office', '2023-09-15', '2024-09-15', 999.00, 'Executive mobile device')
ON CONFLICT (asset_tag) DO NOTHING;
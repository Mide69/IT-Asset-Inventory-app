#!/bin/bash

echo "🐳 Deploying IT Asset Inventory with Docker Containers"
echo "====================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1 FAILED${NC}"
        exit 1
    fi
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "🛑 Stopping existing containers..."
docker stop it-asset-app postgres-db 2>/dev/null || true
docker rm it-asset-app postgres-db 2>/dev/null || true
check_status "Existing containers stopped"

echo "🗄️ Starting PostgreSQL container..."
docker run -d \
  --name postgres-db \
  -e POSTGRES_DB=it_asset_inventory \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  --restart unless-stopped \
  postgres:13
check_status "PostgreSQL container started"

echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker exec postgres-db pg_isready -U postgres >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ PostgreSQL failed to start${NC}"
        docker logs postgres-db
        exit 1
    fi
    sleep 2
done

echo "🗄️ Setting up database schema..."
docker exec postgres-db psql -U postgres -d it_asset_inventory -c "
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

INSERT INTO assets (asset_tag, name, category, brand, model, serial_number, status, location, department, assigned_to, purchase_date, warranty_expiry, cost, notes) VALUES
('LAP001', 'Dell Latitude 7420', 'Laptop', 'Dell', 'Latitude 7420', 'DL7420001', 'Active', 'Office Floor 2', 'IT', 'John Doe', '2023-01-15', '2026-01-15', 1200.00, 'Primary development laptop'),
('DSK001', 'HP EliteDesk 800', 'Desktop', 'HP', 'EliteDesk 800 G6', 'HP800001', 'Active', 'Office Floor 1', 'Finance', 'Jane Smith', '2023-02-10', '2026-02-10', 800.00, 'Accounting workstation'),
('SRV001', 'Dell PowerEdge R740', 'Server', 'Dell', 'PowerEdge R740', 'PE740001', 'Active', 'Data Center Rack A1', 'IT', NULL, '2022-12-01', '2025-12-01', 5000.00, 'Main application server')
ON CONFLICT (asset_tag) DO NOTHING;
"
check_status "Database schema and sample data created"

echo "🏗️ Building application image..."
docker build -t tektribe/it-asset-inventory .
check_status "Application image built"
docker push tektribe/it-asset-inventory

echo "🚀 Starting application container..."
docker run -d \
  --name it-asset-app \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DB_HOST=postgres-db \
  -e DB_PORT=5432 \
  -e DB_NAME=it_asset_inventory \
  -e DB_USER=postgres \
  -e DB_PASSWORD=password \
  -e LOG_LEVEL=info \
  -p 3000:3000 \
  -v uploads_data:/app/uploads \
  --link postgres-db \
  --restart unless-stopped \
  it-asset-inventory
check_status "Application container started"

echo "⏳ Waiting for application to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:3000/healthcheck | grep -q '"status":"OK"'; then
        echo -e "${GREEN}✅ Application is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Application failed to start${NC}"
        docker logs it-asset-app
        exit 1
    fi
    sleep 2
done

echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "====================================="
echo -e "${GREEN}✅ PostgreSQL: Running in container (postgres-db)${NC}"
echo -e "${GREEN}✅ IT Asset App: Running in container (it-asset-app)${NC}"
echo -e "${GREEN}✅ Sample data: 3 assets pre-loaded${NC}"
echo ""
echo "🌍 ACCESS YOUR APPLICATION:"
echo "   Main App: http://localhost:3000"
echo "   API: http://localhost:3000/api/v1/assets"
echo "   Health: http://localhost:3000/healthcheck"
echo ""
echo "🗄️ DATABASE ACCESS:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: it_asset_inventory"
echo "   Username: postgres"
echo "   Password: password"
echo ""
echo "📊 CONTAINER MANAGEMENT:"
echo "   View app logs: docker logs it-asset-app"
echo "   View DB logs: docker logs postgres-db"
echo "   Stop containers: docker stop it-asset-app postgres-db"
echo "   Remove containers: docker rm it-asset-app postgres-db"
echo "   Shell access: docker exec -it it-asset-app sh"
echo "   DB access: docker exec -it postgres-db psql -U postgres -d it_asset_inventory"
echo ""
echo "🎯 FEATURES READY:"
echo "   • Complete asset CRUD operations"
echo "   • Search and filter functionality"
echo "   • Image upload capability"
echo "   • Cyberpunk UI theme"
echo "   • Persistent data storage"
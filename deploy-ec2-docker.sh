#!/bin/bash

echo "🐳 Deploying IT Asset Inventory on EC2 Ubuntu with Docker"
echo "========================================================"

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

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    sudo apt update
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt update
    sudo apt install -y docker-ce
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    check_status "Docker installed"
    echo "⚠️  Please logout and login again for Docker permissions, then re-run this script"
    exit 0
fi

echo "🛑 Cleaning up existing containers and network..."
docker stop it-asset-app it-asset-postgres 2>/dev/null || true
docker rm it-asset-app it-asset-postgres 2>/dev/null || true
docker network rm it-asset-network 2>/dev/null || true
check_status "Cleanup completed"

echo "🌐 Creating Docker network..."
docker network create it-asset-network
check_status "Network created"

echo "🗄️ Starting PostgreSQL container..."
docker run -d \
  --name it-asset-postgres \
  --network it-asset-network \
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
    if docker exec it-asset-postgres pg_isready -U postgres >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ PostgreSQL failed to start${NC}"
        docker logs it-asset-postgres
        exit 1
    fi
    sleep 2
done

echo "🗄️ Setting up database schema..."
docker exec it-asset-postgres psql -U postgres -d it_asset_inventory -c "
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
('SRV001', 'Dell PowerEdge R740', 'Server', 'Dell', 'PowerEdge R740', 'PE740001', 'Active', 'Data Center Rack A1', 'IT', NULL, '2022-12-01', '2025-12-01', 5000.00, 'Main application server'),
('NET001', 'Cisco Catalyst 2960', 'Network', 'Cisco', 'Catalyst 2960-X', 'C2960001', 'Active', 'Network Closet Floor 1', 'IT', NULL, '2023-03-20', '2028-03-20', 600.00, '24-port switch'),
('MOB001', 'iPhone 14 Pro', 'Mobile', 'Apple', 'iPhone 14 Pro', 'IP14001', 'Active', 'Mobile', 'Management', 'CEO Office', '2023-09-15', '2024-09-15', 999.00, 'Executive mobile device')
ON CONFLICT (asset_tag) DO NOTHING;
"
check_status "Database schema and sample data created"

echo "🏗️ Building application image..."
docker build -t it-asset-inventory .
check_status "Application image built"

echo "🚀 Starting application container..."
docker run -d \
  --name it-asset-app \
  --network it-asset-network \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DB_HOST=it-asset-postgres \
  -e DB_PORT=5432 \
  -e DB_NAME=it_asset_inventory \
  -e DB_USER=postgres \
  -e DB_PASSWORD=password \
  -e LOG_LEVEL=info \
  -p 3000:3000 \
  -v uploads_data:/app/uploads \
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

# Get public IP
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || curl -s http://ipinfo.io/ip 2>/dev/null || echo "Unable to get IP")

echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "====================================="
echo -e "${GREEN}✅ Docker Network: it-asset-network${NC}"
echo -e "${GREEN}✅ PostgreSQL: Running in container${NC}"
echo -e "${GREEN}✅ IT Asset App: Running in container${NC}"
echo -e "${GREEN}✅ Sample data: 5 assets pre-loaded${NC}"
echo ""
echo "🌍 ACCESS YOUR APPLICATION:"
echo "   Main App: http://$PUBLIC_IP:3000"
echo "   API: http://$PUBLIC_IP:3000/api/v1/assets"
echo "   Health: http://$PUBLIC_IP:3000/healthcheck"
echo ""
echo "⚠️  IMPORTANT: Configure AWS Security Group"
echo "   1. Go to EC2 Console → Security Groups"
echo "   2. Add Inbound Rule: Custom TCP, Port 3000, Source 0.0.0.0/0"
echo ""
echo "🐳 CONTAINER MANAGEMENT:"
echo "   View containers: docker ps"
echo "   App logs: docker logs it-asset-app"
echo "   DB logs: docker logs it-asset-postgres"
echo "   Stop all: docker stop it-asset-app it-asset-postgres"
echo "   Network info: docker network inspect it-asset-network"
echo "   Shell access: docker exec -it it-asset-app sh"
echo "   DB access: docker exec -it it-asset-postgres psql -U postgres -d it_asset_inventory"
echo ""
echo "🎯 FEATURES READY:"
echo "   • Complete IT asset CRUD operations"
echo "   • Search and filter functionality"
echo "   • Image upload capability"
echo "   • Containerized PostgreSQL database"
echo "   • Persistent data storage"
echo "   • Auto-restart on failure"
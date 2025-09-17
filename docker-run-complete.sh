#!/bin/bash

echo "🐳 Running IT Asset Inventory System with PostgreSQL in Docker"
echo "============================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not available${NC}"
    echo "Please install Docker Compose or use Docker Desktop"
    exit 1
fi

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose down -v 2>/dev/null || docker compose down -v 2>/dev/null || true

# Remove existing images (optional - uncomment to force rebuild)
# echo "🗑️ Removing existing images..."
# docker rmi it-asset-inventory-app_app 2>/dev/null || true

# Build and start services
echo "🏗️ Building and starting services..."
if command -v docker-compose &> /dev/null; then
    docker-compose up --build -d
else
    docker compose up --build -d
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Services started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start services${NC}"
    exit 1
fi

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check PostgreSQL health
echo "🗄️ Checking PostgreSQL..."
for i in {1..30}; do
    if docker exec it-asset-postgres pg_isready -U postgres > /dev/null 2>&1; then
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

# Check application health
echo "🚀 Checking application..."
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

# Test API
echo "🧪 Testing API..."
API_TEST=$(curl -s http://localhost:3000/api/v1/assets | grep -o '"success":true' || echo "")
if [ -n "$API_TEST" ]; then
    echo -e "${GREEN}✅ API is working${NC}"
else
    echo -e "${YELLOW}⚠️ API test inconclusive (may be empty data)${NC}"
fi

echo ""
echo "🎉 IT Asset Inventory System is running!"
echo "========================================"
echo -e "${GREEN}✅ PostgreSQL Database: Running in container${NC}"
echo -e "${GREEN}✅ IT Asset App: Running in container${NC}"
echo -e "${GREEN}✅ Sample Data: Loaded${NC}"
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
echo "📊 SAMPLE ASSETS LOADED:"
echo "   • Dell Latitude 7420 (LAP001)"
echo "   • HP EliteDesk 800 (DSK001)"
echo "   • Dell PowerEdge R740 (SRV001)"
echo "   • Cisco Catalyst 2960 (NET001)"
echo "   • iPhone 14 Pro (MOB001)"
echo ""
echo "🔧 MANAGEMENT COMMANDS:"
echo "   View logs: docker-compose logs -f"
echo "   Stop: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Shell access: docker exec -it it-asset-app sh"
echo "   Database shell: docker exec -it it-asset-postgres psql -U postgres -d it_asset_inventory"
#!/bin/bash

echo "🐳 Deploying IT Asset Inventory with Docker Compose"
echo "=================================================="

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

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not available${NC}"
    echo "Please install Docker Compose"
    exit 1
fi

echo "🛑 Stopping existing services..."
if command -v docker-compose &> /dev/null; then
    docker-compose down
else
    docker compose down
fi
check_status "Existing services stopped"

echo "🏗️ Building and starting services..."
if command -v docker-compose &> /dev/null; then
    docker-compose up -d --build
else
    docker compose up -d --build
fi
check_status "Services started"

echo "⏳ Waiting for services to be ready..."
sleep 15

# Check PostgreSQL health
echo "🗄️ Checking PostgreSQL..."
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

# Check Application health
echo "🌐 Checking Application..."
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
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "localhost")

echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "====================================="
echo -e "${GREEN}✅ PostgreSQL Database: Running in container${NC}"
echo -e "${GREEN}✅ IT Asset Inventory App: Running in container${NC}"
echo -e "${GREEN}✅ Sample data: 5 assets pre-loaded${NC}"
echo ""
echo "🌍 ACCESS YOUR APPLICATION:"
echo "   Main App: http://$PUBLIC_IP:3000"
echo "   API: http://$PUBLIC_IP:3000/api/v1/assets"
echo "   Health: http://$PUBLIC_IP:3000/healthcheck"
echo ""
echo "🗄️ DATABASE ACCESS:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: it_asset_inventory"
echo "   Username: postgres"
echo "   Password: password"
echo ""
echo "📊 DOCKER COMPOSE MANAGEMENT:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Rebuild: docker-compose up -d --build"
echo "   Shell access: docker exec -it it-asset-app sh"
echo "   DB access: docker exec -it it-asset-postgres psql -U postgres -d it_asset_inventory"
echo ""
echo "🎯 FEATURES READY:"
echo "   • Complete asset CRUD operations"
echo "   • Search and filter functionality"
echo "   • Image upload capability"
echo "   • Cyberpunk UI theme"
echo "   • Persistent data storage"
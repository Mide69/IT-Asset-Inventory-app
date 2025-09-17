#!/bin/bash

echo "🚀 Deploying IT Asset Inventory System"
echo "====================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1 FAILED${NC}"
        exit 1
    fi
}

echo "📦 Installing backend dependencies..."
npm install
check_status "Backend dependencies installed"

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..
check_status "Frontend dependencies installed"

echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    check_status "Environment file created"
else
    echo -e "${GREEN}✅ Environment file exists${NC}"
fi

echo "🗄️ Running database migration..."
npm run migrate
check_status "Database migration completed"

echo "🏗️ Building frontend..."
npm run build
check_status "Frontend built successfully"

echo "📁 Creating uploads directory..."
mkdir -p uploads
chmod 755 uploads
check_status "Uploads directory ready"

echo ""
echo "🎉 DEPLOYMENT COMPLETED!"
echo "======================="
echo -e "${GREEN}✅ All dependencies installed${NC}"
echo -e "${GREEN}✅ Database migrated${NC}"
echo -e "${GREEN}✅ Frontend built${NC}"
echo -e "${GREEN}✅ System ready to start${NC}"
echo ""
echo "🚀 To start the application:"
echo "   npm start"
echo ""
echo "🧪 To test the system:"
echo "   chmod +x test-system.sh && ./test-system.sh"
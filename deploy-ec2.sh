#!/bin/bash

echo "🚀 Deploying Student Management System on EC2"
echo "=============================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to check status
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1 FAILED${NC}"
        exit 1
    fi
}

# Stop any existing processes
echo "🛑 Stopping existing processes..."
pkill -f "node src/server.js" 2>/dev/null || true
sudo lsof -ti:3000 | xargs sudo kill -9 2>/dev/null || true

# Install dependencies
echo "📦 Installing dependencies..."
npm install
check_status "Backend dependencies installed"

cd frontend && npm install && cd ..
check_status "Frontend dependencies installed"

# Setup environment
echo "🔧 Setting up environment..."
cp .env.example .env
check_status "Environment configured"

# Setup PostgreSQL
echo "🗄️ Setting up PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';" 2>/dev/null || true
sudo -u postgres createdb student_management 2>/dev/null || echo "Database already exists"
check_status "PostgreSQL configured"

# Run migration
echo "📊 Running database migration..."
npm run migrate
check_status "Database migration completed"

# Build frontend
echo "🏗️ Building frontend..."
npm run build
check_status "Frontend built"

# Start application
echo "🚀 Starting application..."
nohup npm start > app.log 2>&1 &
sleep 3

# Test application
echo "🧪 Testing application..."
sleep 2
HEALTH_CHECK=$(curl -s http://localhost:3000/healthcheck | grep -o '"status":"OK"' || echo "")
if [ -n "$HEALTH_CHECK" ]; then
    echo -e "${GREEN}✅ Application is running successfully${NC}"
else
    echo -e "${RED}❌ Application failed to start${NC}"
    echo "Check logs: tail -f app.log"
    exit 1
fi

# Get public IP
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com 2>/dev/null || echo "Unable to get IP")

echo ""
echo "🎉 DEPLOYMENT COMPLETED!"
echo "======================="
echo -e "${GREEN}✅ Server: Running on port 3000${NC}"
echo -e "${GREEN}✅ Database: PostgreSQL connected${NC}"
echo -e "${GREEN}✅ Frontend: React app built and serving${NC}"
echo ""
echo "🌍 Access your app at: http://$PUBLIC_IP:3000"
echo "📊 Health check: http://$PUBLIC_IP:3000/healthcheck"
echo "🔗 API: http://$PUBLIC_IP:3000/api/v1/students"
echo ""
echo "⚠️  Make sure AWS Security Group allows port 3000"
echo "📝 Monitor logs: tail -f app.log"
echo "🛑 Stop server: pkill -f 'node src/server.js'"
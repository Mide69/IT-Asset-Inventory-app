#!/bin/bash

echo "🧹 Cleaning up PM2 and preparing for npm run dev..."

# Stop and remove all PM2 processes
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true

# Remove PM2 startup script
pm2 unstartup 2>/dev/null || true

# Kill any process using port 3000
sudo lsof -ti:3000 | xargs sudo kill -9 2>/dev/null || true

# Install dependencies
npm install

# Build frontend
npm run build

echo "✅ Cleanup complete! Now run: npm run dev"
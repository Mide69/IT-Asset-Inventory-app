#!/bin/bash

# EC2 Ubuntu Deployment Script for Student Management System

echo "🚀 Starting deployment on EC2 Ubuntu..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Setup PostgreSQL
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
sudo -u postgres createdb student_management

# Install PM2 for process management
sudo npm install -g pm2

# Install dependencies
npm install

# Setup frontend
npm run install:frontend

# Create environment file
cp .env.example .env

# Run database migration
npm run migrate

# Build frontend
npm run build

# Start application with PM2
pm2 start src/server.js --name "student-management"
pm2 startup
pm2 save

echo "✅ Deployment completed!"
echo "🌍 Access your app at: http://YOUR_EC2_IP:3000"
echo "📊 Health check: http://YOUR_EC2_IP:3000/healthcheck"
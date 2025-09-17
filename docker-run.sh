#!/bin/bash

# Docker run script for Student Management System

echo "🐳 Running Student Management System Container"

# Build the image
echo "📦 Building Docker image..."
docker build -t student-management-system .

# Run the container with environment variables
echo "🚀 Starting container..."
docker run -d \
  --name student-management \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=student_management \
  -e DB_USER=postgres \
  -e DB_PASSWORD=password \
  -e LOG_LEVEL=info \
  --restart unless-stopped \
  student-management-system

echo "✅ Container started!"
echo "🌍 Access your app at: http://localhost:3000"
echo "📊 Health check: http://localhost:3000/healthcheck"
echo ""
echo "📝 Useful commands:"
echo "  View logs: docker logs -f student-management"
echo "  Stop container: docker stop student-management"
echo "  Remove container: docker rm student-management"
echo "  Shell access: docker exec -it student-management sh"
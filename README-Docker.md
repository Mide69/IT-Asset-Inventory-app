# 🐳 Docker Deployment Guide

## Build and Run

### Quick Start
```bash
# Make script executable
chmod +x docker-run.sh

# Build and run
./docker-run.sh
```

### Manual Build and Run
```bash
# Build image
docker build -t student-management-system .

# Run with custom environment variables
docker run -d \
  --name student-management \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_NAME=student_management \
  -e DB_USER=postgres \
  -e DB_PASSWORD=your-password \
  student-management-system
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | production | Environment mode |
| `PORT` | 3000 | Server port |
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `DB_NAME` | student_management | Database name |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | password | Database password |
| `LOG_LEVEL` | info | Logging level |

## Database Setup

### Option 1: External PostgreSQL
```bash
# Run with external database
docker run -d \
  --name student-management \
  -p 3000:3000 \
  -e DB_HOST=your-postgres-host \
  -e DB_PASSWORD=your-password \
  student-management-system
```

### Option 2: PostgreSQL in Docker
```bash
# Run PostgreSQL container
docker run -d \
  --name postgres-db \
  -e POSTGRES_DB=student_management \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:13

# Run app container
docker run -d \
  --name student-management \
  -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PASSWORD=password \
  --link postgres-db \
  student-management-system
```

## Management Commands

```bash
# View logs
docker logs -f student-management

# Stop container
docker stop student-management

# Start container
docker start student-management

# Remove container
docker rm student-management

# Shell access
docker exec -it student-management sh

# Health check
curl http://localhost:3000/healthcheck
```

## Production Deployment

```bash
# Build for production
docker build -t student-management:v1.0 .

# Run with production settings
docker run -d \
  --name student-management-prod \
  -p 80:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=prod-db-host \
  -e DB_PASSWORD=secure-password \
  --restart unless-stopped \
  student-management:v1.0
```

## Features

✅ **Multi-stage build** - Optimized image size  
✅ **Non-root user** - Security best practices  
✅ **Health checks** - Container monitoring  
✅ **Environment injection** - Runtime configuration  
✅ **Frontend included** - Complete full-stack app  
✅ **PostgreSQL ready** - Database integration
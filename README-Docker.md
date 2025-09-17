# 🐳 Docker Deployment Guide

## Quick Start

### Linux/Mac
```bash
chmod +x deploy-docker.sh
./deploy-docker.sh
```

### Windows
```cmd
deploy-docker.bat
```

## Manual Deployment

### Prerequisites
- Docker Desktop installed
- Docker Compose available

### Build and Run
```bash
# Build the application image
docker build -t it-asset-inventory .

# Start both containers
docker-compose up -d

# Check status
docker-compose ps
```

## Container Architecture

```
┌─────────────────────┐    ┌─────────────────────┐
│   IT Asset App      │    │   PostgreSQL DB     │
│   (Port 3000)       │◄──►│   (Port 5432)       │
│   - Node.js API     │    │   - Database        │
│   - React Frontend  │    │   - Sample Data     │
│   - File Uploads    │    │   - Persistent Vol  │
└─────────────────────┘    └─────────────────────┘
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | production | Environment mode |
| `PORT` | 3000 | Application port |
| `DB_HOST` | postgres | Database host (container name) |
| `DB_PORT` | 5432 | Database port |
| `DB_NAME` | it_asset_inventory | Database name |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | password | Database password |

## Sample Data

The database comes pre-loaded with sample assets:
- Dell Laptop (LAP001)
- HP Desktop (DSK001) 
- Dell Server (SRV001)
- Cisco Switch (NET001)
- iPhone (MOB001)

## Management Commands

```bash
# View application logs
docker logs it-asset-app

# View database logs
docker logs it-asset-postgres

# Access application shell
docker exec -it it-asset-app sh

# Access database
docker exec -it it-asset-postgres psql -U postgres -d it_asset_inventory

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# Remove everything (including data)
docker-compose down -v
docker rmi it-asset-inventory
```

## Persistent Data

- **Database**: Stored in `postgres_data` volume
- **Uploads**: Stored in `uploads_data` volume
- **Data persists** between container restarts

## Networking

- **Application**: http://localhost:3000
- **Database**: localhost:5432 (from host)
- **Internal**: Containers communicate via `it-asset-network`

## Health Checks

Both containers have health checks:
- **PostgreSQL**: `pg_isready` command
- **Application**: HTTP health endpoint

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs it-asset-app
docker logs it-asset-postgres

# Check if ports are in use
netstat -an | grep 3000
netstat -an | grep 5432
```

### Database Connection Issues
```bash
# Test database connectivity
docker exec it-asset-postgres pg_isready -U postgres

# Check database exists
docker exec it-asset-postgres psql -U postgres -l
```

### Application Issues
```bash
# Test health endpoint
curl http://localhost:3000/healthcheck

# Test API endpoint
curl http://localhost:3000/api/v1/assets
```

## Production Deployment

For production, update `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - DB_PASSWORD=secure_password_here
```

## Features

✅ **Containerized PostgreSQL** - No local installation needed  
✅ **Multi-stage build** - Optimized image size  
✅ **Health checks** - Automatic monitoring  
✅ **Persistent storage** - Data survives restarts  
✅ **Sample data** - Ready to use  
✅ **Network isolation** - Secure container communication  
✅ **Easy deployment** - One command setup
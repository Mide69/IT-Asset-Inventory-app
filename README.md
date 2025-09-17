# 💻 IT Asset Inventory System

A modern IT asset management system built with Node.js, PostgreSQL, and React.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for local development)
- Docker (for containerized deployment)

### Local Development
```bash
# Install dependencies and setup
./deploy.sh

# Start application
npm start
```

### Docker Deployment (Recommended)
```bash
# Linux/Mac
chmod +x deploy-docker.sh
./deploy-docker.sh

# Windows
deploy-docker.bat
```

## 📊 Features

- ✅ Asset CRUD operations
- ✅ Search and filtering
- ✅ Image uploads
- ✅ Category management (Laptop, Desktop, Server, etc.)
- ✅ Status tracking (Active, Maintenance, Disposed, etc.)
- ✅ Department assignment
- ✅ Warranty tracking
- ✅ Cost management
- ✅ Cyberpunk UI theme

## 🌍 Access

- **App**: http://localhost:3000
- **API**: http://localhost:3000/api/v1/assets
- **Health**: http://localhost:3000/healthcheck

## 🐳 Docker Architecture

```
┌─────────────────────┐    ┌─────────────────────┐
│   PostgreSQL DB     │    │   IT Asset App      │
│   (postgres-db)     │◄──►│   (it-asset-app)    │
│   Port: 5432        │    │   Port: 3000        │
│   Volume: postgres  │    │   Volume: uploads   │
└─────────────────────┘    └─────────────────────┘
```

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | production | Environment mode |
| `PORT` | 3000 | Application port |
| `DB_HOST` | postgres-db | Database host |
| `DB_PORT` | 5432 | Database port |
| `DB_NAME` | it_asset_inventory | Database name |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | password | Database password |

## 📁 Project Structure

```
├── src/
│   ├── config/database.js
│   ├── controllers/assetController.js
│   ├── middleware/validation.js
│   ├── models/Asset.js
│   ├── routes/assets.js
│   ├── migrations/migrate.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/AssetList.js, AssetForm.js
│   │   ├── App.js, App.css
│   │   └── index.js
│   └── public/index.html
├── Dockerfile (Multi-stage build)
├── deploy-docker.sh (Container deployment)
└── package.json
```

## 🛠️ Management Commands

```bash
# Docker deployment
./deploy-docker.sh

# Stop containers
./stop-docker.sh

# View logs
docker logs it-asset-app
docker logs postgres-db

# Database access
docker exec -it postgres-db psql -U postgres -d it_asset_inventory

# Container shell
docker exec -it it-asset-app sh
```

## 📄 License

MIT
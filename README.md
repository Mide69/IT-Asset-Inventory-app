# 💻 IT Asset Inventory System

A modern IT asset management system built with Node.js, PostgreSQL, and React.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Docker (optional)

### Local Development
```bash
# Install dependencies
npm install
cd frontend && npm install && cd ..

# Setup database
npm run migrate

# Build frontend
npm run build

# Start application
npm start
```

### Docker Deployment
```bash
# Start PostgreSQL
docker run -d --name postgres -e POSTGRES_DB=it_asset_inventory -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:13

# Build and run app
docker build -t it-asset-inventory .
docker run -d --name it-asset-app -p 3000:3000 -e DB_HOST=host.docker.internal it-asset-inventory
```

## 📊 Features

- ✅ Asset CRUD operations
- ✅ Search and filtering
- ✅ Image uploads
- ✅ Category management
- ✅ Status tracking
- ✅ Department assignment
- ✅ Warranty tracking
- ✅ Cost management
- ✅ Cyberpunk UI theme

## 🌍 Access

- **App**: http://localhost:3000
- **API**: http://localhost:3000/api/v1/assets
- **Health**: http://localhost:3000/healthcheck

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
│   │   ├── components/
│   │   ├── App.js
│   │   └── App.css
│   └── public/
├── Dockerfile
├── package.json
└── .env.example
```

## 🔧 Environment Variables

```
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=it_asset_inventory
DB_USER=postgres
DB_PASSWORD=password
LOG_LEVEL=info
```

## 📄 License

MIT
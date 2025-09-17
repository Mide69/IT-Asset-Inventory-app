# 💻 IT Asset Inventory System

A modern IT asset management system built with Node.js, PostgreSQL, and React with cyberpunk UI theme.

## 📋 Prerequisites

Before running this application, ensure you have the following tools installed:

### Required Tools
- **Docker** (v20.10+) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0+) - [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Make** - Build automation tool
  - **Linux/Mac**: Usually pre-installed
  - **Windows**: Install via [Chocolatey](https://chocolatey.org/) or [Make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm)
- **Node.js** (v18+) - For local development only
- **curl** - For API testing (usually pre-installed)

### Verify Installation
```bash
# Check if all tools are installed
make check-deps
```

## 🚀 Quick Start

### Using Make (Recommended)

```bash
# 1. Start the complete application (DB + API)
make start

# 2. View application status
make status

# 3. Test the API
make test

# 4. View logs
make logs
```

### Manual Docker Compose

```bash
# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🎯 Make Targets

Run `make help` to see all available targets:

### Core Targets (Execution Order)

1. **`make check-deps`** - Verify prerequisites are installed
2. **`make start-db`** - Start PostgreSQL database container
3. **`make migrate`** - Run database migrations (DML)
4. **`make build-api`** - Build REST API docker image
5. **`make start-api`** - Start REST API container (runs 1-4 automatically)
6. **`make start`** - Complete application startup (alias for start-api)

### Management Targets

| Target | Description |
|--------|-------------|
| `make help` | Show all available targets |
| `make install` | Install Node.js dependencies |
| `make status` | Show container status |
| `make logs` | View all container logs |
| `make logs-api` | View API logs only |
| `make logs-db` | View database logs only |
| `make test` | Run API health tests |
| `make stop` | Stop all containers |
| `make restart` | Restart application |
| `make rebuild` | Rebuild and restart |
| `make clean` | Clean up containers and volumes |
| `make shell-api` | Access API container shell |
| `make shell-db` | Access database shell |
| `make dev` | Start development mode |

## 📊 Features

- ✅ **Asset CRUD Operations** - Create, Read, Update, Delete assets
- ✅ **Advanced Search & Filtering** - By category, status, department, location
- ✅ **Image Upload** - Asset photos with file validation
- ✅ **Category Management** - Laptop, Desktop, Server, Network, Mobile, Printer, Monitor
- ✅ **Status Tracking** - Active, Inactive, Maintenance, Disposed, Lost
- ✅ **Department Assignment** - IT, HR, Finance, Marketing, Operations, Management
- ✅ **Warranty & Cost Tracking** - Purchase dates, warranty expiry, cost management
- ✅ **Cyberpunk UI Theme** - Modern dark theme with neon accents
- ✅ **Responsive Design** - Mobile-friendly interface
- ✅ **Docker Containerized** - Easy deployment and scaling
- ✅ **Health Monitoring** - Built-in health checks

## 🌍 Access Points

After running `make start`, access your application at:

- **Main Application**: http://localhost:3000
- **REST API**: http://localhost:3000/api/v1/assets
- **Health Check**: http://localhost:3000/healthcheck
- **Database**: localhost:5432 (from host)

## 🗄️ Database

### Connection Details
- **Host**: localhost (from host) / postgres (from containers)
- **Port**: 5432
- **Database**: it_asset_inventory
- **Username**: postgres
- **Password**: password

### Sample Data
The application comes with 5 pre-loaded sample assets:
- Dell Laptop (LAP001)
- HP Desktop (DSK001)
- Dell Server (SRV001)
- Cisco Switch (NET001)
- iPhone (MOB001)

### Database Shell Access
```bash
# Access database directly
make shell-db

# Or manually
docker exec -it it-asset-postgres psql -U postgres -d it_asset_inventory
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/healthcheck` | Application health status |
| GET | `/api/v1/assets` | List all assets (with filters) |
| POST | `/api/v1/assets` | Create new asset |
| GET | `/api/v1/assets/:id` | Get asset by ID |
| PUT | `/api/v1/assets/:id` | Update asset |
| DELETE | `/api/v1/assets/:id` | Delete asset |

### Query Parameters for GET /api/v1/assets
- `search` - Search by asset tag, name, brand, model
- `category` - Filter by category
- `status` - Filter by status
- `department` - Filter by department
- `location` - Filter by location

## 🐳 Docker Architecture

```
┌─────────────────────┐    ┌─────────────────────┐
│   PostgreSQL DB     │    │   IT Asset App      │
│   (it-asset-postgres│◄──►│   (it-asset-app)    │
│   Port: 5432        │    │   Port: 3000        │
│   Volume: postgres  │    │   Volume: uploads   │
└─────────────────────┘    └─────────────────────┘
```

## 🛠️ Development

### Local Development Setup
```bash
# Install dependencies
make install

# Start development server
make dev

# Or manually
npm run dev
```

### Project Structure
```
├── src/                    # Backend source code
│   ├── config/database.js  # Database configuration
│   ├── controllers/        # API controllers
│   ├── middleware/         # Express middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── migrations/        # Database migrations
│   └── server.js          # Main server file
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main App component
│   │   └── App.css        # Cyberpunk styling
│   └── public/
├── docker-compose.yml     # Docker services configuration
├── Dockerfile            # Multi-stage Docker build
├── Makefile              # Build automation
├── init.sql              # Database initialization
└── package.json          # Node.js dependencies
```

## 🧪 Testing

```bash
# Run API tests
make test

# Manual API testing
curl http://localhost:3000/healthcheck
curl http://localhost:3000/api/v1/assets
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   make stop
   make start
   ```

2. **Database connection issues**
   ```bash
   make logs-db
   make restart
   ```

3. **API not responding**
   ```bash
   make logs-api
   make rebuild
   ```

### Logs and Debugging
```bash
# View all logs
make logs

# View specific service logs
make logs-api
make logs-db

# Check container status
make status
```

## 🧹 Cleanup

```bash
# Stop containers
make stop

# Complete cleanup (removes volumes and images)
make clean
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `make test`
5. Submit a pull request

---

**🎉 Your IT Asset Inventory System is ready to manage your organization's IT assets with style!**
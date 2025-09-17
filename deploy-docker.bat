@echo off
echo 🐳 Deploying IT Asset Inventory with Docker Containers
echo =====================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed
    echo Please install Docker Desktop: https://docs.docker.com/desktop/windows/
    pause
    exit /b 1
)

echo 🛑 Stopping existing containers...
docker stop it-asset-app postgres-db 2>nul
docker rm it-asset-app postgres-db 2>nul
echo ✅ Existing containers stopped

echo 🗄️ Starting PostgreSQL container...
docker run -d --name postgres-db -e POSTGRES_DB=it_asset_inventory -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -v postgres_data:/var/lib/postgresql/data --restart unless-stopped postgres:13
if %errorlevel% neq 0 (
    echo ❌ Failed to start PostgreSQL
    pause
    exit /b 1
)
echo ✅ PostgreSQL container started

echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak >nul

echo 🗄️ Setting up database schema...
docker exec postgres-db psql -U postgres -d it_asset_inventory -c "CREATE TABLE IF NOT EXISTS assets (id SERIAL PRIMARY KEY, asset_tag VARCHAR(50) UNIQUE NOT NULL, name VARCHAR(100) NOT NULL, category VARCHAR(50) NOT NULL, brand VARCHAR(50) NOT NULL, model VARCHAR(100) NOT NULL, serial_number VARCHAR(100), status VARCHAR(20) NOT NULL, location VARCHAR(100) NOT NULL, department VARCHAR(50) NOT NULL, assigned_to VARCHAR(100), purchase_date DATE, warranty_expiry DATE, cost DECIMAL(10,2), notes TEXT, image TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); INSERT INTO assets (asset_tag, name, category, brand, model, status, location, department, cost) VALUES ('LAP001', 'Dell Laptop', 'Laptop', 'Dell', 'Latitude 7420', 'Active', 'Office Floor 2', 'IT', 1200.00), ('DSK001', 'HP Desktop', 'Desktop', 'HP', 'EliteDesk 800', 'Active', 'Office Floor 1', 'Finance', 800.00) ON CONFLICT (asset_tag) DO NOTHING;"
echo ✅ Database schema created

echo 🏗️ Building application image...
docker build -t it-asset-inventory .
if %errorlevel% neq 0 (
    echo ❌ Failed to build application
    pause
    exit /b 1
)
echo ✅ Application image built

echo 🚀 Starting application container...
docker run -d --name it-asset-app -e NODE_ENV=production -e PORT=3000 -e DB_HOST=postgres-db -e DB_PORT=5432 -e DB_NAME=it_asset_inventory -e DB_USER=postgres -e DB_PASSWORD=password -p 3000:3000 -v uploads_data:/app/uploads --link postgres-db --restart unless-stopped it-asset-inventory
if %errorlevel% neq 0 (
    echo ❌ Failed to start application
    pause
    exit /b 1
)
echo ✅ Application container started

echo ⏳ Waiting for application to be ready...
timeout /t 15 /nobreak >nul

echo 🌐 Testing application...
curl -s http://localhost:3000/healthcheck | findstr "OK" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Application not responding
    docker logs it-asset-app
    pause
    exit /b 1
)
echo ✅ Application is ready

echo.
echo 🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!
echo =====================================
echo ✅ PostgreSQL: Running in container (postgres-db)
echo ✅ IT Asset App: Running in container (it-asset-app)
echo ✅ Sample data: Pre-loaded
echo.
echo 🌍 ACCESS YOUR APPLICATION:
echo    Main App: http://localhost:3000
echo    API: http://localhost:3000/api/v1/assets
echo    Health: http://localhost:3000/healthcheck
echo.
echo 📊 CONTAINER MANAGEMENT:
echo    View app logs: docker logs it-asset-app
echo    View DB logs: docker logs postgres-db
echo    Stop containers: docker stop it-asset-app postgres-db
echo.
pause
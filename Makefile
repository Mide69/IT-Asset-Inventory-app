# IT Asset Inventory System Makefile
# ===================================

# Variables
DOCKER_COMPOSE = docker-compose
DB_CONTAINER = it-asset-postgres
API_CONTAINER = it-asset-app
DB_NAME = it_asset_inventory
DB_USER = postgres
DOCKER_IMAGE = tektribe/it-asset-inventory
DOCKER_TAG = $(shell git rev-parse --short HEAD 2>/dev/null || echo "latest")

# Colors for output
GREEN = \033[0;32m
RED = \033[0;31m
YELLOW = \033[1;33m
NC = \033[0m

.PHONY: help install check-deps start-db migrate build-api start-api start stop logs clean test lint test-ci docker-push

# Default target
help: ## Show this help message
	@echo "IT Asset Inventory System - Available Make Targets:"
	@echo "=================================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies and setup the application
	@echo "$(GREEN)📦 Installing dependencies...$(NC)"
	npm install
	cd frontend && npm install && cd ..
	@echo "$(GREEN)✅ Dependencies installed$(NC)"

check-deps: ## Check if required tools are installed
	@echo "$(GREEN)🔍 Checking prerequisites...$(NC)"
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)❌ Docker is required but not installed$(NC)"; exit 1; }
	@command -v docker-compose >/dev/null 2>&1 || docker compose version >/dev/null 2>&1 || { echo "$(RED)❌ Docker Compose is required but not installed$(NC)"; exit 1; }
	@command -v make >/dev/null 2>&1 || { echo "$(RED)❌ Make is required but not installed$(NC)"; exit 1; }
	@echo "$(GREEN)✅ All prerequisites are installed$(NC)"

start-db: check-deps ## Start PostgreSQL database container
	@echo "$(GREEN)🗄️ Starting PostgreSQL database...$(NC)"
	@if [ "$$(docker ps -q -f name=$(DB_CONTAINER))" ]; then \
		echo "$(YELLOW)⚠️ Database container already running$(NC)"; \
	else \
		$(DOCKER_COMPOSE) up -d postgres; \
		echo "$(GREEN)✅ Database container started$(NC)"; \
	fi
	@echo "$(GREEN)⏳ Waiting for database to be ready...$(NC)"
	@for i in $$(seq 1 30); do \
		if docker exec $(DB_CONTAINER) pg_isready -U $(DB_USER) >/dev/null 2>&1; then \
			echo "$(GREEN)✅ Database is ready$(NC)"; \
			break; \
		fi; \
		if [ $$i -eq 30 ]; then \
			echo "$(RED)❌ Database failed to start$(NC)"; \
			exit 1; \
		fi; \
		sleep 2; \
	done

migrate: start-db ## Run database migrations (DML)
	@echo "$(GREEN)🔄 Running database migrations...$(NC)"
	@if docker exec $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME) -c "SELECT 1 FROM assets LIMIT 1;" >/dev/null 2>&1; then \
		echo "$(YELLOW)⚠️ Database migrations already applied$(NC)"; \
	else \
		docker exec $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME) -f /docker-entrypoint-initdb.d/init.sql; \
		echo "$(GREEN)✅ Database migrations completed$(NC)"; \
	fi

build-api: check-deps ## Build REST API docker image
	@echo "$(GREEN)🏗️ Building API docker image...$(NC)"
	$(DOCKER_COMPOSE) build app
	@echo "$(GREEN)✅ API docker image built$(NC)"

start-api: migrate build-api ## Start REST API docker container (with dependencies)
	@echo "$(GREEN)🚀 Starting REST API container...$(NC)"
	@if [ "$$(docker ps -q -f name=$(API_CONTAINER))" ]; then \
		echo "$(YELLOW)⚠️ API container already running$(NC)"; \
	else \
		$(DOCKER_COMPOSE) up -d app; \
		echo "$(GREEN)✅ API container started$(NC)"; \
	fi
	@echo "$(GREEN)⏳ Waiting for API to be ready...$(NC)"
	@for i in $$(seq 1 30); do \
		if curl -s http://localhost:3000/healthcheck | grep -q '"status":"OK"'; then \
			echo "$(GREEN)✅ API is ready$(NC)"; \
			break; \
		fi; \
		if [ $$i -eq 30 ]; then \
			echo "$(RED)❌ API failed to start$(NC)"; \
			exit 1; \
		fi; \
		sleep 2; \
	done
	@echo ""
	@echo "$(GREEN)🎉 IT Asset Inventory System is running!$(NC)"
	@echo "$(GREEN)🌍 Access: http://localhost:3000$(NC)"
	@echo "$(GREEN)📊 API: http://localhost:3000/api/v1/assets$(NC)"
	@echo "$(GREEN)💚 Health: http://localhost:3000/healthcheck$(NC)"

lint: ## Perform code linting
	@echo "$(GREEN)🔍 Running code linting...$(NC)"
	@if command -v eslint >/dev/null 2>&1; then \
		npx eslint src/ --ext .js --fix || true; \
		cd frontend && npx eslint src/ --ext .js,.jsx --fix || true && cd ..; \
	else \
		echo "$(YELLOW)⚠️ ESLint not found, installing...$(NC)"; \
		npm install --save-dev eslint; \
		npx eslint --init || true; \
	fi
	@echo "$(GREEN)✅ Code linting completed$(NC)"

test: ## Run API tests
	@echo "$(GREEN)🧪 Running API tests...$(NC)"
	@if [ "$$(docker ps -q -f name=$(API_CONTAINER))" ]; then \
		curl -s http://localhost:3000/healthcheck | grep -q '"status":"OK"' && echo "$(GREEN)✅ Health check passed$(NC)" || echo "$(RED)❌ Health check failed$(NC)"; \
		curl -s http://localhost:3000/api/v1/assets | grep -q '"success":true' && echo "$(GREEN)✅ API endpoint working$(NC)" || echo "$(RED)❌ API endpoint failed$(NC)"; \
	else \
		echo "$(RED)❌ API container is not running. Run 'make start' first.$(NC)"; \
	fi

test-ci: ## Run tests for CI pipeline
	@echo "$(GREEN)🧪 Running CI tests...$(NC)"
	@echo "$(GREEN)🧹 Cleaning up existing containers...$(NC)"
	@docker stop $(shell docker ps -q --filter "name=it-asset") 2>/dev/null || true
	@docker rm $(shell docker ps -aq --filter "name=it-asset") 2>/dev/null || true
	@docker network rm it-asset-inventory-app_it-asset-network 2>/dev/null || true
	@echo "$(GREEN)🗄️ Starting database for CI...$(NC)"
	@POSTGRES_PORT=5433 $(DOCKER_COMPOSE) -f docker-compose.yml up -d postgres
	@sleep 10
	@echo "$(GREEN)🔄 Running migrations...$(NC)"
	@docker exec $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME) -f /docker-entrypoint-initdb.d/init.sql || true
	@echo "$(GREEN)⏳ Starting API container for testing...$(NC)"
	@API_PORT=3001 $(DOCKER_COMPOSE) -f docker-compose.yml up -d app
	@sleep 15
	@echo "$(GREEN)🔍 Testing health endpoint...$(NC)"
	@curl -s http://localhost:3001/healthcheck | grep -q '"status":"OK"' && echo "$(GREEN)✅ Health check passed$(NC)" || { echo "$(RED)❌ Health check failed$(NC)"; exit 1; }
	@echo "$(GREEN)🔍 Testing API endpoint...$(NC)"
	@curl -s http://localhost:3001/api/v1/assets | grep -q '"success":true' && echo "$(GREEN)✅ API endpoint working$(NC)" || { echo "$(RED)❌ API endpoint failed$(NC)"; exit 1; }
	@echo "$(GREEN)✅ All CI tests passed$(NC)"
	@$(DOCKER_COMPOSE) down

docker-push: ## Build and push Docker image to registry
	@echo "$(GREEN)🐳 Building and pushing Docker image...$(NC)"
	@echo "$(GREEN)📦 Building image: $(DOCKER_IMAGE):$(DOCKER_TAG)$(NC)"
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .
	docker build -t $(DOCKER_IMAGE):latest .
	@echo "$(GREEN)🚀 Pushing image to registry...$(NC)"
	docker push $(DOCKER_IMAGE):$(DOCKER_TAG)
	docker push $(DOCKER_IMAGE):latest
	@echo "$(GREEN)✅ Docker image pushed successfully$(NC)"
	@echo "$(GREEN)🎯 Image: $(DOCKER_IMAGE):$(DOCKER_TAG)$(NC)"

start: start-api ## Start the complete application (database + API)

stop: ## Stop all containers
	@echo "$(GREEN)🛑 Stopping all containers...$(NC)"
	$(DOCKER_COMPOSE) down
	@echo "$(GREEN)✅ All containers stopped$(NC)"

logs: ## View logs from all containers
	@echo "$(GREEN)📋 Viewing container logs...$(NC)"
	$(DOCKER_COMPOSE) logs -f

logs-api: ## View API container logs only
	@echo "$(GREEN)📋 Viewing API logs...$(NC)"
	$(DOCKER_COMPOSE) logs -f app

logs-db: ## View database container logs only
	@echo "$(GREEN)📋 Viewing database logs...$(NC)"
	$(DOCKER_COMPOSE) logs -f postgres

status: ## Show status of all containers
	@echo "$(GREEN)📊 Container Status:$(NC)"
	@$(DOCKER_COMPOSE) ps

clean: stop ## Clean up containers, images, and volumes
	@echo "$(GREEN)🧹 Cleaning up...$(NC)"
	$(DOCKER_COMPOSE) down -v --rmi local
	docker system prune -f
	@echo "$(GREEN)✅ Cleanup completed$(NC)"

clean-project: ## Clean up project files and dependencies
	@echo "$(GREEN)🧹 Cleaning up project files...$(NC)"
	rm -rf node_modules frontend/node_modules frontend/build
	rm -rf uploads/* && mkdir -p uploads
	rm -f actions-runner-*.tar.gz actions-runner-*.zip
	rm -rf -- "-p"
	find . -name "*.log" -type f -delete
	@echo "$(GREEN)✅ Project cleanup completed$(NC)"

restart: stop start ## Restart the complete application

rebuild: stop ## Rebuild and restart everything
	@echo "$(GREEN)🔄 Rebuilding application...$(NC)"
	$(DOCKER_COMPOSE) up -d --build
	@echo "$(GREEN)✅ Application rebuilt and started$(NC)"

shell-api: ## Access API container shell
	@echo "$(GREEN)🐚 Accessing API container shell...$(NC)"
	docker exec -it $(API_CONTAINER) sh

shell-db: ## Access database container shell
	@echo "$(GREEN)🐚 Accessing database shell...$(NC)"
	docker exec -it $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME)

dev: ## Start development environment
	@echo "$(GREEN)🔧 Starting development environment...$(NC)"
	npm run dev
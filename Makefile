.PHONY: install migrate start dev test build clean

install:
	npm install
	npm run install:frontend

migrate:
	npm run migrate

start:
	npm start

dev:
	npm run dev

test:
	npm test

build:
	npm run build

clean:
	rm -rf node_modules
	rm -rf frontend/node_modules
	rm -rf frontend/build
	rm -rf database

setup: install migrate
	@echo "✅ Setup complete! Run 'make dev' to start development server"
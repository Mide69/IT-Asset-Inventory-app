# Multi-stage Dockerfile for Student Management System

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend Dependencies
FROM node:18-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 3: Production Image
FROM node:18-alpine AS production
WORKDIR /app

# Install PostgreSQL client for migrations
RUN apk add --no-cache postgresql-client

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy backend dependencies
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app/package*.json ./

# Copy backend source
COPY src/ ./src/

# Copy built frontend
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Create uploads directory
RUN mkdir -p uploads && chown -R nodejs:nodejs uploads

# Set environment variables with defaults
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_HOST=localhost
ENV DB_PORT=5432
ENV DB_NAME=student_management
ENV DB_USER=postgres
ENV DB_PASSWORD=password
ENV LOG_LEVEL=info

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/healthcheck', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start application
CMD ["node", "src/server.js"]
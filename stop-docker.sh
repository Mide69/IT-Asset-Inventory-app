#!/bin/bash

echo "🛑 Stopping IT Asset Inventory Docker Containers"
echo "==============================================="

# Stop containers
docker stop it-asset-app postgres-db 2>/dev/null || true
echo "✅ Containers stopped"

# Remove containers
docker rm it-asset-app postgres-db 2>/dev/null || true
echo "✅ Containers removed"

# Optional: Remove volumes (uncomment to delete data)
# docker volume rm postgres_data uploads_data 2>/dev/null || true
# echo "✅ Volumes removed"

# Optional: Remove image (uncomment to delete built image)
# docker rmi it-asset-inventory 2>/dev/null || true
# echo "✅ Application image removed"

echo "🎉 Docker cleanup completed!"
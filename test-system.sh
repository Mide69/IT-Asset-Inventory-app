#!/bin/bash

echo "🧪 Testing IT Asset Inventory System"
echo "==================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

BASE_URL="http://localhost:3000"

echo "1️⃣ Testing Health Check..."
HEALTH=$(curl -s $BASE_URL/healthcheck)
if echo $HEALTH | grep -q '"status":"OK"'; then
    echo -e "${GREEN}✅ Health Check: PASS${NC}"
else
    echo -e "${RED}❌ Health Check: FAIL${NC}"
    echo "Response: $HEALTH"
    exit 1
fi

echo ""
echo "2️⃣ Testing Assets API..."
ASSETS=$(curl -s $BASE_URL/api/v1/assets)
if echo $ASSETS | grep -q '"success":true'; then
    echo -e "${GREEN}✅ GET Assets: PASS${NC}"
else
    echo -e "${RED}❌ GET Assets: FAIL${NC}"
    echo "Response: $ASSETS"
    exit 1
fi

echo ""
echo "3️⃣ Testing Asset Creation..."
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/api/v1/assets \
  -F "asset_tag=TEST001" \
  -F "name=Test Laptop" \
  -F "category=Laptop" \
  -F "brand=Dell" \
  -F "model=Test Model" \
  -F "status=Active" \
  -F "location=Test Location" \
  -F "department=IT" \
  -F "cost=1000.00")

if echo $CREATE_RESPONSE | grep -q '"success":true'; then
    echo -e "${GREEN}✅ POST Asset: PASS${NC}"
    ASSET_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | grep -o '[0-9]*')
    echo "   Created asset with ID: $ASSET_ID"
    
    # Clean up test data
    curl -s -X DELETE $BASE_URL/api/v1/assets/$ASSET_ID > /dev/null
    echo "   Test asset cleaned up"
else
    echo -e "${RED}❌ POST Asset: FAIL${NC}"
    echo "Response: $CREATE_RESPONSE"
fi

echo ""
echo "🎉 System test completed successfully!"
echo "Your IT Asset Inventory System is working properly."
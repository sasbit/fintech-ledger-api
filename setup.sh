#!/bin/bash

echo "Ledger - Setup Script"
echo "================================="
echo ""

if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "SUCCESS: Docker is running"
echo ""

if lsof -ti:3000 > /dev/null 2>&1; then
    echo "WARNING: Port 3000 is in use. Stopping conflicting processes..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

if lsof -ti:27017 > /dev/null 2>&1; then
    echo "WARNING: Port 27017 is in use. Stopping conflicting MongoDB processes..."
    docker stop $(docker ps -q --filter ancestor=mongo:7.0) 2>/dev/null || true
    sleep 2
fi

echo "SUCCESS: Ports are available"
echo ""

echo "Starting Ledger system..."
docker compose up --build -d

echo ""
echo "Waiting for services to be ready..."

echo "   Waiting for MongoDB..."
until docker compose ps mongodb | grep -q "healthy"; do
    sleep 2
done

echo "   Waiting for API..."
until curl -s http://localhost:3000/health > /dev/null; do
    sleep 2
done

echo ""
echo "SUCCESS: All services are ready!"
echo ""

echo "System Status:"
docker compose ps

echo ""
echo "API Health Check:"
curl -s http://localhost:3000/health | jq '.'

echo ""
echo "Sample Data:"
curl -s http://localhost:3000/api/v1/accounts | jq '.data[] | {name, type, balance}'

echo ""
echo "Ready for testing! You can now:"
echo "   1. Run the demo: ./scripts/demo.sh"
echo "   2. Test manually with curl commands"
echo "   3. View the README.md for detailed instructions"
echo ""
echo "API is available at: http://localhost:3000"
echo "Documentation: README.md"

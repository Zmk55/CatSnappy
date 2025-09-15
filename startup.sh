#!/bin/bash

# CatSnappy Startup Script
# This script ensures all services start in the correct order

set -e

echo "Starting CatSnappy services..."

# Change to the project directory
cd /home/tim/CatSnappy

# Start Docker services
echo "Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 15

# Check if PostgreSQL is ready
echo "Checking PostgreSQL connection..."
until psql -h localhost -U postgres -d catsnappy -c "SELECT 1;" > /dev/null 2>&1; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo "PostgreSQL is ready!"

# Check if MinIO is ready
echo "Checking MinIO connection..."
until curl -s http://localhost:9000/minio/health/live > /dev/null 2>&1; do
    echo "Waiting for MinIO..."
    sleep 2
done

echo "MinIO is ready!"

# Setup MinIO bucket if it doesn't exist
echo "Setting up MinIO bucket..."
node scripts/setup-minio.js

# Start the Next.js application
echo "Starting CatSnappy web application..."
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/catsnappy"
exec pnpm dev

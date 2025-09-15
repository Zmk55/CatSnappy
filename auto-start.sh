#!/bin/bash

# CatSnappy Auto-Start Script
# This script can be added to your login profile to start CatSnappy automatically

cd /home/tim/CatSnappy

# Check if the app is already running
if [ -f app.pid ]; then
    PID=$(cat app.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo "CatSnappy is already running (PID: $PID)"
        exit 0
    else
        echo "Removing stale PID file..."
        rm app.pid
    fi
fi

# Start Docker services first
echo "Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 15

# Start the application
echo "Starting CatSnappy..."
./start-persistent.sh

echo "CatSnappy auto-start completed!"

#!/bin/bash

# CatSnappy Persistent Startup Script
# This script runs the application in the background and persists across terminal sessions

cd /home/tim/CatSnappy

# Set environment variables
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/catsnappy"

# Start the application in the background
nohup pnpm dev > /home/tim/CatSnappy/app.log 2>&1 &

# Save the PID for later reference
echo $! > /home/tim/CatSnappy/app.pid

echo "CatSnappy started in background with PID: $!"
echo "Logs are being written to: /home/tim/CatSnappy/app.log"
echo "PID file: /home/tim/CatSnappy/app.pid"
echo "Application should be accessible at: http://localhost:3000"

#!/bin/bash

# CatSnappy Stop Script
# This script stops the persistent application

cd /home/tim/CatSnappy

if [ -f app.pid ]; then
    PID=$(cat app.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo "Stopping CatSnappy (PID: $PID)..."
        kill $PID
        rm app.pid
        echo "CatSnappy stopped successfully."
    else
        echo "CatSnappy process not found. Removing stale PID file."
        rm app.pid
    fi
else
    echo "No PID file found. CatSnappy may not be running."
fi

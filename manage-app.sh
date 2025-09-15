#!/bin/bash

# CatSnappy Application Manager
# Simple script to start, stop, and check status of the persistent application

case "$1" in
    start)
        if [ -f /home/tim/CatSnappy/app.pid ]; then
            PID=$(cat /home/tim/CatSnappy/app.pid)
            if ps -p $PID > /dev/null 2>&1; then
                echo "CatSnappy is already running (PID: $PID)"
                exit 0
            else
                echo "Removing stale PID file..."
                rm /home/tim/CatSnappy/app.pid
            fi
        fi
        echo "Starting CatSnappy..."
        /home/tim/CatSnappy/start-persistent.sh
        ;;
    stop)
        echo "Stopping CatSnappy..."
        /home/tim/CatSnappy/stop-persistent.sh
        ;;
    status)
        if [ -f /home/tim/CatSnappy/app.pid ]; then
            PID=$(cat /home/tim/CatSnappy/app.pid)
            if ps -p $PID > /dev/null 2>&1; then
                echo "CatSnappy is running (PID: $PID)"
                echo "Application URL: http://localhost:3000"
                echo "Log file: /home/tim/CatSnappy/app.log"
            else
                echo "CatSnappy is not running (stale PID file found)"
            fi
        else
            echo "CatSnappy is not running"
        fi
        ;;
    logs)
        if [ -f /home/tim/CatSnappy/app.log ]; then
            tail -f /home/tim/CatSnappy/app.log
        else
            echo "No log file found. CatSnappy may not be running."
        fi
        ;;
    restart)
        echo "Restarting CatSnappy..."
        /home/tim/CatSnappy/stop-persistent.sh
        sleep 2
        /home/tim/CatSnappy/start-persistent.sh
        ;;
    *)
        echo "Usage: $0 {start|stop|status|logs|restart}"
        echo ""
        echo "Commands:"
        echo "  start   - Start CatSnappy in background"
        echo "  stop    - Stop CatSnappy"
        echo "  status  - Check if CatSnappy is running"
        echo "  logs    - Show live logs"
        echo "  restart - Restart CatSnappy"
        exit 1
        ;;
esac

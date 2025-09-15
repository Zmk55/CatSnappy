# CatSnappy Persistent Setup

Your CatSnappy application is now configured to run persistently in the background, even when you close your terminal session.

## Quick Commands

```bash
# Check if the app is running
./manage-app.sh status

# Start the app in background
./manage-app.sh start

# Stop the app
./manage-app.sh stop

# Restart the app
./manage-app.sh restart

# View live logs
./manage-app.sh logs
```

## How It Works

The application runs using `nohup` which allows it to continue running even after the terminal session ends. The process ID is stored in `app.pid` and logs are written to `app.log`.

## Access Your Application

- **Application**: http://localhost:3000
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
- **Mailpit**: http://localhost:8025

## Prerequisites

Before starting the application, make sure Docker services are running:

```bash
docker-compose up -d
```

## Auto-Start on Boot/Login

### Option 1: Auto-start on Login (Recommended)

Add this line to your `~/.bashrc` or `~/.profile`:

```bash
# Auto-start CatSnappy on login
/home/tim/CatSnappy/auto-start.sh &
```

This will automatically start CatSnappy (including Docker services) every time you log in.

### Option 2: Full Boot-time Startup (Requires sudo)

If you want the application to start even before login (full boot-time startup), you can:

1. Copy the service file to system directory:

   ```bash
   sudo cp /home/tim/CatSnappy/catsnappy.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable catsnappy.service
   ```

2. Also enable Docker to start on boot:
   ```bash
   sudo systemctl enable docker
   ```

### Option 3: Manual Startup

Simply run the auto-start script manually when needed:

```bash
./auto-start.sh
```

## Files Created

- `start-persistent.sh` - Starts the app in background
- `stop-persistent.sh` - Stops the app
- `manage-app.sh` - Management script with all commands
- `auto-start.sh` - Auto-start script for login/boot
- `catsnappy.service` - Systemd service file
- `app.pid` - Contains the process ID (created when running)
- `app.log` - Application logs (created when running)

## Notes

- The application will automatically restart if it crashes (when using systemd)
- Logs are continuously written to `app.log`
- The application runs on port 3000 as requested
- Docker services (PostgreSQL, MinIO, Mailpit) are started automatically by the auto-start script

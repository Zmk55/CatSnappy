#!/bin/bash

echo "🐱 Setting up CatSnappy..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Copy environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp env.example .env.local
    echo "✅ Created .env.local - please update with your configuration"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
pnpm db:generate

# Push database schema
echo "🗄️ Setting up database..."
pnpm db:push

# Seed database
echo "🌱 Seeding database..."
pnpm db:seed

# Setup Git hooks
echo "🔧 Setting up Git hooks..."
pnpm prepare

echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "   pnpm dev"
echo ""
echo "🌐 Access the app at:"
echo "   http://localhost:3000"
echo ""
echo "📊 Access MinIO console at:"
echo "   http://localhost:9001 (minioadmin/minioadmin)"
echo ""
echo "📧 Access Mailpit at:"
echo "   http://localhost:8025"
echo ""
echo "Happy coding! 🐱"

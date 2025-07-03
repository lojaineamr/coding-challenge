#!/bin/bash

echo "🚀 Setting up Performance Tracker Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Setup Backend
echo "📦 Setting up backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found!"
    exit 1
fi

echo "📥 Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "🗄️ Initializing database..."
npm run init-db

if [ $? -ne 0 ]; then
    echo "❌ Failed to initialize database"
    exit 1
fi

# Setup Frontend
echo "📦 Setting up frontend..."
cd ../frontend

if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found!"
    exit 1
fi

echo "📥 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   Backend:  cd backend && npm run dev"
echo "   Frontend: cd frontend && npm start"
echo ""
echo "📱 Access the app at: http://localhost:3000"
echo "🔗 API available at: http://localhost:3001"

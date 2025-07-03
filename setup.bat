@echo off
echo 🚀 Setting up Performance Tracker Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

REM Setup Backend
echo 📦 Setting up backend...
cd backend

if not exist "package.json" (
    echo ❌ Backend package.json not found!
    pause
    exit /b 1
)

echo 📥 Installing backend dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo 🗄️ Initializing database...
npm run init-db

if %errorlevel% neq 0 (
    echo ❌ Failed to initialize database
    pause
    exit /b 1
)

REM Setup Frontend
echo 📦 Setting up frontend...
cd ..\frontend

if not exist "package.json" (
    echo ❌ Frontend package.json not found!
    pause
    exit /b 1
)

echo 📥 Installing frontend dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo ✅ Setup complete!
echo.
echo 🚀 To start the application:
echo    Backend:  cd backend ^&^& npm run dev
echo    Frontend: cd frontend ^&^& npm start
echo.
echo 📱 Access the app at: http://localhost:3000
echo 🔗 API available at: http://localhost:3001
echo.
pause

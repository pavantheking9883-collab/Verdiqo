@echo off
echo =======================================================
echo Verdiqo Secure Adjudication Backend Startup
echo Quantex Intelligence Systems (P) Ltd.
echo =======================================================
echo.
echo Checking for Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js was not found in your system PATH.
    echo Please download and install Node.js from https://nodejs.org/
    echo before running the Verdiqo backend.
    echo.
    pause
    exit /b 1
)

echo Node.js found. Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install npm dependencies.
    echo.
    pause
    exit /b 1
)

echo.
echo Starting Express Server (listening on http://localhost:3000)...
npm start
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Backend server crashed or failed to start.
    echo.
    pause
    exit /b 1
)

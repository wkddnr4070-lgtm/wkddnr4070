@echo off
chcp 65001 >nul 2>&1
title SHE Digital Twin - Quick Start
echo ========================================
echo SHE Digital Twin - Quick Start
echo ========================================
echo.

cd /d "%~dp0"

:: Check if port 8080 is already in use
netstat -ano | findstr :8080 >nul 2>&1
if %errorlevel% == 0 (
    echo Port 8080 is already in use. Using existing server.
    echo.
    :: Open browser immediately if server is already running
    start http://localhost:8080
    echo Browser opened: http://localhost:8080
    echo.
) else (
    echo Starting server...
    echo.
    :: Start server (Vite will auto-open browser with open: true)
    start "SHE Frontend Server" cmd /k "npm run dev"
    
    :: Open browser immediately (will load when server is ready)
    echo Opening browser...
    start http://localhost:8080
    
    :: Wait a moment for server to initialize
    timeout /t 3 /nobreak >nul
    
    :: Check if server has started (with shorter intervals)
    :check_server
    netstat -ano | findstr :8080 >nul 2>&1
    if %errorlevel% neq 0 (
        timeout /t 1 /nobreak >nul
        goto check_server
    )
    echo Server started!
    echo.
)

echo Starting ngrok tunnel...
start "SHE ngrok Tunnel" cmd /k "ngrok http 8080"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo Server started successfully!
echo ========================================
echo.
echo Access URL: http://localhost:8080
echo.
echo ngrok external URL: https://drooly-pseudosessile-teresita.ngrok-free.dev
echo Login info:
echo   Username: dnrdl4070
echo   Password: @wlsghks12
echo.
echo You can close this window.
echo.
pause


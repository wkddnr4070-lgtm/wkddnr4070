@echo off
chcp 65001 >nul
title SHE Digital Twin Server
echo ========================================
echo SHE Digital Twin Server Starting...
echo ========================================
echo.

echo Current location: %CD%
echo.

echo ========================================
echo Step 1: Kill existing processes
echo ========================================
echo.
echo Killing existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ngrok.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo ========================================
echo Step 2: Start Frontend Server
echo ========================================
echo.
echo Starting frontend server...
start "SHE Frontend Server" cmd /k "cd /d \"C:\Users\com\Desktop\SHE 디지털트윈\" && npm run dev"
echo Frontend server starting... waiting 15 seconds
timeout /t 15 /nobreak >nul

echo ========================================
echo Step 3: Start ngrok Tunnel
echo ========================================
echo.
echo Starting ngrok tunnel...
start "SHE ngrok Tunnel" cmd /k "ngrok http 8080"
echo ngrok starting... waiting 10 seconds
timeout /t 10 /nobreak >nul

echo ========================================
echo Step 4: Status Check
echo ========================================
echo.
echo Checking server status...
netstat -an | findstr ":3000" >nul
if %errorlevel% neq 0 (
    echo ❌ Server failed to start
) else (
    echo ✅ Server is running normally!
)

echo.
echo Checking ngrok status...
tasklist | findstr "ngrok.exe" >nul
if %errorlevel% neq 0 (
    echo ❌ ngrok failed to start
) else (
    echo ✅ ngrok is running normally!
)

echo.
echo ========================================
echo 🎉 Complete!
echo ========================================
echo.
echo ✅ SHE Digital Twin Server is running!
echo ✅ External access is available!
echo.
echo Access URL: https://drooly-pseudosessile-teresita.ngrok-free.dev
echo Login Info:
echo   Username: dnrdl4070
echo   Password: @wlsghks12
echo.
echo This window will stay open to monitor the system.
echo Press Ctrl+C to stop all services.
echo.

:monitor
timeout /t 30 /nobreak >nul
echo [%date% %time%] System monitoring... All services running normally.
goto monitor


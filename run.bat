@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo  ========================================
echo   Awaaz AI - Starting...
echo  ========================================
echo.

REM Start API server in new window
start "Awaaz API Server" cmd /k "cd /d "%~dp0" && python server.py"

REM Wait a moment
timeout /t 3 >nul

REM Start Frontend in new window
start "Awaaz Frontend" cmd /k "cd /d "%~dp0\frontend" && npx -y serve -p 3001"

echo.
echo   Servers are starting...
echo.
echo   API:      http://localhost:8000
echo   App:      http://localhost:3001
echo   Admin:    http://localhost:3001/admin.html
echo   API Docs: http://localhost:8000/docs
echo.
echo   Press any key to open the app in browser...
pause >nul

start http://localhost:3001

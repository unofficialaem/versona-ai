@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║     VERSONA AI - Urdu Voice Platform     ║
echo  ╚══════════════════════════════════════════╝
echo.

REM Start Backend API server in new window
echo  [1/2] Starting Backend Server...
start "Versona Backend" cmd /k "cd /d "%~dp0" && python server.py"

REM Wait for backend to initialize
timeout /t 3 >nul

REM Start Frontend in new window
echo  [2/2] Starting Frontend Server...
start "Versona Frontend" cmd /k "cd /d "%~dp0\versonawebapp\frontend" && npm run dev"

echo.
echo  ════════════════════════════════════════════
echo.
echo   ✅ Servers are starting...
echo.
echo   🌐 Frontend:  http://localhost:3000
echo   🔧 Backend:   http://localhost:8000
echo   📚 API Docs:  http://localhost:8000/docs
echo   ☁️ Database:  MongoDB Atlas (Cloud)
echo.
echo  ════════════════════════════════════════════
echo.
echo   Press any key to open the app in browser...
pause >nul

start http://localhost:3000

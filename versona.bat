@echo off
chcp 65001 >nul
cd /d "%~dp0"

REM ═══════════════════════════════════════════════════════════
REM  VERSONA AI - Command Line Tool
REM  Usage: versona [command]
REM ═══════════════════════════════════════════════════════════

if "%1"=="" goto help
if "%1"=="server" goto server
if "%1"=="backend" goto server
if "%1"=="frontend" goto frontend
if "%1"=="both" goto both
if "%1"=="start" goto both
if "%1"=="install" goto install
if "%1"=="setup" goto install
goto cli

:help
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║         VERSONA AI - Commands            ║
echo  ╚══════════════════════════════════════════╝
echo.
echo   Server Commands:
echo     versona server     - Start backend API only
echo     versona frontend   - Start frontend only
echo     versona both       - Start everything
echo     versona install    - Install all dependencies
echo.
echo   CLI Commands:
echo     versona tts "text" -o output.mp3
echo     versona voices
echo     versona analytics
echo.
echo   Quick Start:
echo     Double-click run.bat to start everything!
echo.
pause
goto end

:server
echo.
echo  Starting Backend Server...
echo  API: http://localhost:8000
echo  Docs: http://localhost:8000/docs
echo.
python server.py
goto end

:frontend
echo.
echo  Starting Frontend Server...
echo  URL: http://localhost:3000
echo.
cd versonawebapp\frontend
npm run dev
goto end

:both
echo.
echo  Starting Versona AI...
echo.
start "Versona Backend" cmd /k "cd /d "%~dp0" && python server.py"
timeout /t 3 >nul
start "Versona Frontend" cmd /k "cd /d "%~dp0\versonawebapp\frontend" && npm run dev"
echo.
echo  ✅ Servers started!
echo.
echo     Frontend: http://localhost:3000
echo     Backend:  http://localhost:8000
echo.
timeout /t 2 >nul
start http://localhost:3000
goto end

:install
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║       Installing Dependencies...         ║
echo  ╚══════════════════════════════════════════╝
echo.
echo  [1/2] Installing Python packages...
pip install -r requirements.txt
echo.
echo  [2/2] Installing Node.js packages...
cd versonawebapp\frontend
call npm install
cd ..\..
echo.
echo  ════════════════════════════════════════════
echo  ✅ Installation complete!
echo.
echo  Run 'versona both' or double-click run.bat
echo  ════════════════════════════════════════════
echo.
pause
goto end

:cli
python cli.py %*
goto end

:end

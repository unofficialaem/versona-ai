@echo off
REM Awaaz AI - Quick Start Script for Windows
REM Usage: start.bat [command]

cd /d "%~dp0"

if "%1"=="" goto help
if "%1"=="server" goto server
if "%1"=="frontend" goto frontend
if "%1"=="both" goto both
if "%1"=="install" goto install
goto cli

:help
echo.
echo 🎙️ Awaaz AI - Quick Start
echo ========================
echo.
echo Commands:
echo   start server     - Start the API backend server
echo   start frontend   - Start the frontend dev server
echo   start both       - Start both servers
echo   start install    - Install dependencies
echo.
echo CLI Commands:
echo   start tts "text" -o output.mp3
echo   start stt audio.mp3
echo   start sts audio.mp3 -v VOICE_ID
echo   start clone "Name" sample.mp3
echo   start voices
echo   start analytics
echo.
goto end

:server
echo Starting API server...
python server.py
goto end

:frontend
echo Starting frontend server...
cd frontend
npx -y serve -p 3001
goto end

:both
echo Starting both servers...
start cmd /k "cd /d %~dp0 && python server.py"
start cmd /k "cd /d %~dp0\frontend && npx -y serve -p 3001"
echo.
echo ✅ Servers started in new windows
echo    API: http://localhost:8000
echo    Frontend: http://localhost:3001
echo    Admin: http://localhost:3001/admin.html
goto end

:install
echo Installing dependencies...
pip install -r requirements.txt
echo.
echo ✅ Done! Run 'start both' to launch the app.
goto end

:cli
python cli.py %*
goto end

:end

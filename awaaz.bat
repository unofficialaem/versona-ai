@echo off
chcp 65001 >nul
REM Awaaz AI - Quick Start Script for Windows
REM Usage: awaaz.bat [command]

cd /d "%~dp0"

if "%1"=="" goto help
if "%1"=="server" goto server
if "%1"=="frontend" goto frontend
if "%1"=="both" goto both
if "%1"=="install" goto install
goto cli

:help
echo.
echo  Awaaz AI - Quick Start
echo  =======================
echo.
echo  Commands:
echo    awaaz server     - Start the API backend server
echo    awaaz frontend   - Start the frontend dev server
echo    awaaz both       - Start both servers
echo    awaaz install    - Install dependencies
echo.
echo  CLI Commands:
echo    awaaz tts "text" -o output.mp3
echo    awaaz stt audio.mp3
echo    awaaz sts audio.mp3 -v VOICE_ID
echo    awaaz clone "Name" sample.mp3
echo    awaaz voices
echo    awaaz analytics
echo.
pause
goto end

:server
echo Starting API server...
echo.
python server.py
goto end

:frontend
echo Starting frontend server...
echo.
cd frontend
npx -y serve -p 3001
goto end

:both
echo Starting both servers...
echo.
start "Awaaz API" cmd /k "cd /d "%~dp0" && python server.py"
timeout /t 2 >nul
start "Awaaz Frontend" cmd /k "cd /d "%~dp0\frontend" && npx -y serve -p 3001"
echo.
echo  Servers started in new windows!
echo.
echo    API: http://localhost:8000
echo    Frontend: http://localhost:3001
echo    Admin: http://localhost:3001/admin.html
echo.
pause
goto end

:install
echo Installing dependencies...
echo.
pip install -r requirements.txt
echo.
echo  Done! Run 'awaaz both' to launch the app.
pause
goto end

:cli
python cli.py %*
goto end

:end

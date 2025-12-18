@echo off
cd /d "%~dp0"

:: 1. Start Backend (Minimized)
start "Backend Worker" /min cmd /k "node server.js"

:: 2. Start Frontend (Minimized)
start "Web Interface" /min cmd /k "npm run dev"

:: 3. Wait a moment for them to start
timeout /t 4 /nobreak >nul

:: 4. Open Browser
start http://localhost:5173

:: 5. Close this launcher window immediately
exit
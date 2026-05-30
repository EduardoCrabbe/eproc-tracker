@echo off
echo ==========================================
echo Buscando atualizações do sistema (Git Pull)...
cd /d "%~dp0"
git pull origin main
echo ==========================================

echo Iniciando o Eproc Tracker API (Motor Python)...
start cmd /k "cd /d "%~dp0" && .\venv\Scripts\activate && cd platform_manager\backend && python app.py"

echo Iniciando o Apoio Ao CS (React + Electron)...
start cmd /k "cd /d "%~dp0\Apoio Ao CS\frontend" && npm run electron:dev"

echo.
echo Tudo iniciado! 
echo A janela do Apoio ao CS abrira em alguns segundos.
pause

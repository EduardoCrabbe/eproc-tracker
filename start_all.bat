@echo off
echo ==========================================
echo Buscando atualizacoes do sistema (Git Pull)...
cd /d "%~dp0"
git pull origin main
echo ==========================================

echo Preparando ambiente silencioso...
echo Set WshShell = CreateObject("WScript.Shell") > run_hidden.vbs
echo WshShell.Run "cmd /c cd /d ""%~dp0"" && .\venv\Scripts\activate && cd platform_manager\backend && python app.py", 0, False >> run_hidden.vbs
echo WshShell.Run "cmd /c cd /d ""%~dp0Apoio Ao CS\frontend"" && npm run electron:dev", 0, False >> run_hidden.vbs

echo Iniciando o Eproc Tracker API (Motor Python) silenciosamente...
echo Iniciando o Apoio Ao CS (React + Electron) silenciosamente...

wscript run_hidden.vbs
del run_hidden.vbs

echo.
echo Tudo iniciado com sucesso! As janelas pretas (CMD) ficarao ocultas.
echo A interface do Apoio ao CS abrira em poucos segundos. Esta janela fechara sozinha.
timeout /t 5 > nul

@echo off
echo Iniciando CS Manager App...

:: Iniciar Backend
start cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn main:app --reload"

:: Iniciar Frontend
start cmd /k "cd frontend && npm run dev"

echo Servidores iniciados! Backend rodando na porta 8000 e Frontend rodando no Vite.

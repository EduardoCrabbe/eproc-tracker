from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openpyxl import load_workbook, Workbook
import os
import sys
import threading

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
EPROC_DIR = os.path.join(BASE_DIR, "eproc_consultant")
UPLOADS_DIR = os.path.join(BASE_DIR, "platform_manager", "uploads")
sys.path.append(EPROC_DIR)

if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)

try:
    from test_scraper import run_tests
except ImportError:
    pass

app = FastAPI(title="Eproc Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Estado global do robô por usuário
robo_states = {}

class ClienteNovo(BaseModel):
    cpf: str
    processo: str = ""

def get_user_file(username: str):
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    return os.path.join(UPLOADS_DIR, f"base_{username}.xlsx")

@app.get("/api/clientes")
def listar_clientes(user: str):
    planilha_path = get_user_file(user)
    if not os.path.exists(planilha_path):
        return {"clientes": []}
    
    wb = load_workbook(planilha_path, data_only=True)
    sheet = wb.active
    rows = list(sheet.iter_rows(values_only=True))
    
    if len(rows) <= 1:
        return {"clientes": []}
        
    clientes = []
    for idx, row in enumerate(rows[1:]):
        cpf = row[0] if len(row) > 0 else ""
        if not cpf:
            continue
            
        clientes.append({
            "id": idx + 2,
            "cpf": cpf,
            "processo": row[1] if len(row) > 1 else "",
            "status": row[2] if len(row) > 2 else "",
            "classe": row[3] if len(row) > 3 else "",
            "data": row[4] if len(row) > 4 else "",
            "desc": row[5] if len(row) > 5 else "",
            "triagem": row[6] if len(row) > 6 else ""
        })
    return {"clientes": clientes}

@app.post("/api/clientes")
def adicionar_cliente(cliente: ClienteNovo, user: str):
    planilha_path = get_user_file(user)
    if not os.path.exists(planilha_path):
        # Cria a planilha se não existir
        wb = Workbook()
        sheet = wb.active
        sheet.append(["CPF", "Processo", "Status Consulta", "Classe da Ação", "Data da Movimentação", "Descrição da Movimentação", "Triagem"])
    else:
        wb = load_workbook(planilha_path)
        sheet = wb.active
        
    nova_linha = sheet.max_row + 1
    sheet.cell(row=nova_linha, column=1, value=cliente.cpf)
    sheet.cell(row=nova_linha, column=2, value=cliente.processo)
    
    wb.save(planilha_path)
    return {"message": "Cliente inserido com sucesso!"}

@app.post("/api/upload")
async def upload_planilha(user: str = Query(...), file: UploadFile = File(...)):
    if not file.filename.endswith('.xlsx'):
        raise HTTPException(status_code=400, detail="Envie apenas arquivos Excel (.xlsx)")
        
    planilha_path = get_user_file(user)
    conteudo = await file.read()
    with open(planilha_path, "wb") as f:
        f.write(conteudo)
        
    return {"message": "Planilha atualizada com sucesso!"}

def rodar_robo_em_background(user: str, planilha_path: str):
    global robo_states
    robo_states[user] = {"is_running": True, "message": "Robô em execução..."}
    try:
        run_tests(planilha_path)
        robo_states[user] = {"is_running": False, "message": "Varredura concluída com sucesso!"}
    except Exception as e:
        robo_states[user] = {"is_running": False, "message": f"Erro na execução: {e}"}

@app.post("/api/scan")
def disparar_varredura(user: str):
    global robo_states
    state = robo_states.get(user, {"is_running": False})
    if state.get("is_running"):
        return {"message": "O robô já está rodando!"}
        
    planilha_path = get_user_file(user)
    if not os.path.exists(planilha_path):
        raise HTTPException(status_code=404, detail="Nenhuma planilha encontrada para varrer.")
        
    thread = threading.Thread(target=rodar_robo_em_background, args=(user, planilha_path))
    thread.start()
    return {"message": "Varredura iniciada em background."}

@app.get("/api/status")
def status_robo(user: str):
    global robo_states
    return robo_states.get(user, {"is_running": False, "message": "Parado"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from database import engine, Base
import models
from gemini_service import summarize_attendance
import auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CS Manager App API")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "CS Manager Backend Local Ativo"}

@app.post("/api/ai/summarize")
async def generate_ai_summary(file: UploadFile = File(...)):
    # Save the file temporarily
    temp_file_path = f"temp_{file.filename}"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        summary = summarize_attendance(temp_file_path)
    except Exception as e:
        summary = f"Erro ao processar pela IA: {str(e)}"
    finally:
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            
    return {"summary": summary}

import csv
import io
from fastapi import HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi import Depends

@app.post("/api/customers/upload")
async def upload_customers_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    try:
        decoded = content.decode('utf-8')
    except:
        decoded = content.decode('latin-1')
    
    reader = csv.DictReader(io.StringIO(decoded))
    # Expecting columns something like: id_datajuri, nome_completo, uf, tipo_contrato
    imported_count = 0
    for row in reader:
        id_data = row.get("id_datajuri") or row.get("ID")
        full_name = row.get("nome_completo") or row.get("Nome") or ""
        uf = row.get("uf") or row.get("Estado") or ""
        contract_type = row.get("tipo_contrato") or row.get("Contrato") or ""

        if not id_data: continue

        first_name = full_name.split(" ")[0] if full_name else ""
        
        # Check if exists
        existing = db.query(models.Customer).filter(models.Customer.id_datajuri == id_data).first()
        if existing:
            existing.first_name = first_name
            existing.uf = uf
            existing.contract_type = contract_type
        else:
            new_cust = models.Customer(
                id_datajuri=id_data, 
                first_name=first_name, 
                uf=uf, 
                contract_type=contract_type
            )
            db.add(new_cust)
        imported_count += 1

    db.commit()
    return {"message": f"{imported_count} clientes processados com sucesso."}

from pydantic import BaseModel
class PromptUpdate(BaseModel):
    prompt: str

@app.get("/api/settings/prompt")
def get_prompt(db: Session = Depends(get_db)):
    setting = db.query(models.SystemSettings).filter(models.SystemSettings.key == "ai_prompt").first()
    return {"prompt": setting.value if setting else ""}

@app.post("/api/settings/prompt")
def update_prompt(data: PromptUpdate, db: Session = Depends(get_db)):
    setting = db.query(models.SystemSettings).filter(models.SystemSettings.key == "ai_prompt").first()
    if setting:
        setting.value = data.prompt
    else:
        new_setting = models.SystemSettings(key="ai_prompt", value=data.prompt)
        db.add(new_setting)
    db.commit()
    return {"message": "Prompt atualizado com sucesso"}

# Pricing Table for CS Levels
# Category: Atendimento, ComentarioQuitacao, ReclameAqui, FotoBoleto, VideoDepoimento
PRICING = {
    "Level1_2": {
        "Atendimento": 1.00,
        "ComentarioQuitacao": 5.00,
        "ReclameAqui": 10.00,
        "FotoBoleto": 5.00,
        "VideoDepoimento": 15.00
    },
    "Level3_5": {
        "Atendimento": 1.50,
        "ComentarioQuitacao": 10.00,
        "ReclameAqui": 15.00,
        "FotoBoleto": 15.00,
        "VideoDepoimento": 20.00
    }
}

def get_price(level: int, action: str) -> float:
    category = "Level1_2" if level in [1, 2] else "Level3_5"
    return PRICING[category].get(action, 0.0)

class AttendanceRequest(BaseModel):
    user_id: int

@app.post("/api/customers/{id_datajuri}/attendance")
def register_attendance(id_datajuri: str, req: AttendanceRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    customer = db.query(models.Customer).filter(models.Customer.id_datajuri == id_datajuri).first()
    if not user or not customer:
        raise HTTPException(status_code=404, detail="Usuário ou Cliente não encontrado")

    count = db.query(models.Attendance).filter(models.Attendance.customer_id == id_datajuri).count()
    if count >= 6:
        raise HTTPException(status_code=400, detail="Limite de 6 atendimentos atingido para este cliente")

    price = get_price(user.level_cs, "Atendimento")
    
    attendance = models.Attendance(
        user_id=user.id,
        customer_id=customer.id_datajuri,
        commission_value=price
    )
    db.add(attendance)
    db.commit()
    return {"message": "Atendimento registrado", "commission": price}

class BonusRequest(BaseModel):
    user_id: int
    customer_id: str
    action_type: str # ComentarioQuitacao, ReclameAqui, FotoBoleto, VideoDepoimento

@app.post("/api/bonus/manual")
def register_manual_bonus(req: BonusRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    price = get_price(user.level_cs, req.action_type)
    
    bonus = models.BonusEntry(
        user_id=user.id,
        customer_id=req.customer_id,
        type=req.action_type,
        amount=price
    )
    db.add(bonus)
    db.commit()
    return {"message": "Bônus registrado", "amount": price}

@app.post("/api/customers/{id_datajuri}/quitado")
def mark_as_quitado(id_datajuri: str, db: Session = Depends(get_db)):
    customer = db.query(models.Customer).filter(models.Customer.id_datajuri == id_datajuri).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    
    customer.status = "Quitado"
    db.commit()
    return {"message": "Cliente movido para Quitações"}

@app.get("/api/team")
def get_team_stats(db: Session = Depends(get_db)):
    cs_users = db.query(models.User).filter(models.User.role == "CS").all()
    stats = []
    for user in cs_users:
        total_att = db.query(models.Attendance).filter(models.Attendance.user_id == user.id).count()
        att_comm = sum([a.commission_value for a in db.query(models.Attendance).filter(models.Attendance.user_id == user.id).all()])
        bonus_comm = sum([b.amount for b in db.query(models.BonusEntry).filter(models.BonusEntry.user_id == user.id).all()])
        
        stats.append({
            "id": user.id,
            "email": user.email,
            "level": user.level_cs,
            "total_attendances": total_att,
            "total_gains": att_comm + bonus_comm
        })
    return stats

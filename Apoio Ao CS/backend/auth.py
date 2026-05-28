from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import models
from database import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "CS"

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if not user.email.endswith("@reisrevisional.com.br"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso Negado: Apenas e-mails corporativos (@reisrevisional.com.br) são permitidos."
        )
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
        
    # Seed logic / Limits
    total_users = db.query(models.User).count()
    if total_users == 0:
        # First user is ALWAYS Gerente
        user.role = "Gerente"
    else:
        # Enforce limits
        role_count = db.query(models.User).filter(models.User.role == user.role).count()
        if user.role == "Gerente" and role_count >= 1:
            raise HTTPException(status_code=400, detail="Já existe um Gerente cadastrado.")
        if user.role == "Supervisor" and role_count >= 1:
            raise HTTPException(status_code=400, detail="Já existe um Supervisor cadastrado.")
        if user.role == "CS" and role_count >= 12:
            raise HTTPException(status_code=400, detail="O limite de 12 CSs já foi atingido.")

    new_user = models.User(
        email=user.email,
        password_hash=user.password, 
        role=user.role,
        level_cs=1 if user.role == "CS" else None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Usuário criado com sucesso", "email": new_user.email, "role": new_user.role}

@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    if not user.email.endswith("@reisrevisional.com.br"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso Negado: O e-mail deve pertencer ao domínio @reisrevisional.com.br"
        )
        
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or db_user.password_hash != user.password:
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")
        
    return {
        "message": "Login bem-sucedido", 
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "role": db_user.role,
            "level_cs": db_user.level_cs
        }
    }

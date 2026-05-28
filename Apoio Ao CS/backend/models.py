from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String) # Gerente, Supervisor, CS
    level_cs = Column(Integer, default=1)

    attendances = relationship("Attendance", back_populates="user")
    bonuses = relationship("BonusEntry", back_populates="user")

class Customer(Base):
    __tablename__ = "customers"
    id_datajuri = Column(String, primary_key=True, index=True)
    first_name = Column(String)
    uf = Column(String, nullable=True)
    contract_type = Column(String, nullable=True) # Veículo / Empréstimo
    status = Column(String, default="Ativo") # Ativo / Quitado

    attendances = relationship("Attendance", back_populates="customer")
    bonuses = relationship("BonusEntry", back_populates="customer")

class SystemSettings(Base):
    __tablename__ = "system_settings"
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True)
    value = Column(String)

class Attendance(Base):
    __tablename__ = "attendances"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    customer_id = Column(String, ForeignKey("customers.id_datajuri"))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    commission_value = Column(Float, default=0.0)

    user = relationship("User", back_populates="attendances")
    customer = relationship("Customer", back_populates="attendances")

class BonusEntry(Base):
    __tablename__ = "bonus_entries"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    customer_id = Column(String, ForeignKey("customers.id_datajuri"))
    type = Column(String) # Comentário, Reclame Aqui, Foto, Vídeo, etc.
    amount = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="bonuses")
    customer = relationship("Customer", back_populates="bonuses")

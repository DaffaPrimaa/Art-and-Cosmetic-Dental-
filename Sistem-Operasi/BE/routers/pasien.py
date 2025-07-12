# BE/routers/pasien.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_all(db: Session = Depends(get_db)):
    return db.query(models.Pasien).all()

@router.post("/")
def create_pasien(data: schemas.PasienBase, db: Session = Depends(get_db)):
    pasien = models.Pasien(**data.dict())
    db.add(pasien)
    db.commit()
    db.refresh(pasien)
    return pasien

@router.get("/")
def get_pasien():
    return {"message": "Data pasien"}
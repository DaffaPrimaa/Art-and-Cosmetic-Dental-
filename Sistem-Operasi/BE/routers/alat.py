from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

@router.get("/", response_model=list[schemas.AlatOut])
def get_all_alat(db: Session = Depends(get_db)):
    return db.query(models.Alat).all()

@router.post("/", response_model=schemas.AlatOut)
def create_alat(data: schemas.AlatCreate, db: Session = Depends(get_db)):
    alat = models.Alat(**data.dict())
    db.add(alat)
    db.commit()
    db.refresh(alat)
    return alat

@router.get("/{id}", response_model=schemas.AlatOut)
def get_alat(id: int, db: Session = Depends(get_db)):
    alat = db.query(models.Alat).filter(models.Alat.id == id).first()
    if not alat:
        raise HTTPException(status_code=404, detail="Alat tidak ditemukan")
    return alat

@router.put("/{id}", response_model=schemas.AlatOut)
def update_alat(id: int, data: schemas.AlatUpdate, db: Session = Depends(get_db)):
    alat = db.query(models.Alat).filter(models.Alat.id == id).first()
    if not alat:
        raise HTTPException(status_code=404, detail="Alat tidak ditemukan")
    for field, value in data.dict().items():
        setattr(alat, field, value)
    db.commit()
    return alat

@router.delete("/{id}")
def delete_alat(id: int, db: Session = Depends(get_db)):
    alat = db.query(models.Alat).filter(models.Alat.id == id).first()
    if not alat:
        raise HTTPException(status_code=404, detail="Alat tidak ditemukan")
    db.delete(alat)
    db.commit()
    return {"message": "Alat berhasil dihapus"}

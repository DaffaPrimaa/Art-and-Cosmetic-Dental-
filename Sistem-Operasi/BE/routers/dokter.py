# routes/dokter.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Dokter
from schemas import DokterCreate, DokterUpdate, DokterOut

router = APIRouter(
    prefix="/dokter",
    tags=["Dokter"]
)

@router.get("/", response_model=list[DokterOut])
def get_all_dokter(db: Session = Depends(get_db)):
    return db.query(Dokter).all()

@router.post("/", response_model=DokterOut)
def create_dokter(dokter: DokterCreate, db: Session = Depends(get_db)):
    db_dokter = Dokter(**dokter.dict())
    db.add(db_dokter)
    db.commit()
    db.refresh(db_dokter)
    return db_dokter

@router.get("/{dokter_id}", response_model=DokterOut)
def get_dokter_by_id(dokter_id: int, db: Session = Depends(get_db)):
    dokter = db.query(Dokter).get(dokter_id)
    if not dokter:
        raise HTTPException(status_code=404, detail="Dokter tidak ditemukan")
    return dokter

@router.put("/{dokter_id}", response_model=DokterOut)
def update_dokter(dokter_id: int, update: DokterUpdate, db: Session = Depends(get_db)):
    dokter = db.query(Dokter).get(dokter_id)
    if not dokter:
        raise HTTPException(status_code=404, detail="Dokter tidak ditemukan")
    for key, value in update.dict().items():
        setattr(dokter, key, value)
    db.commit()
    db.refresh(dokter)
    return dokter

@router.delete("/{dokter_id}")
def delete_dokter(dokter_id: int, db: Session = Depends(get_db)):
    dokter = db.query(Dokter).get(dokter_id)
    if not dokter:
        raise HTTPException(status_code=404, detail="Dokter tidak ditemukan")
    db.delete(dokter)
    db.commit()
    return {"message": "Dokter berhasil dihapus"}

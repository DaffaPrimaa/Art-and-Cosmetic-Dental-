from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_  # 👈 WAJIB IMPORT INI UNTUK PENCARIAN
from database import SessionLocal
import models, schemas
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ KODE YANG SUDAH DIPERBAIKI (FITUR SEARCH)
@router.get("/", response_model=List[schemas.PasienOut])
def get_all_pasien(
    search: str | None = None,  # Parameter query dari Postman
    db: Session = Depends(get_db)
):
    # 1. Mulai query dasar
    query = db.query(models.Pasien)

    # 2. Cek apakah ada input search?
    if search:
        search_term = f"%{search}%"
        # Filter Nama ATAU Alamat (Case Insensitive / Tidak peduli huruf besar kecil)
        query = query.filter(
            or_(
                models.Pasien.nama.ilike(search_term),
                models.Pasien.alamat.ilike(search_term)
            )
        )
    
    # 3. Kembalikan hasil (terfilter atau semua)
    return query.all()

@router.post("/", response_model=schemas.PasienOut)
def create_pasien(data: schemas.PasienCreate, db: Session = Depends(get_db)):
    # Catatan: Jika pakai Pydantic v2, sebaiknya ganti .dict() jadi .model_dump()
    pasien = models.Pasien(**data.dict()) 
    db.add(pasien)
    db.commit()
    db.refresh(pasien)
    return pasien

@router.get("/{pasien_id}", response_model=schemas.PasienOut)
def get_pasien(pasien_id: int, db: Session = Depends(get_db)):
    pasien = db.query(models.Pasien).filter(models.Pasien.id == pasien_id).first()
    if not pasien:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")
    return pasien

@router.put("/{pasien_id}", response_model=schemas.PasienOut)
def update_pasien(pasien_id: int, data: schemas.PasienUpdate, db: Session = Depends(get_db)):
    pasien = db.query(models.Pasien).filter(models.Pasien.id == pasien_id).first()
    if not pasien:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")
    
    for attr, value in data.dict().items():
        setattr(pasien, attr, value)
    
    db.commit()
    db.refresh(pasien)
    return pasien

@router.delete("/{pasien_id}")
def delete_pasien(pasien_id: int, db: Session = Depends(get_db)):
    pasien = db.query(models.Pasien).filter(models.Pasien.id == pasien_id).first()
    if not pasien:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")
    db.delete(pasien)
    db.commit()
    return {"detail": "Pasien berhasil dihapus"}

# ❌ SAYA MENGHAPUS FUNGSI DUPLIKAT DI BAWAH SINI
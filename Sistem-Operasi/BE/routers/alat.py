from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from datetime import datetime # 👈 Pastikan ini di-import

router = APIRouter()

@router.get("/", response_model=list[schemas.AlatOut])
def get_all_alat(db: Session = Depends(get_db)):
    """(TETAP) Mengambil semua stok alat saat ini."""
    return db.query(models.Alat).all()

@router.post("/", response_model=schemas.AlatOut)
def create_alat(data: schemas.AlatCreate, db: Session = Depends(get_db)):
    """(TETAP) Membuat alat baru..."""
    
    # Gunakan .model_dump() untuk Pydantic v2
    alat = models.Alat(**data.model_dump()) 
    db.add(alat)
    
    # 👇 KODE TAMBAHAN: MENULIS LOG "MASUK"
    log_entry = models.AlatLog(
        tanggal=datetime.now(),
        nama_alat=data.nama,
        status="MASUK",
        jumlah=data.jumlah,
        harga_satuan=data.harga,
        total_nilai=data.jumlah * data.harga,
        keterangan=data.keterangan  # <-- INI YANG MEMPERBAIKI
    )
    db.add(log_entry)
    
    # Commit keduanya (stok baru DAN log baru)
    db.commit()
    db.refresh(alat)
    return alat

@router.get("/{id}", response_model=schemas.AlatOut)
def get_alat(id: int, db: Session = Depends(get_db)):
    """(TETAP) Mengambil satu alat"""
    alat = db.query(models.Alat).filter(models.Alat.id == id).first()
    if not alat:
        raise HTTPException(status_code=404, detail="Alat tidak ditemukan")
    return alat

@router.put("/{id}", response_model=schemas.AlatOut)
def update_alat(id: int, data: schemas.AlatUpdate, db: Session = Depends(get_db)):
    """(TETAP) Mengupdate alat..."""
    alat = db.query(models.Alat).filter(models.Alat.id == id).first()
    if not alat:
        raise HTTPException(status_code=404, detail="Alat tidak ditemukan")

    # Simpan data LAMA untuk perbandingan log
    old_data = {
        "nama": alat.nama,
        "jumlah": alat.jumlah,
        "harga": alat.harga
    }

    # Gunakan .model_dump() untuk Pydantic v2
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(alat, field, value)
    
    db.add(alat) # Add to session sebelum commit

    # 👇 KODE TAMBAHAN: MENULIS LOG "UPDATE"
    
    # Periksa apakah jumlah berubah (misal: 1 -> 2)
    if old_data["jumlah"] != data.jumlah:
        status = "KELUAR" if old_data["jumlah"] > data.jumlah else "MASUK"
        perubahan_jumlah = abs(old_data["jumlah"] - data.jumlah)
        
        log_entry = models.AlatLog(
            tanggal=datetime.now(),
            nama_alat=alat.nama,
            status=status,
            jumlah=perubahan_jumlah,
            harga_satuan=alat.harga, 
            total_nilai=perubahan_jumlah * alat.harga,
            keterangan=alat.keterangan # <-- INI YANG MEMPERBAIKI
        )
        db.add(log_entry)
    
    # Log jika ada perubahan lain (nama atau harga) TAPI jumlah tetap
    elif old_data["nama"] != data.nama or old_data["harga"] != data.harga:
        log_entry = models.AlatLog(
            tanggal=datetime.now(),
            nama_alat=alat.nama,
            status="DIUPDATE",
            jumlah=alat.jumlah, # Jumlah tetap
            harga_satuan=alat.harga,
            total_nilai=alat.jumlah * alat.harga,
            keterangan=alat.keterangan # <-- INI YANG MEMPERBAIKI
        )
        db.add(log_entry)
    
    # Commit semua perubahan
    db.commit()
    db.refresh(alat)
    return alat

@router.delete("/{id}")
def delete_alat(id: int, db: Session = Depends(get_db)):
    """(TETAP) Menghapus alat..."""
    alat = db.query(models.Alat).filter(models.Alat.id == id).first()
    if not alat:
        raise HTTPException(status_code=404, detail="Alat tidak ditemukan")
        
    # 👇 KODE TAMBAHAN: MENULIS LOG "KELUAR"
    log_entry = models.AlatLog(
        tanggal=datetime.now(),
        nama_alat=alat.nama,
        status="KELUAR",
        jumlah=alat.jumlah, # Log semua jumlah yang tersisa
        harga_satuan=alat.harga,
        total_nilai=alat.jumlah * alat.harga,
        keterangan=alat.keterangan # <-- INI YANG MEMPERBAIKI
    )
    db.add(log_entry)
    
    # Kode Asli Anda:
    db.delete(alat)
    
    # Commit keduanya
    db.commit()
    return {"message": "Alat berhasil dihapus"}
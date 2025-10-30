from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import RekamMedisBase
from models import RekamMedis, Pasien, Dokter
from datetime import date

router = APIRouter()

# GET semua rekam medis
@router.get("/")
def get_rekam_medis(db: Session = Depends(get_db)):
    rekam_list = db.query(RekamMedis).all()
    result = []
    for r in rekam_list:
        result.append({
            "id": r.id,
            "tanggal": r.tanggal.isoformat(),
            "pasien": r.pasien.nama if r.pasien else None,
            "keluhan": r.keluhan,
            "dokter": r.dokter.nama if r.dokter else None,
            "diagnosa": r.diagnosa,
            "tindakan": r.tindakan,
            "biaya_tindakan": r.biaya_tindakan,
            "biaya_bahan": r.biaya_bahan,
            "biaya_obat": r.biaya_obat,
            "total_biaya": r.total_biaya,
        })
    return result

# POST
@router.post("/")
def create_rekam_medis(data: RekamMedisBase, db: Session = Depends(get_db)):
    pasien = db.query(Pasien).get(data.pasien_id)
    dokter = db.query(Dokter).get(data.dokter_id)

    if not pasien:
        raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")
    if not dokter:
        raise HTTPException(status_code=404, detail="Dokter tidak ditemukan")

    total = data.biaya_tindakan + data.biaya_bahan + data.biaya_obat

    rekam = RekamMedis(
        pasien_id=data.pasien_id,
        dokter_id=data.dokter_id,
        keluhan=data.keluhan,
        diagnosa=data.diagnosa,
        tindakan=data.tindakan,
        tanggal=data.tanggal or date.today(),
        biaya_tindakan=data.biaya_tindakan,
        biaya_bahan=data.biaya_bahan,
        biaya_obat=data.biaya_obat,
        total_biaya=total,
    )

    db.add(rekam)
    db.commit()
    db.refresh(rekam)
    return {"message": "Data rekam medis berhasil disimpan"}

# DELETE
@router.delete("/{id}")
def delete_rekam_medis(id: int, db: Session = Depends(get_db)):
    rekam = db.query(RekamMedis).filter_by(id=id).first()
    if not rekam:
        raise HTTPException(status_code=404, detail="Rekam medis tidak ditemukan")
    db.delete(rekam)
    db.commit()
    return {"message": "Data rekam medis berhasil dihapus"}

# GET by ID
@router.get("/{id}")
def get_rekam_medis_by_id(id: int, db: Session = Depends(get_db)):
    rekam = db.query(RekamMedis).filter_by(id=id).first()
    if not rekam:
        raise HTTPException(status_code=404, detail="Rekam medis tidak ditemukan")

    return {
        "id": rekam.id,
        "tanggal": rekam.tanggal.isoformat(),
        "pasien": rekam.pasien.nama if rekam.pasien else None,
        "pasien_id": rekam.pasien_id,
        "keluhan": rekam.keluhan,
        "dokter": rekam.dokter.nama if rekam.dokter else None,
        "dokter_id": rekam.dokter_id,
        "diagnosa": rekam.diagnosa,
        "tindakan": rekam.tindakan,
        "biaya_tindakan": rekam.biaya_tindakan,
        "biaya_bahan": rekam.biaya_bahan,
        "biaya_obat": rekam.biaya_obat,
        "total_biaya": rekam.total_biaya,
    }

# PUT
@router.put("/{id}")
def update_rekam_medis(id: int, data: dict, db: Session = Depends(get_db)):
    rekam = db.query(RekamMedis).filter_by(id=id).first()
    if not rekam:
        raise HTTPException(status_code=404, detail="Rekam medis tidak ditemukan")

    rekam.tanggal = date.fromisoformat(data.get("tanggal", rekam.tanggal.isoformat()))
    rekam.keluhan = data.get("keluhan", rekam.keluhan)
    rekam.diagnosa = data.get("diagnosa", rekam.diagnosa)
    rekam.tindakan = data.get("tindakan", rekam.tindakan)

    rekam.biaya_tindakan = data.get("biaya_tindakan", rekam.biaya_tindakan)
    rekam.biaya_bahan = data.get("biaya_bahan", rekam.biaya_bahan)
    rekam.biaya_obat = data.get("biaya_obat", rekam.biaya_obat)

    # hitung ulang total biaya
    rekam.total_biaya = (
        rekam.biaya_tindakan + rekam.biaya_bahan + rekam.biaya_obat
    )

    if "pasien_id" in data:
        if not db.query(Pasien).filter_by(id=data["pasien_id"]).first():
            raise HTTPException(status_code=404, detail="Pasien tidak ditemukan")
        rekam.pasien_id = data["pasien_id"]

    if "dokter_id" in data:
        if not db.query(Dokter).filter_by(id=data["dokter_id"]).first():
            raise HTTPException(status_code=404, detail="Dokter tidak ditemukan")
        rekam.dokter_id = data["dokter_id"]

    db.commit()
    return {"message": "Data rekam medis berhasil diperbarui"}

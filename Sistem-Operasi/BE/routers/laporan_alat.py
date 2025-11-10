from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from typing import List

router = APIRouter()

@router.get("/", response_model=List[schemas.AlatLogOut])
def get_alat_log_history(db: Session = Depends(get_db)):
    """
    HANYA MENGAMBIL riwayat/history log alat dari tabel 'alat_log'.
    Diurutkan dari yang terbaru.
    """
    # Ambil data dari 'AlatLog'
    logs = db.query(models.AlatLog).order_by(models.AlatLog.tanggal.desc()).all()
    return logs
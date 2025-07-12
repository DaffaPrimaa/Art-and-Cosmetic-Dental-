# schemas.py
from pydantic import BaseModel, EmailStr
from datetime import date

# ==== PASIEN ====
class PasienBase(BaseModel):
    nama: str
    alamat: str
    telp: str

# ==== DOKTER ====
class DokterBase(BaseModel):
    nama: str
    spesialis: str
    email: EmailStr
    telp: str
    alamat: str

class DokterCreate(DokterBase):
    pass

class DokterUpdate(DokterBase):
    pass

class DokterOut(DokterBase):
    id: int

    class Config:
        orm_mode = True

# ==== REKAM MEDIS ====
class RekamMedisBase(BaseModel):
    pasien: str
    keluhan: str
    dokter: str
    diagnosa: str
    tanggal: date

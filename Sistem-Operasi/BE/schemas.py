# schemas.py
from pydantic import BaseModel, EmailStr
from datetime import date

# ==== PASIEN ====
class PasienBase(BaseModel):
    nama: str
    gender: str
    email: EmailStr
    alamat: str
    telp: str

class PasienCreate(PasienBase):
    pass

class PasienUpdate(PasienBase):
    pass

class PasienOut(PasienBase):
    id: int

    class Config:
        from_attributes = True  # ✅ Pydantic v2 compliant

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
        from_attributes = True  # ✅ Pydantic v2 compliant

# ==== REKAM MEDIS ====
class RekamMedisBase(BaseModel):
    pasien_id: int
    dokter_id: int
    keluhan: str
    diagnosa: str
    tindakan: str
    tanggal: date | None = None
    biaya_dokter: int = 0
    biaya_tindakan: int = 0
    biaya_obat: int = 0

class RekamMedisCreate(RekamMedisBase):
    pass

class RekamMedisOut(RekamMedisBase):
    id: int

    class Config:
        from_attributes = True

# ==== alat ====
class AlatBase(BaseModel):
    nama: str
    jumlah: int
    harga: int
    keterangan: str

class AlatCreate(AlatBase):
    pass

class AlatUpdate(AlatBase):
    pass

class AlatOut(AlatBase):
    id: int

    class Config:
        from_attributes = True

# BE/main.py
from fastapi import FastAPI
from database import Base, engine
import models
from fastapi.middleware.cors import CORSMiddleware

# Pastikan router sudah ada
from routers.dokter import router as dokter_router
from routers.pasien import router as pasien_router
from routers.rekam_medis import router as rekam_medis_router
from routers.alat import router as alat_router

# Buat semua tabel dari model
Base.metadata.create_all(bind=engine)   

app = FastAPI()

# Registrasi router jika tersedia
app.include_router(pasien_router, prefix="/pasien", tags=["Pasien"])
app.include_router(dokter_router, prefix="/dokter", tags=["Dokter"])
app.include_router(rekam_medis_router, prefix="/rekam-medis", tags=["Rekam Medis"])
app.include_router(alat_router, prefix="/alat", tags=["Alat"])

@app.get("/")
def home():
    return {"message": "API Klinik Aktif"}
# Tambahkan ini agar bisa fetch dari frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # sesuaikan dengan URL FE kamu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router


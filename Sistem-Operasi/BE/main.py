# BE/main.py

from fastapi import FastAPI
from database import Base, engine
import models
from fastapi.middleware.cors import CORSMiddleware

# Pastikan router sudah ada
from routers import pasien, dokter, rekam_medis

# Buat semua tabel dari model
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Registrasi router jika tersedia
app.include_router(pasien.router, prefix="/pasien", tags=["Pasien"])
app.include_router(dokter.router, prefix="/dokter", tags=["Dokter"])
app.include_router(rekam_medis.router, prefix="/rekam-medis", tags=["Rekam Medis"])

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
app.include_router(dokter.router)

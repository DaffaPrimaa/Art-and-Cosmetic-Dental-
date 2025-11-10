from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime # 👈 TAMBAHKAN IMPORT INI

class Pasien(Base):
    __tablename__ = "pasien"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String)
    gender = Column(String)
    email = Column(String)
    alamat = Column(String)
    telp = Column(String)
    rekam_medis = relationship("RekamMedis", back_populates="pasien")


class Dokter(Base):
    __tablename__ = "dokter"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String)
    spesialis = Column(String)
    email = Column(String)
    telp = Column(String)
    alamat = Column(String)
    rekam_medis = relationship("RekamMedis", back_populates="dokter")


class RekamMedis(Base):
    __tablename__ = "rekam_medis"
    id = Column(Integer, primary_key=True, index=True)
    pasien_id = Column(Integer, ForeignKey("pasien.id"))
    dokter_id = Column(Integer, ForeignKey("dokter.id"))
    tanggal = Column(Date)
    keluhan = Column(String)
    diagnosa = Column(String)
    tindakan = Column(String)
    biaya_tindakan = Column(Integer, default=0)
    biaya_bahan = Column(Integer, default=0)
    biaya_obat = Column(Integer, default=0)
    total_biaya = Column(Integer, default=0)
    pasien = relationship("Pasien", back_populates="rekam_medis")
    dokter = relationship("Dokter", back_populates="rekam_medis")

class Alat(Base):
    __tablename__ = "alat"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String)
    jumlah = Column(Integer)
    harga = Column(Integer)
    keterangan = Column(String)
    tanggal = Column(Date, nullable=True)

# 👇 TAMBAHKAN KELAS BARU INI UNTUK MENYIMPAN HISTORY
class AlatLog(Base):
    __tablename__ = "alat_log"
    
    id = Column(Integer, primary_key=True, index=True)
    tanggal = Column(DateTime, default=datetime.utcnow)
    nama_alat = Column(String)
    status = Column(String) # Mis: "MASUK", "KELUAR", "DIUPDATE"
    jumlah = Column(Integer)
    harga_satuan = Column(Integer)
    total_nilai = Column(Integer)
    keterangan = Column(String, nullable=True)
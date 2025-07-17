# BE/models.py

from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Pasien(Base):
    __tablename__ = "pasien"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String)
    gender = Column(String)
    email = Column(String)
    alamat = Column(String)
    telp = Column(String)

    # Relasi ke rekam medis
    rekam_medis = relationship("RekamMedis", back_populates="pasien")


class Dokter(Base):
    __tablename__ = "dokter"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String)
    spesialis = Column(String)
    email = Column(String)
    telp = Column(String)
    alamat = Column(String)

    # Relasi ke rekam medis
    rekam_medis = relationship("RekamMedis", back_populates="dokter")


class RekamMedis(Base):
    __tablename__ = "rekam_medis"
    id = Column(Integer, primary_key=True, index=True)

    pasien_id = Column(Integer, ForeignKey("pasien.id"))
    dokter_id = Column(Integer, ForeignKey("dokter.id"))

    keluhan = Column(String)
    diagnosa = Column(String)
    tanggal = Column(Date)

    # Relasi ke Pasien dan Dokter
    pasien = relationship("Pasien", back_populates="rekam_medis")
    dokter = relationship("Dokter", back_populates="rekam_medis")

class Alat(Base):
    __tablename__ = "alat"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String)
    jumlah = Column(Integer)
    harga = Column(Integer)
    keterangan = Column(String)

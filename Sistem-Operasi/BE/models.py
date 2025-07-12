# BE/models.py
from sqlalchemy import Column, Integer, String, Date
from database import Base

class Pasien(Base):
    __tablename__ = "pasien"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String)
    alamat = Column(String)
    telp = Column(String)

class Dokter(Base):
    __tablename__ = "dokter"
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String)
    spesialis = Column(String)
    email = Column(String)
    telp = Column(String)
    alamat = Column(String)

class RekamMedis(Base):
    __tablename__ = "rekam_medis"
    id = Column(Integer, primary_key=True, index=True)
    pasien = Column(String)
    keluhan = Column(String)
    dokter = Column(String)
    diagnosa = Column(String)
    tanggal = Column(Date)

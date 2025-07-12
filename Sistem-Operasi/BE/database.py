from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session

DATABASE_URL = "sqlite:///./app.db"  # atau URL database lain

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})  # untuk SQLite
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Ini yang dibutuhkan
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

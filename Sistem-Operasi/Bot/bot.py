import subprocess
import sys
import os
import time
from dotenv import load_dotenv

# Load variabel dari file .env
load_dotenv()

# Path absolut berdasarkan lokasi bot.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Lokasi folder Bot
FE_PATH = os.path.abspath(os.path.join(BASE_DIR, "../FE"))
BE_PATH = os.path.abspath(os.path.join(BASE_DIR, "../BE"))

fe_process = None
be_process = None

def run_fe():
    global fe_process
    print("⚙️ Menyalakan Frontend...")
    fe_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=FE_PATH,
        shell=True
    )

def run_be():
    global be_process
    print("⚙️ Menyalakan Backend...")
    be_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--reload"],
        cwd=BE_PATH,
        shell=True
    )

if __name__ == "__main__":
    print("🚀 Memulai sistem...")

    if not os.path.exists(FE_PATH):
        print(f"❌ Path Frontend tidak ditemukan: {FE_PATH}")
        sys.exit(1)

    if not os.path.exists(BE_PATH):
        print(f"❌ Path Backend tidak ditemukan: {BE_PATH}")
        sys.exit(1)

    run_fe()
    time.sleep(2)
    run_be()

    print("✅ Frontend & Backend berhasil dinyalakan.")
    print("🌐 Buka: http://localhost:5173/")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 FE dan BE akan dimatikan...")
        time.sleep(2)
        if fe_process:
            fe_process.terminate()
            print("✅ FE dimatikan.")
        if be_process:
            be_process.terminate()
            print("✅ BE dimatikan.")
        print("👋 Program selesai. Bye.")

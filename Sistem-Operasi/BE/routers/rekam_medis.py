from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_rekam_medis():
    return {"message": "Data rekam medis"}

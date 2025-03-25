from fastapi import APIRouter, UploadFile, File
from app.utils.templateUtil import process_input_json
import os

router = APIRouter()

# Define a directory to store uploaded templates
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/")
async def read_root():
    return {"message": "Upload API!"}

@router.get("/process")
async def process():
    """
    Endpoint to process input JSON data and generate a presentation.
    """
    return process_input_json()

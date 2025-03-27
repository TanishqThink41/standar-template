import os
import json
from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
from app.utils.llm_processor import process_input_json
from app.utils.chart_generator import generate_bar_chart

# Define a directory to store uploaded templates
UPLOAD_DIR = "uploads"

# Create a router instance
router = APIRouter()


class InputData(BaseModel):
    data: dict

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/")
async def read_root():
    return {"message": "Upload API!"}


@router.post("/createPresentation")
async def create_presentation(input_data: InputData):
    # Step 1: Process the input JSON with the LLM (Gemini).
    try:
        # process_input_json calls Gemini and returns a list of slide objects.
        slides = process_input_json(input_data.data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM processing failed: {str(e)}")
    
    # Step 2: For each slide, generate the bar graph image.
    final_slides = []
    for slide in slides:
        # Expecting each slide to have "title", "subtitle", and "bargraphJSON".
        bg_data = slide.get("bargraphJSON")
        if not bg_data:
            raise HTTPException(
                status_code=400, 
                detail=f"Slide for '{slide.get('title', 'unknown')}' is missing 'bargraphJSON'"
            )
        try:
            # generate_bar_chart returns a base64 encoded PNG image.
            image_base64 = generate_bar_chart(bg_data)
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Graph generation failed for slide '{slide.get('title', 'unknown')}': {e}"
            )
        
        # Adding the generated image to the slide.
        slide["bargraphImage"] = image_base64
        
        # Optionally, remove the raw bargraphJSON field if it’s no longer needed:
        # del slide["bargraphJSON"]

        final_slides.append(slide)

    return {"slides": final_slides}

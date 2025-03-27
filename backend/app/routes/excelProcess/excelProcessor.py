from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import FileResponse
import pandas as pd
import os
import shutil
from .excel import generate_pandas_code

router = APIRouter()

# Define directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Current directory (excelProcess/)
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")  # Upload folder
OUTPUT_DIR = os.path.join(BASE_DIR, "output")  # Output folder

# Ensure both directories exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

@router.post("/process-excel/")
async def process_excel(file: UploadFile = File(...), prompt: str = Form(...)):
    """
    API to process an uploaded Excel file based on the provided prompt.
    Returns the processed Excel file.
    """
    input_path = os.path.join(UPLOAD_DIR, file.filename)  # Save uploaded file here
    output_path = os.path.join(OUTPUT_DIR, f"processed_{file.filename}")  # Save processed file here

    # Save the uploaded file
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Read the Excel file
        df = pd.read_excel(input_path)

        # Generate Pandas code using column headers & preview rows
        headers = df.columns.tolist()
        preview_rows = df.head(10).to_dict(orient="records")
        pandas_code = generate_pandas_code(headers, preview_rows, prompt)
        print(f"Generated Code:\n{pandas_code}")

        # Define execution environment
        exec_globals = {"df": df, "pd": pd}
        exec(pandas_code, exec_globals)  # Execute the Pandas code

        # Extract 'result_df' safely
        result_df = exec_globals.get("result_df")

        if result_df is None:
            return {"error": "Generated code did not produce a valid DataFrame."}

        # Convert Series to DataFrame if necessary
        if isinstance(result_df, pd.Series):
            result_df = result_df.to_frame()

        # Save processed file
        result_df.to_excel(output_path, index=False)

    except Exception as e:
        return {"error": f"Error executing Pandas code: {str(e)}"}

    # Return processed file for download
    return FileResponse(output_path, filename=f"processed_{file.filename}")

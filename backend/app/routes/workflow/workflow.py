from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse  # ✅ Correct import
from sqlalchemy.orm import Session
import pandas as pd
import io
import openai
import magic
from app.routes.workflow.workflowModels import Workflow
from app.routes.workflow.workflowSchemas import WorkflowResponse, UpdatePandasScriptsRequest
from app.utils.db import get_db
from dotenv import load_dotenv
import shutil
import os
from app.routes.profile.profileHelperFunctions import get_current_user
from app.routes.profile.profileModels import User
load_dotenv()

# Load API key from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI Client
client = openai.OpenAI(api_key=OPENAI_API_KEY)
router = APIRouter()

#  AI FUNCTION THAT GENERATES PANDAS CODE 
def generate_pandas_code(headers, preview_rows, prompt):
    """Generates Pandas code using GPT-4o mini."""
    client = openai.OpenAI()  # Initialize OpenAI client

    system_prompt = (
        "You are a Python assistant that generates valid Pandas code only in simple text format(just the code, no markdown, no nothing). "
        "The dataset is already stored in a DataFrame named `df`. Do not redefine `df`. "
        "Ensure the output is always a DataFrame named `result_df`, even if filtering only one column. "
        "Your response must be only the valid Pandas code."
    )

    user_message = f"The dataset has columns: {headers}. First few rows:\n{preview_rows}\n\n{prompt}"

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_message}],
        temperature=0.3
    )

    pandas_code = response.choices[0].message.content.strip()
    return pandas_code




# ALLOWED FILE TYPES WHICH CAN BE PROCESSED IN THE WEBSITE
ALLOWED_FILE_TYPES = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",  # .xlsx
    "application/vnd.ms-excel"  # .xls
}


#  STARTS WORKFLOW BY INITIALIZING AN EMPTY WORKFLOW ROW IN WORKFLOW DATABASE
@router.post("/start-workflow")
def start_workflow(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user), 
):
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}")

    os.makedirs("temp", exist_ok=True)
    print(current_user)
    user = db.query(User).filter(User.email == current_user["sub"]).first()
    # Extract user ID correctly
    user_id = user.id  # Use .get() to avoid KeyError
    print(user_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user authentication")

    workflow = Workflow(file_name=file.filename, pandas_scripts=[], created_by=user_id)
    db.add(workflow)
    db.commit()
    db.refresh(workflow)

    file_path = os.path.join("temp", f"{workflow.id}_{file.filename}")

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return {"message": "Workflow started", "workflow_id": workflow.id, "file_path": file_path}


# PROCESS FILE BY GENERATING PANDAS CODE AND EXECUTING IT 
@router.post("/process-file")
def process_file(
    workflow_id: int,
    prompt: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")

    contents = file.file.read()

    # Detect file type
    mime = magic.Magic(mime=True)
    file_type = mime.from_buffer(contents[:2048])  # Check first 2KB

    # Load DataFrame
    if file_type == "text/csv":
        df = pd.read_csv(io.BytesIO(contents))
    elif file_type in ALLOWED_FILE_TYPES:
        df = pd.read_excel(io.BytesIO(contents), engine="openpyxl")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    # Debug: Print original DataFrame
    print("Original DataFrame before processing:\n", df.head())

    if df.empty:
        return JSONResponse(content={"error": "Uploaded file contains no data."}, status_code=400)

    # Extract headers and preview rows
    headers = list(df.columns)
    preview_rows = df.head(5).to_dict(orient="records")

    # Generate Pandas code using AI
    generated_code = generate_pandas_code(headers, preview_rows, prompt)

    # Debug: Print generated Pandas code
    print(f"Generated Pandas Code:\n{generated_code}")

    # Ensure pandas_scripts is initialized
    if workflow.pandas_scripts is None:
        workflow.pandas_scripts = []

    # Save generated code to workflow
    # workflow.pandas_scripts.append(generated_code)
    # db.add(workflow)
    # db.commit()
    # db.refresh(workflow)

    # Prepare execution environment
    exec_globals = {"df": df.copy(), "pd": pd}
    exec_globals["result_df"] = df.copy()  # Ensure result_df exists

    # Execute generated Pandas code
    try:
        exec(generated_code, exec_globals)
    except Exception as e:
        return JSONResponse(content={"error": f"Execution error: {str(e)}"}, status_code=400)

    # Extract 'result_df' safely
    result_df = exec_globals.get("result_df")

    if result_df is None:
        return JSONResponse(content={"error": "Generated code did not produce a valid DataFrame."}, status_code=400)

    # Ensure result_df is a DataFrame
    if isinstance(result_df, pd.Series):
        result_df = result_df.to_frame()

    # Debug: Print processed DataFrame
    print("Processed DataFrame after execution:\n", result_df)

    if result_df.empty:
        return JSONResponse(content={"error": "Processed DataFrame is empty."}, status_code=400)

    # Convert DataFrame to CSV
    csv_string = result_df.to_csv(index=False)

    # Return response
    return JSONResponse(
        content={
            "generated_code": generated_code,
            "csv_output": csv_string
        }
    )



# UPDATE PANDAS SCRIPTS IN WORKFLOW TABLE 
@router.put("/workflow/update-pandas-scripts/{workflow_id}")
def update_pandas_scripts(workflow_id: int, update_data: UpdatePandasScriptsRequest, db: Session = Depends(get_db)):
    # Fetch the workflow by ID
    workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()

    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")

    # Update the pandas_scripts field with new data
    workflow.pandas_scripts = update_data.pandas_scripts

    # Commit the changes
    db.add(workflow)
    db.commit()
    db.refresh(workflow)

    return {"message": "Pandas scripts updated successfully", "updated_pandas_scripts": workflow.pandas_scripts}


# APPLY WORKFLOW BY EXECUTING THE PANDAS CODE IN PANDAS SCRIPT IN WORKFLOW TABLE 
@router.post("/apply-workflow")
def apply_workflow(
    workflow_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Fetch the workflow from the database
    workflow = db.query(Workflow).filter(Workflow.id == workflow_id).first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")

    # Read the uploaded file
    contents = file.file.read()

    # Detect file type
    mime = magic.Magic(mime=True)
    file_type = mime.from_buffer(contents[:2048])  # Check first 2KB

    # Load DataFrame based on file type
    if file_type == "text/csv":
        df = pd.read_csv(io.BytesIO(contents))
    elif file_type in ALLOWED_FILE_TYPES:
        df = pd.read_excel(io.BytesIO(contents), engine="openpyxl")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    # Debug: Print original DataFrame
    print("Original DataFrame before processing:\n", df.head())

    if df.empty:
        return JSONResponse(content={"error": "Uploaded file contains no data."}, status_code=400)

    # Prepare dictionary to store results of each script
    script_results = {}

    # Execute each script in workflow.pandas_scripts
    for script_info in workflow.pandas_scripts:
        script_name = script_info.get("name")
        script = script_info.get("script")

        # Initialize execution environment with a fresh DataFrame copy
        exec_globals = {"pd": pd, "df": df.copy()}
        exec_globals["result_df"] = df.copy()  # Ensure result_df exists

        # Debug: Print the script being executed
        print(f"Executing script: {script_name}")

        try:
            # Execute the script on the dataframe
            exec(script, exec_globals)
        except Exception as e:
            script_results[script_name] = f"Error executing script: {str(e)}"
            continue

        # Get the result DataFrame from execution
        result_df = exec_globals.get("result_df")

        if result_df is None:
            script_results[script_name] = "Generated code did not produce a valid DataFrame."
            continue

        # Ensure result_df is a DataFrame and clean the data (replace NaN and inf values)
        if isinstance(result_df, pd.Series):
            result_df = result_df.to_frame()
        result_df = result_df.replace([float("inf"), float("-inf")], None)
        result_df = result_df.where(pd.notnull(result_df), None)

        script_results[script_name] = result_df.to_csv(index=False)

    # Return the results in structured JSON
    return JSONResponse(content={"message": "Workflow applied.", "results": script_results})
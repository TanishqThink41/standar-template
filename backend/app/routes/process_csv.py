from fastapi import APIRouter, UploadFile, File, Form
import pandas as pd
import openai
import io
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_pandas_code(user_query: str, csv_sample: str) -> str:
    prompt = f"""
    You are an AI that generates Pandas code for analyzing CSV data. 
    - The user query is: "{user_query}"
    - The CSV file sample data is:
    {csv_sample}
    
    **Instructions:**
    1. Generate only **executable** Pandas code.
    2. Use the dataframe named **'df'** (it is already loaded).
    3. Assign the final result to **'result_df'**.
    4. Do **not** include file reading (`pd.read_csv()`), just work with 'df'.
    5. Ensure the logic **matches** the user query correctly.
    6. Choose the right method based on the query:
       - Use `.value_counts()` for counting occurrences.
       - Use `.duplicated()` only if explicitly needed.
       - Use `.groupby()` if the query involves grouping.
       - Use `.agg()` or `.sum()` for aggregations.

    Generate only the **Python script** with no explanations.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a data analysis expert."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.choices[0].message.content.strip()


def execute_pandas_code(csv_data: bytes, pandas_code: str) -> str:
    exec_locals = {"pd": pd}  # Ensuring Pandas is available in execution

    # Load CSV data into a DataFrame
    df = pd.read_csv(io.BytesIO(csv_data))
    exec_locals["df"] = df  # Injecting dataframe into exec() scope

    # Remove Markdown code block markers if they exist
    pandas_code = pandas_code.strip("```python").strip("```").strip()

    try:
        exec(pandas_code, {}, exec_locals)
    except Exception as e:
        return f"Error executing pandas code: {e}"

    # Extract the result from exec_locals
    if "result_df" in exec_locals and isinstance(exec_locals["result_df"], pd.DataFrame):
        return exec_locals["result_df"].to_csv(index=False)
    else:
        return "Error: result_df was not created in the generated code."

@router.post("/process_csv/")
async def process_csv(file: UploadFile = File(...), query: str = Form(...)):
    csv_data = await file.read()  # Read the uploaded CSV file
    sample_df = pd.read_csv(io.BytesIO(csv_data))  
    sample_text = sample_df.head().to_csv(index=False)  # Generate a sample for AI input

    pandas_code = generate_pandas_code(query, sample_text)  # Generate Pandas code
    output_csv = execute_pandas_code(csv_data, pandas_code)  # Execute the code and get the output CSV

    return {"pandas_code": pandas_code, "output_csv": output_csv}
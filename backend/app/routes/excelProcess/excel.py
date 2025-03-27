import openai
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

# Load API key from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI Client
client = openai.OpenAI(api_key=OPENAI_API_KEY)

def generate_pandas_code(headers, preview_rows, prompt):
    """Generates Pandas code using GPT-4o mini."""
    client = openai.OpenAI()  # Initialize OpenAI client

    system_prompt = (
        "You are a Python assistant that generates valid Pandas code only in simple text format(just the code, no markdown, no nothing). . "
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


def process_excel(headers, preview_rows, prompt, df):
    """Processes the Excel file by generating and executing Pandas code."""
    try:
        # Generate Pandas code
        pandas_code = generate_pandas_code(headers, preview_rows, prompt)
        print(f"Generated Code:\n{pandas_code}")

        # Prepare execution environment
        local_vars = {"df": df, "pd": pd}

        # Execute generated code
        exec(f"filtered_df = {pandas_code}", {}, local_vars)

        # Retrieve processed DataFrame
        if "filtered_df" in local_vars and isinstance(local_vars["filtered_df"], pd.DataFrame):
            return local_vars["filtered_df"]
        else:
            raise ValueError("Generated code did not produce a valid DataFrame.")
    except Exception as e:
        print(f"Error executing Pandas code: {e}")
        return df  # Return original data if execution fails

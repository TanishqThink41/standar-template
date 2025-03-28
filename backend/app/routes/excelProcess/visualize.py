from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import pandas as pd
import os
import io
import base64
import matplotlib.pyplot as plt
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Load API key from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
router = APIRouter()

# Define directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(BASE_DIR, "output")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# OpenAI Client
client = OpenAI(api_key=OPENAI_API_KEY)


def generate_bar_chart(data, x_column, y_column):
    """Generate a bar chart and return it as a Base64 image."""
    plt.figure(figsize=(8, 5))
    plt.bar(data[x_column], data[y_column], color="skyblue")
    plt.xlabel(x_column)
    plt.ylabel(y_column)
    plt.title(f"{x_column} vs {y_column}")
    plt.xticks(rotation=45)
    plt.tight_layout()

    # Save to BytesIO buffer
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)

    # Encode as Base64
    encoded_image = base64.b64encode(buf.read()).decode("utf-8")
    buf.close()
    return encoded_image


def rule_based_analysis(df):
    """Analyze data using rule-based logic and return structured insights."""
    insights = {}

    # Check for duplicates
    duplicated_columns = []
    for col in df.columns:
        if df[col].duplicated().any():
            duplicated_columns.append(col)

    if duplicated_columns:
        x_column = duplicated_columns[0]  # Pick first duplicated column
        y_column = "Count"
        counts = df[x_column].value_counts().reset_index()
        counts.columns = [x_column, y_column]

        insights = {
            "title": f"Duplicacy in {x_column}",
            "subtitle": f"{len(counts)} {x_column} values have duplicates.",
            "table": counts.to_dict(orient="records"),
            "content": [
                f"{row[x_column]} is repeated {row[y_column]} times."
                for _, row in counts.iterrows()
            ],
            "graph": generate_bar_chart(counts, x_column, y_column),
        }

    return insights if insights else None


def llm_fallback(df, prompt):
    """Call GPT-4o-mini if rule-based analysis is not sufficient."""
    messages = [
        {
            "role": "system",
            "content": "You are a data analyst. Analyze the given table and suggest the best visualization.",
        },
        {"role": "user", "content": f"Data preview: {df.head(10).to_dict(orient='records')}"},
        {"role": "user", "content": f"Prompt: {prompt}"},
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )

    return response.choices[0].message.content.strip()


@router.post("/visualize-excel/")
async def visualize_excel(file: UploadFile = File(...)):
    """
    API to analyze and visualize a processed Excel file.
    Returns structured insights including title, subtitle, table, content, and graph.
    """
    try:
        # Convert file to seekable buffer
        file_bytes = await file.read()
        file_buffer = io.BytesIO(file_bytes)

        # Read uploaded file
        df = pd.read_excel(file_buffer)

        # Apply rule-based analysis
        insights = rule_based_analysis(df)

        # If no rule-based insights, use LLM fallback
        if not insights:
            llm_output = llm_fallback(df, "Suggest the best visualization for this data.")
            insights = {
                "title": "AI-Generated Visualization Insights",
                "subtitle": llm_output,
                "table": df.head(10).to_dict(orient="records"),  # Show preview
                "content": [llm_output],
                "graph": None,  # No graph since LLM doesn't generate images
            }

        return JSONResponse(content=insights)

    except Exception as e:
        return JSONResponse(content={"error": f"Failed to process file: {str(e)}"}, status_code=400)

import argparse
import pandas as pd
from excel import process_excel

def run_cli(input_file, prompt, output_file):
    # Load Excel data
    df = pd.read_excel(input_file)
    
    # Extract headers and first 10 rows
    headers = df.columns.tolist()
    preview_rows = df.head(10).to_dict(orient="records")

    # Generate and execute Pandas code
    processed_df = process_excel(headers, preview_rows, prompt, df)

    # Save output to Excel
    processed_df.to_excel(output_file, index=False)
    print(f"Processed file saved to {output_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="MCP Agent CLI")
    parser.add_argument("input_file", type=str, help="Path to input Excel file")
    parser.add_argument("prompt", type=str, help="Analysis prompt for AI")
    parser.add_argument("output_file", type=str, help="Path to save output Excel file")

    args = parser.parse_args()
    run_cli(args.input_file, args.prompt, args.output_file)

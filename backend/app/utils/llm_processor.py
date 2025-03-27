import json
import os
import requests

def process_input_json(input_json: dict):
    prompt = f"""
You are a presentation assistant. Given the following JSON data with employee duplicate details, generate a presentation as a JSON array where each element (slide) is an object with the keys:
  - "title": A string representing the duplicate type (for example, "DuplicateEmpNo.", "DuplicateSSN", etc.)
  - "subtitle": A brief description or subtitle for the slide.
  - "bargraphJSON": A JSON object containing two arrays: "labels" and "values", representing the data required to create a bar graph for this duplicate type.
Ensure that the output is valid JSON.
Input JSON:
{json.dumps(input_json)}
"""

    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise Exception("Gemini API key is not set. Please set GEMINI_API_KEY in your environment.")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_api_key}"
    headers = {"Content-Type": "application/json"}
    
    # Prepare the payload for Gemini.
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"Gemini API error: {response.text}")

    json_response = response.json()

    # Assuming the Gemini API returns a JSON structure with a candidates list.
    # For example: { "candidates": [ { "content": "generated JSON text" } ] }
    candidate = json_response.get("candidates", [{}])[0].get("content", "")
    if candidate is None or candidate == "":
        raise Exception("No content generated by Gemini.")
    
    # If candidate is not a string (for example a dict), convert it to string.
    if isinstance(candidate, dict):
        generated_text = json.dumps(candidate)
    else:
        generated_text = str(candidate).strip()

    # Attempt to parse the generated text as JSON.
    try:
        slides = json.loads(generated_text)
        # Ensure that Gemini output is a list of slide objects.
        if not isinstance(slides, list):
            raise ValueError("Gemini output is not a list of slides.")
        return slides
    except Exception as e:
        raise Exception(f"Failed to parse Gemini output as JSON: {e}")
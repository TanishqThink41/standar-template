import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai
from app.routes import process_csv  # Import the route


app = FastAPI()


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Define a basic Pydantic model for input validation
class InputData(BaseModel):
    data: dict

# Include our route modules with prefixes
app.include_router(process_csv.router) 

@app.get("/")
async def read_root():
    return {"message": "Welcome to the presentation assistant API!"}


# To run the app use: uvicorn app.main:app --reload
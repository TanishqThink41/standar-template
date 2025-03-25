import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from app.routes import upload
import openai


app = FastAPI()


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include our route modules with prefixes
app.include_router(upload.router, prefix="/upload")

# Define a basic Pydantic model for input validation
class InputData(BaseModel):
    data: dict

@app.get("/")
async def read_root():
    return {"message": "Welcome to the presentation assistant API!"}


# To run the app use: uvicorn main:app --reload
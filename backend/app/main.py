from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import presentation

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include our route modules with prefixes
app.include_router(presentation.router, prefix="/presentation")


@app.get("/")
async def read_root():
    return {"message": "Presentation API!"}

# To run the app, use: uvicorn main:app --reload
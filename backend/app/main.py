from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from app.routes.excelProcess import excel
from app.routes.excelProcess.excelProcessor import router as excel_router


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include our route modules with prefixes
app.include_router(excel_router, prefix="/excel", tags=["Excel Processing"])


@app.get("/")
async def read_root():
    return {"message": "Excel processing API!"}

# To run the app, use: uvicorn main:app --reload
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from app.routes.excelProcess import excel
# from app.routes.excelProcess.excelProcessor import router as excel_router
from app.routes.workflow.workflow import router as workflow_router
from app.routes.profile.profile import router as profile_router


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include our route modules with prefixes
# app.include_router(excel_router, prefix="/excel", tags=["Excel Processing"])
app.include_router(workflow_router, prefix="/workflow", tags=["Workflow"])
app.include_router(profile_router, prefix="/profile", tags=["Profile"])

@app.get("/")
async def read_root():
    return {"message": "Excel processing API!"}

# To run the app, use: uvicorn main:app --reload
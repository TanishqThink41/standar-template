from pydantic import BaseModel
from typing import List, Optional

class WorkflowCreate(BaseModel):
    file_name: str

class WorkflowResponse(BaseModel):
    id: int
    file_name: str
    pandas_scripts: List[str]

    class Config:
        orm_mode = True

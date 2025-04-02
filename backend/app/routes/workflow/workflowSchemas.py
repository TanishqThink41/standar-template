from pydantic import BaseModel
from typing import List, Dict, Optional

class WorkflowCreate(BaseModel):
    file_name: str

class WorkflowResponse(BaseModel):
    id: int
    file_name: str
    pandas_scripts: List[Dict[str, Optional[str]]]  # Now it expects a list of dictionaries with string keys and optional string values

    class Config:
        orm_mode = True

# Request Schema for updating pandas_scripts
class UpdatePandasScriptsRequest(BaseModel):
    pandas_scripts: List[Dict[str, Optional[str]]]  # New array of key-value pairs (strings)


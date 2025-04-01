from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    designation: Optional[str] = None
    company: Optional[str] = None
    company_reg_no: Optional[str] = None

class UserCreate(UserBase):
    password: str  # Required for site registration

class UserResponse(UserBase):
    auth_provider: str

class Token(BaseModel):
    access_token: str
    token_type: str

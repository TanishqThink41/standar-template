import jwt
import bcrypt
import os
from google.oauth2 import id_token
from google.auth.transport import requests
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jwt import ExpiredSignatureError, DecodeError

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
security = HTTPBearer()
# Hash password
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

# Generate JWT token
def create_jwt_token(email: str) -> str:
    return jwt.encode({"sub": email}, SECRET_KEY, algorithm=ALGORITHM)

# Verify Google OAuth token
def verify_google_token(token: str):
    try:
        payload = id_token.verify_oauth2_token(token, requests.Request())
        return payload.get("email")
    except:
        return None

# Get current user
# Authentication Dependency
def get_current_user(credentials: str = Depends(security)):
    try:
        print(f"Received Credentials: {credentials}")  # Debugging
        token = credentials.credentials  # Extract token
        print(f"Extracted Token: {token}")  # Debugging
        
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_token  # This will contain user details from the token
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except DecodeError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
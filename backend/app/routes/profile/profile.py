from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import HTTPAuthorizationCredentials,APIKeyHeader,OAuth2PasswordRequestForm
from app.routes.profile.profileModels import User
from app.routes.profile.profileSchemas import UserCreate, UserResponse, Token
from app.routes.profile.profileHelperFunctions import hash_password, verify_password, create_jwt_token, verify_google_token, get_current_user
from app.utils.db import get_db
from dotenv import load_dotenv

router = APIRouter()
oauth2_scheme = APIKeyHeader(name="Authorization", auto_error=True)


# Signup API (Site Registration)
@router.post("/signup", response_model=Token)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    new_user = User(
        email=user.email,
        hashed_password=hashed_password,
        auth_provider="site",
        name=user.name,
        designation=user.designation,
        company=user.company,
        company_reg_no=user.company_reg_no,
    )

    db.add(new_user)
    db.commit()

    return {"access_token": create_jwt_token(user.email), "token_type": "bearer"}

# Login API (Site Login)
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"access_token": create_jwt_token(user.email), "token_type": "bearer"}

# Google Auth API
@router.post("/google-login", response_model=Token)
def google_login(token: str, db: Session = Depends(get_db)):
    email = verify_google_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid Google Token")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(email=email, auth_provider="google")
        db.add(user)
        db.commit()

    return {"access_token": create_jwt_token(email), "token_type": "bearer"}

# Profile Endpoint
@router.get("/profile")
def get_profile(user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # JWT standard uses 'sub' for subject identifier
        user_email = user.get("sub")
        
        if not user_email:
            raise HTTPException(
                status_code=400, 
                detail="Invalid token: missing email/subject"
            )
            
        # Fetch user profile from the database
        user = db.query(User).filter(User.email == user_email).first()
        
        if not user:
            raise HTTPException(
                status_code=404, 
                detail=f"User with email {user_email} not found"
            )
            
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving profile: {str(e)}"
        )
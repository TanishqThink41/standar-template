from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from app.utils.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String,nullable=False, unique=True, index=True)
    hashed_password = Column(String, nullable=True)  # Nullable for Google signups
    auth_provider = Column(String, nullable=False)  # "google" or "site"

    # Additional Fields
    name = Column(String, nullable=True)  # User's full name
    designation = Column(String, nullable=True)  # Job title
    company = Column(String, nullable=True)  # Company name
    company_reg_no = Column(String, nullable=True)  # Company registration number
    # Relationship to Workflow table
    workflows = relationship("Workflow", back_populates="user", cascade="all, delete-orphan")

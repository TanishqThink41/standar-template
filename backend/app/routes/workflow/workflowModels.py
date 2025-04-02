from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.ext.mutable import MutableList  # Import MutableList
from sqlalchemy.orm import relationship
from app.utils.db import Base

class Workflow(Base):
    __tablename__ = "workflows"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    file_name: Mapped[str] = mapped_column(String, nullable=False)
    pandas_scripts: Mapped[list[dict]] = mapped_column(
        MutableList.as_mutable(JSONB), default=list
    )  # ✅ Now changes inside the list will be tracked
    # Foreign Key linking to User table
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Relationship with User (optional, useful for ORM queries)
    user = relationship("User", back_populates="workflows")

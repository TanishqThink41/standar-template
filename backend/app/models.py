from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.ext.mutable import MutableList  # Import MutableList
from .utils.db import Base

class Workflow(Base):
    __tablename__ = "workflows"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    file_name: Mapped[str] = mapped_column(String, nullable=False)
    pandas_scripts: Mapped[list[str]] = mapped_column(
        MutableList.as_mutable(ARRAY(String)), default=list
    )  # Use MutableList for tracking changes

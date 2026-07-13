"""
db_models.py
------------
SQLAlchemy ORM table definitions.
  - CalculationRecord: stores every footprint calculation so the
    Dashboard can show a "monthly comparison" history.
  - ContactMessage: stores messages submitted via the Contact page.
"""

from sqlalchemy import Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.sql import func

from app.database import Base


class CalculationRecord(Base):
    __tablename__ = "calculations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    inputs = Column(JSON, nullable=False)
    transportation_kg = Column(Float, nullable=False)
    electricity_kg = Column(Float, nullable=False)
    lifestyle_kg = Column(Float, nullable=False)
    total_kg = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=True)
    message = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

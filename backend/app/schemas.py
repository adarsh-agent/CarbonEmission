"""
schemas.py
----------
Pydantic models describing every request/response body used by the API.
"""

from typing import Optional, Literal, List
from pydantic import BaseModel, EmailStr, Field


class CalculatorInput(BaseModel):
    # Transportation
    car_km: float = Field(0, ge=0, description="Car distance driven per day (km)")
    bike_km: float = Field(0, ge=0, description="Bicycle distance per day (km)")
    bus_km: float = Field(0, ge=0, description="Bus distance per day (km)")
    train_km: float = Field(0, ge=0, description="Train distance per day (km)")
    flights_year: int = Field(0, ge=0, description="Number of flights taken per year")

    # Electricity
    electricity_bill: float = Field(0, ge=0, description="Monthly electricity bill (INR)")
    ac_hours: float = Field(0, ge=0, description="AC usage per day (hours)")
    fan_hours: float = Field(0, ge=0, description="Fan usage per day (hours)")
    has_fridge: bool = Field(True, description="Household owns a refrigerator")
    washing_loads_week: int = Field(0, ge=0, description="Washing machine loads per week")
    laptop_hours: float = Field(0, ge=0, description="Laptop/desktop usage per day (hours)")
    mobile_hours: float = Field(0, ge=0, description="Mobile charging time per day (hours)")

    # Lifestyle
    lpg_cylinders_month: float = Field(0, ge=0, description="LPG cylinders used per month")
    meat_meals_week: int = Field(0, ge=0, description="Meat meals eaten per week")
    recycling_habit: Literal["always", "sometimes", "never"] = "sometimes"
    plastic_level: Literal["low", "medium", "high"] = "medium"
    water_litres: float = Field(0, ge=0, description="Water consumption per day (litres)")

    name: Optional[str] = Field(None, description="Optional label for this calculation")


class Breakdown(BaseModel):
    transportation: float
    electricity: float
    lifestyle: float
    total: float


class Suggestion(BaseModel):
    icon: str
    title: str
    detail: str


class PredictionResponse(BaseModel):
    id: int
    category: str
    confidence: float
    breakdown: Breakdown
    suggestions: List[Suggestion]


class HistoryItem(BaseModel):
    id: int
    name: Optional[str]
    total_kg: float
    transportation_kg: float
    electricity_kg: float
    lifestyle_kg: float
    category: str
    confidence: float
    created_at: str

    class Config:
        from_attributes = True


class ContactForm(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    subject: Optional[str] = None
    message: str = Field(..., min_length=1)


class ContactResponse(BaseModel):
    success: bool
    message: str

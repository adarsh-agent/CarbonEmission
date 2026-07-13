"""
calculator.py
-------------
Pure, deterministic conversion of a user's lifestyle inputs into an
estimated CO2 footprint (kg / month), plus a category breakdown used
for the Dashboard's pie/bar charts.

Why a formula AND a machine-learning model?
  - The formula gives a transparent, explainable kg CO2/month number.
  - The ML model (see predictor.py) learns the *pattern* between raw
    inputs and Low/Medium/High bands, and reports a confidence score —
    this is the "AI" layer requested by the spec, sitting on top of the
    explainable formula rather than replacing it.
"""

from app.ml.emission_factors import (
    CAR_KG_PER_KM, BUS_KG_PER_KM, TRAIN_KG_PER_KM, BIKE_KG_PER_KM,
    FLIGHT_KG_PER_TRIP, GRID_KG_PER_KWH, RUPEES_PER_KWH, AC_KWH_PER_HOUR,
    FAN_KWH_PER_HOUR, FRIDGE_KWH_PER_DAY, WASHING_MACHINE_KWH_PER_LOAD,
    LAPTOP_KWH_PER_HOUR, MOBILE_KWH_PER_HOUR, LPG_KG_PER_CYLINDER,
    MEAT_KG_PER_MEAL, PLASTIC_KG_PER_LEVEL, WATER_KG_PER_LITRE,
    RECYCLING_REDUCTION,
)

DAYS_PER_MONTH = 30
WEEKS_PER_MONTH = 4.345


def compute_breakdown(payload: dict) -> dict:
    """
    Takes a dict of raw calculator-form inputs and returns a dict with
    per-category kg CO2/month figures plus the grand total.
    Expected keys mirror the CalculatorInput pydantic schema.
    """

    # ---------- Transportation ----------
    car_month = payload["car_km"] * CAR_KG_PER_KM * DAYS_PER_MONTH
    bus_month = payload["bus_km"] * BUS_KG_PER_KM * DAYS_PER_MONTH
    train_month = payload["train_km"] * TRAIN_KG_PER_KM * DAYS_PER_MONTH
    bike_month = payload["bike_km"] * BIKE_KG_PER_KM * DAYS_PER_MONTH
    flight_month = (payload["flights_year"] * FLIGHT_KG_PER_TRIP) / 12.0
    transportation = car_month + bus_month + train_month + bike_month + flight_month

    # ---------- Electricity ----------
    bill_kwh = payload["electricity_bill"] / RUPEES_PER_KWH
    bill_kg = bill_kwh * GRID_KG_PER_KWH

    ac_kg = payload["ac_hours"] * AC_KWH_PER_HOUR * GRID_KG_PER_KWH * DAYS_PER_MONTH
    fan_kg = payload["fan_hours"] * FAN_KWH_PER_HOUR * GRID_KG_PER_KWH * DAYS_PER_MONTH
    fridge_kg = (FRIDGE_KWH_PER_DAY * GRID_KG_PER_KWH * DAYS_PER_MONTH) if payload["has_fridge"] else 0.0
    washing_kg = payload["washing_loads_week"] * WASHING_MACHINE_KWH_PER_LOAD * GRID_KG_PER_KWH * WEEKS_PER_MONTH
    laptop_kg = payload["laptop_hours"] * LAPTOP_KWH_PER_HOUR * GRID_KG_PER_KWH * DAYS_PER_MONTH
    mobile_kg = payload["mobile_hours"] * MOBILE_KWH_PER_HOUR * GRID_KG_PER_KWH * DAYS_PER_MONTH

    # electricity bill already reflects most appliance usage; we blend the
    # bill-derived figure with the itemised appliance estimate (avg) so a
    # user who under-reports one still gets a sensible number.
    itemised = ac_kg + fan_kg + fridge_kg + washing_kg + laptop_kg + mobile_kg
    electricity = (bill_kg + itemised) / 2.0

    # ---------- Lifestyle ----------
    lpg_kg = payload["lpg_cylinders_month"] * LPG_KG_PER_CYLINDER
    meat_kg = payload["meat_meals_week"] * MEAT_KG_PER_MEAL * WEEKS_PER_MONTH
    plastic_kg = PLASTIC_KG_PER_LEVEL.get(payload["plastic_level"], 12.0) * (DAYS_PER_MONTH / 30.0)
    water_kg = payload["water_litres"] * WATER_KG_PER_LITRE * DAYS_PER_MONTH
    lifestyle_raw = lpg_kg + meat_kg + plastic_kg + water_kg

    recycling_factor = RECYCLING_REDUCTION.get(payload["recycling_habit"], 1.0)
    lifestyle = lifestyle_raw * recycling_factor

    total = round(transportation + electricity + lifestyle, 2)

    return {
        "transportation": round(transportation, 2),
        "electricity": round(electricity, 2),
        "lifestyle": round(lifestyle, 2),
        "total": total,
    }


PLASTIC_SCORE = {"low": 1, "medium": 2, "high": 3}
RECYCLING_SCORE = {"always": 1, "sometimes": 2, "never": 3}


def encode_features(payload: dict) -> list:
    """
    Turns the raw payload into a fixed-order numeric feature vector that
    the RandomForest model was trained on. Keep this in lock-step with
    FEATURE_ORDER in emission_factors.py and with train_model.py.
    """
    return [
        payload["car_km"],
        payload["bike_km"],
        payload["bus_km"],
        payload["train_km"],
        payload["flights_year"],
        payload["electricity_bill"],
        payload["ac_hours"],
        payload["fan_hours"],
        1 if payload["has_fridge"] else 0,
        payload["washing_loads_week"],
        payload["laptop_hours"],
        payload["mobile_hours"],
        payload["lpg_cylinders_month"],
        payload["meat_meals_week"],
        PLASTIC_SCORE.get(payload["plastic_level"], 2),
        payload["water_litres"],
        RECYCLING_SCORE.get(payload["recycling_habit"], 2),
    ]

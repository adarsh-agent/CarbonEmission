"""
emission_factors.py
--------------------
Central place for every emission factor used across CarbonCheck.
Keeping these constants in one file means the synthetic-data generator
(train_model.py) and the live predictor (predictor.py) always agree on
how raw lifestyle inputs turn into kilograms of CO2.

Factors are approximate averages compiled from IPCC, EPA and Indian
CEA grid-emission-factor style references. They are good enough for an
educational / capstone project — NOT for scientific or legal reporting.
"""

# ---------------- Transportation (kg CO2 per km) ----------------
CAR_KG_PER_KM = 0.192          # average petrol/diesel hatchback-sedan mix
BUS_KG_PER_KM = 0.055          # per-passenger share on a shared bus
TRAIN_KG_PER_KM = 0.041        # per-passenger share on electric/diesel rail
BIKE_KG_PER_KM = 0.0           # cycling / walking -> zero tailpipe emissions
FLIGHT_KG_PER_TRIP = 250.0     # average short/medium-haul round-trip flight

# ---------------- Electricity ----------------
GRID_KG_PER_KWH = 0.82         # kg CO2 per kWh (India grid average, coal-heavy)
RUPEES_PER_KWH = 8.0           # used to translate a monthly bill into kWh
AC_KWH_PER_HOUR = 1.5
FAN_KWH_PER_HOUR = 0.075
FRIDGE_KWH_PER_DAY = 1.2       # flat daily draw when a fridge is present
WASHING_MACHINE_KWH_PER_LOAD = 1.0
LAPTOP_KWH_PER_HOUR = 0.06
MOBILE_KWH_PER_HOUR = 0.01

# ---------------- Lifestyle ----------------
LPG_KG_PER_CYLINDER = 42.6     # full combustion of one 14.2kg domestic cylinder
MEAT_KG_PER_MEAL = 3.3         # average across red meat / poultry meals
PLASTIC_KG_PER_LEVEL = {"low": 4.0, "medium": 12.0, "high": 24.0}
WATER_KG_PER_LITRE = 0.0003    # pumping + treatment footprint per litre/day
RECYCLING_REDUCTION = {"always": 0.85, "sometimes": 0.93, "never": 1.0}

# ---------------- Classification thresholds (kg CO2 / month) ----------------
LOW_THRESHOLD = 300.0
MEDIUM_THRESHOLD = 420.0

FEATURE_ORDER = [
    "car_km", "bike_km", "bus_km", "train_km", "flights_year",
    "electricity_bill", "ac_hours", "fan_hours", "has_fridge",
    "washing_loads_week", "laptop_hours", "mobile_hours",
    "lpg_cylinders_month", "meat_meals_week", "plastic_level_score",
    "water_litres", "recycling_score",
]

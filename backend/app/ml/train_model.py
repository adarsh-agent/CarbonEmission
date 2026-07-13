"""
train_model.py
---------------
Generates a synthetic-but-realistic dataset of household lifestyle
profiles, labels each one Low / Medium / High carbon using the same
deterministic formula the API uses (calculator.py), then trains a
RandomForestClassifier to recognise those bands directly from the raw
inputs. The trained pipeline (scaler + model + label encoder) is saved
to model.pkl so the FastAPI backend can load it instantly at startup.

Run with:
    python -m app.ml.train_model
from the backend/ directory (with the virtualenv activated).
"""

import random
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

from app.ml.calculator import compute_breakdown, encode_features
from app.ml.emission_factors import LOW_THRESHOLD, MEDIUM_THRESHOLD

RANDOM_SEED = 42
N_SAMPLES = 6000

random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)


def random_profile():
    """Sample one plausible household lifestyle profile."""
    return {
        "car_km": round(np.random.exponential(12), 1),
        "bike_km": round(np.random.exponential(4), 1),
        "bus_km": round(np.random.exponential(6), 1),
        "train_km": round(np.random.exponential(5), 1),
        "flights_year": np.random.choice([0, 0, 0, 1, 2, 4, 8], p=[0.35, 0.2, 0.15, 0.15, 0.08, 0.05, 0.02]),
        "electricity_bill": float(np.clip(round(np.random.normal(2200, 1200)), 200, 12000)),
        "ac_hours": round(np.random.exponential(2.5), 1),
        "fan_hours": round(np.random.exponential(5), 1),
        "has_fridge": np.random.choice([True, False], p=[0.85, 0.15]),
        "washing_loads_week": np.random.poisson(3),
        "laptop_hours": round(np.random.exponential(4), 1),
        "mobile_hours": round(np.random.exponential(2), 1),
        "lpg_cylinders_month": float(np.clip(round(np.random.normal(0.7, 0.3), 2), 0, 3)),
        "meat_meals_week": np.random.poisson(4),
        "plastic_level": np.random.choice(["low", "medium", "high"], p=[0.3, 0.45, 0.25]),
        "water_litres": float(np.clip(round(np.random.normal(150, 60)), 30, 500)),
        "recycling_habit": np.random.choice(["always", "sometimes", "never"], p=[0.3, 0.45, 0.25]),
    }


def label_for_total(total_kg: float) -> str:
    if total_kg < LOW_THRESHOLD:
        return "Low"
    if total_kg < MEDIUM_THRESHOLD:
        return "Medium"
    return "High"


def build_dataset(n=N_SAMPLES):
    rows, labels = [], []
    for _ in range(n):
        profile = random_profile()
        breakdown = compute_breakdown(profile)
        # small realistic noise so the ML model isn't just memorising the formula
        noisy_total = breakdown["total"] * np.random.normal(1.0, 0.05)
        label = label_for_total(noisy_total)
        rows.append(encode_features(profile))
        labels.append(label)
    return np.array(rows, dtype=float), np.array(labels)


def main():
    print(f"Generating {N_SAMPLES} synthetic household profiles...")
    X, y = build_dataset()

    encoder = LabelEncoder()
    y_encoded = encoder.fit_transform(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_encoded, test_size=0.2, random_state=RANDOM_SEED, stratify=y_encoded
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = RandomForestClassifier(
        n_estimators=120,
        max_depth=8,
        random_state=RANDOM_SEED,
        class_weight="balanced",
    )
    model.fit(X_train_scaled, y_train)

    preds = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, preds)
    print(f"Test accuracy: {acc:.3f}")
    print(classification_report(y_test, preds, target_names=encoder.classes_))

    bundle = {
        "model": model,
        "scaler": scaler,
        "label_encoder": encoder,
    }
    out_path = "app/ml/model.pkl"
    joblib.dump(bundle, out_path)
    print(f"Saved trained model bundle to {out_path}")


if __name__ == "__main__":
    main()

"""
predictor.py
------------
Loads the trained RandomForest bundle (model.pkl) once at import time
and exposes `predict_carbon_band(payload)` which returns:
  - category: "Low" | "Medium" | "High"
  - confidence: float 0-1 (probability of the predicted class)
  - breakdown: transportation / electricity / lifestyle / total kg CO2
"""

import os
import joblib
import numpy as np

from app.ml.calculator import compute_breakdown, encode_features

_MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
_bundle = None


def _load_bundle():
    global _bundle
    if _bundle is None:
        if not os.path.exists(_MODEL_PATH):
            raise RuntimeError(
                "model.pkl not found. Run `python -m app.ml.train_model` "
                "from the backend/ directory first."
            )
        _bundle = joblib.load(_MODEL_PATH)
    return _bundle


def predict_carbon_band(payload: dict) -> dict:
    bundle = _load_bundle()
    model = bundle["model"]
    scaler = bundle["scaler"]
    encoder = bundle["label_encoder"]

    features = np.array([encode_features(payload)], dtype=float)
    features_scaled = scaler.transform(features)

    probs = model.predict_proba(features_scaled)[0]
    pred_idx = int(np.argmax(probs))
    category = str(encoder.inverse_transform([pred_idx])[0])
    confidence = float(probs[pred_idx])

    breakdown = compute_breakdown(payload)

    return {
        "category": category,
        "confidence": round(confidence, 3),
        "breakdown": breakdown,
    }

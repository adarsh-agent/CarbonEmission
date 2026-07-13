"""
main.py
-------
CarbonCheck FastAPI application entrypoint.

Run with:
    uvicorn app.main:app --reload --port 8000
from the backend/ directory.
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import engine, get_db, Base
from app import db_models, schemas
from app.ml.predictor import predict_carbon_band
from app.suggestions import generate_suggestions

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CarbonCheck API",
    description="AI-powered carbon footprint calculator backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # relax for local dev; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "CarbonCheck API"}


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}


@app.post("/api/predict", response_model=schemas.PredictionResponse, tags=["Prediction"])
def predict(payload: schemas.CalculatorInput, db: Session = Depends(get_db)):
    """
    Accepts a full lifestyle input form, runs the ML model + formula,
    generates suggestions, stores the record, and returns everything
    the frontend needs to render the result + dashboard.
    """
    data = payload.model_dump()

    result = predict_carbon_band(data)
    breakdown = result["breakdown"]
    suggestions = generate_suggestions(data, breakdown)

    record = db_models.CalculationRecord(
        name=payload.name,
        inputs=data,
        transportation_kg=breakdown["transportation"],
        electricity_kg=breakdown["electricity"],
        lifestyle_kg=breakdown["lifestyle"],
        total_kg=breakdown["total"],
        category=result["category"],
        confidence=result["confidence"],
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "category": result["category"],
        "confidence": result["confidence"],
        "breakdown": breakdown,
        "suggestions": suggestions,
    }


@app.get("/api/history", response_model=list[schemas.HistoryItem], tags=["Dashboard"])
def get_history(limit: int = 12, db: Session = Depends(get_db)):
    """Returns the most recent calculations for the Dashboard's monthly comparison chart."""
    records = (
        db.query(db_models.CalculationRecord)
        .order_by(db_models.CalculationRecord.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": r.id,
            "name": r.name,
            "total_kg": r.total_kg,
            "transportation_kg": r.transportation_kg,
            "electricity_kg": r.electricity_kg,
            "lifestyle_kg": r.lifestyle_kg,
            "category": r.category,
            "confidence": r.confidence,
            "created_at": r.created_at.isoformat() if r.created_at else "",
        }
        for r in reversed(records)
    ]


@app.get("/api/history/{record_id}", response_model=schemas.HistoryItem, tags=["Dashboard"])
def get_history_item(record_id: int, db: Session = Depends(get_db)):
    record = db.query(db_models.CalculationRecord).filter(
        db_models.CalculationRecord.id == record_id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return {
        "id": record.id,
        "name": record.name,
        "total_kg": record.total_kg,
        "transportation_kg": record.transportation_kg,
        "electricity_kg": record.electricity_kg,
        "lifestyle_kg": record.lifestyle_kg,
        "category": record.category,
        "confidence": record.confidence,
        "created_at": record.created_at.isoformat() if record.created_at else "",
    }


@app.post("/api/contact", response_model=schemas.ContactResponse, tags=["Contact"])
def submit_contact(form: schemas.ContactForm, db: Session = Depends(get_db)):
    message = db_models.ContactMessage(
        name=form.name,
        email=form.email,
        subject=form.subject,
        message=form.message,
    )
    db.add(message)
    db.commit()
    return {"success": True, "message": "Thanks for reaching out! We'll get back to you soon."}


@app.get("/api/stats", tags=["Home"])
def get_platform_stats(db: Session = Depends(get_db)):
    """Aggregate stats used by the Home page's statistics cards."""
    total_calcs = db.query(func.count(db_models.CalculationRecord.id)).scalar() or 0
    avg_total = db.query(func.avg(db_models.CalculationRecord.total_kg)).scalar() or 0
    low_count = db.query(func.count(db_models.CalculationRecord.id)).filter(
        db_models.CalculationRecord.category == "Low"
    ).scalar() or 0

    return {
        "total_calculations": total_calcs,
        "average_monthly_kg": round(avg_total, 1),
        "low_carbon_users": low_count,
        "co2_trees_equivalent": round((avg_total * max(total_calcs, 1)) / 21, 1),
    }

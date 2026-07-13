# 🌱 CarbonCheck — AI Carbon Footprint Calculator

CarbonCheck is a full-stack web app that estimates a person's monthly carbon
footprint from everyday transportation, electricity and lifestyle habits,
classifies it as **Low / Medium / High** using a trained machine learning
model, and generates personalized reduction suggestions.

Built as a college internship / capstone project.

---

## Tech stack

**Frontend:** React (Vite), Tailwind CSS, Framer Motion, React Router, Recharts
**Backend:** Python, FastAPI, SQLite (SQLAlchemy)
**AI/ML:** scikit-learn (RandomForestClassifier), pandas, numpy

---

## Project structure

```
carboncheck/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── db_models.py
│   │   ├── schemas.py
│   │   ├── suggestions.py
│   │   └── ml/
│   │       ├── emission_factors.py
│   │       ├── calculator.py
│   │       ├── train_model.py
│   │       ├── predictor.py
│   │       └── model.pkl
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── pages/        Home, Calculator, Result, Dashboard, Tips, About, Contact
│   │   ├── components/   Navbar, Footer, CarbonRing
│   │   ├── context/       CarbonContext (shares latest result across pages)
│   │   ├── api/           Axios client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md   ← you are here
```

---

## Quick start

### 1. Backend (FastAPI) — using `uv` (recommended)

[uv](https://docs.astral.sh/uv/) replaces `pip` + `venv` with one fast tool.

```bash
# install uv once, if you don't have it
curl -LsSf https://astral.sh/uv/install.sh | sh

cd backend
uv sync                                          # installs everything into .venv
uv run uvicorn app.main:app --reload --port 8000
```

The trained model (`model.pkl`) is already included, so the API works
immediately. To regenerate it: `uv run python -m app.ml.train_model`.

<details>
<summary>Alternative: plain pip + venv (no uv)</summary>

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
</details>

API docs: http://localhost:8000/docs

### 2. Frontend (React + Vite)

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env   # defaults to http://localhost:8000
npm run dev
```

App: http://localhost:5173

---

## Features

- **Home page** — hero section, live platform stats, feature overview, SDG section, CTA
- **Calculator** — 3-step form covering transportation, electricity and lifestyle (17 inputs)
- **AI prediction** — RandomForestClassifier predicts Low/Medium/High with a confidence score, alongside an explainable kg CO₂/month formula
- **Personalized suggestions** — rule-based recommendations prioritized by your highest-impact category
- **Dashboard** — total score ring, pie chart, bar chart, and a monthly history comparison line chart
- **Sustainability Tips** — daily tips, green habits, government initiatives, SDG goals
- **About** — what a carbon footprint is, why it matters, how AI helps
- **Contact** — working contact form stored in SQLite

---

## How the AI model works

1. `train_model.py` generates thousands of synthetic household profiles and
   computes their true emissions using the same formula the API uses
   (`calculator.py`), so labels reflect a realistic distribution.
2. A `RandomForestClassifier` is trained on the raw 17-feature vector to learn
   the *pattern* of Low/Medium/High households (not just re-deriving the
   formula), reaching ~83% test accuracy.
3. At prediction time, `predictor.py` loads the saved model bundle
   (model + scaler + label encoder), returns the predicted category and a
   confidence score, and pairs it with the transparent formula's kg CO₂/month
   figure and category breakdown.

---

## Notes for evaluators

- The emission factors in `emission_factors.py` are reasonable educational
  approximations (India grid-average electricity factor, average vehicle
  factors, etc.) — not a certified carbon accounting standard.
- SQLite requires no setup and is created automatically as `carboncheck.db`
  on first run.
- CORS is fully open (`allow_origins=["*"]`) for local development; restrict
  this before any real deployment.

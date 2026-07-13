# CarbonCheck Backend (FastAPI + ML)

## Setup with uv (recommended)

[uv](https://docs.astral.sh/uv/) is a fast Python package/dependency manager
that replaces `pip` + `venv`. Install it once if you don't have it:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh   # macOS/Linux
# or: pipx install uv / winget install astral-sh.uv on Windows
```

Then, from the `backend/` folder:

```bash
cd backend
uv sync              # reads pyproject.toml, creates .venv, installs everything
```

Run the API:

```bash
uv run uvicorn app.main:app --reload --port 8000
```

`uv run` automatically uses the project's `.venv` — no manual activation needed.

(Re)train the ML model if you want to regenerate `model.pkl`:

```bash
uv run python -m app.ml.train_model
```

## Setup with pip (alternative, no uv)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.ml.train_model     # optional — model.pkl is already included
uvicorn app.main:app --reload --port 8000
```

## Run the API

The API will be live at `http://localhost:8000`, with interactive docs at
`http://localhost:8000/docs`.

A SQLite database file `carboncheck.db` is created automatically on first run.


## Endpoints

| Method | Path              | Description                                   |
|--------|-------------------|------------------------------------------------|
| GET    | /api/health       | Health check                                   |
| POST   | /api/predict      | Submit lifestyle inputs, get AI prediction     |
| GET    | /api/history       | Last N calculations (for Dashboard charts)     |
| GET    | /api/history/{id}  | Single calculation record                      |
| POST   | /api/contact       | Submit contact form                            |
| GET    | /api/stats         | Aggregate platform stats (for Home page)       |

## Project layout

```
backend/
├── app/
│   ├── main.py            FastAPI app + routes
│   ├── database.py        SQLAlchemy engine/session
│   ├── db_models.py        SQLAlchemy ORM tables
│   ├── schemas.py          Pydantic request/response models
│   ├── suggestions.py      Rule-based recommendation engine
│   └── ml/
│       ├── emission_factors.py  All emission-factor constants
│       ├── calculator.py        Deterministic kg CO2 formula
│       ├── train_model.py       Synthetic data + model training script
│       ├── predictor.py         Loads model.pkl, exposes predict()
│       └── model.pkl            Pre-trained model bundle (included)
└── requirements.txt
```

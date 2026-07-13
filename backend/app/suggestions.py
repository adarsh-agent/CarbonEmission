"""
suggestions.py
--------------
Generates personalized, prioritized eco-recommendations by looking at
which category (transportation / electricity / lifestyle) contributes
the most to a user's footprint, plus specific raw inputs that stand out.
"""


def generate_suggestions(payload: dict, breakdown: dict) -> list:
    tips = []

    # ---------- Transportation ----------
    if payload["car_km"] > 15:
        tips.append({
            "icon": "car",
            "title": "Cut down solo car trips",
            "detail": "Try carpooling, cycling or public transport for short trips under 5 km — "
                       "it can cut your transport emissions by up to 40%.",
        })
    if payload["flights_year"] >= 4:
        tips.append({
            "icon": "plane",
            "title": "Offset or reduce flights",
            "detail": "Flights are one of the heaviest personal emissions sources. Consider "
                       "video calls for work trips and carbon-offset programs for unavoidable travel.",
        })
    if payload["bus_km"] == 0 and payload["train_km"] == 0 and payload["car_km"] > 5:
        tips.append({
            "icon": "bus",
            "title": "Try public transport",
            "detail": "Switching just two car trips a week to bus or train can meaningfully "
                       "lower your monthly footprint.",
        })

    # ---------- Electricity ----------
    if payload["ac_hours"] > 4:
        tips.append({
            "icon": "wind",
            "title": "Optimize AC usage",
            "detail": "Set your AC to 24-26°C and use a timer. Every 1°C lower can raise "
                       "consumption by roughly 6%.",
        })
    if payload["electricity_bill"] > 3000:
        tips.append({
            "icon": "bulb",
            "title": "Switch to LED lighting & efficient appliances",
            "detail": "LED bulbs use ~75% less energy than incandescent bulbs. Star-rated "
                       "appliances can cut your bill and footprint significantly.",
        })
    tips.append({
        "icon": "sun",
        "title": "Explore renewable energy",
        "detail": "Rooftop solar or a green-energy tariff from your electricity provider can "
                   "offset a large share of your household emissions.",
    })

    # ---------- Lifestyle ----------
    if payload["meat_meals_week"] > 5:
        tips.append({
            "icon": "leaf",
            "title": "Try more plant-based meals",
            "detail": "Reducing meat intake by even 2 meals a week can lower diet-related "
                       "emissions by up to 20%.",
        })
    if payload["plastic_level"] in ("medium", "high"):
        tips.append({
            "icon": "recycle",
            "title": "Reduce single-use plastic",
            "detail": "Carry a reusable bottle and bags. Choosing reusable products over "
                       "single-use plastic reduces both waste and embodied emissions.",
        })
    if payload["recycling_habit"] != "always":
        tips.append({
            "icon": "recycle",
            "title": "Build a consistent recycling habit",
            "detail": "Segregating dry/wet waste and recycling paper, glass and metal keeps "
                       "materials out of landfill and cuts related emissions.",
        })
    if payload["water_litres"] > 180:
        tips.append({
            "icon": "droplet",
            "title": "Save water",
            "detail": "Shorter showers and fixing leaks can reduce daily water use — and the "
                       "energy used to pump and treat it — significantly.",
        })

    tips.append({
        "icon": "tree",
        "title": "Plant or support tree-planting",
        "detail": "A single mature tree absorbs about 20-25 kg of CO2 a year — supporting "
                   "local plantation drives is an easy way to offset your footprint.",
    })

    # Highest-impact category gets surfaced first
    top_category = max(
        ("transportation", breakdown["transportation"]),
        ("electricity", breakdown["electricity"]),
        ("lifestyle", breakdown["lifestyle"]),
        key=lambda x: x[1],
    )[0]

    category_keywords = {
        "transportation": ["car", "plane", "bus"],
        "electricity": ["wind", "bulb", "sun"],
        "lifestyle": ["leaf", "recycle", "droplet", "tree"],
    }
    priority_icons = category_keywords[top_category]
    tips.sort(key=lambda t: 0 if t["icon"] in priority_icons else 1)

    return tips[:6]

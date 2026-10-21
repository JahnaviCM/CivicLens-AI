
import sqlite3
from pathlib import Path
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="CivicLens AI",
    description="Civic issue reporting and sustainability insights",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "civiclens.db"

ALLOWED_STATUSES = ["Reported", "In Progress", "Resolved"]


# DATABASE

def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS issues (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                location TEXT NOT NULL DEFAULT 'Location not provided',
                category TEXT NOT NULL,
                priority TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'Reported',
                recommendation TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)

        count = connection.execute(
            "SELECT COUNT(*) FROM issues"
        ).fetchone()[0]

        if count == 0:
            examples = [
                (
                    "Overflowing drainage near residential area",
                    "Water is overflowing from a blocked drain.",
                    "Demo location",
                    "Drainage",
                    "High",
                    "Reported",
                    "Inspect the drain and clear blockages.",
                    datetime.now().isoformat(),
                ),
                (
                    "Garbage accumulation on roadside",
                    "Uncollected garbage is affecting the area.",
                    "Demo location",
                    "Waste Management",
                    "Medium",
                    "In Progress",
                    "Arrange waste collection.",
                    datetime.now().isoformat(),
                ),
            ]

            connection.executemany("""
                INSERT INTO issues (
                    title, description, location, category,
                    priority, status, recommendation, created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, examples)


initialize_database()


# REQUEST MODELS

class IssueInput(BaseModel):
    title: str = Field(min_length=4, max_length=200)
    description: str = Field(min_length=8, max_length=3000)
    location: str = Field(
        default="Location not provided",
        max_length=300,
    )


class StatusInput(BaseModel):
    status: str


class QuestionInput(BaseModel):
    question: str = Field(min_length=2, max_length=2000)


# ISSUE CLASSIFICATION RULES

ISSUE_RULES = [
    {
        "category": "Drainage",
        "keywords": [
            "drain", "flood", "flooding", "waterlogging",
            "sewage", "water overflow", "blocked drain",
        ],
        "priority": "High",
        "recommendation": (
            "Inspect the drain, clear blockages, and check water flow."
        ),
        "impact": "Possible waterlogging and water contamination",
        "sustainability": (
            "Supports water quality and resilient urban drainage."
        ),
    },
    {
        "category": "Waste Management",
        "keywords": [
            "garbage", "waste", "rubbish", "dumping",
            "litter", "plastic", "landfill",
        ],
        "priority": "Medium",
        "recommendation": (
            "Arrange waste collection and encourage waste segregation."
        ),
        "impact": "Possible land pollution and blocked drains",
        "sustainability": (
            "Encourages recycling and responsible waste management."
        ),
    },
    {
        "category": "Air Pollution",
        "keywords": [
            "smoke", "pollution", "emission", "dust",
            "air quality", "burning waste",
        ],
        "priority": "High",
        "recommendation": (
            "Document the pollution source if safe and request an "
            "environmental assessment."
        ),
        "impact": "Possible air-quality deterioration",
        "sustainability": (
            "Supports cleaner air and pollution reduction."
        ),
    },
    {
        "category": "Green Spaces",
        "keywords": [
            "tree", "trees", "deforestation", "green space",
            "cutting trees", "park",
        ],
        "priority": "Medium",
        "recommendation": (
            "Inspect the affected green space and consider restoration."
        ),
        "impact": "Potential loss of vegetation and green cover",
        "sustainability": (
            "Supports urban biodiversity and greener neighbourhoods."
        ),
    },
    {
        "category": "Public Infrastructure",
        "keywords": [
            "streetlight", "street light", "dark road",
            "broken road", "pothole", "road damage", "footpath",
        ],
        "priority": "Medium",
        "recommendation": (
            "Inspect the infrastructure and arrange necessary maintenance."
        ),
        "impact": "Possible public safety risks",
        "sustainability": (
            "Supports safer and more reliable public infrastructure."
        ),
    },
    {
        "category": "Water Supply",
        "keywords": [
            "water shortage", "no water", "water leakage",
            "pipe leak", "drinking water", "water supply",
        ],
        "priority": "Medium",
        "recommendation": (
            "Request an inspection of the water supply or leakage."
        ),
        "impact": "Possible water wastage or supply interruption",
        "sustainability": (
            "Supports water conservation."
        ),
    },
    {
        "category": "Energy",
        "keywords": [
            "power wastage", "energy wastage",
            "electricity wastage", "power outage",
        ],
        "priority": "Medium",
        "recommendation": (
            "Request an inspection by the responsible electricity team."
        ),
        "impact": "Possible energy waste or service disruption",
        "sustainability": (
            "Encourages responsible energy use."
        ),
    },
]


def analyze_issue(title, description):
    text = f"{title} {description}".lower()

    matched = None

    for rule in ISSUE_RULES:
        if any(word in text for word in rule["keywords"]):
            matched = rule
            break

    if matched is None:
        matched = {
            "category": "Other Civic Issue",
            "priority": "Low",
            "recommendation": (
                "Review the report and assign it to the appropriate "
                "civic department."
            ),
            "impact": "Impact requires further assessment",
            "sustainability": (
                "Assess the issue before determining its sustainability impact."
            ),
        }

    score = 20

    if matched["priority"] == "High":
        score += 30
    elif matched["priority"] == "Medium":
        score += 15

    risk_words = [
        "severe", "urgent", "dangerous", "hazardous",
        "overflowing", "contaminated", "exposed wire",
        "major leak", "blocked completely",
    ]

    if any(word in text for word in risk_words):
        score += 25

    widespread_words = [
        "entire street", "whole area", "multiple houses",
        "school", "hospital", "many residents",
    ]

    if any(word in text for word in widespread_words):
        score += 15

    score = min(score, 100)

    if score >= 60:
        priority = "High"
        reason = "Issue type and reported risk indicators suggest higher priority."
    elif score >= 35:
        priority = "Medium"
        reason = "Issue type and reported details suggest moderate priority."
    else:
        priority = "Low"
        reason = "Few risk indicators were identified by the current rules."

    return {
        "category": matched["category"],
        "priority": priority,
        "priority_score": score,
        "priority_reason": reason,
        "recommendation": matched["recommendation"],
        "potential_impact": matched["impact"],
        "sustainability_insight": matched["sustainability"],
        "analysis_method": "Rule-based heuristic",
    }


def row_to_dict(row):
    issue = dict(row)
    analysis = analyze_issue(
        issue["title"],
        issue["description"],
    )

    issue["priority_score"] = analysis["priority_score"]
    issue["priority_reason"] = analysis["priority_reason"]
    issue["potential_impact"] = analysis["potential_impact"]
    issue["sustainability_insight"] = analysis["sustainability_insight"]
    issue["analysis_method"] = analysis["analysis_method"]

    return issue


# HOME AND HEALTH

@app.get("/")
def home():
    return {
        "message": "CivicLens AI backend is running",
        "version": app.version,
        "database": "SQLite",
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "project": "CivicLens AI",
        "database": "SQLite",
        "version": app.version,
    }


# ISSUE ENDPOINTS

@app.get("/api/issues")
def get_issues():
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM issues ORDER BY id DESC"
        ).fetchall()

    return [row_to_dict(row) for row in rows]


@app.post("/api/issues", status_code=201)
def create_issue(data: IssueInput):
    title = data.title.strip()
    description = data.description.strip()
    location = data.location.strip() or "Location not provided"

    if not title or not description:
        raise HTTPException(
            status_code=400,
            detail="Title and description cannot be blank.",
        )

    analysis = analyze_issue(title, description)

    with get_connection() as connection:
        cursor = connection.execute("""
            INSERT INTO issues (
                title, description, location, category,
                priority, status, recommendation, created_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            title,
            description,
            location,
            analysis["category"],
            analysis["priority"],
            "Reported",
            analysis["recommendation"],
            datetime.now().isoformat(),
        ))

        issue_id = cursor.lastrowid

        row = connection.execute(
            "SELECT * FROM issues WHERE id = ?",
            (issue_id,),
        ).fetchone()

    return row_to_dict(row)


@app.patch("/api/issues/{issue_id}/status")
def update_status(issue_id: int, data: StatusInput):
    if data.status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Status must be Reported, In Progress, or Resolved.",
        )

    with get_connection() as connection:
        cursor = connection.execute(
            "UPDATE issues SET status = ? WHERE id = ?",
            (data.status, issue_id),
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Issue not found.",
            )

        row = connection.execute(
            "SELECT * FROM issues WHERE id = ?",
            (issue_id,),
        ).fetchone()

    return row_to_dict(row)


# DASHBOARD STATISTICS

@app.get("/api/stats")
def get_stats():
    with get_connection() as connection:
        row = connection.execute("""
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'Reported' THEN 1 ELSE 0 END)
                    AS reported,
                SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END)
                    AS in_progress,
                SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END)
                    AS resolved,
                SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END)
                    AS high_priority
            FROM issues
        """).fetchone()

    return {
        key: (row[key] or 0)
        for key in [
            "total", "reported", "in_progress",
            "resolved", "high_priority",
        ]
    }


# SUSTAINABILITY INSIGHTS

@app.get("/api/insights")
def get_insights():
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM issues ORDER BY id DESC"
        ).fetchall()

    issues = [row_to_dict(row) for row in rows]
    total = len(issues)

    categories = {}
    priorities = {"High": 0, "Medium": 0, "Low": 0}

    for issue in issues:
        category = issue["category"]
        categories[category] = categories.get(category, 0) + 1

        priority = issue["priority"]
        if priority in priorities:
            priorities[priority] += 1

    resolved = sum(
        1 for issue in issues if issue["status"] == "Resolved"
    )
    open_count = total - resolved

    resolution_rate = (
        round(resolved / total * 100, 1) if total else 0
    )

    high_priority_open = sum(
        1 for issue in issues
        if issue["priority"] == "High"
        and issue["status"] != "Resolved"
    )

    top_category = (
        max(categories, key=categories.get) if categories else None
    )

    recommendations = []

    if high_priority_open:
        recommendations.append(
            f"Review {high_priority_open} open high-priority issue(s) "
            "and confirm urgency with the responsible team."
        )

    if categories.get("Waste Management", 0):
        recommendations.append(
            "Review waste collection frequency and opportunities "
            "for segregation and recycling."
        )

    if categories.get("Drainage", 0):
        recommendations.append(
            "Inspect reported drainage locations for blockages "
            "and possible waterlogging."
        )

    if categories.get("Air Pollution", 0):
        recommendations.append(
            "Document reported pollution locations and request "
            "an assessment from the relevant authority."
        )

    if categories.get("Green Spaces", 0):
        recommendations.append(
            "Review green-space maintenance and restoration opportunities."
        )

    if not recommendations:
        recommendations.append(
            "Continue collecting reports to identify civic priorities "
            "and sustainability opportunities."
        )

    return {
        "total_issues": total,
        "resolved_issues": resolved,
        "open_issues": open_count,
        "resolution_rate_percent": resolution_rate,
        "high_priority_open": high_priority_open,
        "category_breakdown": categories,
        "priority_breakdown": priorities,
        "most_reported_category": top_category,
        "recommendations": recommendations,
        "analysis_method": "Rule-based summary of submitted reports",
        "note": (
            "Prototype insights are based on submitted reports, not "
            "verified environmental measurements or trained ML predictions."
        ),
    }


# CIVIC GUIDANCE ASSISTANT

@app.post("/api/assistant")
def assistant(data: QuestionInput):
    question = data.question.strip()
    text = question.lower()

    if any(word in text for word in [
        "drain", "flood", "waterlogging", "sewage",
    ]):
        answer = (
            "Record the location and describe the drainage overflow. "
            "Report it to the responsible civic authority. Avoid entering "
            "floodwater and keep away from exposed electrical equipment."
        )

    elif any(word in text for word in [
        "garbage", "waste", "dumping", "recycl", "litter", "plastic",
    ]):
        answer = (
            "Record the dumping location and request waste collection. "
            "Separate recyclable materials where practical. Do not handle "
            "unknown or hazardous waste directly."
        )

    elif any(word in text for word in [
        "pollution", "smoke", "air quality", "emission", "dust",
    ]):
        answer = (
            "Record the location, time, and visible pollution source if safe. "
            "Contact the relevant civic or environmental authority for "
            "assessment. Avoid approaching hazardous emissions."
        )

    elif any(word in text for word in [
        "tree", "deforestation", "green space", "park",
    ]):
        answer = (
            "Document the affected location and describe the impact on "
            "trees or green space. Contact the relevant authority "
            "to request an inspection."
        )

    elif any(word in text for word in [
        "water shortage", "water leakage", "water supply",
        "drinking water", "pipe leak",
    ]):
        answer = (
            "Record the affected location and describe the water issue. "
            "Request an inspection from the responsible water-supply "
            "department. Avoid drinking water suspected of contamination."
        )

    elif any(word in text for word in [
        "streetlight", "street light", "pothole",
        "broken road", "infrastructure",
    ]):
        answer = (
            "Include the exact location and describe the infrastructure "
            "problem. Report hazards to the responsible civic department."
        )

    elif any(word in text for word in [
        "priority", "urgent", "high risk", "important issue",
    ]):
        answer = (
            "Priority is estimated using issue type and selected risk words. "
            "Review high-priority open reports first and confirm urgency "
            "with the relevant authority."
        )

    elif any(word in text for word in [
        "sustainability", "environment", "climate", "eco-friendly",
    ]):
        answer = (
            "Possible sustainability actions include preventing waste "
            "dumping, protecting water quality, improving drainage, "
            "reducing pollution, and maintaining green spaces. "
            "See GET /api/insights for report patterns."
        )

    else:
        answer = (
            "Describe the civic issue and its location. CivicLens AI can "
            "categorize common drainage, waste, pollution, green-space, "
            "water-supply, and infrastructure problems."
        )

    return {
        "question": question,
        "answer": answer,
        "note": (
            "This prototype uses rule-based categorization and predefined "
            "guidance. It does not call a live LLM or use a trained ML model."
        ),
    }

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(title="CivicLens AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

issues = [
    {
        "id": 1,
        "title": "Overflowing drainage near residential area",
        "description": "Water is overflowing from a blocked drain.",
        "location": "Demo location",
        "category": "Drainage",
        "priority": "High",
        "status": "Reported",
        "recommendation": "Inspect the drain and clear blockages.",
        "created_at": datetime.now().isoformat(),
    },
    {
        "id": 2,
        "title": "Garbage accumulation on roadside",
        "description": "Uncollected garbage is affecting the area.",
        "location": "Demo location",
        "category": "Waste Management",
        "priority": "Medium",
        "status": "In Progress",
        "recommendation": "Arrange waste collection and improve collection frequency.",
        "created_at": datetime.now().isoformat(),
    },
]


class IssueInput(BaseModel):
    title: str
    description: str
    location: str = "Location not provided"


class StatusInput(BaseModel):
    status: str


class QuestionInput(BaseModel):
    question: str


def classify_issue(text: str):
    text = text.lower()

    if any(word in text for word in ["drain", "flood", "waterlogging", "sewage"]):
        return "Drainage", "High", "Inspect the drain and clear blockages."

    if any(word in text for word in ["garbage", "waste", "rubbish", "dumping", "litter"]):
        return "Waste Management", "Medium", "Arrange collection and identify the dumping source."

    if any(word in text for word in ["smoke", "pollution", "emission", "dust"]):
        return "Air Pollution", "High", "Inspect the pollution source and assess environmental impact."

    if any(word in text for word in ["tree", "deforestation", "green space"]):
        return "Green Spaces", "Medium", "Inspect the affected green space and consider restoration."

    if any(word in text for word in ["streetlight", "street light", "dark road"]):
        return "Public Infrastructure", "Medium", "Inspect the streetlight and arrange maintenance."

    return "Other Civic Issue", "Low", "Review the report and assign it to the appropriate department."


@app.get("/")
def home():
    return {"message": "CivicLens AI backend is running"}


@app.get("/api/health")
def health():
    return {"status": "healthy", "project": "CivicLens AI"}


@app.get("/api/issues")
def get_issues():
    return sorted(issues, key=lambda item: item["id"], reverse=True)


@app.post("/api/issues")
def create_issue(data: IssueInput):
    category, priority, recommendation = classify_issue(
        data.title + " " + data.description
    )

    issue = {
        "id": max((item["id"] for item in issues), default=0) + 1,
        "title": data.title,
        "description": data.description,
        "location": data.location,
        "category": category,
        "priority": priority,
        "status": "Reported",
        "recommendation": recommendation,
        "created_at": datetime.now().isoformat(),
    }

    issues.append(issue)
    return issue


@app.patch("/api/issues/{issue_id}/status")
def update_status(issue_id: int, data: StatusInput):
    if data.status not in ["Reported", "In Progress", "Resolved"]:
        return {"error": "Invalid status"}

    for issue in issues:
        if issue["id"] == issue_id:
            issue["status"] = data.status
            return issue

    return {"error": "Issue not found"}


@app.get("/api/stats")
def get_stats():
    return {
        "total": len(issues),
        "reported": sum(item["status"] == "Reported" for item in issues),
        "in_progress": sum(item["status"] == "In Progress" for item in issues),
        "resolved": sum(item["status"] == "Resolved" for item in issues),
        "high_priority": sum(item["priority"] == "High" for item in issues),
    }


@app.post("/api/assistant")
def assistant(data: QuestionInput):
    question = data.question.lower()

    if any(word in question for word in ["drain", "flood", "waterlogging"]):
        answer = (
            "Record the location and describe the drainage overflow. "
            "Report it to the responsible civic authority. Avoid entering floodwater."
        )
    elif any(word in question for word in ["garbage", "waste", "recycl"]):
        answer = (
            "Record the dumping location and request waste collection. "
            "Separate recyclable materials where practical; do not handle hazardous waste."
        )
    elif any(word in question for word in ["pollution", "smoke", "air quality"]):
        answer = (
            "Record the location, time, and visible pollution source if safe, "
            "then contact the relevant environmental or civic authority."
        )
    else:
        answer = (
            "Describe the civic issue and its location. CivicLens AI can suggest "
            "next steps for common drainage, waste, pollution, green-space, "
            "and public-infrastructure problems."
        )

    return {
        "question": data.question,
        "answer": answer,
        "note": "This prototype uses predefined guidance, not a live AI model.",
    }

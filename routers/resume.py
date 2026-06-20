import re
import pdfplumber
from fastapi import APIRouter, UploadFile, File, Form
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

router = APIRouter(
    prefix="/resume",
    tags=["Resume Analyzer"]
)

# canonical_skill -> category
SKILL_MAP = {
    "javascript": "javascript", "js": "javascript", "node": "javascript", "nodejs": "javascript",
    "react": "frontend", "html": "frontend", "css": "frontend", "angular": "frontend", "vue": "frontend",

    "python": "python", "fastapi": "python backend", "django": "python backend", "flask": "python backend",

    "sql": "database", "postgresql": "database", "mysql": "database", "mongodb": "database",

    "rest api": "api", "rest": "api", "api": "api",

    "java": "java", "spring": "java backend", "servlet": "java backend", "jsp": "java backend",

    "docker": "devops", "kubernetes": "devops", "ci/cd": "devops",
    "aws": "cloud", "azure": "cloud", "gcp": "cloud",
}

WEIGHTS = {
    "python backend": 3, "java backend": 3, "database": 2, "api": 2,
    "frontend": 2, "cloud": 2, "devops": 2, "javascript": 2,
    "python": 2, "java": 2,
}

# sort longer phrases first so "rest api" is checked before "api"/"rest"
SORTED_SKILLS = sorted(SKILL_MAP.keys(), key=len, reverse=True)


def find_skill(skill: str, text: str) -> bool:
    """Whole-word/phrase match, avoids 'java' matching inside 'javascript'."""
    pattern = r"(?<![a-zA-Z0-9])" + re.escape(skill) + r"(?![a-zA-Z0-9])"
    return re.search(pattern, text) is not None


def extract_skills(text: str) -> set:
    found = set()
    for skill in SORTED_SKILLS:
        if find_skill(skill, text):
            found.add(skill)
    return found


@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    # ---- extract resume text ----
    text = ""
    with pdfplumber.open(resume.file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""

    resume_text = text.lower()
    job_text = job_description.lower()

    # ---- 1. skill-based score (only against skills actually required by THIS job) ----
    jd_skills = extract_skills(job_text)
    resume_skills = extract_skills(resume_text)

    matched_skills = {}
    missing_skills = {}
    total_score = 0
    max_score = 0

    for skill in jd_skills:
        category = SKILL_MAP[skill]
        weight = WEIGHTS.get(category, 1)
        max_score += weight
        if skill in resume_skills:
            matched_skills[skill] = category
            total_score += weight
        else:
            missing_skills[skill] = category

    skill_score = (total_score / max_score) * 100 if max_score else 0

    # ---- 2. semantic similarity score (TF-IDF cosine similarity) ----
    # this is what actually makes the tool feel "real" -- it captures
    # overlap in phrasing/content beyond just the hardcoded skill list
    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf = vectorizer.fit_transform([resume_text, job_text])
        similarity_score = float(cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]) * 100
    except ValueError:
        # happens if one of the texts is empty after stopword removal
        similarity_score = 0.0

    # ---- 3. combined ATS score ----
    # weight skill match higher since it's more interpretable/actionable,
    # but let semantic similarity catch things the skill dictionary misses
    ats_score = round((0.7 * skill_score) + (0.3 * similarity_score), 2)

    # ---- career suggestion (based on categories actually present in resume) ----
    resume_categories = {SKILL_MAP[s] for s in resume_skills}

    if "java backend" in resume_categories and "python backend" not in resume_categories:
        suggestion = "You are well suited for Java Backend Developer roles."
    elif "python backend" in resume_categories:
        suggestion = "You are well suited for Python Backend Developer roles."
    elif "frontend" in resume_categories:
        suggestion = "You are suitable for Frontend or Full Stack Developer roles."
    elif resume_categories:
        suggestion = f"Your strongest areas appear to be: {', '.join(sorted(resume_categories))}."
    else:
        suggestion = "Not enough recognizable skills found to suggest a role. Consider adding a clearer Skills section."

    return {
        "ats_score": ats_score,
        "skill_match_score": round(skill_score, 2),
        "semantic_similarity_score": round(similarity_score, 2),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "resume_preview": text[:500],
        "career_suggestion": suggestion
    }
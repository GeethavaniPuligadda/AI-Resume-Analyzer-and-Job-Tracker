# AI Resume Analyzer & Job Tracker

A full-stack web app that helps job seekers analyze how well their resume matches
a job description, and track their job applications in one place.

## Features

- **User authentication** — register/login with JWT-based auth
- **Resume Analyzer**
  - Upload a resume (PDF) and paste a job description
  - Get an ATS-style match score combining:
    - Skill-keyword matching (scoped to skills the job description actually mentions)
    - TF-IDF cosine similarity between resume and job description
  - See matched vs. missing skills, grouped by category
  - Get a basic career-path suggestion based on detected skills
- **Job Tracker**
  - Add, search, and delete job applications 
  - Track status: Applied / Interview / Offer / Rejected
  - Dashboard with application counts by status
  - Paginated job list

## Tech Stack

**Backend:** FastAPI, SQLAlchemy, PostgreSQL, JWT auth (`python-jose`, `passlib`),
`pdfplumber` (PDF text extraction), `scikit-learn` (TF-IDF / cosine similarity)

**Frontend:** React (Create React App), React Router, `lucide-react` icons

## Project Structure

```
AI RESUME ANALYZER1/
├── routers/
│   ├── resume.py        # Resume analyzer endpoint
│   ├── jobs.py           # Job tracker endpoints
│   └── user.py            # Register/login/user endpoints
├── frontend/
│   └── src/
│       └── pages/
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           ├── Jobs.jsx
│           └── ResumeAnalyzer.jsx
├── main.py                # FastAPI app entrypoint
├── database.py            # DB connection/session setup
├── models.py               # SQLAlchemy models
├── schemas.py               # Pydantic schemas
├── hashing.py                # Password hashing utilities
├── tokenn.py                  # JWT token creation/verification
├── requirements.txt
└── README.md
```

## Getting Started

### Backend

```bash
# from the project root
python -m venv myenv
myenv\Scripts\activate        # Windows
# source myenv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file in the project root with:

```
DATABASE_URL=postgresql://user:password@localhost:5432/your_db_name
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Run the backend:

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`. Interactive docs at
`http://127.0.0.1:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm start
```

The app runs at `http://localhost:5173`.

## API Endpoints (key ones)

| Method | Endpoint              | Description                          |
|--------|------------------------|---------------------------------------|
| POST   | `/register`            | Create a new user                    |
| POST   | `/login`                | Log in, returns JWT access token     |
| GET    | `/me`                    | Get current logged-in user info      |
| POST   | `/resume/analyze`       | Upload resume + job description, get ATS analysis |
| GET    | `/jobs/`                  | List jobs (paginated)                |
| POST   | `/jobs/`                  | Add a job application                |
| GET    | `/jobs/dashboard`        | Get job status counts                |
| GET    | `/jobs/search`            | Search jobs by company name          |
| DELETE | `/jobs/{id}`              | Delete a job application             |

## Deployment

- Backend: deployed on Render (or your platform of choice)
- Frontend: deployed on Vercel
- Database: PostgreSQL (Render Postgres / hosted provider)

## License

This project is for educational/portfolio purposes.
from fastapi import FastAPI
from routers import user,job,resume
import models
from database import engine
from fastapi.middleware.cors import CORSMiddleware
app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
models.Base.metadata.create_all(bind=engine)
app.include_router(user.router)
app.include_router(job.router)
app.include_router(resume.router)
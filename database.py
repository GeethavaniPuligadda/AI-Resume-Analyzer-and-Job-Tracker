from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker
from dotenv import load_dotenv
import os
Base=declarative_base()
load_dotenv()
DATABASE_URL=os.getenv("DATABASE_URL")
# DATABASE_URL="postgresql://postgres:Geetha%40123@localhost/resume_analyzer1"
engine=create_engine(DATABASE_URL)
SessionLocal=sessionmaker(bind=engine,autoflush=False)
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()


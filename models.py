from database import Base
from sqlalchemy import Column,String,Integer,ForeignKey,DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True,autoincrement=True)
    name=Column(String)
    email=Column(String)
    password=Column(String)
    jobs=relationship('Job',back_populates='user')
class Job(Base):
    __tablename__="jobs"
    job_id=Column(Integer,primary_key=True,autoincrement=True)
    job_title=Column(String)
    company_name=Column(String)
    job_url=Column(String)
    job_status=Column(String)
    applied_date=Column(DateTime)
    user_id=Column(Integer,ForeignKey("users.id"))
    user=relationship('User',back_populates='jobs')


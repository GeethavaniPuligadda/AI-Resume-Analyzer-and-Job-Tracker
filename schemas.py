from pydantic import BaseModel
from datetime import datetime
from enum import Enum
class createuser(BaseModel):
    name:str
    email:str
    password:str
    
class login(BaseModel):
    email:str
    password:str

class showuser(BaseModel):
    id:int
    name:str
    email:str
    class Config:
        from_attributes=True
class jobstatus(str,Enum):
    APPLIED="Applied"
    INTERVIEW="Interview"
    OFFER="Offer"
    REJECTED="Rejected"

class createjob(BaseModel):
    job_title:str
    company_name:str
    job_url:str
    job_status:jobstatus
    applied_date:datetime
class showjob(BaseModel):
    job_id:int
    job_title:str
    company_name:str
    job_url:str
    job_status:str
    applied_date:datetime
    class Config:
        from_attributes=True
class showdashboard(BaseModel):
    total_jobs:int
    applied:int
    interview:int
    offer:int
    rejected:int
        

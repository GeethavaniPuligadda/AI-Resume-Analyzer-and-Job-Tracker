from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from tokenn import verify_token
import schemas,models
from database import get_db
router=APIRouter(prefix='/jobs',tags=['Job'])
@router.post('/',response_model=schemas.showjob)
def createjob(request:schemas.createjob,current_user:str=Depends(verify_token),db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.email==current_user).first()
    job=models.Job(job_title=request.job_title,company_name=request.company_name,job_url=request.job_url,job_status=request.job_status,applied_date=request.applied_date,user_id=user.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job
@router.get('/',response_model=list[schemas.showjob])
def showjobs(sort:str=None,page:int=1,limit:int=5,current_user:str=Depends(verify_token),db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.email==current_user).first()
    query=db.query(models.Job).filter(models.Job.user_id==user.id)
    skip=(page-1)*limit
    if sort=="latest":
        query=query.order_by(models.Job.applied_date.desc())
    jobs=query.offset(skip).limit(limit).all()
    return jobs
@router.delete('/{id}')
def removejob(id:int,current_user:str=Depends(verify_token),db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.email==current_user).first()
    job=db.query(models.Job).filter(models.Job.job_id==id,models.Job.user_id==user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Job not found")
    db.delete(job)
    db.commit()
    return "Job deleted successfully"
@router.put('/{id}',response_model=schemas.showjob)
def updatejob(id:int,request:schemas.createjob,current_user:str=Depends(verify_token),db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.email==current_user).filter().first()
    job=db.query(models.Job).filter(models.Job.job_id==id,models.Job.user_id==user.id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="job not found")
    job.job_title=request.job_title
    job.company_name=request.company_name
    job.job_url=request.job_url
    job.job_status=request.job_status
    job.applied_date=request.applied_date
    db.commit()
    db.refresh(job)
    return job
@router.get('/dashboard',response_model=schemas.showdashboard)
def dashboard(current_user:str=Depends(verify_token),db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.email==current_user).first()
    jobs=db.query(models.Job).filter(models.Job.user_id==user.id).all()
    applied=interview=offer=rejected=0
    for job in jobs:
        if job.job_status=="Applied":
            applied+=1
        elif job.job_status=="Interview":
            interview+=1
        elif job.job_status=="Offer":
            offer+=1
        elif job.job_status=="Rejected":
            rejected+=1
    return {"total_jobs":len(jobs),"applied":applied,"interview":interview,"offer":offer,"rejected":rejected}
@router.get("/search",response_model=list[schemas.showjob])
def search_jobs(company_name:str,current_user:str=Depends(verify_token),db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.email==current_user).first()
    jobs=db.query(models.Job).filter(models.Job.company_name==company_name,models.Job.user_id==user.id).all()
    return jobs

    


    



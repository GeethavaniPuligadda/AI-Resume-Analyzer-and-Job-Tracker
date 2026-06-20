from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from tokenn import create_access_token,verify_token
from database import get_db
from hashing import hash,verify 
import models,schemas
router=APIRouter(tags=["User"])
@router.post('/register',response_model=schemas.showuser)
def create(request:schemas.createuser,db:Session=Depends(get_db)):
    existing_user=db.query(models.User).filter(models.User.email==request.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Email already registered")
    new_user=models.User(name=request.name,email=request.email,password=hash(request.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
@router.post("/login")
def login(request:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.email==request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Email not found")
    if not verify(request.password,user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail='Incorrect password')
    access_token=create_access_token({'sub':user.email})
    return {"access_token":access_token,"token_type":"bearer"}
@router.get("/me",response_model=schemas.showuser)
def get_me(current_user:str=Depends(verify_token),db:Session=Depends(get_db)):
    user=db.query(models.User).filter(models.User.email==current_user).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="user not found")
    return user

  

    

from datetime import datetime,timedelta
from jose import jwt,JWTError
from fastapi import Depends,status,HTTPException
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os
load_dotenv()
SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
# SECRET_KEY="mysecretkey"
# ALGORITHM="HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES=15
oauth_2=OAuth2PasswordBearer(tokenUrl='/login')
def create_access_token(data:dict):
    to_encode=data.copy()
    expire=datetime.utcnow()+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({'exp':expire})
    access_token=jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return access_token
def verify_token(token:str=Depends(oauth_2)):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        email=payload.get("sub")
        if email is None:
             raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
        return email

    except JWTError:
         raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )









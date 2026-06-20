from passlib.context import CryptContext
pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")
def hash(password):
    return pwd_context.hash(password)
def verify(org_pass,hash_pass):
    return pwd_context.verify(org_pass,hash_pass)
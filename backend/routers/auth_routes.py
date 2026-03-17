from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from models import SystemLog

from database import SessionLocal
from models import User
from auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ---------------------------
# Schemas
# ---------------------------

class RegisterSchema(BaseModel):
    username: str
    email: str
    password: str


class LoginSchema(BaseModel):
    email: str
    password: str


# ---------------------------
# DB Dependency
# ---------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------
# Register
# ---------------------------

@router.post("/register")
def register(user: RegisterSchema, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
    (User.email == user.email) | (User.username == user.username)).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_user.user_code = f"U{new_user.id}"
    db.commit()

    log = SystemLog(
    user_id=new_user.id,
    action="User Registered",
    description=f"User {new_user.username} registered"
)

    db.add(log)
    db.commit()

    return {
        "message": "User registered successfully",
        "user_code": new_user.user_code
    }


# ---------------------------
# Login
# ---------------------------

@router.post("/login")
def login(user: LoginSchema, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": str(db_user.id)})

    log = SystemLog(
    user_id=db_user.id,
    action="User Login",
    description=f"User {db_user.username} logged in"
)

    db.add(log)
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer"
    }
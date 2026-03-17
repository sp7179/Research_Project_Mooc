from fastapi import FastAPI
from fastapi.responses import Response
from sqlalchemy import text

from database import engine
from models import Base
from routers import auth_routes

from routers import prediction_routes

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include Auth Routes
app.include_router(auth_routes.router)
app.include_router(prediction_routes.router)

@app.get("/")
def root():
    return {"message": "EEG FastAPI Backend Running"}

@app.get("/test-db")
def test_db():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
        return {"db_status": "connected"}

@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)
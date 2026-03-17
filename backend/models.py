from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


# ==========================
# USER MODEL
# ==========================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_code = Column(String, unique=True, index=True)  # U1, U2

    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)

    sessions = relationship("PredictionSession", back_populates="user")
    logs = relationship("SystemLog", back_populates="user")


# ==========================
# PREDICTION SESSION
# ==========================

class PredictionSession(Base):
    __tablename__ = "prediction_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_code = Column(String, unique=True, index=True)  # S1, S2

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    guest_code = Column(String, nullable=True)  # G1 if guest

    file_name = Column(String, nullable=False)

    total_rows = Column(Integer)
    seizure_count = Column(Integer)
    non_seizure_count = Column(Integer)
    seizure_percentage = Column(Float)

    avg_eeg_mean = Column(Float)
    avg_stress_mean = Column(Float)

    processing_time = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")
    records = relationship("PredictionRecord", back_populates="session")
    logs = relationship("SystemLog", back_populates="session")


# ==========================
# PREDICTION RECORD (Sample)
# ==========================

class PredictionRecord(Base):
    __tablename__ = "prediction_records"

    id = Column(Integer, primary_key=True, index=True)
    sample_code = Column(String, unique=True, index=True)  # SP1, SP2

    session_id = Column(Integer, ForeignKey("prediction_sessions.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    sample_id = Column(String)
    timestamp = Column(String)

    prediction = Column(Integer)
    prediction_label = Column(String)

    eeg_mean = Column(Float)
    stress_mean = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("PredictionSession", back_populates="records")


# ==========================
# SYSTEM LOG
# ==========================

class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(Integer, ForeignKey("prediction_sessions.id"), nullable=True)

    guest_code = Column(String, nullable=True)  # G1 if guest

    action = Column(String)
    description = Column(String)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="logs")
    session = relationship("PredictionSession", back_populates="logs")
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import PredictionSession, PredictionRecord
import pandas as pd
import numpy as np
import joblib
import time
import base64
from io import BytesIO


from models import SystemLog

router = APIRouter(prefix="/api", tags=["Prediction"])

# Load model once
model = joblib.load("ml/seizure_stress_model.pkl")
scaler = joblib.load("ml/scaler.pkl")

# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/predict")
async def predict(file: UploadFile = File(...), db: Session = Depends(get_db)):

    start_time = time.time()

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Upload CSV file only")

    df = pd.read_csv(file.file)

    # Validate structure
    if "id" not in df.columns or "timestamp" not in df.columns:
        raise HTTPException(status_code=400, detail="Missing id or timestamp column")

    feature_cols = [col for col in df.columns if col not in ["id", "timestamp"]]

    if len(feature_cols) != 210:
        raise HTTPException(status_code=400, detail="Must contain exactly 210 feature columns")

    # Split EEG and Stress
    eeg_cols = feature_cols[:178]
    stress_cols = feature_cols[178:]

    # Get features
    features = df[feature_cols].copy()

    # Rename columns to match training names
    features.columns = scaler.feature_names_in_

    # Scale
    scaled = scaler.transform(features)

    predictions = model.predict(scaled)

    # Create new calculated columns safely
    calc_df = pd.DataFrame({
        "prediction": predictions,
        "prediction_label": ["Seizure" if x == 1 else "Non-Seizure" for x in predictions],
        "eeg_mean": df[eeg_cols].mean(axis=1),
        "stress_mean": df[stress_cols].mean(axis=1)
    })

    df = pd.concat([df, calc_df], axis=1)

    total_rows = len(df)
    seizure_count = int(df["prediction"].sum())
    non_seizure_count = total_rows - seizure_count
    seizure_percentage = round((seizure_count / total_rows) * 100, 2)

    avg_eeg_mean = float(df["eeg_mean"].mean())
    avg_stress_mean = float(df["stress_mean"].mean())

    processing_time = round(time.time() - start_time, 3)

    # Save Session
    session = PredictionSession(
        file_name=file.filename,
        total_rows=total_rows,
        seizure_count=seizure_count,
        non_seizure_count=non_seizure_count,
        seizure_percentage=seizure_percentage,
        avg_eeg_mean=avg_eeg_mean,
        avg_stress_mean=avg_stress_mean,
        processing_time=processing_time
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    log = SystemLog(
    user_id=session.user_id,
    session_id=session.id,
    guest_code=None if session.user_id else f"G{session.id}",
    action="Prediction Performed",
    description=f"File {file.filename} processed"
)

    db.add(log)
    db.commit()

    # Generate session / guest code
    if session.user_id:
        session.session_code = f"S{session.id}"
    else:
        session.guest_code = f"G{session.id}"

    db.commit()

    # Save Records
    records = [
    PredictionRecord(
        session_id=session.id,
        sample_id=row["id"],
        timestamp=pd.to_datetime(row["timestamp"], format="%d-%m-%Y %H:%M").isoformat(),
        prediction=int(row["prediction"]),
        prediction_label=row["prediction_label"],
        eeg_mean=float(row["eeg_mean"]),
        stress_mean=float(row["stress_mean"])
    )
    for _, row in df.iterrows()
]

    db.bulk_save_objects(records)
    db.commit()

    # Create Base64 CSV
    buffer = BytesIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)

    encoded_file = base64.b64encode(buffer.read()).decode("utf-8")

    # Prepare Visual JSON
    response = {
        "session_summary": {
            "session_code": session.session_code if session.user_id else session.guest_code,
            "session_id": session.id,
            "total_rows": total_rows,
            "seizure_count": seizure_count,
            "non_seizure_count": non_seizure_count,
            "seizure_percentage": seizure_percentage,
            "avg_eeg_mean": avg_eeg_mean,
            "avg_stress_mean": avg_stress_mean,
            "processing_time": processing_time
        },
        "visual_data": {
            "trend": [
            {
                "timestamp": pd.to_datetime(row["timestamp"], format="%d-%m-%Y %H:%M").isoformat(),
                "prediction": int(row["prediction"])
            }
            for _, row in df.iterrows()
        ],
            "distribution": {
                "seizure": seizure_count,
                "non_seizure": non_seizure_count
            },
            "eeg_mean": df[["id", "eeg_mean"]].to_dict(orient="records"),
            "stress_mean": df[["id", "stress_mean"]].to_dict(orient="records"),
            "correlation": df[["eeg_mean", "stress_mean", "prediction"]].to_dict(orient="records")
        },
        "records": df[[
            "id", "timestamp", "prediction", "prediction_label"
        ]].to_dict(orient="records"),
        "file_name": "prediction_output.csv",
        "file_data": encoded_file
    }

    return response
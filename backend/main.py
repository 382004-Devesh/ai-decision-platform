from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")

class InputData(BaseModel):
    salary: float
    experience: float

@app.post("/predict")
def predict(data: InputData):
    prediction = model.predict([[data.salary, data.experience]])

    return {
        "success_probability": float(prediction[0]),
        "risk_score": float(1 - prediction[0])
    }
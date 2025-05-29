from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="Crop Recommendation System")

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite's default port
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model and scaler
model = joblib.load('models/crop_model.joblib')
scaler = joblib.load('models/scaler.joblib')

class SoilData(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

@app.get("/")
def read_root():
    return {"message": "Welcome to Crop Recommendation System API"}

@app.post("/predict")
async def get_prediction(data: SoilData):
    try:
        # Convert input data to array
        input_data = np.array([[
            data.N,
            data.P,
            data.K,
            data.temperature,
            data.humidity,
            data.ph,
            data.rainfall
        ]])
        
        # Scale the input data
        scaled_data = scaler.transform(input_data)
        
        # Make prediction
        prediction = model.predict(scaled_data)
        
        return {"recommended_crop": prediction[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

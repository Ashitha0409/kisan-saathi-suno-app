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
try:
    model = joblib.load('models/crop_model.joblib')
    scaler = joblib.load('models/scaler.joblib')
except Exception as e:
    print(f"Error loading model files: {str(e)}")
    model = None
    scaler = None

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
    if model is None or scaler is None:
        raise HTTPException(
            status_code=500,
            detail="Model or scaler not loaded. Please check server logs."
        )
        
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
        print(f"Error in prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/market-prices")
async def get_market_prices():
    try:
        # Sample market price data - in a real app, this would come from a database
        market_prices = [
            {"crop": "Tomato", "price": "₹25", "unit": "per kg", "change": "+5%", "trending": "up"},
            {"crop": "Onion", "price": "₹30", "unit": "per kg", "change": "-2%", "trending": "down"},
            {"crop": "Potato", "price": "₹20", "unit": "per kg", "change": "+3%", "trending": "up"},
            {"crop": "Rice", "price": "₹45", "unit": "per kg", "change": "0%", "trending": "stable"},
            {"crop": "Wheat", "price": "₹25", "unit": "per kg", "change": "+1%", "trending": "up"}
        ]
        return market_prices
    except Exception as e:
        print(f"Error in get_market_prices: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

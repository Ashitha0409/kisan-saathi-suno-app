from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the saved model, vectorizer, and treatments
try:
    model = joblib.load('models/disease_model.joblib')
    vectorizer = joblib.load('models/vectorizer.joblib')
    treatments = joblib.load('models/treatments.joblib')
    print("Model, vectorizer, and treatments loaded successfully!")
except Exception as e:
    print(f"Error loading model files: {str(e)}")
    model = None
    vectorizer = None
    treatments = None

@app.route('/')
def home():
    return jsonify({"message": "Crop Disease Detection API"})

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or vectorizer is None or treatments is None:
        return jsonify({
            "error": "Model files not loaded. Please check server logs."
        }), 500

    try:
        # Get symptoms from request
        data = request.get_json()
        symptoms = data.get('symptoms')
        
        if not symptoms:
            return jsonify({
                "error": "No symptoms provided"
            }), 400

        # Transform symptoms using vectorizer
        symptoms_vector = vectorizer.transform([symptoms])
        
        # Make prediction
        prediction = model.predict(symptoms_vector)[0]
        
        # Get treatment
        treatment = treatments.get(prediction, "No specific treatment found")
        
        return jsonify({
            "disease": prediction,
            "treatment": treatment,
            "symptoms": symptoms
        })

    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

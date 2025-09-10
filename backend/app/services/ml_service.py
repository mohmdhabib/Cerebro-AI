# backend/app/services/ml_service.py

import numpy as np
from PIL import Image
from . import preprocessing
import os
from tensorflow.keras.models import load_model

# --- Model Loading ---
# THE FIX IS HERE: We go up one more directory level to find the 'backend' folder.
# .../app/services/ -> .../app/ -> .../backend/
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, 'ml_model', 'saved_model', 'model.h5')

try:
    model = load_model(MODEL_PATH)
    print(f"--- Model successfully loaded from {MODEL_PATH} ---")
except Exception as e:
    print(f"CRITICAL ERROR: Could not load the model. Ensure 'model.h5' exists at {MODEL_PATH}")
    print(f"Error details: {e}")
    model = None

# --- Prediction Decoding ---
CLASS_NAMES = ["glioma", "meningioma", "notumor", "pituitary"]

def decode_predictions(prediction_raw):
    """Decodes the model's raw output into a class name and confidence score."""
    if prediction_raw is None or len(prediction_raw[0]) != len(CLASS_NAMES):
        return "Prediction Error", 0.0

    confidence = np.max(prediction_raw)
    predicted_class_index = np.argmax(prediction_raw)
    prediction_class = CLASS_NAMES[predicted_class_index]
    
    return prediction_class.capitalize(), float(confidence)

# --- Main Prediction Function ---
def predict(image_file):
    """Processes an image and returns the model's prediction."""
    if model is None:
        return "Model not loaded", 0.0

    # 1. Preprocess the image to the correct size: 224x224
    image = Image.open(image_file.stream)
    processed_image = preprocessing.preprocess_image(image, target_size=(224, 224))
    image_batch = np.expand_dims(processed_image, axis=0)
    
    # 2. Use the REAL model to make a prediction
    prediction_raw = model.predict(image_batch)
    
    # 3. Decode the prediction into a readable format
    prediction_class, confidence = decode_predictions(prediction_raw)
    
    return prediction_class, confidence
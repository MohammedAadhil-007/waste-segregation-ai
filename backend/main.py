from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from PIL import Image
import tensorflow as tf
import numpy as np
import io
import os

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"



# --------------------------------------------------
# App
# --------------------------------------------------

app = FastAPI(
    title="Waste Segregation AI",
    description="AI-powered Dry, Wet and Mixed waste classification API",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Load model
# --------------------------------------------------

MODEL_PATH = "waste_classifier.keras"

model = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = [
    "Dry Waste",
    "Wet Waste",
    "Mixed Waste"
]

IMG_SIZE = (224, 224)


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Waste Segregation AI API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "MobileNetV2"
    }


# --------------------------------------------------
# Prediction
# --------------------------------------------------

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Validate file type
    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, PNG or WebP image."
        )

    try:
        contents = await file.read()

        image = Image.open(
            io.BytesIO(contents)
        ).convert("RGB")

        # Resize exactly as during training
        image = image.resize(IMG_SIZE)

        # IMPORTANT:
        # Our model was trained using raw 0-255 pixel values,
        # so we do NOT use preprocess_input() here.
        image_array = np.array(image, dtype=np.float32)

        # Add batch dimension
        image_array = np.expand_dims(
            image_array,
            axis=0
        )

        # Prediction
        predictions = model.predict(
            image_array,
            verbose=0
        )[0]

        predicted_index = int(
            np.argmax(predictions)
        )

        confidence = float(
            predictions[predicted_index]
        )

        predicted_class = CLASS_NAMES[
            predicted_index
        ]

        return {
            "prediction": predicted_class,
            "confidence": round(confidence, 4),
            "probabilities": {
                CLASS_NAMES[i]: round(float(predictions[i]), 4)
                for i in range(len(CLASS_NAMES))
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )
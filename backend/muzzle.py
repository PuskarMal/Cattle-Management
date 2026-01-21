from fastapi import FastAPI, UploadFile, File, HTTPException
from ultralytics import YOLO
import numpy as np
import cv2
import torch
import os

app = FastAPI(title="Muzzle Biometric Service")

# --------------------------------------------------
# LOAD MODEL ONCE (ABSOLUTE PATH – IMPORTANT)
# --------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "complete_muzzle_model.pt")

device = "cuda" if torch.cuda.is_available() else "cpu"
model = YOLO(MODEL_PATH)
model.to(device)

print("✅ Muzzle model loaded from:", MODEL_PATH)

# --------------------------------------------------
# FEATURE EXTRACTION
# --------------------------------------------------
def extract_features(roi):
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (64, 64))

    # Simple fixed-length biometric vector (128)
    features = resized.flatten().astype("float32") / 255.0
    return features[:128].tolist()

# --------------------------------------------------
# API ENDPOINT
# --------------------------------------------------
@app.post("/extract-muzzle")
async def extract_muzzle(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        npimg = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(status_code=400, detail="Invalid image")

        results = model(image, conf=0.6)

        if not results or len(results[0].boxes) == 0:
            raise HTTPException(status_code=400, detail="No muzzle detected")

        box = results[0].boxes[0].xyxy[0].cpu().numpy().astype(int)
        confidence = float(results[0].boxes[0].conf[0])

        x1, y1, x2, y2 = box
        roi = image[y1:y2, x1:x2]

        features = extract_features(roi)
        print(features)
        return {
            "features": features,
            "confidence": confidence
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

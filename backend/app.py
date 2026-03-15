from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
from PIL import Image
from io import BytesIO
from tensorflow.keras.preprocessing import image

app = Flask(__name__)
CORS(app)

model = None
disease_model = None

CLASS_NAMES = [
"Alambadi","Amritmahal","Ayrshire","Banni","Bargur","Bhadawari",
"Brown_Swiss","Dangi","Deoni","Gir","Guernsey","Hallikar",
"Hariana","Holstein_Friesian","Jaffrabadi","Jersey","Kangayam",
"Kankrej","Kasargod","Kenkatha","Kherigarh","Khillari",
"Krishna_Valley","Malnad_gidda","Mehsana","Murrah","Nagori",
"Nagpuri","Nili_Ravi","Nimari","Ongole","Pulikalam","Rathi",
"Red_Dane","Red_Sindhi","Sahiwal","Surti","Tharparkar","Toda",
"Umblacherry","Vechur"
]

DISEASE_CLASSES = ["Foot and Mouth", "Healthy", "Lumpy Disease"]

IMG_SIZE = 150


def load_models():
    global model, disease_model

    if model is None:
        print("Loading breed model...")
        model = tf.keras.models.load_model("model.h5",compile=False)
        model.save("model.keras")
        model = tf.keras.models.load_model("model.keras",compile=False)

    if disease_model is None:
        print("Loading disease model...")
        disease_model = tf.keras.models.load_model("model2.keras",compile=False)


def preprocess_image_from_bytes(image_bytes):
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)


@app.route("/")
def home():
    
    return "SAMRIDHI AI API Running"


@app.route("/predict-breed", methods=["POST"])

def predict():
    
    try:
        
        load_models()

        if "image" not in request.files:
            return jsonify({"error": "Image not found"}), 400
        
        image_bytes = request.files["image"].read()
        
        img = preprocess_image_from_bytes(image_bytes)

        preds = model.predict(img, verbose=0)[0]
        top_indices = np.argsort(preds)[-5:][::-1]

        return jsonify({
            "top_predictions": [
                {
                    "breed": CLASS_NAMES[i],
                    "confidence": round(float(preds[i]) * 100, 2)
                }
                for i in top_indices
            ]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict-disease", methods=["POST"])
def predict_disease():
    try:
        print("---- /predict-disease endpoint called ----")

        if "image" not in request.files:
            print("Image missing in request")
            return jsonify({"error": "Image missing"}), 400

        print("Image received")

        image_bytes = request.files["image"].read()
        print("Image size:", len(image_bytes))

        h, w = disease_model.input_shape[1], disease_model.input_shape[2]
        print("Model input shape:", h, w)

        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        img = img.resize((w, h))
        print("Image resized")

        img_arr = image.img_to_array(img) / 255.0
        img_arr = np.expand_dims(img_arr, axis=0)
        print("Image array shape:", img_arr.shape)

        preds = disease_model.predict(img_arr, verbose=0)[0]
        print("Predictions:", preds)

        idx = int(np.argmax(preds))
        print("Predicted index:", idx)

        return jsonify({
            "disease": DISEASE_CLASSES[idx],
            "confidence": round(float(preds[idx]) * 100, 2)
        })

    except Exception as e:
        print("ERROR OCCURRED:", str(e))
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    
    app.run(debug=True)
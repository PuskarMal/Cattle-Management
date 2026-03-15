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


model = tf.keras.models.load_model("model.h5")

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

IMG_SIZE = 150

def preprocess_image_from_bytes(image_bytes):
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.route("/predict-breed", methods=["POST"])
def predict():
    try:
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


disease_model = tf.keras.models.load_model("model2.keras")

DISEASE_CLASSES = ["Foot and Mouth", "Healthy", "Lumpy Disease"]


@app.route("/predict-disease", methods=["POST"])
def predict_disease():
    try:
        if "image" not in request.files:
            return jsonify({"error": "Image missing"}), 400
        print("Received disease prediction request")
        image_bytes = request.files["image"].read()
        
        h, w = disease_model.input_shape[1], disease_model.input_shape[2]
        
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        img = img.resize((w, h))
        img_arr = image.img_to_array(img) / 255.0
        img_arr = np.expand_dims(img_arr, axis=0)

        preds = disease_model.predict(img_arr, verbose=0)[0]
        idx = int(np.argmax(preds))

        return jsonify({
            "disease": DISEASE_CLASSES[idx],
            "confidence": round(float(preds[idx]) * 100, 2),
            "all_probabilities": {
                DISEASE_CLASSES[i]: round(float(preds[i]) * 100, 2)
                for i in range(len(DISEASE_CLASSES))
            }
        })

    except Exception as e:
        print("Disease prediction error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000)) 
    app.run(host="0.0.0.0", port=port,debug=True)
    

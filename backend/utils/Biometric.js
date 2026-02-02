const axios = require("axios");
const FormData = require("form-data");

async function extractMuzzleFeatures(imageBuffer) {
  try {
    const formData = new FormData();
    formData.append("file", imageBuffer, {
      filename: "muzzle.jpg",
      contentType: "image/jpg"
    });

    const response = await axios.post(
      "http://localhost:8000/extract-muzzle",
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error);
    }
   
    return {
      features: response.data.features,
      confidence: response.data.confidence
    };
    

  } catch (err) {
    console.error("ML service error:", err.message);
    throw err;
  }
}

module.exports = { extractMuzzleFeatures };

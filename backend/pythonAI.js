const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const pythonAI = (imagePath) => {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    axios.post('https://trisomic-unconsidering-genny.ngrok-free.dev/predict', form, {
      headers: form.getHeaders()
    })
    .then(response => resolve(response.data))
    .catch(error => reject(error));
  });
};

module.exports = pythonAI;
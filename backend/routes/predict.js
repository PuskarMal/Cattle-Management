const router = require('express').Router()
const multer = require("multer");
const Breed = require("../models/breed");
const { callPythonAI } = require("../pythonAI");

const upload = multer({ dest: "uploads/" });

router.get("/fetch_details/:breedName", async (req, res) => {
  try {
    const { breedName } = req.params;
    const breedInfo = await Breed.findOne(
      { breed_name: breedName },
      { _id: 0 }
    );

    res.json(breedInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch breed details" });
  }
});

module.exports = router;

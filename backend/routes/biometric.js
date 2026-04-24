const router = require("express").Router();
const upload = require("../middleware/upload");
const Cattle = require("../models/cattle");
const { extractMuzzleFeatures } = require("../utils/Biometric");
const { cosineSimilarity } = require("../utils/biometricMatch");

router.post("/verify-biometric", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image required" });
    }

    // 1️⃣ Extract biometric features from uploaded image
    const probe = await extractMuzzleFeatures(req.file.buffer);
    //console.log("Extracted features with confidence:", probe.confidence);

    if (probe.confidence < 0.7) {
      return res.status(400).json({ error: "Low quality image" });
    }

    // 2️⃣ Fetch cattle having biometric data
    const cattleList = await Cattle.find({ "biometric.features": { $exists: true } });
    console.log(`Comparing against ${cattleList.length} stored biometrics`);

    let bestMatch = null;
    let bestScore = 0;

    // 3️⃣ Compare with each stored biometric
    for (const cattle of cattleList) {
      const score = cosineSimilarity(
        probe.features,
        cattle.biometric.features
      );
      console.log(`Similarity with ${cattle.unique_id}:`, score.toFixed(4));

      if (score > bestScore) {
        bestScore = score;
        bestMatch = cattle;
      }
    }

    // 4️⃣ Threshold decision
    if (!bestMatch || bestScore < 0.85) {
      return res.status(401).json({
        verified: false,
        message: "Biometric verification failed"
      });
    }

    // 5️⃣ Verified → return cattle details
    res.json({
      verified: true,
      similarity: bestScore,
      cattle: {
        unique_id: bestMatch.unique_id,
        breed: bestMatch.breed_name,
        state: bestMatch.state,
        owner: bestMatch.owner_name
      }
    });
    

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;

const router = require('express').Router();
const { extractMuzzleFeatures } = require("../utils/Biometric")
const Cattle = require("../models/cattle");
const mongoose = require("mongoose")
const { getGridFSBucket } = require("../config/gridfs")
const upload = require("../middleware/upload")

const state = {
  "West Bengal": "WB",
  "Tamil Nadu": "TN",
  "Rajasthan": "RJ",
  "Punjab": "PB"
};
const breed = {
  "Gir": "121",
  "Sahiwal": "342",
  "Red_Sindhi": "235",
  "Tharparkar": "458"
}


router.post("/register-cattle", upload.single("image"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "Image required" });
    }

    const bucket = getGridFSBucket();
    if (!bucket) {
      return res.status(500).json({ error: "GridFS not initialized" });
    }

    const uploadStream = bucket.openUploadStream(
      `cattle_${Date.now()}_${req.file.originalname}`,
      { contentType: req.file.mimetype }
    );

    uploadStream.end(req.file.buffer);
    uploadStream.on("finish", async () => {
      const imageId = uploadStream.id; // ✅ THIS IS THE FILE ID
      const cattleData = {
        ...req.body,
        milk_production: JSON.parse(req.body.milk_production),
        health_status: JSON.parse(req.body.health_status),
        image_id: imageId
      };


      const uniqueId =
        state[req.body.state] +
        breed[req.body.breed_name] +
        Math.floor(Math.random() * 100000);

      const newCattle = new Cattle({
        ...cattleData,
        unique_id: uniqueId
      });

      await newCattle.save();

      res.status(201).json({
        message: "Cattle registered successfully",
        unique_id: uniqueId
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register cattle" });
  }
});
router.get("/cattle_image/:id", async (req, res) => {
  try {
    const bucket = getGridFSBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("file", (file) => {
      res.set("Content-Type", file.contentType || "image/jpeg");
    });

    downloadStream.on("error", () => {
      res.status(404).json({ message: "Image not found" });
    });

    downloadStream.pipe(res);
  } catch (err) {
    res.status(400).json({ message: "Invalid image id" });
  }
});


router.post(
  "/link-biometric/:unique_id",
  upload.single("image"),
  async (req, res) => {
    try {
      const { unique_id } = req.params;
      const cattle = await Cattle.findOne({ unique_id });
      if (!cattle) {
        return res.json({ message: "Cattle not found" });
      }
      if (cattle.biometric.confidence)
        return res.json({ message: "Biometric is already registered" });
      else {
        if (!req.file) {
          return res.status(400).json({ error: "Image required" });
        }
        // 🔹 Step 1: Extract biometric features
        const { features, confidence } = await extractMuzzleFeatures(req.file.buffer);

        // 🔹 Step 2: Store in schema
        cattle.biometric = {
          features,
          confidence,
          enrolled_at: new Date()
        };

        await cattle.save();

        res.json({
          message: "Biometric successfully linked",
          confidence
        });
      }

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Biometric enrollment failed" });
    }
  }
);

router.get("/fetch-cattle-profile/:unique_id", async(req,res) => {
  const {unique_id} = req.params;
  
  try {
    const cattle = await Cattle.findOne({unique_id});
    
    if(!cattle)
      return res.status(404).json({error: "No cattle found with this ID"})
    else{
      res.json(cattle)
    }
  }
  catch(err)
  {
    console.log(err)
  }
})






module.exports = router;
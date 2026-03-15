const router = require('express').Router();
const { extractMuzzleFeatures } = require("../utils/Biometric")
const Cattle = require("../models/cattle");
const mongoose = require("mongoose")
const { getGridFSBucket } = require("../config/gridfs")
const upload = require("../middleware/upload")
const Report = require("../models/report");
const AdminStats = require("../models/dashboardStats");
const Activity = require("../models/activity");
const { generateCattlePDF } = require("../utils/generateReport")
const User = require("../models/user")

const state = {
  "West Bengal": "WB", "Tamil Nadu": "TN", "Rajasthan": "RJ", "Punjab": "PB", "Gujarat": "GJ", "Maharashtra": "MH",
  "Karnataka": "KA", "Kerala": "KL", "Madhya Pradesh": "MP", "Uttar Pradesh": "UP", "Haryana": "HR", "Andhra Pradesh": "AP",
  "Bihar": "BR", "Odisha": "OD", "Delhi": "DL", "Assam": "AS", "Goa": "GA", "Chhattisgarh": "CG", "Jharkhand": "JH", "Jammu and Kashmir": "JK",
  "Himachal Pradesh": "HP", "Uttarakhand": "UK", "Tripura": "TR", "Sikkim": "SK", "Nagaland": "NL", "Meghalaya": "ML",
  "Manipur": "MN", "Mizoram": "MZ", "Arunachal Pradesh": "AR", "Telangana": "TS", "Lakshadweep": "LD", "Puducherry": "PY", "Chandigarh": "CH",
  "Dadra and Nagar Haveli and Daman and Diu": "DN", "Andaman and Nicobar Islands": "AN", "Ladakh": "LA"
};

const breed = {
  "Gir": "151", "Sahiwal": "152",
  "Holstein_Friesian": "E1", "Jersey": "E2", "Red_Dane": "E3", "Ayrshire": "E4", "Brown_Swiss": "E5", "Guernsey": "E6",
  "Alambadi": "101", "Amritmahal": "102", "Bargur": "103", "Dangi": "104", "Deoni": "105", "Hallikar": "106", "Hariana": "107",
  "Kangayam": "108", "Kankrej": "109", "Kasargod": "110", "Kenkatha": "111", "Kherigarh": "112", "Khillari": "113", "Krishna_Valley": "114",
  "Malnad_gidda": "115", "Nagori": "116", "Nagpuri": "117", "Nimari": "118", "Ongole": "119", "Pulikalam": "120", "Toda": "122",
  "Umblacherry": "123", "Vechur": "124", "Rathi": "125", "Red_Sindhi": "126", "Tharparkar": "127",
  "Murrah": "501", "Nili_Ravi": "502", "Banni": "551", "Bhadawari": "552", "Jaffrabadi": "553", "Mehsana": "554", "Surti": "555",       // Buffalo

};

router.post("/register-cattle", upload.single("image"), async (req, res) => {
  try {
    /* ---------- Validate image ---------- */
    if (!req.file) {
      return res.status(400).json({ error: "Image required" });
    }

    /* ---------- Owner lookup ---------- */
    const ownerId = req.headers.ownerid;
    const user = await User.findOne({ user_id: ownerId });

    if (!user) {
      return res.status(404).json({ error: "Owner not found" });
    }

    /* ---------- GridFS ---------- */
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
      try {
        /* ---------- TEMP ADMIN ---------- */
        const adminId = new mongoose.Types.ObjectId("000000000000000000000001");

        /* ---------- Prepare cattle data ---------- */
        const imageId = uploadStream.id;

        const cattleData = {
          ...req.body,
          milk_production: JSON.parse(req.body.milk_production),
          health_status: JSON.parse(req.body.health_status),
          image_id: imageId,
          owner_id: user._id
        };

        const uniqueId =
          state[req.body.state] +
          breed[req.body.breed_name] +
          Math.floor(0x10000 + Math.random() * 0xFFFFF).toString(16).toUpperCase();


        const newCattle = await Cattle.create({
          ...cattleData,
          unique_id: uniqueId,
          createdBy: adminId
        });
        const pdfFileId = await generateCattlePDF(newCattle);


        /* Save Report */
        await Report.create({
          name: `Registered - ${newCattle.unique_id}`,
          cattle_id: newCattle._id,
          owner_id: user._id,
          admin_id: user._id, // temporary default
          breed: newCattle.breed_name,
          state: newCattle.state,
          district: newCattle.district,
          pdf_file_id: pdfFileId
        });

        /* ---------- Update REPORT ---------- */
        await AdminStats.findOneAndUpdate(
          {},
          {
            $inc: {
              totalCattle: 1,
              [`breedWiseCount.${req.body.breed_name}`]: 1
            }
          },
          { upsert: true, new: true }
        );

        /* ---------- Log ACTIVITY ---------- */
        await Activity.create({
          action: "CATTLE_REGISTERED",
          entityType: "Cattle",
          entityId: newCattle._id,
          performedBy: adminId,
          metadata: {
            breed: req.body.breed_name,
            owner_id: user._id
          }
        });

        /* ---------- Response ---------- */
        res.status(201).json({
          success: true,
          unique_id: uniqueId
        });

      } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ error: "Database save failed" });
      }
    });

  } catch (err) {
    console.error("Register cattle error:", err);
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
        console.log(`Extracted features with confidence: ${confidence.toFixed(4)}`);

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




router.get("/fetch-cattle-profile/:unique_id", async (req, res) => {
  const { unique_id } = req.params;

  try {
    const cattle = await Cattle.findOne({ unique_id })
    .populate("owner_id", "full_name user_id phone_number");

    if (!cattle)
      return res.status(404).json({ error: "No cattle found with this ID" })
    else {
      
      res.json(cattle,
        
      )
    }
  }
  catch (err) {
    console.log(err)
  }
})






module.exports = router;
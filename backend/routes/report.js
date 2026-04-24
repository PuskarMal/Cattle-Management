const mongoose = require("mongoose"); 
const PDFDocument = require("pdfkit");
const Cattle = require("../models/cattle.js");
const {getGridFSBucket} = require("../config/gridfs");
const QRCode = require("qrcode");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const router = require("express").Router()
const Report = require("../models/report.js");
const Activity = require("../models/activity.js");

router.get("/download-report/:unique_id", async (req, res) => {
  try {
    const cattle = await Cattle.findOne({ unique_id: req.params.unique_id });
    if (!cattle) return res.status(404).json({ error: "Cattle not found" });

    const report = await Report.findOne({ cattle_id: cattle._id });
    if (!report) return res.status(404).json({ error: "Report not found" });

    const bucket = getGridFSBucket();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${cattle.unique_id}_report.pdf`
    );

    bucket.openDownloadStream(report.pdf_file_id).pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed" });
  }
});

router.get("/reports", async (req, res) => {
  const reports = await Report.find()
    .populate("cattle_id", "unique_id breed_name")
    .populate("owner_id", "full_name user_id")
    .sort({ createdAt: -1 });

  res.json(reports);
});

router.get("/report/pdf/:id", async (req, res) => {

  const bucket = getGridFSBucket();

  const fileId = new mongoose.Types.ObjectId(req.params.id);

  res.set("Content-Type", "application/pdf");

  bucket
    .openDownloadStream(fileId)
    .pipe(res);
});

router.get("/activity", async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("performedBy", "full_name user_id")
      .populate("entityId", "unique_id")
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

router.get("/recent-activity", async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("performedBy", "full_name user_id")
      .populate("entityId", "unique_id")
      .sort({ createdAt: -1 })
      .limit(3);

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});


module.exports = router;
const PDFDocument = require("pdfkit");
const Cattle = require("../models/cattle.js");

const QRCode = require("qrcode");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const router = require("express").Router()

router.get("/download-report/:unique_id", async (req, res) => {
  try {
    const cattle = await Cattle.findOne({
      unique_id: req.params.unique_id
    });

    if (!cattle) {
      return res.status(404).json({ error: "Cattle not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${cattle.cattle_id}_report.pdf`
    );

    doc.pipe(res);

    doc.image("assets/logo.jpeg", 50, 40, { width: 80 });

    doc.fontSize(18).text("Cattle Health & Production Report", { align: "center" });
    doc.moveDown();
    const qrData = `http://localhost:5173/register-cattle`;
const qrImage = await QRCode.toDataURL(qrData);

doc.image(qrImage, 450, 40, { width: 100 });
    doc.fontSize(12).text(`Pashu AADHAR No: ${cattle.unique_id}`);
    doc.fontSize(12).text(`Cattle ID: ${cattle.animal_tag_id}`);
    doc.text(`Species: ${cattle.species}`);
    doc.text(`Breed: ${cattle.breed_name}`);
    doc.text(`Age (months): ${cattle.age_in_months}`);
    doc.text(`Gender: ${cattle.gender}`);
    doc.text(`State: ${cattle.state}`);
    doc.text(`District: ${cattle.district}`);

    doc.moveDown();
    doc.text("Milk Production");
    doc.text(`• Average Yield (LPD): ${cattle.milk_production?.average_yield_lpd || "N/A"}`);
    doc.text(`• Fat %: ${cattle.milk_production?.fat_percentage || "N/A"}`);

    doc.moveDown();
    doc.text("Health Information");
    doc.text(`• Last Vaccination: ${cattle.health_status?.last_vaccination_date || "N/A"}`);
    doc.text(`• Current Condition: ${cattle.health_status?.current_condition || "Normal"}`);
    const chartCanvas = new ChartJSNodeCanvas({ width: 500, height: 300 });

const chartImage = await chartCanvas.renderToBuffer({
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [{
      label: "Milk Yield (LPD)",
      data: [10, 12, 11, 13],
      borderColor: "green"
    }]
  }
});

doc.addPage();
doc.text("Milk Production Trend");
doc.image(chartImage, 50, 100);
    doc.image("assets/sign.jpg", 400, 650, { width: 120 });
doc.text("Authorized Veterinary Officer", 400, 700);
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate report" });
  }
});


module.exports = router;
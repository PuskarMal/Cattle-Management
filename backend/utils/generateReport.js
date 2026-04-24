const PDFDocument = require("pdfkit");
const { getGridFSBucket } = require("../config/gridfs");

async function generateCattlePDF(cattle) {
  console.log(cattle)
  const doc = new PDFDocument({ margin: 50 });
  const bucket = getGridFSBucket();

  const uploadStream = bucket.openUploadStream(
    `${cattle.unique_id}_report.pdf`,
    { contentType: "application/pdf" }
  );

  doc.pipe(uploadStream);

  /* -------- PDF CONTENT -------- */
  doc.fontSize(18).text("Cattle Health & Production Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Pashu AADHAR No: ${cattle.unique_id}`);
  doc.text(`Animal Tag ID: ${cattle.animal_tag_id}`);
  doc.text(`Species: ${cattle.species}`);
  doc.text(`Breed: ${cattle.breed_name}`);
  doc.text(`Age (in months): ${cattle.age || "N/A"} years`);

  doc.moveDown();
  doc.text(`Owner ID: ${cattle.owner_id}`);
  doc.text(`Owner Name: ${cattle.owner_name || "N/A"}`);
  doc.text(`Address: ${cattle.address}`);
  doc.text(`State: ${cattle.state}`);
  doc.text(`District: ${cattle.district}`);

  doc.moveDown();
  doc.text("Milk Production");
  doc.text(`Avg Yield: ${cattle.milk_production?.average_yield_lpd || "N/A"}`);
  doc.text(`Fat %: ${cattle.milk_production?.fat_percentage || "N/A"}`);

  doc.moveDown();
  doc.text("Health Status");
  doc.text(`Current Condition: ${cattle.health_status?.current_condition || "Normal"}`);
  doc.text(`Last Vaccination Date: ${cattle.health_status?.last_vaccination_date || "N/A"}`);

  doc.end();

  return new Promise((resolve, reject) => {
    uploadStream.on("finish", () => resolve(uploadStream.id));
    uploadStream.on("error", reject);
  });
}

module.exports = { generateCattlePDF };

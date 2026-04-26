const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    name:{
      type: String
    },
    cattle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cattle_masters",
      required: true,
      unique: true
    },

    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      index: true
    },

    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users" // admin for now
    },

     pdf_file_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  status:{
    type: String,
    enum: ["Pending", "Active", "Rejected"],
    default: "Pending"
  },

    breed_name: String,
    state: String,
    district: String,
    rural_urban: String
  },
  
  { timestamps: true }
);


module.exports = mongoose.model("Report", reportSchema);

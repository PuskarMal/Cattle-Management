const mongoose = require("mongoose");

const cattleSchema = new mongoose.Schema({
  animal_tag_id: { type: String, unique: true },
  name: String,
  species: { type: String, enum: ["Cow", "Buffalo"], required: true },
  breed_name: { type: String, required: true },
  age_in_months: { type: Number },
  gender: { type: String, enum: ["Male", "Female"] },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
    sparse: true,
    index: true
  },
  children: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "cattle_masters" }],
    default: []
  },
  sire_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cattle_masters",
    default: null
  },

  dam_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cattle_masters",
    default: null
  },

  address: { type: String },

  state: { type: String, required: true },
  district: { type: String, required: true },

  milk_production: {
    average_yield_lpd: Number,
    fat_percentage: Number
  },
  biometric: {
    features: {
      type: [Number]
    },
    confidence: Number,
    enrolled_at: Date
  },
  
  health_status: {
    current_condition: String,
    last_vaccination_date: Date
  },
  vaccination_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VaccinationPlan"
  },
  feed_plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FeedPlan"
  },
  unique_id: {
    type: String, unique: true, required: true
  },
  image_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cattle_images.files"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // admin
  },
  status: { type: String, enum: ["Pending","Active","Rejected"], default: "Pending" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("cattle_masters", cattleSchema);

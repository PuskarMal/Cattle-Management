const mongoose = require("mongoose");

const cattleSchema = new mongoose.Schema({
  animal_tag_id: { type: String, unique: true },
  name: String,
  species: { type: String, enum: ["Cow", "Buffalo"], required: true },
  breed_name: { type: String, required: true },
  age_in_months: {type: Number},
  gender: {type: String, enum: ["Male", "Female"]},
  owner_id: {
    id: String,
    name: String,
    phone: String
  },

  address: { type: String },
  
  state: { type: String, required: true },
  district: { type: String, required: true },

  milk_production: {
    average_yield_lpd: Number,
    fat_percentage: Number
  },
  biometric: {
    features:{
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
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("cattle_master", cattleSchema);

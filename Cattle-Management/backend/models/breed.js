const mongoose = require("mongoose");

const BreedSchema = new mongoose.Schema(
  {
    breed_name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    species: {
      type: String,
      enum: ["Cow", "Buffalo"],
      required: true
    },

    origin_state: {
      type: String,
      required: true
    },

    avg_milk_yield_lpd: {
      type: Number, // Litres per day
      required: true
    },

    lactation_days: {
      type: Number,
      required: true
    },

    fat_percentage: {
      type: Number,
      required: true
    },

    age_first_calving: {
      type: Number, // Months
      required: true
    },

    heat_cycle_days: {
      type: Number,
      default: 21
    },

    vaccination_plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VaccinationPlan"
    },

    common_diseases: [
      {
        type: String
      }
    ],
    recommended_feed: [
      {
        type: String
      }
    ],
    govt_breed_code: {
      type: String
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("breed_master", BreedSchema);

const mongoose = require('mongoose');

const MarketplaceSchema = new mongoose.Schema(
  {
    // Product / Listing name
    breed_name: {
      type: String,
      required: true,
      trim: true
    },

    // Nutrition | Health | Hardware | Breeding
    listing_type: {
      type: String,
      enum: ['Nutrition', 'Health', 'Hardware', 'Breeding'],
      required: true
    },

    // Price or service fee
    price_or_fee: {
      type: Number,
      required: true
    },

    // REQUIRED — this was causing the error
    description: {
      type: String,
      required: true,
      trim: true
    },

    // Image path from multer
    image: {
      type: String,
      required: true
    },

    // Species (Cow / Buffalo etc.)
    species: {
      type: String,
      default: 'Cow'
    },

    // Auto-generated animal ID
    animal_id: {
      type: String,
      default: () =>
        `ANM${Math.floor(100000 + Math.random() * 900000)}`
    },

    // Listing status
    status: {
      type: String,
      default: 'Active'
    },

    // Timestamp
    created_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'marketplace_listing'
  }
);

module.exports = mongoose.model('Marketplace', MarketplaceSchema);
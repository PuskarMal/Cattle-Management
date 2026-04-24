const mongoose = require("mongoose");
const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: [
      "CATTLE_REGISTERED",
      "CATTLE_UPDATED",
      "CATTLE_DELETED"
    ],
    required: true
  },

  entityType: {
    type: String,
    enum: ["Cattle", "User"],
    required: true
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cattle_masters",
    required: true
  },

  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users" // admin
  },

  metadata: Object
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);

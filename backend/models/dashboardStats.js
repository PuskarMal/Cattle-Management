const mongoose = require("mongoose");
const dashboardReportSchema = new mongoose.Schema(
  {
    totalCattle: { type: Number, default: 0 },

    breedWiseCount: {
      type: Map,
      of: Number,
      default: {}
    },

    stateWiseCount: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("DashboardReport", dashboardReportSchema);
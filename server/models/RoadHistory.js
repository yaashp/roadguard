const mongoose = require("mongoose");

const RoadHistorySchema = new mongoose.Schema(
  {
    roadName: { type: String, required: true },
    location: { type: String, default: "" },
    safetyScore: { type: Number, default: 100 },
    incidents: [
      {
        year: Number,
        potholesReported: { type: Number, default: 0 },
        accidentsReported: { type: Number, default: 0 },
        note: { type: String, default: "" },
      },
    ],
    repairs: [
      {
        year: Number,
        description: String,
      },
    ],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.RoadHistory || mongoose.model("RoadHistory", RoadHistorySchema);

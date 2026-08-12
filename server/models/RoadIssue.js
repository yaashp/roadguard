const mongoose = require("mongoose");

const RoadIssueSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Pothole", "Accident", "Construction", "Hazard", "Resolved"],
      required: true,
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    roadName: { type: String, required: true },
    severity: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    image: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved"],
      default: "Under Review",
    },
    reportCount: { type: Number, default: 1 },
    reportedAt: { type: Date, default: Date.now },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.models.RoadIssue || mongoose.model("RoadIssue", RoadIssueSchema);

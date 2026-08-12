const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    issueType: {
      type: String,
      enum: ["Pothole", "Accident", "Road Damage", "Waterlogging", "Road Construction", "Traffic Hazard", "Other"],
      required: true,
    },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, default: "" },
    severity: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved"],
      default: "Submitted",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);

const { roadIssues } = require("../data/store");

exports.getRoadIssues = async (req, res) => {
  const { type, severity } = req.query;
  let results = roadIssues;
  if (type) results = results.filter((r) => r.type.toLowerCase() === String(type).toLowerCase());
  if (severity) results = results.filter((r) => r.severity.toLowerCase() === String(severity).toLowerCase());
  res.json({ success: true, issues: results });
};

exports.createRoadIssue = async (req, res) => {
  const { type, latitude, longitude, roadName, severity } = req.body;
  if (!type || latitude === undefined || longitude === undefined || !roadName) {
    return res.status(400).json({ success: false, message: "type, roadName, latitude, and longitude are required." });
  }
  const issue = {
    _id: `ri_${Date.now()}`,
    type,
    latitude: Number(latitude),
    longitude: Number(longitude),
    roadName,
    severity: severity || "Medium",
    image: req.file ? `/uploads/${req.file.filename}` : "",
    status: "Submitted",
    reportCount: 1,
    reportedAt: new Date(),
  };
  roadIssues.unshift(issue);
  res.status(201).json({ success: true, issue });
};

exports.updateRoadIssue = async (req, res) => {
  const issue = roadIssues.find((r) => r._id === req.params.id);
  if (!issue) return res.status(404).json({ success: false, message: "Road issue not found." });
  const { status, severity } = req.body;
  if (status) {
    issue.status = status;
    if (status === "Resolved") {
      issue.type = "Resolved";
      issue.resolvedAt = new Date();
    }
  }
  if (severity) issue.severity = severity;
  res.json({ success: true, issue });
};

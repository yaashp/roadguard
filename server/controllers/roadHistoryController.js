const { roadHistory } = require("../data/store");

exports.getRoadHistory = async (req, res) => {
  const { id } = req.params;
  const record =
    roadHistory.find((r) => r._id === id) ||
    roadHistory.find((r) => r.roadName.toLowerCase().replace(/\s+/g, "-") === id.toLowerCase());

  if (!record) {
    return res.status(404).json({ success: false, message: "No history found for this road." });
  }
  res.json({ success: true, history: record });
};

exports.listRoads = async (req, res) => {
  const list = roadHistory.map((r) => ({ _id: r._id, roadName: r.roadName, location: r.location, safetyScore: r.safetyScore }));
  res.json({ success: true, roads: list });
};

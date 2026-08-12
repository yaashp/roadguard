const { complaints, users, nextComplaintId } = require("../data/store");

exports.createComplaint = async (req, res) => {
  const { issueType, description, latitude, longitude, address, severity } = req.body;

  if (!issueType || latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      success: false,
      message: "Issue type and a location (latitude/longitude) are required.",
    });
  }

  const complaint = {
    _id: `c_${Date.now()}`,
    complaintId: nextComplaintId(),
    userId: req.user._id,
    issueType,
    description: description || "",
    image: req.file ? `/uploads/${req.file.filename}` : "",
    latitude: Number(latitude),
    longitude: Number(longitude),
    address: address || "",
    severity: severity || "Medium",
    status: "Submitted",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  complaints.unshift(complaint);
  res.status(201).json({ success: true, complaint });
};

exports.getMyComplaints = async (req, res) => {
  const mine = complaints
    .filter((c) => c.userId === req.user._id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, complaints: mine });
};

exports.getComplaintById = async (req, res) => {
  const complaint = complaints.find((c) => c._id === req.params.id || c.complaintId === req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: "Complaint not found." });
  }
  res.json({ success: true, complaint });
};

exports.updateComplaint = async (req, res) => {
  const complaint = complaints.find((c) => c._id === req.params.id || c.complaintId === req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: "Complaint not found." });
  }

  // Only admins can change fulfillment fields. Citizens can still view their complaints.
  const { status, severity, description } = req.body;
  if (status && !["Submitted", "Under Review", "Assigned", "In Progress", "Resolved"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid complaint status." });
  }
  if (status) complaint.status = status;
  if (severity) complaint.severity = severity;
  if (description !== undefined) complaint.description = description;
  complaint.updatedAt = new Date();

  res.json({ success: true, complaint });
};

exports.getAllComplaints = async (req, res) => {
  const sorted = [...complaints]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((complaint) => {
      const reporter = users.find((u) => u._id === complaint.userId);
      return {
        ...complaint,
        reporter: reporter
          ? { name: reporter.name, email: reporter.email, phone: reporter.phone || "" }
          : null,
      };
    });

  res.json({ success: true, complaints: sorted });
};

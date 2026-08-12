const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/auth");
const {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  getAllComplaints,
} = require("../controllers/complaintController");

router.post("/", protect, upload.single("image"), createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/all", protect, adminOnly, getAllComplaints);
router.get("/:id", protect, getComplaintById);
// Fulfillment/status updates are an admin operation.
router.put("/:id", protect, adminOnly, updateComplaint);

module.exports = router;

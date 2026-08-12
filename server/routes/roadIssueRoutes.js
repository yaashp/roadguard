const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/auth");
const { getRoadIssues, createRoadIssue, updateRoadIssue } = require("../controllers/roadIssueController");

router.get("/", getRoadIssues);
router.post("/", protect, upload.single("image"), createRoadIssue);
router.put("/:id", protect, adminOnly, updateRoadIssue);

module.exports = router;

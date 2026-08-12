const express = require("express");
const router = express.Router();
const { getRoadHistory, listRoads } = require("../controllers/roadHistoryController");

router.get("/", listRoads);
router.get("/:id/history", getRoadHistory);

module.exports = router;

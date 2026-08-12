const express = require("express");
const router = express.Router();
const { checkRoute, compareRoutes } = require("../controllers/routeController");

router.post("/check", checkRoute);
router.post("/alternative", compareRoutes);

module.exports = router;

const { roadIssues } = require("../data/store");
const { scoreRoute } = require("../utils/routeSafety");

/**
 * POST /api/routes/check
 * Body: { points: [{lat, lng}, ...] }  <- polyline of the route (from Google Directions on the client)
 * Returns hazard analysis + safety score for that route.
 */
exports.checkRoute = async (req, res) => {
  const { points } = req.body;
  if (!Array.isArray(points) || points.length === 0) {
    return res.status(400).json({ success: false, message: "A non-empty array of route points is required." });
  }

  const result = scoreRoute(points, roadIssues);
  res.json({
    success: true,
    safe: result.hazards.length === 0,
    ...result,
  });
};

/**
 * POST /api/routes/alternative
 * Body: { fastestPoints: [...], saferPoints: [...] }
 * Scores both a "fastest" and a candidate "safer" route (the safer polyline
 * is computed on the client via the Google Directions API using waypoints
 * that avoid known hazard coordinates) and returns a comparison.
 */
exports.compareRoutes = async (req, res) => {
  const { fastestPoints, saferPoints, fastestMeta = {}, saferMeta = {} } = req.body;

  if (!Array.isArray(fastestPoints) || !Array.isArray(saferPoints)) {
    return res.status(400).json({ success: false, message: "fastestPoints and saferPoints arrays are required." });
  }

  const fastest = scoreRoute(fastestPoints, roadIssues);
  const safer = scoreRoute(saferPoints, roadIssues);

  res.json({
    success: true,
    fastest: { ...fastest, ...fastestMeta },
    safer: { ...safer, ...saferMeta },
  });
};

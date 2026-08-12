/**
 * Modular route safety scoring.
 * Start at 100 and subtract points for each hazard found near the route.
 * Tweak PENALTIES below to change scoring behaviour without touching callers.
 */
const PENALTIES = {
  Pothole: { Low: 5, Medium: 10, High: 20 },
  Accident: { Low: 15, Medium: 20, High: 25 },
  Construction: { Low: 5, Medium: 10, High: 15 },
  Hazard: { Low: 10, Medium: 20, High: 30 },
  Resolved: { Low: 0, Medium: 0, High: 0 },
};

const HAZARD_RADIUS_METERS = 250;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Haversine distance in meters
function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function categorize(score) {
  if (score >= 90) return "Very Safe";
  if (score >= 75) return "Safe";
  if (score >= 50) return "Moderate";
  return "Risky";
}

/**
 * @param {Array<{lat:number, lng:number}>} routePoints - polyline points of the route
 * @param {Array} roadIssues - list of known road issues (from the data layer)
 */
function scoreRoute(routePoints, roadIssues) {
  let score = 100;
  const hazardsFound = [];
  const seen = new Set();

  for (const point of routePoints) {
    for (const issue of roadIssues) {
      if (issue.type === "Resolved") continue;
      const d = distanceMeters(point.lat, point.lng, issue.latitude, issue.longitude);
      if (d <= HAZARD_RADIUS_METERS && !seen.has(issue._id)) {
        seen.add(issue._id);
        const penalty = PENALTIES[issue.type]?.[issue.severity] ?? 10;
        score -= penalty;
        hazardsFound.push({ ...issue, penalty, distanceMeters: Math.round(d) });
      }
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score,
    category: categorize(score),
    hazards: hazardsFound.sort((a, b) => b.penalty - a.penalty),
  };
}

module.exports = { scoreRoute, distanceMeters, categorize, HAZARD_RADIUS_METERS, PENALTIES };

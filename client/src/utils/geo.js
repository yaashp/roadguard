// Bounding box covering Mumbai / Navi Mumbai / Thane — used to project
// lat/lng onto the stylized Demo Map when no Google Maps API key is set.
export const DEMO_BOUNDS = {
  north: 19.29,
  south: 18.96,
  east: 73.08,
  west: 72.76,
};

export function latLngToPercent(lat, lng, bounds = DEMO_BOUNDS) {
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * 100;
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * 100;
  return { xPct: Math.min(98, Math.max(2, x)), yPct: Math.min(96, Math.max(4, y)) };
}

export function isWithinDemoBounds(lat, lng, bounds = DEMO_BOUNDS) {
  return lat <= bounds.north && lat >= bounds.south && lng <= bounds.east && lng >= bounds.west;
}

// Straight-line interpolation between two points, sampled every ~ (1/steps)
// Good enough to demo hazard-checking without calling a paid Directions API.
export function interpolateRoute(origin, destination, steps = 24) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push({
      lat: origin.lat + (destination.lat - origin.lat) * t,
      lng: origin.lng + (destination.lng - origin.lng) * t,
    });
  }
  return points;
}

// Offsets a route perpendicular to its direction, to synthesize a plausible
// "alternative" polyline for the demo safer-route feature.
export function offsetRoute(points, offsetDeg = 0.01) {
  if (points.length < 2) return points;
  const [start, end] = [points[0], points[points.length - 1]];
  const dx = end.lng - start.lng;
  const dy = end.lat - start.lat;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return points.map((p, i) => {
    // taper the offset at the endpoints so it still meets origin/destination
    const t = Math.sin((i / (points.length - 1)) * Math.PI);
    return { lat: p.lat + ny * offsetDeg * t, lng: p.lng + nx * offsetDeg * t };
  });
}

export function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function routeDistanceKm(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += haversineMeters(points[i - 1], points[i]);
  return total / 1000;
}

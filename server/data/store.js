/**
 * In-memory mock data layer.
 *
 * The app runs on this by default (no MongoDB required) so it works
 * out of the box for demos. The Mongoose schemas in /models mirror this
 * shape exactly — swap the controllers over to them once MONGODB_URI
 * is set and reachable (see README "Connecting a real database").
 */
const bcrypt = require("bcryptjs");

let nextComplaintSeq = 421;

// ---------- Users ----------
const users = [
  {
    _id: "u_demo_1",
    name: "Aarav Sharma",
    email: "demo@roadguard.app",
    phone: "9876543210",
    password: bcrypt.hashSync("password123", 10),
    profileImage: "",
    role: "user",
    createdAt: new Date("2026-01-15"),
  },
  {
    _id: "u_admin_1",
    name: "RoadGuard Admin",
    email: "admin@roadguard.app",
    phone: "9999999999",
    password: bcrypt.hashSync("admin123", 10),
    profileImage: "",
    role: "admin",
    createdAt: new Date("2026-01-01"),
  },
];

// ---------- Road Issues (map markers) ----------
// Mumbai / Navi Mumbai / Thane region
const roadIssues = [
  { _id: "ri_1", type: "Pothole", latitude: 19.0760, longitude: 72.8777, roadName: "Marine Drive, Mumbai", severity: "High", image: "", status: "Under Review", reportCount: 17, reportedAt: daysAgo(2) },
  { _id: "ri_2", type: "Pothole", latitude: 19.0330, longitude: 73.0297, roadName: "Palm Beach Road, Navi Mumbai", severity: "Medium", image: "", status: "Assigned", reportCount: 9, reportedAt: daysAgo(5) },
  { _id: "ri_3", type: "Pothole", latitude: 19.2183, longitude: 72.9781, roadName: "Ghodbunder Road, Thane", severity: "Low", image: "", status: "Submitted", reportCount: 3, reportedAt: daysAgo(1) },
  { _id: "ri_4", type: "Accident", latitude: 19.0896, longitude: 72.8656, roadName: "Western Express Highway, Mumbai", severity: "High", image: "", status: "In Progress", reportCount: 6, reportedAt: daysAgo(3) },
  { _id: "ri_5", type: "Accident", latitude: 19.0176, longitude: 73.0169, roadName: "Sion-Panvel Highway, Navi Mumbai", severity: "Medium", image: "", status: "Under Review", reportCount: 4, reportedAt: daysAgo(7) },
  { _id: "ri_6", type: "Construction", latitude: 19.0473, longitude: 72.9159, roadName: "Eastern Express Highway, Mumbai", severity: "Medium", image: "", status: "In Progress", reportCount: 2, reportedAt: daysAgo(10) },
  { _id: "ri_7", type: "Construction", latitude: 19.1943, longitude: 72.9634, roadName: "LBS Marg, Thane", severity: "Low", image: "", status: "Submitted", reportCount: 1, reportedAt: daysAgo(1) },
  { _id: "ri_8", type: "Hazard", latitude: 19.1090, longitude: 72.8767, roadName: "S.V. Road, Mumbai", severity: "High", image: "", status: "Under Review", reportCount: 12, reportedAt: daysAgo(4) },
  { _id: "ri_9", type: "Hazard", latitude: 19.0410, longitude: 73.0080, roadName: "Vashi Bridge, Navi Mumbai", severity: "Medium", image: "", status: "Assigned", reportCount: 8, reportedAt: daysAgo(6) },
  { _id: "ri_10", type: "Resolved", latitude: 19.1663, longitude: 72.9950, roadName: "Pokhran Road, Thane", severity: "Low", image: "", status: "Resolved", reportCount: 5, reportedAt: daysAgo(20), resolvedAt: daysAgo(2) },
  { _id: "ri_11", type: "Resolved", latitude: 19.0522, longitude: 72.8300, roadName: "Linking Road, Mumbai", severity: "Medium", image: "", status: "Resolved", reportCount: 11, reportedAt: daysAgo(30), resolvedAt: daysAgo(5) },
  { _id: "ri_12", type: "Pothole", latitude: 19.2403, longitude: 72.9784, roadName: "Majiwada, Thane", severity: "High", image: "", status: "Under Review", reportCount: 14, reportedAt: daysAgo(1) },
];

// ---------- Complaints ----------
const complaints = [
  {
    _id: "c_1",
    complaintId: "RG-2026-00417",
    userId: "u_demo_1",
    issueType: "Pothole",
    description: "Large pothole near the signal, hard to spot at night.",
    image: "",
    latitude: 19.0760,
    longitude: 72.8777,
    address: "Marine Drive, Mumbai",
    severity: "High",
    status: "In Progress",
    createdAt: daysAgo(9),
    updatedAt: daysAgo(1),
  },
  {
    _id: "c_2",
    complaintId: "RG-2026-00398",
    userId: "u_demo_1",
    issueType: "Waterlogging",
    description: "Water accumulates fully after rain, blocks one lane.",
    image: "",
    latitude: 19.0330,
    longitude: 73.0297,
    address: "Palm Beach Road, Navi Mumbai",
    severity: "Medium",
    status: "Resolved",
    createdAt: daysAgo(25),
    updatedAt: daysAgo(15),
  },
  {
    _id: "c_3",
    complaintId: "RG-2026-00405",
    userId: "u_demo_1",
    issueType: "Road Damage",
    description: "Cracked road surface across two lanes.",
    image: "",
    latitude: 19.1943,
    longitude: 72.9634,
    address: "LBS Marg, Thane",
    severity: "Low",
    status: "Under Review",
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
];

// ---------- Road History ----------
const roadHistory = [
  {
    _id: "rh_1",
    roadName: "Palm Beach Road",
    location: "Navi Mumbai",
    safetyScore: 74,
    incidents: [
      { year: 2026, potholesReported: 5, accidentsReported: 2, note: "3 potholes repaired" },
      { year: 2025, potholesReported: 8, accidentsReported: 1, note: "Major resurfacing completed" },
      { year: 2024, potholesReported: 3, accidentsReported: 0, note: "" },
    ],
    repairs: [
      { year: 2026, description: "3 potholes patched near sector 19" },
      { year: 2025, description: "Full resurfacing, 2.4 km stretch" },
    ],
  },
  {
    _id: "rh_2",
    roadName: "Marine Drive",
    location: "Mumbai",
    safetyScore: 88,
    incidents: [
      { year: 2026, potholesReported: 2, accidentsReported: 0, note: "" },
      { year: 2025, potholesReported: 4, accidentsReported: 1, note: "Drainage upgrade" },
      { year: 2024, potholesReported: 1, accidentsReported: 0, note: "" },
    ],
    repairs: [{ year: 2025, description: "Drainage and resurfacing near Chowpatty" }],
  },
  {
    _id: "rh_3",
    roadName: "Ghodbunder Road",
    location: "Thane",
    safetyScore: 61,
    incidents: [
      { year: 2026, potholesReported: 9, accidentsReported: 3, note: "" },
      { year: 2025, potholesReported: 12, accidentsReported: 4, note: "Traffic signal added" },
      { year: 2024, potholesReported: 7, accidentsReported: 2, note: "" },
    ],
    repairs: [{ year: 2025, description: "Partial patchwork, Kasarvadavali stretch" }],
  },
];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function nextComplaintId() {
  nextComplaintSeq += 1;
  return `RG-2026-${String(nextComplaintSeq).padStart(5, "0")}`;
}

module.exports = {
  users,
  roadIssues,
  complaints,
  roadHistory,
  nextComplaintId,
  daysAgo,
};

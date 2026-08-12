export function timeAgo(dateInput) {
  const date = new Date(dateInput);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${name}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export function formatDate(dateInput) {
  return new Date(dateInput).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export const ISSUE_COLORS = {
  Pothole: { dot: "bg-hazard", text: "text-hazard", ring: "ring-hazard/30", hex: "#E13B3B" },
  Accident: { dot: "bg-warn", text: "text-warn-dark", ring: "ring-warn/30", hex: "#F2A93B" },
  Construction: { dot: "bg-yellow-400", text: "text-yellow-600", ring: "ring-yellow-400/30", hex: "#EAB308" },
  Hazard: { dot: "bg-violet", text: "text-violet", ring: "ring-violet/30", hex: "#8B5CF6" },
  Resolved: { dot: "bg-signal", text: "text-signal-dark", ring: "ring-signal/30", hex: "#17B890" },
};

export const SEVERITY_COLORS = {
  Low: "text-signal-dark bg-signal/10",
  Medium: "text-warn-dark bg-warn/10",
  High: "text-hazard bg-hazard/10",
};

export const STATUS_COLORS = {
  Submitted: "text-route bg-route/10",
  "Under Review": "text-warn-dark bg-warn/10",
  Assigned: "text-violet bg-violet/10",
  "In Progress": "text-route bg-route/10",
  Resolved: "text-signal-dark bg-signal/10",
};

export function scoreCategory(score) {
  if (score >= 90) return { label: "Very Safe", color: "text-signal-dark" };
  if (score >= 75) return { label: "Safe", color: "text-signal" };
  if (score >= 50) return { label: "Moderate", color: "text-warn-dark" };
  return { label: "Risky", color: "text-hazard" };
}

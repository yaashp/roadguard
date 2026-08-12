import { ISSUE_COLORS } from "../../utils/format.js";
import { AlertTriangle, Car, Construction, ShieldAlert, CheckCircle2 } from "lucide-react";

const ICONS = {
  Pothole: AlertTriangle,
  Accident: Car,
  Construction: Construction,
  Hazard: ShieldAlert,
  Resolved: CheckCircle2,
};

export default function MapPin({ type, severity, selected, onClick, style }) {
  const Icon = ICONS[type] || AlertTriangle;
  const color = ISSUE_COLORS[type]?.hex || "#E13B3B";
  const size = severity === "High" ? 34 : severity === "Medium" ? 30 : 26;

  return (
    <button
      onClick={onClick}
      style={style}
      className={`absolute -translate-x-1/2 -translate-y-full transition-transform duration-200 ${
        selected ? "scale-125 z-20" : "z-10 hover:scale-110"
      }`}
    >
      {severity === "High" && type !== "Resolved" && (
        <span
          className="absolute inset-0 rounded-full animate-pulse-ring"
          style={{ backgroundColor: color }}
        />
      )}
      <svg width={size} height={size * 1.25} viewBox="0 0 24 30" fill="none">
        <path
          d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12z"
          fill={color}
          stroke="white"
          strokeWidth="1.2"
        />
        <circle cx="12" cy="11.5" r="6.2" fill="white" />
      </svg>
      <Icon
        size={size * 0.28}
        color={color}
        strokeWidth={2.5}
        style={{ position: "absolute", top: size * 0.16, left: "50%", transform: "translateX(-50%)" }}
      />
    </button>
  );
}

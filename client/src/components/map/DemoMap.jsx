import { useRef } from "react";
import { Satellite, Map as MapIcon, Layers } from "lucide-react";
import MapPin from "./MapPin.jsx";
import { DEMO_BOUNDS, latLngToPercent } from "../../utils/geo.js";

const STYLE_OPTIONS = [
  { id: "satellite", label: "Satellite", icon: Satellite },
  { id: "roadmap", label: "Roadmap", icon: MapIcon },
  { id: "hybrid", label: "Hybrid", icon: Layers },
];

const BG = {
  satellite:
    "radial-gradient(circle at 30% 20%, #2C3B2E 0%, #1B2A1E 35%, #14201A 60%, #0F1A16 100%)",
  hybrid:
    "radial-gradient(circle at 30% 20%, #223327 0%, #16231B 40%, #101B15 100%)",
  roadmap: "linear-gradient(180deg, #E9EEE9 0%, #DCE4DD 100%)",
};

export default function DemoMap({
  issues = [],
  selectedIssue,
  onSelectIssue,
  mapStyle,
  onMapStyleChange,
  routes = [],
  userLocation,
  onMapClick,
  pickedLocation,
  interactive = true,
  className = "",
}) {
  const containerRef = useRef(null);
  const isDark = mapStyle !== "roadmap";

  function handleClick(e) {
    if (!onMapClick || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const lat = DEMO_BOUNDS.north - (yPct / 100) * (DEMO_BOUNDS.north - DEMO_BOUNDS.south);
    const lng = DEMO_BOUNDS.west + (xPct / 100) * (DEMO_BOUNDS.east - DEMO_BOUNDS.west);
    onMapClick({ lat, lng });
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative w-full h-full overflow-hidden select-none ${onMapClick ? "cursor-crosshair" : ""} ${className}`}
      style={{ background: BG[mapStyle] || BG.satellite }}
    >
      {/* Demo mode badge */}
      <div className="absolute top-4 left-4 z-10 glass rounded-full px-3 py-1.5 text-[11px] font-medium flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-warn animate-pulse" />
        Demo Map Mode — add a Google Maps key for live imagery
      </div>

      {/* Texture: faux road network */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <defs>
          <pattern id="roads" width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M0 45 H90 M45 0 V90" stroke={isDark ? "#5FDCB8" : "#8FA89A"} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#roads)" />
      </svg>

      {/* Route polylines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {routes.map((route, idx) => {
          const pts = route.points.map((p) => latLngToPercent(p.lat, p.lng));
          const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.xPct} ${p.yPct}`).join(" ");
          return (
            <path
              key={idx}
              d={d}
              fill="none"
              stroke={route.color || "#2F6FED"}
              strokeWidth={route.width || 1.4}
              strokeLinecap="round"
              strokeDasharray={route.dashed ? "3 2" : undefined}
              vectorEffect="non-scaling-stroke"
              opacity={0.9}
            />
          );
        })}
      </svg>

      {/* Style switcher */}
      {onMapStyleChange && (
        <div className="absolute top-4 right-4 z-10 glass rounded-full p-1 flex gap-1">
          {STYLE_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={(e) => { e.stopPropagation(); onMapStyleChange(id); }}
              title={label}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                mapStyle === id ? "bg-signal text-white" : "text-asphalt-900/60 dark:text-mist-100/70 hover:bg-white/40"
              }`}
            >
              <Icon size={15} />
            </button>
          ))}
        </div>
      )}

      {/* Markers */}
      {issues.map((issue) => {
        const { xPct, yPct } = latLngToPercent(issue.latitude, issue.longitude);
        return (
          <MapPin
            key={issue._id}
            type={issue.type}
            severity={issue.severity}
            selected={selectedIssue?._id === issue._id}
            onClick={(e) => { e.stopPropagation(); onSelectIssue?.(issue); }}
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
          />
        );
      })}

      {/* Picked location marker (for report form) */}
      {pickedLocation && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full z-20"
          style={{
            left: `${latLngToPercent(pickedLocation.lat, pickedLocation.lng).xPct}%`,
            top: `${latLngToPercent(pickedLocation.lat, pickedLocation.lng).yPct}%`,
          }}
        >
          <svg width="30" height="38" viewBox="0 0 24 30" fill="none">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12z" fill="#2F6FED" stroke="white" strokeWidth="1.2" />
            <circle cx="12" cy="11.5" r="4" fill="white" />
          </svg>
        </div>
      )}

      {/* User location dot */}
      {userLocation && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            left: `${latLngToPercent(userLocation.lat, userLocation.lng).xPct}%`,
            top: `${latLngToPercent(userLocation.lat, userLocation.lng).yPct}%`,
          }}
        >
          <span className="absolute inset-0 w-4 h-4 -m-2 rounded-full bg-route/30 animate-pulse-ring" />
          <span className="block w-4 h-4 rounded-full bg-route border-2 border-white shadow-soft" />
        </div>
      )}
    </div>
  );
}

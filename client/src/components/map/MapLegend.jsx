import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ISSUE_COLORS } from "../../utils/format.js";

const LEGEND_ITEMS = [
  { type: "Pothole", label: "Pothole" },
  { type: "Accident", label: "Accident" },
  { type: "Construction", label: "Construction" },
  { type: "Hazard", label: "Hazardous Area" },
  { type: "Resolved", label: "Resolved Issue" },
];

export default function MapLegend() {
  const [open, setOpen] = useState(true);

  return (
    <div className="absolute left-4 bottom-4 z-10 glass rounded-2xl shadow-card overflow-hidden w-44 sm:w-48">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-asphalt-900/60 dark:text-mist-100/60"
      >
        Legend
        {open ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
      {open && (
        <ul className="px-4 pb-3 space-y-2">
          {LEGEND_ITEMS.map((item) => (
            <li key={item.type} className="flex items-center gap-2 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${ISSUE_COLORS[item.type].dot}`} />
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

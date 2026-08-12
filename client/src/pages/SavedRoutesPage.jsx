import { useState } from "react";
import { Route as RouteIcon, Trash2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import EmptyState from "../components/common/EmptyState.jsx";

const SEED = [
  { id: 1, name: "Home → Office", from: "Bandra, Mumbai", to: "Andheri, Mumbai", score: 88 },
  { id: 2, name: "Weekend errands", from: "Vashi, Navi Mumbai", to: "Palm Beach Road, Navi Mumbai", score: 74 },
];

export default function SavedRoutesPage() {
  const [routes, setRoutes] = useState(SEED);

  function remove(id) {
    setRoutes((r) => r.filter((route) => route.id !== id));
  }

  if (routes.length === 0) {
    return (
      <EmptyState
        icon={RouteIcon}
        title="No saved routes"
        description="Save a route from the Live Map after finding a safer path — it'll show up here for quick reuse."
        action={<Link to="/map" className="btn-primary text-sm !py-2 !px-4">Plan a route</Link>}
      />
    );
  }

  return (
    <div className="max-w-2xl space-y-3">
      {routes.map((r) => (
        <div key={r.id} className="card p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-route/10 text-route flex items-center justify-center shrink-0">
              <RouteIcon size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{r.name}</p>
              <p className="text-xs text-asphalt-900/50 dark:text-mist-100/50 truncate">{r.from} → {r.to}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold text-signal-dark dark:text-signal-light">{r.score}% Safe</span>
            <button onClick={() => remove(r.id)} className="text-asphalt-900/35 dark:text-mist-100/35 hover:text-hazard transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      <Link to="/map" className="flex items-center justify-center gap-2 border-2 border-dashed border-asphalt-900/15 dark:border-white/15 rounded-2xl py-4 text-sm font-medium text-asphalt-900/55 dark:text-mist-100/55 hover:border-signal/50 hover:text-signal-dark transition-colors">
        <Plus size={16} /> Plan a new route
      </Link>
    </div>
  );
}

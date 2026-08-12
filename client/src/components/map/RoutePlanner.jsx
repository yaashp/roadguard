import { useState } from "react";
import { Navigation, AlertTriangle, ShieldCheck, X, Loader2 } from "lucide-react";
import { KNOWN_PLACES } from "../../utils/places.js";
import { interpolateRoute, offsetRoute, routeDistanceKm } from "../../utils/geo.js";
import { scoreCategory } from "../../utils/format.js";
import api from "../../services/api.js";

export default function RoutePlanner({ onClose, onResult, userLocation }) {
  const [originIdx, setOriginIdx] = useState("");
  const [destIdx, setDestIdx] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleFindRoute() {
    setError("");
    const origin = originIdx === "current" ? userLocation : KNOWN_PLACES[originIdx];
    const destination = KNOWN_PLACES[destIdx];

    if (!origin) {
      setError("Choose a starting point (or enable your location).");
      return;
    }
    if (!destination) {
      setError("Choose a destination.");
      return;
    }

    setLoading(true);
    try {
      const fastestPoints = interpolateRoute(origin, destination, 24);
      const saferPoints = offsetRoute(fastestPoints, 0.012);

      const { data } = await api.post("/routes/alternative", {
        fastestPoints,
        saferPoints,
        fastestMeta: {
          distanceKm: Number(routeDistanceKm(fastestPoints).toFixed(1)),
          etaMin: Math.round((routeDistanceKm(fastestPoints) / 32) * 60),
        },
        saferMeta: {
          distanceKm: Number(routeDistanceKm(saferPoints).toFixed(1)),
          etaMin: Math.round((routeDistanceKm(saferPoints) / 28) * 60),
        },
      });

      setResult(data);
      onResult?.({
        fastestPoints,
        saferPoints,
        fastest: data.fastest,
        safer: data.safer,
      });
    } catch (err) {
      setError("Couldn't calculate a route right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function useRoute(which) {
    onResult?.({ use: which });
  }

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[min(92vw,420px)] card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm flex items-center gap-2">
          <Navigation size={15} className="text-signal" /> Plan a route
        </h3>
        <button onClick={onClose} className="text-asphalt-900/40 dark:text-mist-100/40 hover:text-asphalt-900 dark:hover:text-mist-100">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-3">
        <select className="input" value={originIdx} onChange={(e) => setOriginIdx(e.target.value)}>
          <option value="">Starting point…</option>
          {userLocation && <option value="current">📍 My current location</option>}
          {KNOWN_PLACES.map((p, i) => (
            <option key={p.name} value={i}>{p.name}</option>
          ))}
        </select>
        <select className="input" value={destIdx} onChange={(e) => setDestIdx(e.target.value)}>
          <option value="">Destination…</option>
          {KNOWN_PLACES.map((p, i) => (
            <option key={p.name} value={i}>{p.name}</option>
          ))}
        </select>

        {error && <p className="text-xs text-hazard">{error}</p>}

        <button onClick={handleFindRoute} disabled={loading} className="btn-primary w-full !py-2.5 text-sm disabled:opacity-60">
          {loading ? <Loader2 size={15} className="animate-spin" /> : "Find Route"}
        </button>
      </div>

      {result && (
        <div className="mt-5 pt-4 border-t border-asphalt-900/10 dark:border-white/10 space-y-3">
          {result.safer.hazards.length > 0 && (
            <div className="flex items-start gap-2 text-xs bg-warn/10 text-warn-dark rounded-xl px-3 py-2.5">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>
                Hazard detected on your current route. {result.fastest.hazards.length} hazard
                {result.fastest.hazards.length === 1 ? "" : "s"} found along the fastest path.
              </span>
            </div>
          )}

          <RouteOption label="Fastest Route" data={result.fastest} accent="route" onUse={() => useRoute("fastest")} />
          <RouteOption label="Recommended Safer Route" data={result.safer} accent="signal" onUse={() => useRoute("safer")} highlight />
        </div>
      )}
    </div>
  );
}

function RouteOption({ label, data, accent, onUse, highlight }) {
  const cat = scoreCategory(data.score);
  return (
    <div className={`rounded-xl border p-3.5 ${highlight ? "border-signal/40 bg-signal/5" : "border-asphalt-900/10 dark:border-white/10"}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold flex items-center gap-1.5">
          {highlight && <ShieldCheck size={14} className="text-signal" />}
          {label}
        </p>
        <span className={`text-xs font-bold ${cat.color}`}>{data.score}% {cat.label}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-asphalt-900/55 dark:text-mist-100/55 mb-3">
        <span>{data.distanceKm ?? "—"} km</span>
        <span>{data.etaMin ?? "—"} min</span>
        <span>{data.hazards.length} hazard{data.hazards.length === 1 ? "" : "s"}</span>
      </div>
      <button onClick={onUse} className={`w-full !py-2 text-xs ${highlight ? "btn-primary" : "btn-secondary"}`}>
        Use {label.replace("Recommended ", "")}
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { History, Wrench, ShieldCheck } from "lucide-react";
import api from "../services/api.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import RoadHistoryChart from "../components/RoadHistoryChart.jsx";
import { scoreCategory } from "../utils/format.js";

export default function RoadHistoryPage() {
  const [roads, setRoads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/roads")
      .then(({ data }) => {
        setRoads(data.roads || []);
        if (data.roads?.length) setSelectedId(data.roads[0]._id);
      })
      .catch(() => setError("Couldn't load the roads list."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingHistory(true);
    api
      .get(`/roads/${selectedId}/history`)
      .then(({ data }) => setHistory(data.history))
      .catch(() => setError("Couldn't load history for this road."))
      .finally(() => setLoadingHistory(false));
  }, [selectedId]);

  if (loading) return <LoadingSpinner full label="Loading roads…" />;

  if (roads.length === 0) {
    return <EmptyState icon={History} title="No road history available" description="Check back once roads have been monitored for a while." />;
  }

  const cat = history ? scoreCategory(history.safetyScore) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {roads.map((r) => (
          <button
            key={r._id}
            onClick={() => setSelectedId(r._id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              selectedId === r._id
                ? "border-signal bg-signal/10 text-signal-dark dark:text-signal-light"
                : "border-asphalt-900/10 dark:border-white/10 hover:bg-asphalt-900/5 dark:hover:bg-white/5"
            }`}
          >
            {r.roadName}
          </button>
        ))}
      </div>

      {loadingHistory || !history ? (
        <LoadingSpinner label="Loading road history…" />
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="card p-6 sm:col-span-1 flex flex-col items-center justify-center text-center">
              <ShieldCheck size={22} className={cat.color} />
              <p className={`font-display font-bold text-3xl mt-2 ${cat.color}`}>{history.safetyScore}</p>
              <p className="text-xs text-asphalt-900/50 dark:text-mist-100/50">/ 100 · {cat.label}</p>
              <p className="text-sm font-medium mt-3">{history.roadName}</p>
              <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45">{history.location}</p>
            </div>

            <div className="card p-6 sm:col-span-2">
              <h3 className="font-display font-semibold mb-4 text-sm">Condition over time</h3>
              <RoadHistoryChart incidents={history.incidents} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-6">
              <h3 className="font-display font-semibold mb-4 text-sm flex items-center gap-2">
                <History size={16} /> Incident Timeline
              </h3>
              <ul className="space-y-4">
                {[...history.incidents].sort((a, b) => b.year - a.year).map((i) => (
                  <li key={i.year} className="flex gap-4">
                    <div className="w-14 shrink-0 font-mono text-sm font-semibold text-asphalt-900/50 dark:text-mist-100/50">{i.year}</div>
                    <div className="flex-1 border-l border-asphalt-900/10 dark:border-white/10 pl-4 pb-1">
                      <p className="text-sm">
                        <span className="font-medium">{i.potholesReported}</span> potholes reported
                        {i.accidentsReported > 0 && (
                          <>, <span className="font-medium">{i.accidentsReported}</span> accidents reported</>
                        )}
                      </p>
                      {i.note && <p className="text-xs text-asphalt-900/50 dark:text-mist-100/50 mt-1">{i.note}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="font-display font-semibold mb-4 text-sm flex items-center gap-2">
                <Wrench size={16} /> Repair History
              </h3>
              {history.repairs.length === 0 ? (
                <p className="text-sm text-asphalt-900/50 dark:text-mist-100/50">No repairs recorded yet.</p>
              ) : (
                <ul className="space-y-4">
                  {[...history.repairs].sort((a, b) => b.year - a.year).map((r, idx) => (
                    <li key={idx} className="flex gap-4">
                      <div className="w-14 shrink-0 font-mono text-sm font-semibold text-signal-dark dark:text-signal-light">{r.year}</div>
                      <div className="flex-1 border-l border-signal/30 pl-4 pb-1">
                        <p className="text-sm">{r.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { Search, Navigation2, Route as RouteIcon, X } from "lucide-react";
import RoadMap from "../components/map/RoadMap.jsx";
import MapLegend from "../components/map/MapLegend.jsx";
import IssueInfoCard from "../components/map/IssueInfoCard.jsx";
import RoutePlanner from "../components/map/RoutePlanner.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { useRoadIssues } from "../hooks/useRoadIssues.js";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { Radar } from "lucide-react";

export default function MapPage() {
  const { issues, loading, error } = useRoadIssues();
  const { position, status, error: geoError, locate } = useGeolocation();
  const [mapStyle, setMapStyle] = useState("satellite");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [query, setQuery] = useState("");
  const [showPlanner, setShowPlanner] = useState(false);
  const [activeRoutes, setActiveRoutes] = useState([]);

  const filteredIssues = useMemo(() => {
    if (!query.trim()) return issues;
    return issues.filter((i) => i.roadName.toLowerCase().includes(query.toLowerCase()));
  }, [issues, query]);

  const [routeCache, setRouteCache] = useState(null);

  function handleUseRoute(which) {
    if (!routeCache) return;
    if (which === "fastest") {
      setActiveRoutes([{ points: routeCache.fastestPoints, color: "#2F6FED", width: 1.8 }]);
    } else {
      setActiveRoutes([{ points: routeCache.saferPoints, color: "#17B890", width: 1.8 }]);
    }
  }

  if (loading) return <LoadingSpinner full label="Loading road issues…" />;

  if (error) {
    return (
      <EmptyState
        icon={Radar}
        title="Couldn't load the map"
        description={error}
        action={<button onClick={() => window.location.reload()} className="btn-secondary text-sm !py-2 !px-4">Try again</button>}
      />
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem-4.5rem)] lg:h-[calc(100vh-4rem)] -m-5 sm:-m-8 rounded-none overflow-hidden">
      <RoadMap
        issues={filteredIssues}
        selectedIssue={selectedIssue}
        onSelectIssue={setSelectedIssue}
        mapStyle={mapStyle}
        onMapStyleChange={setMapStyle}
        routes={activeRoutes}
        userLocation={position}
      />

      <MapLegend />
      <IssueInfoCard issue={selectedIssue} onClose={() => setSelectedIssue(null)} />

      {/* Search */}
      {!showPlanner && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-[min(92vw,380px)]">
          <div className="glass rounded-full flex items-center gap-2 px-4 py-2.5 shadow-card">
            <Search size={16} className="text-asphalt-900/40 dark:text-mist-100/40 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roads, places, landmarks…"
              className="bg-transparent outline-none text-sm flex-1 min-w-0"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-asphalt-900/40 dark:text-mist-100/40">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {showPlanner && (
        <RoutePlanner
          userLocation={position}
          onClose={() => setShowPlanner(false)}
          onResult={(payload) => {
            if (payload.use) return handleUseRoute(payload.use);
            setRouteCache(payload);
            setActiveRoutes([
              { points: payload.fastestPoints, color: "#2F6FED", width: 1.4, dashed: true },
              { points: payload.saferPoints, color: "#17B890", width: 1.8 },
            ]);
          }}
        />
      )}

      {/* Floating action buttons */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2 items-end">
        <button
          onClick={() => setShowPlanner((s) => !s)}
          className={`w-12 h-12 rounded-full shadow-card flex items-center justify-center transition-colors ${
            showPlanner ? "bg-signal text-white" : "glass text-asphalt-900 dark:text-mist-100"
          }`}
          title="Plan a route"
        >
          <RouteIcon size={19} />
        </button>
        <button
          onClick={locate}
          className="w-12 h-12 rounded-full shadow-card glass flex items-center justify-center text-asphalt-900 dark:text-mist-100"
          title="Locate me"
        >
          <Navigation2 size={19} className={status === "locating" ? "animate-spin" : ""} />
        </button>
      </div>

      {status === "denied" && (
        <div className="absolute bottom-20 right-4 z-10 max-w-[260px] glass rounded-xl px-4 py-3 text-xs">
          {geoError}
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "../../services/googleMaps.js";
import { ISSUE_COLORS } from "../../utils/format.js";
import LoadingSpinner from "../common/LoadingSpinner.jsx";

const MAP_TYPE = { satellite: "satellite", roadmap: "roadmap", hybrid: "hybrid" };

export default function GoogleMapView({
  issues = [],
  selectedIssue,
  onSelectIssue,
  mapStyle = "satellite",
  routes = [],
  userLocation,
  onMapClick,
  pickedLocation,
  center = { lat: 19.076, lng: 72.8777 },
  zoom = 11,
}) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);
  const userMarkerRef = useRef(null);
  const pickedMarkerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Initialize map once
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !ref.current) return;
        mapRef.current = new maps.Map(ref.current, {
          center,
          zoom,
          mapTypeId: MAP_TYPE[mapStyle],
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
        });
        if (onMapClick) {
          mapRef.current.addListener("click", (e) => {
            onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          });
        }
        setReady(true);
      })
      .catch(() => setFailed(true));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map type
  useEffect(() => {
    if (mapRef.current) mapRef.current.setMapTypeId(MAP_TYPE[mapStyle]);
  }, [mapStyle]);

  // Markers
  useEffect(() => {
    if (!ready || !window.google) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = issues.map((issue) => {
      const marker = new window.google.maps.Marker({
        position: { lat: issue.latitude, lng: issue.longitude },
        map: mapRef.current,
        title: issue.roadName,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: ISSUE_COLORS[issue.type]?.hex || "#E13B3B",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
          scale: issue.severity === "High" ? 10 : issue.severity === "Medium" ? 8 : 6,
        },
      });
      marker.addListener("click", () => onSelectIssue?.(issue));
      return marker;
    });
  }, [ready, issues]); // eslint-disable-line react-hooks/exhaustive-deps

  // Routes (polylines)
  useEffect(() => {
    if (!ready || !window.google) return;
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = routes.map(
      (route) =>
        new window.google.maps.Polyline({
          path: route.points.map((p) => ({ lat: p.lat, lng: p.lng })),
          strokeColor: route.color || "#2F6FED",
          strokeWeight: route.width ? route.width * 2 : 4,
          strokeOpacity: route.dashed ? 0 : 0.9,
          icons: route.dashed
            ? [{ icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 }, offset: "0", repeat: "12px" }]
            : undefined,
          map: mapRef.current,
        })
    );
  }, [ready, routes]); // eslint-disable-line react-hooks/exhaustive-deps

  // User location marker
  useEffect(() => {
    if (!ready || !window.google) return;
    userMarkerRef.current?.setMap(null);
    if (userLocation) {
      userMarkerRef.current = new window.google.maps.Marker({
        position: userLocation,
        map: mapRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: "#2F6FED",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
          scale: 8,
        },
      });
      mapRef.current.panTo(userLocation);
    }
  }, [ready, userLocation]);

  // Picked location marker
  useEffect(() => {
    if (!ready || !window.google) return;
    pickedMarkerRef.current?.setMap(null);
    if (pickedLocation) {
      pickedMarkerRef.current = new window.google.maps.Marker({
        position: pickedLocation,
        map: mapRef.current,
      });
    }
  }, [ready, pickedLocation]);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-asphalt-900/50 dark:text-mist-100/50">
        Couldn't load Google Maps. Check your API key and enabled APIs.
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={ref} className="w-full h-full" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-mist-50 dark:bg-asphalt-950">
          <LoadingSpinner label="Loading Google Maps…" />
        </div>
      )}
    </div>
  );
}

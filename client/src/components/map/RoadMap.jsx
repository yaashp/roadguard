import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

const ISSUE_COLORS = {
  Pothole: "#E13B3B",
  Accident: "#FF6B35",
  Construction: "#F5C518",
  Hazard: "#7C5CFC",
  "Resolved Issue": "#17B890"
};

function MapController({ userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.flyTo(
        [userLocation.lat, userLocation.lng],
        14,
        { duration: 1 }
      );
    }
  }, [userLocation, map]);

  return null;
}

export default function RoadMap({
  issues = [],
  selectedIssue,
  onSelectIssue,
  routes = [],
  userLocation,
  onMapClick,
  pickedLocation,
  className = ""
}) {
  const defaultCenter = [19.0760, 72.8777];

  return (
    <div className={`relative w-full h-full ${className}`}>

      <MapContainer
        center={defaultCenter}
        zoom={11}
        zoomControl={true}
        className="w-full h-full"
        style={{ minHeight: "100%" }}
        onClick={(e) => {
          if (onMapClick) {
            onMapClick({
              lat: e.latlng.lat,
              lng: e.latlng.lng
            });
          }
        }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController userLocation={userLocation} />

        {/* Road hazard markers */}
        {issues.map((issue) => {
          const color =
            ISSUE_COLORS[issue.type] || "#E13B3B";

          return (
            <CircleMarker
              key={issue._id}
              center={[
                issue.latitude,
                issue.longitude
              ]}
              radius={
                issue.severity === "High"
                  ? 11
                  : issue.severity === "Medium"
                  ? 9
                  : 7
              }
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: color,
                fillOpacity: 0.9
              }}
              eventHandlers={{
                click: () => {
                  onSelectIssue?.(issue);
                }
              }}
            >
              <Popup>
                <strong>
                  {issue.type || "Road Hazard"}
                </strong>

                <br />

                Severity: {issue.severity || "Unknown"}

                <br />

                {issue.roadName || "Road location"}
              </Popup>
            </CircleMarker>
          );
        })}

        {/* User's current location */}
        {userLocation && (
          <CircleMarker
            center={[
              userLocation.lat,
              userLocation.lng
            ]}
            radius={8}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: "#2F6FED",
              fillOpacity: 1
            }}
          >
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </CircleMarker>
        )}

        {/* Selected location when reporting an issue */}
        {pickedLocation && (
          <CircleMarker
            center={[
              pickedLocation.lat,
              pickedLocation.lng
            ]}
            radius={10}
            pathOptions={{
              color: "#ffffff",
              weight: 3,
              fillColor: "#2F6FED",
              fillOpacity: 1
            }}
          >
            <Popup>
              <strong>Selected Location</strong>
              <br />
              {pickedLocation.lat.toFixed(5)},{" "}
              {pickedLocation.lng.toFixed(5)}
            </Popup>
          </CircleMarker>
        )}

        {/* Routes */}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            positions={route.points.map((point) => [
              point.lat,
              point.lng
            ])}
            pathOptions={{
              color: route.color || "#2F6FED",
              weight: route.width
                ? route.width * 2
                : 5,
              opacity: 0.9,
              dashArray: route.dashed
                ? "10 10"
                : undefined
            }}
          />
        ))}

      </MapContainer>

      {/* OpenStreetMap badge */}
      <div className="absolute top-4 left-4 z-[1000] glass rounded-full px-3 py-1.5 text-[11px] font-medium flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-route" />
        OpenStreetMap
      </div>

    </div>
  );
}
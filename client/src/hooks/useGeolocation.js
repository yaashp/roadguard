import { useCallback, useState } from "react";

export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | locating | success | denied | error
  const [error, setError] = useState("");

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation isn't supported in this browser.");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus("success");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          setError("Location permission was denied. You can still select a location on the map.");
        } else {
          setStatus("error");
          setError("Couldn't determine your location. Please try again or select manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { position, status, error, locate };
}

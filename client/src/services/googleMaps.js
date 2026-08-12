// Lazily loads the Google Maps JavaScript API (Maps, Places, Geometry libraries).
// If no VITE_GOOGLE_MAPS_API_KEY is set, callers should fall back to the
// stylized Demo Map (see components/map/DemoMap.jsx) — this keeps the whole
// product usable without a paid API key while development happens.

let loadPromise = null;

export function hasGoogleMapsKey() {
  return Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
}

export function loadGoogleMaps() {
  if (loadPromise) return loadPromise;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return Promise.reject(new Error("No Google Maps API key configured (VITE_GOOGLE_MAPS_API_KEY)."));
  }

  loadPromise = new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error("Failed to load Google Maps script."));
    document.head.appendChild(script);
  });

  return loadPromise;
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinned, CheckCircle2, Navigation2, AlertCircle } from "lucide-react";
import RoadMap from "../components/map/RoadMap.jsx";
import ImageUpload from "../components/ImageUpload.jsx";
import { useGeolocation } from "../hooks/useGeolocation.js";
import { useToast } from "../context/ToastContext.jsx";
import api from "../services/api.js";

const ISSUE_TYPES = ["Pothole", "Accident", "Road Damage", "Waterlogging", "Road Construction", "Traffic Hazard", "Other"];
const SEVERITIES = ["Low", "Medium", "High"];

export default function ReportIssuePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { position, status, error: geoError, locate } = useGeolocation();

  const [form, setForm] = useState({
    issueType: "Pothole",
    description: "",
    severity: "Medium",
    address: "",
  });
  const [pickedLocation, setPickedLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [submitError, setSubmitError] = useState("");

  function handleUseLocation() {
    locate();
  }

  // Once geolocation resolves, automatically drop the pin there.
  useEffect(() => {
    if (position && status === "success") {
      setPickedLocation(position);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, status]);

  function validate() {
    const e = {};
    if (!form.issueType) e.issueType = "Please select an issue type.";
    if (!pickedLocation) e.location = "Use your current location or select one on the map.";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const formData = new FormData();
      formData.append("issueType", form.issueType);
      formData.append("description", form.description);
      formData.append("severity", form.severity);
      formData.append("address", form.address || `${pickedLocation.lat.toFixed(4)}, ${pickedLocation.lng.toFixed(4)}`);
      formData.append("latitude", pickedLocation.lat);
      formData.append("longitude", pickedLocation.lng);
      if (image) formData.append("image", image);

      const { data } = await api.post("/complaints", formData);
      setSubmitted(data.complaint);
      showToast("Complaint submitted successfully!", "success");
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Couldn't submit your complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <span className="inline-flex w-16 h-16 rounded-full bg-signal/10 text-signal-dark items-center justify-center mb-5">
          <CheckCircle2 size={30} />
        </span>
        <h2 className="font-display font-bold text-2xl mb-2">Complaint submitted successfully!</h2>
        <p className="text-asphalt-900/55 dark:text-mist-100/55 mb-6">
          Your complaint ID is{" "}
          <span className="font-mono font-semibold text-signal-dark dark:text-signal-light">{submitted.complaintId}</span>.
          You can track its progress anytime from My Complaints.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={() => navigate("/complaints")} className="btn-primary">Track this complaint</button>
          <button
            onClick={() => { setSubmitted(null); setForm({ issueType: "Pothole", description: "", severity: "Medium", address: "" }); setPickedLocation(null); setImage(null); }}
            className="btn-secondary"
          >
            Report another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
      {submitError && (
        <div className="flex items-start gap-2 text-sm text-hazard bg-hazard/5 border border-hazard/20 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0" /> {submitError}
        </div>
      )}

      <div className="card p-6">
        <label className="label">Issue Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ISSUE_TYPES.map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setForm({ ...form, issueType: t })}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors text-left ${
                form.issueType === t
                  ? "border-signal bg-signal/10 text-signal-dark dark:text-signal-light"
                  : "border-asphalt-900/10 dark:border-white/10 hover:bg-asphalt-900/5 dark:hover:bg-white/5"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <label className="label">Photograph</label>
        <ImageUpload file={image} onChange={setImage} />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="label !mb-0">Location</label>
          <button type="button" onClick={handleUseLocation} className="text-xs font-medium text-signal-dark dark:text-signal-light flex items-center gap-1.5">
            <Navigation2 size={13} className={status === "locating" ? "animate-spin" : ""} />
            Use My Current Location
          </button>
        </div>

        <div className="h-64 rounded-2xl overflow-hidden relative mb-3">
          <RoadMap
            issues={[]}
            mapStyle="roadmap"
            pickedLocation={pickedLocation || position}
            onMapClick={(loc) => setPickedLocation(loc)}
          />
        </div>

        {position && !pickedLocation && (
          <button
            type="button"
            onClick={() => setPickedLocation(position)}
            className="text-xs text-route font-medium mb-2"
          >
            Drop pin at my current location ({position.lat.toFixed(4)}, {position.lng.toFixed(4)})
          </button>
        )}

        {status === "denied" && <p className="text-xs text-warn-dark mb-2">{geoError}</p>}

        <input
          type="text"
          className="input"
          placeholder="Address or landmark (optional)"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        {pickedLocation && (
          <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45 font-mono mt-2 flex items-center gap-1.5">
            <MapPinned size={12} /> {pickedLocation.lat.toFixed(5)}, {pickedLocation.lng.toFixed(5)}
          </p>
        )}
        {errors.location && <p className="text-xs text-hazard mt-2">{errors.location}</p>}
      </div>

      <div className="card p-6">
        <label className="label">Additional Information</label>
        <textarea
          rows={4}
          className="input resize-none"
          placeholder="Describe the issue…"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div className="card p-6">
        <label className="label">Severity</label>
        <div className="flex gap-2">
          {SEVERITIES.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setForm({ ...form, severity: s })}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                form.severity === s
                  ? s === "High"
                    ? "border-hazard bg-hazard/10 text-hazard"
                    : s === "Medium"
                    ? "border-warn bg-warn/10 text-warn-dark"
                    : "border-signal bg-signal/10 text-signal-dark"
                  : "border-asphalt-900/10 dark:border-white/10 hover:bg-asphalt-900/5 dark:hover:bg-white/5"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
        {submitting ? "Submitting…" : "Submit Complaint"}
      </button>
    </form>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, MapPin } from "lucide-react";
import api from "../services/api.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ComplaintTimeline from "../components/ComplaintTimeline.jsx";
import { SEVERITY_COLORS, formatDate } from "../utils/format.js";

export default function MyComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/complaints/my")
      .then(({ data }) => setComplaints(data.complaints || []))
      .catch(() => setError("Couldn't load your complaints. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner full label="Loading your complaints…" />;

  if (error) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Something went wrong"
        description={error}
        action={<button onClick={() => window.location.reload()} className="btn-secondary text-sm !py-2 !px-4">Retry</button>}
      />
    );
  }

  if (complaints.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="No complaints yet"
        description="Reports you submit will appear here so you can track their progress."
        action={<Link to="/report" className="btn-primary text-sm !py-2 !px-4">Report an issue</Link>}
      />
    );
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {complaints.map((c) => (
        <div key={c._id} className="card p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
            <div className="flex gap-4">
              {c.image ? (
                <img src={c.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-asphalt-900/5 dark:bg-white/5 flex items-center justify-center shrink-0 text-asphalt-900/30 dark:text-mist-100/30">
                  <MapPin size={20} />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-mono text-xs text-signal-dark dark:text-signal-light font-semibold">{c.complaintId}</p>
                <h3 className="font-display font-semibold">{c.issueType}</h3>
                <p className="text-sm text-asphalt-900/55 dark:text-mist-100/55 truncate">{c.address}</p>
                <p className="text-xs text-asphalt-900/40 dark:text-mist-100/40 mt-1">Reported {formatDate(c.createdAt)}</p>
              </div>
            </div>
            <span className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${SEVERITY_COLORS[c.severity]}`}>
              {c.severity} severity
            </span>
          </div>

          {c.description && (
            <p className="text-sm text-asphalt-900/65 dark:text-mist-100/65 mb-5 bg-asphalt-900/[0.03] dark:bg-white/[0.03] rounded-xl px-4 py-3">
              {c.description}
            </p>
          )}

          <ComplaintTimeline status={c.status} />
        </div>
      ))}
    </div>
  );
}

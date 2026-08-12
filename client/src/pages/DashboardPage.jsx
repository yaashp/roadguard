import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, CheckCircle2, Clock, ShieldCheck, ArrowRight, MapPinned } from "lucide-react";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatCard from "../components/StatCard.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { STATUS_COLORS, SEVERITY_COLORS, timeAgo } from "../utils/format.js";

export default function DashboardPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/complaints/my")
      .then(({ data }) => setComplaints(data.complaints || []))
      .catch(() => setError("Couldn't load your reports right now."))
      .finally(() => setLoading(false));
  }, []);

  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const pending = complaints.filter((c) => c.status !== "Resolved").length;
  const safetyScore = 82;

  if (loading) return <LoadingSpinner full label="Loading your dashboard…" />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl">Welcome back, {user?.name?.split(" ")[0]} 👋</h2>
          <p className="text-sm text-asphalt-900/55 dark:text-mist-100/55">Here's what's happening on your roads.</p>
        </div>
        <Link to="/report" className="btn-primary !py-2.5 !px-5 text-sm shrink-0">
          Report an issue
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ListChecks} label="My Reports" value={complaints.length} tone="route" />
        <StatCard icon={CheckCircle2} label="Resolved" value={resolved} tone="signal" />
        <StatCard icon={Clock} label="Pending" value={pending} tone="warn" />
        <StatCard icon={ShieldCheck} label="Road Safety Score" value={safetyScore} suffix="% Safe" tone="signal" />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold">Recent reports</h3>
          <Link to="/complaints" className="text-sm text-signal-dark dark:text-signal-light font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {error && <p className="text-sm text-hazard mb-4">{error}</p>}

        {complaints.length === 0 ? (
          <EmptyState
            icon={MapPinned}
            title="No reports yet"
            description="Once you report a pothole or hazard, it'll show up here with live status updates."
            action={
              <Link to="/report" className="btn-primary !py-2 !px-4 text-sm">
                Report your first issue
              </Link>
            }
          />
        ) : (
          <div className="space-y-2">
            {complaints.slice(0, 5).map((c) => (
              <Link
                to="/complaints"
                key={c._id}
                className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl hover:bg-asphalt-900/5 dark:hover:bg-white/5 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.issueType} — {c.address}</p>
                  <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45 font-mono mt-0.5">
                    {c.complaintId} · {timeAgo(c.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_COLORS[c.severity]}`}>{c.severity}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>{c.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

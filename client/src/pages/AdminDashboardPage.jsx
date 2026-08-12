import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, CheckCircle2, Clock3, Filter, MapPin,
  RefreshCw, Search, ShieldCheck, SlidersHorizontal, X, ChevronRight
} from "lucide-react";
import api from "../services/api.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { SEVERITY_COLORS, STATUS_COLORS, formatDate } from "../utils/format.js";

const STATUS_OPTIONS = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved"];
const SEVERITY_OPTIONS = ["All", "High", "Medium", "Low"];

const STATUS_PROGRESS = {
  Submitted: 10,
  "Under Review": 30,
  Assigned: 50,
  "In Progress": 75,
  Resolved: 100,
};

const STATUS_META = {
  Submitted: "New report",
  "Under Review": "Being verified",
  Assigned: "Team assigned",
  "In Progress": "Work underway",
  Resolved: "Marked complete",
};

function Progress({ status }) {
  const value = STATUS_PROGRESS[status] ?? 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-asphalt-900/45 dark:text-mist-100/45">
        <span>Fulfillment</span><span>{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-asphalt-900/[0.08] dark:bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-signal transition-all duration-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLORS[status] || ""}`}>
      {status}
    </span>
  );
}

function ComplaintCard({ complaint, onOpen }) {
  return (
    <button onClick={() => onOpen(complaint)} className="liquid-glass w-full text-left p-4 rounded-[24px] hover:scale-[1.005] transition-transform">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-semibold text-signal-dark dark:text-signal-light">{complaint.complaintId}</p>
          <h3 className="font-display font-semibold mt-1">{complaint.issueType}</h3>
        </div>
        <StatusPill status={complaint.status} />
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-asphalt-900/55 dark:text-mist-100/55">
        <MapPin size={13} /> <span className="truncate">{complaint.address || "Location not provided"}</span>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${SEVERITY_COLORS[complaint.severity]}`}>{complaint.severity}</span>
        <span className="text-[11px] text-asphalt-900/45 dark:text-mist-100/45">{formatDate(complaint.createdAt)}</span>
      </div>
      <div className="mt-4"><Progress status={complaint.status} /></div>
      <div className="flex items-center justify-end mt-3 text-xs font-semibold text-signal-dark dark:text-signal-light">
        Manage <ChevronRight size={14} />
      </div>
    </button>
  );
}

export default function AdminDashboardPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [mobileFilters, setMobileFilters] = useState(false);

  const load = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);
    setError("");
    try {
      const { data } = await api.get("/complaints/all");
      setComplaints(data.complaints || []);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load complaints. Admin access is required.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  async function changeStatus(id, status) {
    setUpdating(id);
    try {
      const { data } = await api.put(`/complaints/${id}`, { status });
      const updated = data.complaint;
      setComplaints((list) => list.map((c) => (c._id === id ? { ...c, ...updated } : c)));
      setSelected((current) => current?._id === id ? { ...current, ...updated } : current);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update complaint status.");
    } finally {
      setUpdating(null);
    }
  }

  const stats = useMemo(() => ({
    total: complaints.length,
    pending: complaints.filter((c) => c.status !== "Resolved").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
    high: complaints.filter((c) => c.severity === "High").length,
  }), [complaints]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return complaints.filter((c) => {
      const matchesQuery = !q || [c.complaintId, c.issueType, c.address, c.description, c.reporter?.name, c.reporter?.email]
        .filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const matchesSeverity = severityFilter === "All" || c.severity === severityFilter;
      return matchesQuery && matchesStatus && matchesSeverity;
    });
  }, [complaints, query, statusFilter, severityFilter]);

  if (loading) return <LoadingSpinner full label="Loading admin workspace…" />;
  if (error && !complaints.length) {
    return <div className="liquid-glass rounded-[28px] p-6 text-sm text-hazard">{error}</div>;
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="liquid-glass rounded-[30px] p-5 sm:p-7 overflow-hidden relative">
        <div className="absolute -right-16 -top-20 w-48 h-48 rounded-full bg-signal/15 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-bold text-signal-dark dark:text-signal-light mb-2">
              <ShieldCheck size={14} /> Operations control
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight">Complaint fulfillment</h2>
            <p className="text-sm text-asphalt-900/55 dark:text-mist-100/55 mt-1 max-w-2xl">
              Review every citizen report, assign its current stage and keep unresolved road issues moving toward completion.
            </p>
          </div>
          <button onClick={() => load(false)} disabled={refreshing} className="btn-secondary self-start md:self-auto">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </section>

      {error && <div className="rounded-2xl bg-hazard/10 border border-hazard/20 px-4 py-3 text-xs text-hazard">{error}</div>}

      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          [ShieldCheck, "Total reports", stats.total, "text-route"],
          [Clock3, "Needs action", stats.pending, "text-warn"],
          [Activity, "In progress", stats.inProgress, "text-route"],
          [CheckCircle2, "Resolved", stats.resolved, "text-signal-dark"],
          [AlertTriangle, "High severity", stats.high, "text-hazard"],
        ].map(([Icon, label, value, tone]) => (
          <div key={label} className="liquid-glass rounded-[22px] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <Icon size={18} className={tone} />
              <span className="font-display text-2xl font-semibold">{value}</span>
            </div>
            <p className="text-[11px] font-medium text-asphalt-900/50 dark:text-mist-100/50 mt-2">{label}</p>
          </div>
        ))}
      </section>

      <section className="liquid-glass rounded-[28px] p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-asphalt-900/40 dark:text-mist-100/40" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search complaint ID, issue, road or reporter…" className="input pl-10 bg-white/50 dark:bg-white/5 border-white/30 dark:border-white/10" />
          </div>
          <div className="hidden sm:flex gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-auto min-w-[150px] bg-white/50 dark:bg-white/5">
              <option value="All">All statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="input w-auto min-w-[130px] bg-white/50 dark:bg-white/5">
              {SEVERITY_OPTIONS.map((s) => <option key={s}>{s === "All" ? "All severity" : s}</option>)}
            </select>
          </div>
          <button onClick={() => setMobileFilters((v) => !v)} className="sm:hidden btn-secondary !py-2.5">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
        {mobileFilters && (
          <div className="sm:hidden grid grid-cols-2 gap-2 mt-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input bg-white/50 dark:bg-white/5">
              <option value="All">All statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="input bg-white/50 dark:bg-white/5">
              {SEVERITY_OPTIONS.map((s) => <option key={s}>{s === "All" ? "All severity" : s}</option>)}
            </select>
          </div>
        )}
        <div className="flex items-center justify-between px-1 pt-3 text-[11px] text-asphalt-900/45 dark:text-mist-100/45">
          <span>{filtered.length} of {complaints.length} reports</span>
          {(query || statusFilter !== "All" || severityFilter !== "All") && (
            <button onClick={() => { setQuery(""); setStatusFilter("All"); setSeverityFilter("All"); }} className="font-semibold text-signal-dark dark:text-signal-light">Clear filters</button>
          )}
        </div>
      </section>

      <section className="hidden md:block liquid-glass rounded-[28px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.12em] text-asphalt-900/45 dark:text-mist-100/45 border-b border-white/30 dark:border-white/10">
                <th className="px-5 py-4">Complaint</th>
                <th className="px-5 py-4">Issue / location</th>
                <th className="px-5 py-4">Severity</th>
                <th className="px-5 py-4 min-w-[150px]">Fulfillment</th>
                <th className="px-5 py-4">Updated</th>
                <th className="px-5 py-4">Stage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} onClick={() => setSelected(c)} className="border-b border-white/20 dark:border-white/5 last:border-0 hover:bg-white/25 dark:hover:bg-white/5 cursor-pointer transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-mono text-xs font-semibold text-signal-dark dark:text-signal-light">{c.complaintId}</p>
                    <p className="text-[11px] mt-1 text-asphalt-900/45 dark:text-mist-100/45">{c.reporter?.name || "Citizen report"}</p>
                  </td>
                  <td className="px-5 py-4 max-w-[280px]">
                    <p className="font-medium">{c.issueType}</p>
                    <p className="text-xs text-asphalt-900/50 dark:text-mist-100/50 truncate mt-1">{c.address || "Location not provided"}</p>
                  </td>
                  <td className="px-5 py-4"><span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${SEVERITY_COLORS[c.severity]}`}>{c.severity}</span></td>
                  <td className="px-5 py-4"><Progress status={c.status} /></td>
                  <td className="px-5 py-4 text-xs text-asphalt-900/50 dark:text-mist-100/50">{formatDate(c.updatedAt)}</td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <select value={c.status} disabled={updating === c._id} onChange={(e) => changeStatus(c._id, e.target.value)} className={`text-[11px] font-semibold rounded-full px-2.5 py-1.5 border-0 outline-none cursor-pointer ${STATUS_COLORS[c.status]}`}>
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <div className="p-10 text-center text-sm text-asphalt-900/50 dark:text-mist-100/50">No complaints match the current filters.</div>}
        </div>
      </section>

      <section className="md:hidden space-y-3">
        {filtered.map((c) => <ComplaintCard key={c._id} complaint={c} onOpen={setSelected} />)}
        {!filtered.length && <div className="liquid-glass rounded-[24px] p-10 text-center text-sm text-asphalt-900/50 dark:text-mist-100/50">No complaints match the current filters.</div>}
      </section>

      {selected && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-5">
          <div className="absolute inset-0 bg-asphalt-950/45 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <aside className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto liquid-glass rounded-t-[30px] sm:rounded-[30px] p-5 sm:p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-signal-dark dark:text-signal-light">{selected.complaintId}</p>
                <h3 className="font-display text-xl font-semibold mt-1">{selected.issueType}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-full bg-white/40 dark:bg-white/10 flex items-center justify-center"><X size={17} /></button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="glass rounded-2xl p-3"><p className="label">Severity</p><span className={`text-xs px-2 py-1 rounded-full font-semibold ${SEVERITY_COLORS[selected.severity]}`}>{selected.severity}</span></div>
              <div className="glass rounded-2xl p-3"><p className="label">Reported</p><p className="text-xs font-medium">{formatDate(selected.createdAt)}</p></div>
            </div>

            <div className="mt-4 glass rounded-2xl p-4">
              <p className="label">Location</p>
              <p className="text-sm flex gap-2"><MapPin size={16} className="text-signal shrink-0 mt-0.5" /> {selected.address || `${selected.latitude}, ${selected.longitude}`}</p>
            </div>

            {selected.description && <div className="mt-4 glass rounded-2xl p-4"><p className="label">Citizen description</p><p className="text-sm leading-6">{selected.description}</p></div>}

            <div className="mt-4 glass rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div><p className="label mb-1">Fulfillment stage</p><p className="text-sm font-semibold">{STATUS_META[selected.status]}</p></div>
                <StatusPill status={selected.status} />
              </div>
              <Progress status={selected.status} />
              <div className="grid grid-cols-5 gap-1 mt-4">
                {STATUS_OPTIONS.map((s) => <div key={s} className={`h-1.5 rounded-full ${STATUS_PROGRESS[selected.status] >= STATUS_PROGRESS[s] ? "bg-signal" : "bg-asphalt-900/10 dark:bg-white/10"}`} />)}
              </div>
              <label className="label mt-5">Update stage</label>
              <select value={selected.status} disabled={updating === selected._id} onChange={(e) => changeStatus(selected._id, e.target.value)} className="input bg-white/50 dark:bg-white/5">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <p className="text-[11px] text-asphalt-900/45 dark:text-mist-100/45 mt-2">Last updated {formatDate(selected.updatedAt)}. Changes are visible to the citizen in their complaint tracker.</p>
            </div>

            {selected.image && (
              <img src={selected.image} alt="Complaint evidence" className="mt-4 w-full max-h-72 object-cover rounded-2xl border border-white/30 dark:border-white/10" />
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

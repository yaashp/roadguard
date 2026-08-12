import { X, MapPin as PinIcon, Flag } from "lucide-react";
import { ISSUE_COLORS, SEVERITY_COLORS, STATUS_COLORS, timeAgo } from "../../utils/format.js";

export default function IssueInfoCard({ issue, onClose }) {
  if (!issue) return null;
  const label = issue.type === "Resolved" ? "Resolved Issue" : `${issue.type} Detected`;

  return (
    <div className="absolute top-4 right-4 z-20 w-80 max-w-[calc(100vw-2rem)] card p-4 animate-[float_0.25s_ease-out]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${ISSUE_COLORS[issue.type]?.dot}`} />
          <h3 className="font-display font-semibold text-sm">{label}</h3>
        </div>
        <button onClick={onClose} className="text-asphalt-900/40 dark:text-mist-100/40 hover:text-asphalt-900 dark:hover:text-mist-100">
          <X size={16} />
        </button>
      </div>

      <div className="flex items-start gap-2 text-sm mb-3">
        <PinIcon size={15} className="mt-0.5 text-asphalt-900/40 dark:text-mist-100/40 shrink-0" />
        <span>{issue.roadName}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45 mb-0.5">Severity</p>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[issue.severity]}`}>
            {issue.severity}
          </span>
        </div>
        <div>
          <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45 mb-0.5">Status</p>
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[issue.status]}`}>
            {issue.status}
          </span>
        </div>
        <div>
          <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45 mb-0.5">Reported</p>
          <p className="font-mono text-xs">{timeAgo(issue.reportedAt)}</p>
        </div>
        <div>
          <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45 mb-0.5 flex items-center gap-1">
            <Flag size={11} /> Reports
          </p>
          <p className="font-mono text-xs">{issue.reportCount}</p>
        </div>
      </div>

      {issue.image ? (
        <img src={issue.image} alt="" className="w-full h-32 object-cover rounded-xl" />
      ) : (
        <div className="w-full h-20 rounded-xl bg-asphalt-900/5 dark:bg-white/5 flex items-center justify-center text-xs text-asphalt-900/35 dark:text-mist-100/35">
          No photo submitted
        </div>
      )}
    </div>
  );
}

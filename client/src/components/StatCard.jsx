export default function StatCard({ icon: Icon, label, value, tone = "default", suffix = "" }) {
  const toneCls = {
    default: "bg-asphalt-900/5 dark:bg-white/5 text-asphalt-900 dark:text-mist-100",
    signal: "bg-signal/10 text-signal-dark dark:text-signal-light",
    hazard: "bg-hazard/10 text-hazard",
    warn: "bg-warn/10 text-warn-dark",
    route: "bg-route/10 text-route",
  }[tone];

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${toneCls}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-display font-bold leading-none">
          {value}
          {suffix}
        </p>
        <p className="text-xs text-asphalt-900/50 dark:text-mist-100/50 mt-1.5">{label}</p>
      </div>
    </div>
  );
}

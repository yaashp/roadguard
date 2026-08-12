export default function LoadingSpinner({ label = "Loading…", full = false }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${full ? "min-h-[60vh]" : "py-12"}`}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-signal/20" />
        <div className="absolute inset-0 rounded-full border-2 border-signal border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-asphalt-900/50 dark:text-mist-100/50">{label}</p>
    </div>
  );
}

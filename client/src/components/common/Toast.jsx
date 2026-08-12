import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

const STYLES = {
  success: { icon: CheckCircle2, cls: "border-signal/30 text-signal-dark bg-signal/5" },
  warning: { icon: AlertTriangle, cls: "border-warn/30 text-warn-dark bg-warn/5" },
  error: { icon: XCircle, cls: "border-hazard/30 text-hazard bg-hazard/5" },
};

export default function Toast({ toast, onClose }) {
  const { icon: Icon, cls } = STYLES[toast.type] || STYLES.success;

  useEffect(() => {
    const t = setTimeout(() => onClose(toast.id), 5000);
    return () => clearTimeout(t);
  }, [toast.id, onClose]);

  return (
    <div className={`glass border ${cls} rounded-xl shadow-card px-4 py-3 flex items-start gap-3 w-80 animate-[float_0.3s_ease-out]`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <p className="text-sm flex-1 text-asphalt-900 dark:text-mist-100">{toast.message}</p>
      <button onClick={() => onClose(toast.id)} className="text-asphalt-900/40 dark:text-mist-100/40 hover:text-asphalt-900 dark:hover:text-mist-100">
        <X size={16} />
      </button>
    </div>
  );
}

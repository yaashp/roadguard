import { Check } from "lucide-react";

const STEPS = ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved"];

export default function ComplaintTimeline({ status }) {
  const currentIdx = STEPS.indexOf(status);

  return (
    <div className="flex items-start w-full overflow-x-auto py-2">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const current = idx === currentIdx;
        return (
          <div key={step} className="flex items-center flex-1 min-w-[90px] last:flex-none">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                  done
                    ? "bg-signal text-white"
                    : current
                    ? "bg-signal/15 text-signal-dark ring-2 ring-signal"
                    : "bg-asphalt-900/8 dark:bg-white/8 text-asphalt-900/35 dark:text-mist-100/35"
                }`}
              >
                {done ? <Check size={13} /> : idx + 1}
              </div>
              <span
                className={`text-[11px] text-center whitespace-nowrap ${
                  current ? "font-semibold text-signal-dark dark:text-signal-light" : "text-asphalt-900/50 dark:text-mist-100/50"
                }`}
              >
                {step}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mb-5 rounded-full ${done ? "bg-signal" : "bg-asphalt-900/8 dark:bg-white/8"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

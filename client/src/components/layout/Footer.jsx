import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-asphalt-900/5 dark:border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-display font-semibold">
          <span className="w-7 h-7 rounded-lg bg-signal text-white flex items-center justify-center">
            <ShieldCheck size={15} />
          </span>
          RoadGuard
        </div>
        <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45">
          Built for safer streets — a smart-city road safety demo platform.
        </p>
      </div>
    </footer>
  );
}

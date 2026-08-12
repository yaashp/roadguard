import ThemeToggle from "../ThemeToggle.jsx";
import NotificationBell from "../NotificationBell.jsx";
import { ShieldCheck } from "lucide-react";

export default function TopBar({ title, subtitle }) {
  return (
    <header className="sticky top-0 z-30 glass border-b border-asphalt-900/5 dark:border-white/5 px-5 sm:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 lg:hidden font-display font-bold">
        <span className="w-7 h-7 rounded-lg bg-signal text-white flex items-center justify-center">
          <ShieldCheck size={14} />
        </span>
      </div>
      <div className="hidden lg:block">
        <h1 className="font-display font-semibold text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <NotificationBell />
        <ThemeToggle />
      </div>
    </header>
  );
}

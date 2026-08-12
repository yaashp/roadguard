import { useState } from "react";
import { Sun, Moon, Bell, MapPinned } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifs, setNotifs] = useState(true);
  const [autoLocate, setAutoLocate] = useState(true);

  return (
    <div className="max-w-xl space-y-4">
      <div className="card p-6">
        <h3 className="font-display font-semibold mb-4 text-sm">Appearance</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-2 justify-center px-4 py-3 rounded-xl border text-sm font-medium ${
              theme === "light" ? "border-signal bg-signal/10 text-signal-dark" : "border-asphalt-900/10 dark:border-white/10"
            }`}
          >
            <Sun size={16} /> Light Mode
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-2 justify-center px-4 py-3 rounded-xl border text-sm font-medium ${
              theme === "dark" ? "border-signal bg-signal/10 text-signal-dark dark:text-signal-light" : "border-asphalt-900/10 dark:border-white/10"
            }`}
          >
            <Moon size={16} /> Dark Mode
          </button>
        </div>
      </div>

      <div className="card p-6 space-y-1">
        <h3 className="font-display font-semibold mb-3 text-sm">Preferences</h3>
        <ToggleRow icon={Bell} label="Push notifications" desc="Get notified about complaint status changes" value={notifs} onChange={setNotifs} />
        <ToggleRow icon={MapPinned} label="Auto-detect location" desc="Automatically use GPS when reporting issues" value={autoLocate} onChange={setAutoLocate} />
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-asphalt-900/45 dark:text-mist-100/45" />
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => onChange((v) => !v)}
        className={`w-12 h-7 rounded-full flex items-center px-1 transition-colors ${value ? "bg-signal" : "bg-asphalt-900/15 dark:bg-white/15"}`}
      >
        <span className={`w-5 h-5 rounded-full bg-white shadow-soft transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

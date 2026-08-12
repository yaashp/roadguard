import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative w-16 h-9 rounded-full flex items-center px-1 transition-colors duration-300 ${
        isDark ? "bg-asphalt-700" : "bg-mist-200"
      } ${className}`}
    >
      <span
        className={`absolute w-7 h-7 rounded-full bg-white dark:bg-asphalt-900 shadow-soft flex items-center justify-center transition-transform duration-300 ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? <Moon size={14} className="text-signal-light" /> : <Sun size={14} className="text-warn" />}
      </span>
    </button>
  );
}

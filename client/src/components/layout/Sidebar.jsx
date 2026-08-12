import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Map, FilePlus2, ListChecks, History, Route,
  User, Settings, LogOut, ShieldCheck, ClipboardCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/map", label: "Live Map", icon: Map },
  { to: "/report", label: "Report Issue", icon: FilePlus2 },
  { to: "/complaints", label: "My Complaints", icon: ListChecks },
  { to: "/road-history", label: "Road History", icon: History },
  { to: "/saved-routes", label: "Saved Routes", icon: Route },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { logout, user } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 liquid-sidebar">
      <div className="h-16 flex items-center gap-2 px-6 font-display font-bold text-lg border-b border-white/30 dark:border-white/10">
        <span className="w-8 h-8 rounded-xl bg-signal text-white flex items-center justify-center shadow-glow">
          <ShieldCheck size={18} />
        </span>
        RoadGuard
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-signal/12 text-signal-dark dark:text-signal-light shadow-sm"
                : "text-asphalt-900/65 dark:text-mist-100/65 hover:bg-white/35 dark:hover:bg-white/5"
            }`
          }>
            <Icon size={18} /> {label}
          </NavLink>
        ))}

        {user?.role === "admin" && (
          <div className="pt-4 mt-4 border-t border-white/25 dark:border-white/10">
            <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.16em] font-bold text-asphalt-900/35 dark:text-mist-100/35">Administration</p>
            <NavLink to="/admin" className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive ? "bg-violet/10 text-violet" : "text-asphalt-900/65 dark:text-mist-100/65 hover:bg-white/35 dark:hover:bg-white/5"
              }`
            }>
              <ClipboardCheck size={18} /> Complaint Control
            </NavLink>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-white/25 dark:border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-signal/15 text-signal-dark flex items-center justify-center font-display font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-asphalt-900/45 dark:text-mist-100/45 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-hazard hover:bg-hazard/5 transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}

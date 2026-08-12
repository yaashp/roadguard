import { NavLink } from "react-router-dom";
import { History, Route, User, Settings, LogOut, X, ClipboardCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function MobileMoreSheet({ open, onClose }) {
  const { logout, user } = useAuth();
  if (!open) return null;

  const items = [
    { to: "/road-history", label: "Road History", icon: History },
    { to: "/saved-routes", label: "Saved Routes", icon: Route },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/settings", label: "Settings", icon: Settings },
    ...(user?.role === "admin" ? [{ to: "/admin", label: "Complaint Control", icon: ClipboardCheck }] : []),
  ];

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div className="absolute inset-0 bg-asphalt-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 inset-x-0 liquid-glass rounded-t-[30px] p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold">More</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/40 dark:bg-white/10 flex items-center justify-center"><X size={16} /></button>
        </div>
        <div className="space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium hover:bg-white/30 dark:hover:bg-white/5">
              <Icon size={18} /> {label}
            </NavLink>
          ))}
          <button onClick={() => { onClose(); logout(); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-hazard hover:bg-hazard/5">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShieldCheck, Menu, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

const links = [
  { to: "/#how-it-works", label: "How it works" },
  { to: "/#features", label: "Features" },
  { to: "/map", label: "Explore map" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass border-b border-asphalt-900/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="w-8 h-8 rounded-xl bg-signal text-white flex items-center justify-center">
            <ShieldCheck size={18} />
          </span>
          RoadGuard
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="text-asphalt-900/70 dark:text-mist-100/70 hover:text-signal transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <button onClick={() => navigate("/dashboard")} className="btn-primary !py-2.5 !px-5 text-sm">
              Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !py-2.5 !px-5 text-sm">Log in</Link>
              <Link to="/register" className="btn-primary !py-2.5 !px-5 text-sm">Get started</Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-asphalt-900/5 dark:border-white/5 px-5 py-4 space-y-3 bg-mist-50 dark:bg-asphalt-950">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="block text-sm font-medium py-1" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="flex items-center justify-between pt-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <button onClick={() => navigate("/dashboard")} className="btn-primary !py-2 !px-4 text-sm">Dashboard</button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary !py-2 !px-4 text-sm">Log in</Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

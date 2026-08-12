import { NavLink } from "react-router-dom";
import { LayoutDashboard, Map, FilePlus2, ListChecks, Menu } from "lucide-react";
import { useState } from "react";
import MobileMoreSheet from "./MobileMoreSheet.jsx";

const items = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard, end: true },
  { to: "/map", label: "Map", icon: Map },
  { to: "/report", label: "Report", icon: FilePlus2 },
  { to: "/complaints", label: "Complaints", icon: ListChecks },
];

export default function MobileNav() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-asphalt-900/10 dark:border-white/10 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  isActive ? "text-signal" : "text-asphalt-900/50 dark:text-mist-100/50"
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-asphalt-900/50 dark:text-mist-100/50"
          >
            <Menu size={20} />
            More
          </button>
        </div>
      </nav>
      <MobileMoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}

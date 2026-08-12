import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../context/NotificationContext.jsx";

export default function NotificationBell() {
  const { notifications, markAllRead, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) markAllRead();
        }}
        aria-label="Notifications"
        className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-asphalt-900/5 dark:hover:bg-white/5 transition-colors"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-hazard" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 card p-2 z-50 max-h-96 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-asphalt-900/40 dark:text-mist-100/40">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <p className="px-3 py-6 text-sm text-center text-asphalt-900/50 dark:text-mist-100/50">
              You're all caught up.
            </p>
          ) : (
            <ul className="space-y-1">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`px-3 py-2.5 rounded-xl text-sm ${
                    n.read ? "" : "bg-signal/5"
                  } hover:bg-asphalt-900/5 dark:hover:bg-white/5 transition-colors`}
                >
                  <p className="text-asphalt-900 dark:text-mist-100">{n.message}</p>
                  <p className="text-xs text-asphalt-900/40 dark:text-mist-100/40 mt-1">{n.time}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

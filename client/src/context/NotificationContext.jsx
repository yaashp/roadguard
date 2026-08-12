import { createContext, useContext, useState } from "react";

const NotificationContext = createContext(null);

const initialNotifications = [
  {
    id: "n1",
    message: "Your complaint RG-2026-00417 moved to In Progress.",
    time: "2h ago",
    read: false,
  },
  {
    id: "n2",
    message: "Hazard detected on your selected route near Vashi Bridge.",
    time: "5h ago",
    read: false,
  },
  {
    id: "n3",
    message: "Your reported pothole on Palm Beach Road was marked Resolved.",
    time: "1d ago",
    read: true,
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => setNotifications((list) => list.map((n) => ({ ...n, read: true })));

  const pushNotification = (message) =>
    setNotifications((list) => [{ id: `n_${Date.now()}`, message, time: "just now", read: false }, ...list]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, markAllRead, pushNotification, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}

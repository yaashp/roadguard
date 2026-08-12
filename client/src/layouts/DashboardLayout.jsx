import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import MobileNav from "../components/layout/MobileNav.jsx";

const TITLES = {
  "/dashboard": ["Dashboard", "Your road safety overview"],
  "/map": ["Live Map", "Real-time hazards across your city"],
  "/report": ["Report an Issue", "Help make your roads safer"],
  "/complaints": ["My Complaints", "Track the status of what you've reported"],
  "/road-history": ["Road History", "Condition and repair history by road"],
  "/saved-routes": ["Saved Routes", "Your frequently used safe routes"],
  "/profile": ["Profile", "Manage your account details"],
  "/settings": ["Settings", "Preferences and app behaviour"],
  "/admin": ["Admin Dashboard", "City-wide issue oversight"],
};

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const [title, subtitle] = TITLES[pathname] || ["RoadGuard", ""];

  return (
    <div className="min-h-screen flex bg-mist-50 dark:bg-asphalt-950">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 p-5 sm:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

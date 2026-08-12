import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ReportIssuePage from "./pages/ReportIssuePage.jsx";
import MyComplaintsPage from "./pages/MyComplaintsPage.jsx";
import RoadHistoryPage from "./pages/RoadHistoryPage.jsx";
import SavedRoutesPage from "./pages/SavedRoutesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public site (landing, auth) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Live map is browsable without logging in, but still inside the app shell */}
      <Route
        path="/map"
        element={
          <DashboardLayout />
        }
      >
        <Route index element={<MapPage />} />
      </Route>

      {/* Authenticated app */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/report" element={<ReportIssuePage />} />
        <Route path="/complaints" element={<MyComplaintsPage />} />
        <Route path="/road-history" element={<RoadHistoryPage />} />
        <Route path="/saved-routes" element={<SavedRoutesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Admin */}
      <Route
        element={
          <ProtectedRoute adminOnly>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

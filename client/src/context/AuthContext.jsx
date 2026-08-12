import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("roadguard-token"));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem("roadguard-token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    setAuthError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("roadguard-token", data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Unable to log in. Please try again.";
      setAuthError(message);
      return { success: false, message };
    }
  };

  const register = async (payload) => {
    setAuthError("");
    try {
      const { data } = await api.post("/auth/register", payload);
      localStorage.setItem("roadguard-token", data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Unable to create your account. Please try again.";
      setAuthError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("roadguard-token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, authError, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

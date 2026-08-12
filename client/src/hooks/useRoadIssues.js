import { useEffect, useState, useCallback } from "react";
import api from "../services/api.js";

export function useRoadIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/road-issues");
      setIssues(data.issues || []);
    } catch (err) {
      setError("Couldn't load road issues right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { issues, loading, error, refresh };
}

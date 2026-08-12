import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    const res = await login(form.email, form.password);
    setSubmitting(false);
    if (res.success) {
      showToast("Welcome back!", "success");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } else {
      setError(res.message);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-flex w-12 h-12 rounded-2xl bg-signal text-white items-center justify-center mb-4">
            <ShieldCheck size={22} />
          </span>
          <h1 className="font-display font-bold text-2xl">Welcome back</h1>
          <p className="text-sm text-asphalt-900/55 dark:text-mist-100/55 mt-1">Log in to your RoadGuard account</p>
        </div>

        <div className="card p-6 sm:p-8">
          {error && (
            <div className="flex items-start gap-2 text-sm text-hazard bg-hazard/5 border border-hazard/20 rounded-xl px-3 py-2.5 mb-5">
              <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-asphalt-900/35 dark:text-mist-100/35" />
                <input
                  type="email"
                  className="input pl-11"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label !mb-0">Password</label>
                <Link to="#" className="text-xs font-medium text-signal-dark dark:text-signal-light hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-asphalt-900/35 dark:text-mist-100/35" />
                <input
                  type={showPw ? "text" : "password"}
                  className="input pl-11 pr-11"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-asphalt-900/35 dark:text-mist-100/35">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full mt-2 disabled:opacity-60">
              {submitting ? "Logging in…" : "Login"}
            </button>

            <button type="button" className="btn-secondary w-full">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.4 3.58v3h3.86c2.26-2.09 3.57-5.17 3.57-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.3v3.09C3.27 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28V6.63H1.3A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.3 5.37l3.97-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.27 2.7 1.3 6.63l3.97 3.09C6.22 6.86 8.87 4.75 12 4.75z"/></svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-sm text-asphalt-900/55 dark:text-mist-100/55 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-signal-dark dark:text-signal-light font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-asphalt-900/40 dark:text-mist-100/40 mt-5 font-mono">
          Demo login: demo@roadguard.app / password123
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.phone && !/^\d{7,15}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid phone number.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSubmitting(true);
    const res = await register(form);
    setSubmitting(false);
    if (res.success) {
      showToast("Account created — welcome to RoadGuard!", "success");
      navigate("/dashboard", { replace: true });
    } else {
      setErrors({ form: res.message });
    }
  }

  const field = (name, label, Icon, type = "text", placeholder = "") => (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-asphalt-900/35 dark:text-mist-100/35" />
        <input
          type={type}
          className={`input pl-11 ${errors[name] ? "!border-hazard focus:!ring-hazard/40" : ""}`}
          placeholder={placeholder}
          value={form[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        />
      </div>
      {errors[name] && <p className="text-xs text-hazard mt-1.5">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-flex w-12 h-12 rounded-2xl bg-signal text-white items-center justify-center mb-4">
            <ShieldCheck size={22} />
          </span>
          <h1 className="font-display font-bold text-2xl">Create your account</h1>
          <p className="text-sm text-asphalt-900/55 dark:text-mist-100/55 mt-1">Join RoadGuard and start reporting hazards</p>
        </div>

        <div className="card p-6 sm:p-8">
          {errors.form && (
            <div className="flex items-start gap-2 text-sm text-hazard bg-hazard/5 border border-hazard/20 rounded-xl px-3 py-2.5 mb-5">
              <AlertCircle size={15} className="mt-0.5 shrink-0" /> {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {field("name", "Full Name", User, "text", "Aarav Sharma")}
            {field("email", "Email", Mail, "email", "you@example.com")}
            {field("phone", "Phone Number", Phone, "tel", "9876543210")}

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-asphalt-900/35 dark:text-mist-100/35" />
                <input
                  type={showPw ? "text" : "password"}
                  className={`input pl-11 pr-11 ${errors.password ? "!border-hazard focus:!ring-hazard/40" : ""}`}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-asphalt-900/35 dark:text-mist-100/35">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-hazard mt-1.5">{errors.password}</p>}
            </div>

            {field("confirmPassword", "Confirm Password", Lock, "password", "Re-enter your password")}

            <button type="submit" disabled={submitting} className="btn-primary w-full mt-2 disabled:opacity-60">
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-asphalt-900/55 dark:text-mist-100/55 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-signal-dark dark:text-signal-light font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

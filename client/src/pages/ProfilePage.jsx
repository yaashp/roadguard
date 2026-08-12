import { useState } from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });

  function handleSave(e) {
    e.preventDefault();
    showToast("Profile updated (demo only — not persisted to a server yet).", "success");
  }

  return (
    <div className="max-w-xl">
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-signal/15 text-signal-dark flex items-center justify-center font-display font-bold text-xl">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-display font-semibold">{user?.name}</p>
            <p className="text-sm text-asphalt-900/50 dark:text-mist-100/50">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-asphalt-900/35 dark:text-mist-100/35" />
              <input className="input pl-11" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-asphalt-900/35 dark:text-mist-100/35" />
              <input className="input pl-11" value={form.email} disabled />
            </div>
          </div>
          <div>
            <label className="label">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-asphalt-900/35 dark:text-mist-100/35" />
              <input className="input pl-11" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn-primary mt-2">
            <Save size={15} /> Save changes
          </button>
        </form>
      </div>
    </div>
  );
}

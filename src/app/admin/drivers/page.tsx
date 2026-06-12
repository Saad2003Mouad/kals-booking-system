"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  AlertCircle,
} from "lucide-react";

type Driver = {
  id: string;
  name: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
};

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    active: true,
  });
  const [error, setError] = useState("");

  const fetchDrivers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/drivers");
    if (res.ok) setDrivers(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filtered = drivers.filter((d) =>
    `${d.name} ${d.email} ${d.phone}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const openAdd = () => {
    setForm({ name: "", email: "", phone: "", password: "", active: true });
    setEditing(null);
    setError("");
    setModal(true);
  };
  const openEdit = (d: Driver) => {
    setForm({
      name: d.name,
      email: d.email,
      phone: d.phone,
      password: "",
      active: d.active,
    });
    setEditing(d);
    setError("");
    setModal(true);
  };

  const save = async () => {
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    if (!editing && !form.password) {
      setError("Password is required for new drivers.");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch(
      editing ? `/api/admin/drivers/${editing.id}` : "/api/admin/drivers",
      {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to save.");
      setSaving(false);
      return;
    }
    await fetchDrivers();
    setModal(false);
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this driver? This cannot be undone.")) return;
    await fetch(`/api/admin/drivers/${id}`, { method: "DELETE" });
    fetchDrivers();
  };

  return (
    <div
      className="space-y-8 pb-10"
      style={{ fontFamily: "'Inter', 'Nunito', sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-black tracking-tight"
            style={{ color: "#000223" }}
          >
            Drivers & Staff
          </h1>
          <p className="text-slate-500 font-semibold mt-1 text-sm">
            Manage {drivers.length} team members and access
          </p>
        </div>
        <button
          onClick={openAdd}
          className="px-5 py-2.5 rounded-xl text-sm font-black text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Invite Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Staff",
            value: drivers.length,
            bg: "from-slate-50 to-white",
            text: "text-[#000223]",
          },
          {
            label: "Active Now",
            value: drivers.filter((d) => d.active).length,
            bg: "from-emerald-50 to-white",
            text: "text-emerald-600",
          },
          {
            label: "Inactive/Away",
            value: drivers.filter((d) => !d.active).length,
            bg: "from-amber-50 to-white",
            text: "text-amber-600",
          },
        ].map((s, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${s.bg} rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden group`}
          >
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-colors" />
            <div
              className={`text-3xl font-black ${s.text} mb-1 tracking-tight`}
            >
              {s.value}
            </div>
            <div className="text-sm text-slate-500 font-bold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff members..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all bg-slate-50"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 bg-slate-100 rounded-3xl border border-slate-200"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-[24px] border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group relative"
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(d)}
                  className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-[#000223] shadow-md flex items-center justify-center transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => remove(d.id)}
                  className="w-8 h-8 rounded-full bg-white text-red-400 hover:text-red-500 shadow-md flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-6 flex flex-col items-center border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
                <div className="relative mb-3">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-black text-[#FFA000] text-xl shrink-0 shadow-inner"
                    style={{ background: "#000223" }}
                  >
                    {d.name.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${d.active ? "bg-emerald-500" : "bg-slate-300"}`}
                  />
                </div>
                <h3 className="font-black text-lg text-[#000223] tracking-tight text-center">
                  {d.name}
                </h3>
                <span
                  className={`mt-1 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${d.active ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-50 text-slate-500 border border-slate-200"}`}
                >
                  {d.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col gap-3">
                <a
                  href={`mailto:${d.email}`}
                  className="flex items-center gap-3 text-sm font-semibold text-slate-500 hover:text-[#FFA000] transition-colors p-2 -m-2 rounded-lg hover:bg-slate-50"
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{d.email}</span>
                </a>
                <a
                  href={`tel:${d.phone}`}
                  className="flex items-center gap-3 text-sm font-semibold text-slate-500 hover:text-[#FFA000] transition-colors p-2 -m-2 rounded-lg hover:bg-slate-50"
                >
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{d.phone || "No phone listed"}</span>
                </a>
              </div>

              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Team Member
                </span>
                <span>Since {new Date(d.createdAt).getFullYear()}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-600">
                No staff found
              </h3>
              <p className="text-sm font-semibold text-slate-400 mt-1">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-[#000223]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl"
            style={{ animation: "bl-pop 0.3s ease-out both" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-2xl font-black tracking-tight"
                style={{ color: "#000223" }}
              >
                {editing ? "Edit Staff Member" : "Invite Staff"}
              </h2>
              <button
                onClick={() => setModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold mb-5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="driver@email.com"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(617) 555-0000"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                  Password{" "}
                  {editing && (
                    <span className="text-slate-300 normal-case font-semibold">
                      (leave blank to keep current)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    className="w-full px-4 pr-12 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPw ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 mt-2">
                <div>
                  <div className="font-black text-sm text-[#000223]">
                    Account Access
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    Enable or disable login access
                  </div>
                </div>
                <button
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`relative w-12 h-6 rounded-full transition-all shadow-inner ${form.active ? "bg-emerald-500" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${form.active ? "translate-x-7" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setModal(false)}
                className="flex-1 py-3 rounded-xl font-black text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-[2] py-3 rounded-xl font-black text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                {editing ? "Save Changes" : "Invite Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bl-pop {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

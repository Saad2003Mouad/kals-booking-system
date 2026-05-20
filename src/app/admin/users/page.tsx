"use client";
import { useState, useEffect, useCallback } from "react";
import { Users, Plus, Shield, ShieldAlert, CheckCircle2, XCircle, Loader2, Edit, AlertCircle } from "lucide-react";

type Staff = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: string;
};

const ROLES = ["OWNER", "ADMIN", "DISPATCHER", "DRIVER", "ACCOUNTING", "SUPPORT"];

const AVAILABLE_PERMISSIONS = [
  "view_dashboard", "manage_bookings", "approve_bookings", "reject_bookings",
  "manage_customers", "manage_inquiries", "manage_tasks", "manage_fleet",
  "manage_drivers", "manage_packages", "manage_settings", "manage_users",
  "view_reports", "manage_payments"
];

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [permissions, setPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (res.ok && json.success) {
        setStaff(json.data);
      } else {
        setError(json.error || "Failed to load staff (403 Unauthorized?)");
      }
    } catch (err) {
      setError("Failed to fetch staff.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const openAdd = () => {
    setEditingStaff(null);
    setFormData({ name: "", email: "", password: "", role: "SUPPORT" });
    setPermissions([]);
    setShowModal(true);
  };

  const openEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({ name: s.name, email: s.email, password: "", role: s.role });
    setPermissions(s.permissions || []);
    setShowModal(true);
  };

  const togglePermission = (p: string) => {
    setPermissions(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingStaff ? `/api/admin/users/${editingStaff.id}` : `/api/admin/users`;
      const method = editingStaff ? "PATCH" : "POST";
      const body = editingStaff ? { role: formData.role, permissions } : { ...formData, permissions };
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const json = await res.json();
      if (res.ok && json.success) {
        setShowModal(false);
        fetchStaff();
      } else {
        alert(json.error || "Failed to save user");
      }
    } catch (err) {
      alert("Network error");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center p-24"><Loader2 className="w-8 h-8 animate-spin text-[#FFA000]" /></div>;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#000223] tracking-tight flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" /> Staff & Permissions
          </h1>
          <p className="text-slate-500 font-semibold mt-1 text-sm">
            Manage your team's access and roles across the platform.
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 flex flex-col items-center justify-center text-center">
          <ShieldAlert className="w-10 h-10 mb-2 text-red-500" />
          <h3 className="font-bold text-lg">Access Denied</h3>
          <p className="text-sm font-semibold mt-1">{error}</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">User</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Role</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Permissions</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex flex-shrink-0 items-center justify-center font-black text-xs uppercase">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="leading-tight">{s.name}</div>
                          <div className="text-xs text-slate-400 font-semibold mt-0.5">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-black tracking-wide ${s.role === "OWNER" ? "bg-purple-100 text-purple-700" : "bg-blue-50 text-blue-600"}`}>
                        {s.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {s.role === "OWNER" ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Full Access</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {s.permissions?.slice(0, 3).map(p => (
                            <span key={p} className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{p.replace("manage_", "").replace("view_", "")}</span>
                          ))}
                          {(s.permissions?.length || 0) > 3 && (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">+{s.permissions!.length - 3}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEdit(s)} className="text-slate-400 hover:text-blue-600 transition-colors p-2">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800">{editingStaff ? "Edit Staff Roles" : "Add Staff Member"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500"><XCircle className="w-6 h-6"/></button>
            </div>
            
            <form onSubmit={handleSave} className="overflow-y-auto p-6 flex-1">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="label-premium">Name</label>
                  <input required disabled={!!editingStaff} value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="input-premium py-2.5" placeholder="John Doe" />
                </div>
                <div>
                  <label className="label-premium">Email</label>
                  <input required type="email" disabled={!!editingStaff} value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="input-premium py-2.5" placeholder="john@bostonlegend.com" />
                </div>
                {!editingStaff && (
                  <div>
                    <label className="label-premium">Initial Password</label>
                    <input required minLength={6} type="password" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} className="input-premium py-2.5" placeholder="••••••••" />
                  </div>
                )}
                <div>
                  <label className="label-premium">System Role</label>
                  <select value={formData.role} onChange={e=>setFormData({...formData, role:e.target.value})} className="input-premium py-2.5 font-bold text-slate-700">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {formData.role !== "OWNER" && (
                <div>
                  <h3 className="font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">Granular Permissions</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {AVAILABLE_PERMISSIONS.map(p => (
                      <label key={p} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${permissions.includes(p) ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"}`}>
                        <input type="checkbox" className="hidden" checked={permissions.includes(p)} onChange={() => togglePermission(p)} />
                        <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border ${permissions.includes(p) ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"}`}>
                          {permissions.includes(p) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className="text-xs font-bold leading-tight">{p.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </form>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary py-2 px-6 border-slate-200">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-8 flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

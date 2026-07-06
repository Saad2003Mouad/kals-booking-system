"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Users, Plus, Shield, ShieldAlert, CheckCircle2, XCircle, Loader2, Edit, Save } from "lucide-react";

type Staff = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  active?: boolean;
  createdAt: string;
};

const ROLES = ["OWNER", "ADMIN", "DISPATCHER", "SUPPORT", "VIEWER"];

const PERMISSION_MATRIX = {
  "Bookings": ["bookings.view", "bookings.create", "bookings.update", "bookings.delete", "bookings.export"],
  "Customers & Users": ["users.view", "users.create", "users.update", "users.delete"],
  "Packages": ["packages.view", "packages.create", "packages.update", "packages.delete"],
  "Service Areas": ["serviceAreas.view", "serviceAreas.create", "serviceAreas.update", "serviceAreas.delete"],
  "Settings": ["settings.view", "settings.update"],
  "Other": ["notifications.view", "ai.view"]
};

const ROLE_COLORS: Record<string, string> = {
  OWNER:      "bg-amber-50 text-amber-700 border-amber-200",
  ADMIN:      "bg-purple-50 text-purple-700 border-purple-200",
  DISPATCHER: "bg-blue-50 text-blue-700 border-blue-200",
  SUPPORT:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  VIEWER:     "bg-slate-50 text-slate-600 border-slate-200",
};

export default function AdminStaffPage() {
  const { data: session } = useSession();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "SUPPORT", permissions: [] as string[], active: true });
  const [saving, setSaving] = useState(false);

  const loggedInRole = (session?.user as any)?.role || "DRIVER";

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (res.ok && json.success) setStaff(json.data);
      else setError(json.error || "Failed to load staff.");
    } catch {
      setError("Failed to fetch staff.");
    }
    setLoading(false);
  }, []);

  useEffect(() => { 
    if (loggedInRole === "OWNER") fetchStaff(); 
    else { setLoading(false); setError("Access Denied: Only users with OWNER role can manage staff."); }
  }, [fetchStaff, loggedInRole]);

  const openAdd = () => {
    setEditingStaff(null);
    setFormData({ name: "", email: "", password: "", role: "SUPPORT", permissions: [], active: true });
    setShowModal(true);
  };

  const openEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({ name: s.name, email: s.email, password: "", role: s.role, permissions: s.permissions || [], active: s.active !== false });
    setShowModal(true);
  };

  const togglePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const toggleCategory = (category: string) => {
    const perms = PERMISSION_MATRIX[category as keyof typeof PERMISSION_MATRIX];
    const allSelected = perms.every(p => formData.permissions.includes(p));
    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !perms.includes(p))
        : [...new Set([...prev.permissions, ...perms])]
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingStaff ? `/api/admin/users/${editingStaff.id}` : `/api/admin/users`;
      const method = editingStaff ? "PATCH" : "POST";
      const body = editingStaff 
        ? { role: formData.role, permissions: formData.permissions, active: formData.active }
        : formData;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json();
      if (res.ok && json?.success) { setShowModal(false); fetchStaff(); }
      else alert(json?.error || "Failed to save user.");
    } catch { alert("Network error"); }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <Loader2 className="w-10 h-10 animate-spin text-[#FFA000]" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 text-red-600 p-10 rounded-3xl border border-red-200 text-center max-w-xl mx-auto mt-10">
      <ShieldAlert className="w-14 h-14 mx-auto mb-4 text-red-400" />
      <h3 className="font-black text-xl text-[#000223]">Access Denied</h3>
      <p className="text-sm font-semibold mt-2 text-red-600">{error}</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFA000]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#000223] tracking-tight flex items-center gap-3">
            <Shield className="w-9 h-9 text-[#FFA000]" />
            Staff & Permissions
          </h1>
          <p className="text-slate-500 mt-2 text-sm sm:text-base font-semibold">
            Manage team access, roles, and granular permissions.
          </p>
        </div>
        <button onClick={openAdd} className="btn-premium-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Staff Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: staff.length, color: "text-[#000223]" },
          { label: "Active", value: staff.filter(s => s.active !== false).length, color: "text-emerald-600" },
          { label: "Admins & Owners", value: staff.filter(s => ["OWNER","ADMIN"].includes(s.role)).length, color: "text-amber-600" },
          { label: "With Custom Perms", value: staff.filter(s => s.permissions?.length > 0).length, color: "text-purple-600" },
        ].map((s, i) => (
          <div key={i} className="card-premium p-5">
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card-premium overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-white">
          <h2 className="font-black text-lg text-[#000223]">Team Members ({staff.length})</h2>
        </div>
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#FAF6EF] border-b border-slate-200 text-xs font-black uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Permissions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#000223] flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#000223] flex items-center justify-center font-black text-sm text-[#FFA000] uppercase shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-sm text-[#000223]">{s.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[11px] font-black tracking-wide border ${ROLE_COLORS[s.role] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {s.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    {s.permissions?.length > 0 ? (
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg font-black">
                        {s.permissions.length} custom rules
                      </span>
                    ) : (
                      <span className="text-slate-400">Role default</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full border flex items-center gap-1.5 w-fit ${s.active !== false ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-red-600 bg-red-50 border-red-200'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.active !== false ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
                      {s.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEdit(s)} 
                      className="text-slate-400 hover:text-[#000223] p-2.5 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000223]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 sm:px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="font-black text-2xl text-[#000223]">{editingStaff ? "Edit Staff Member" : "Add Staff Member"}</h2>
                <p className="text-slate-400 text-sm font-semibold mt-1">{editingStaff ? `Editing ${editingStaff.name}` : "Create a new team account"}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <XCircle className="w-7 h-7"/>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="overflow-y-auto p-6 sm:p-8 flex-1 flex flex-col lg:flex-row gap-8">
              {/* Left Column: Basic Details */}
              <div className="lg:w-1/3 space-y-5">
                <h3 className="font-black text-base text-[#000223] border-b border-slate-100 pb-3">Profile & Role</h3>
                <div>
                  <label className="label-premium">Full Name</label>
                  <input required disabled={!!editingStaff} value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="input-premium" placeholder="John Smith" />
                </div>
                <div>
                  <label className="label-premium">Email</label>
                  <input required type="email" disabled={!!editingStaff} value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="input-premium" placeholder="john@example.com" />
                </div>
                {!editingStaff && (
                  <div>
                    <label className="label-premium">Password</label>
                    <input required minLength={6} type="password" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} className="input-premium" placeholder="Min. 6 characters" />
                  </div>
                )}
                <div>
                  <label className="label-premium">Role</label>
                  <select value={formData.role} onChange={e=>setFormData({...formData, role:e.target.value})} className="input-premium cursor-pointer">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {editingStaff && (
                  <div className="flex items-center gap-3 pt-2">
                    <input type="checkbox" id="activeToggle" checked={formData.active} onChange={e=>setFormData({...formData, active: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
                    <label htmlFor="activeToggle" className="text-sm font-bold text-[#000223] cursor-pointer">Account Active</label>
                  </div>
                )}
              </div>

              {/* Right Column: Permission Matrix */}
              <div className="lg:flex-1 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-base text-[#000223]">Granular Permissions</h3>
                  <button type="button" onClick={() => setFormData({...formData, permissions: Object.values(PERMISSION_MATRIX).flat()})} className="text-xs font-black text-[#FFA000] hover:underline">Select All</button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(PERMISSION_MATRIX).map(([category, perms]) => {
                    const allSelected = perms.every(p => formData.permissions.includes(p));
                    return (
                      <div key={category} className="bg-[#FAF6EF] border border-slate-100 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                          <span className="font-black text-sm text-[#000223]">{category}</span>
                          <button type="button" onClick={() => toggleCategory(category)} className={`text-xs font-black px-2 py-0.5 rounded-md transition-colors ${allSelected ? 'text-red-500 hover:bg-red-50' : 'text-[#FFA000] hover:bg-amber-50'}`}>
                            {allSelected ? "Clear" : "All"}
                          </button>
                        </div>
                        <div className="space-y-2.5">
                          {perms.map(perm => (
                            <label key={perm} className="flex items-center gap-2.5 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                checked={formData.permissions.includes(perm)}
                                onChange={() => togglePermission(perm)}
                                className="w-4 h-4 rounded border-slate-300 text-[#FFA000] focus:ring-[#FFA000] cursor-pointer"
                              />
                              <span className="text-xs font-bold text-slate-600 group-hover:text-[#000223] transition-colors uppercase tracking-wider">
                                {perm.split(".")[1]}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </form>
            
            <div className="px-6 sm:px-8 py-5 bg-[#FAF6EF] border-t border-slate-100 flex justify-end gap-3 rounded-b-3xl">
              <button type="button" onClick={() => setShowModal(false)} className="btn-premium-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-premium-primary flex items-center gap-2">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

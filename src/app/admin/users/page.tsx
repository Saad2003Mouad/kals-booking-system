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
    const categoryPerms = PERMISSION_MATRIX[category as keyof typeof PERMISSION_MATRIX];
    const hasAll = categoryPerms.every(p => formData.permissions.includes(p));
    setFormData(prev => ({
      ...prev,
      permissions: hasAll
        ? prev.permissions.filter(p => !categoryPerms.includes(p))
        : Array.from(new Set([...prev.permissions, ...categoryPerms]))
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingStaff ? `/api/admin/users/${editingStaff.id}` : `/api/admin/users`;
      const method = editingStaff ? "PATCH" : "POST";
      const body = editingStaff ? { role: formData.role, permissions: formData.permissions, active: formData.active } : formData;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await (res.ok ? res.json() : null);
      if (res.ok && json?.success) { setShowModal(false); fetchStaff(); }
      else alert(json?.error || "Failed to save user.");
    } catch { alert("Network error"); }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center p-24"><Loader2 className="w-8 h-8 animate-spin text-[#FFA000]" /></div>;

  if (error) return (
    <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-200 text-center max-w-xl mx-auto mt-10">
      <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-red-500" />
      <h3 className="font-bold text-lg">Access Denied</h3>
      <p className="text-sm font-semibold mt-2">{error}</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#000223] flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-500" /> Staff & Permissions
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage team access and role-based permissions.</p>
        </div>
        <button onClick={openAdd} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-black uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Permissions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs uppercase">{s.name.charAt(0)}</div>
                      <div>
                        <div className="leading-tight">{s.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-black tracking-wide bg-blue-50 text-blue-600 border border-blue-100">
                      {s.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                    {s.permissions?.length > 0 ? `${s.permissions.length} specific rules` : 'Role default'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${s.active !== false ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-red-600 bg-red-50 border-red-200'}`}>
                      {s.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEdit(s)} className="text-slate-400 hover:text-blue-600 p-2"><Edit className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-lg text-slate-800">{editingStaff ? "Edit Staff" : "Add Staff"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500"><XCircle className="w-6 h-6"/></button>
            </div>
            
            <form onSubmit={handleSave} className="overflow-y-auto p-6 flex-1 flex flex-col lg:flex-row gap-8">
              {/* Left Column: Basic Details */}
              <div className="lg:w-1/3 space-y-4">
                <h3 className="font-bold text-sm border-b pb-2">Profile & Role</h3>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400">Name</label>
                  <input required disabled={!!editingStaff} value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full mt-1 p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400">Email</label>
                  <input required type="email" disabled={!!editingStaff} value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="w-full mt-1 p-2 border rounded-xl" />
                </div>
                {!editingStaff && (
                  <div>
                    <label className="text-xs font-bold uppercase text-slate-400">Password</label>
                    <input required minLength={6} type="password" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} className="w-full mt-1 p-2 border rounded-xl" />
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400">Role</label>
                  <select value={formData.role} onChange={e=>setFormData({...formData, role:e.target.value})} className="w-full mt-1 p-2 border rounded-xl font-bold">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {editingStaff && (
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" id="activeToggle" checked={formData.active} onChange={e=>setFormData({...formData, active: e.target.checked})} className="w-4 h-4 rounded text-emerald-500 border-gray-300 focus:ring-emerald-500" />
                    <label htmlFor="activeToggle" className="text-sm font-bold text-slate-700">Account Active</label>
                  </div>
                )}
              </div>

              {/* Right Column: Checkbox Matrix */}
              <div className="lg:w-2/3 border-l pl-0 lg:pl-8 space-y-6">
                <h3 className="font-bold text-sm border-b pb-2 flex justify-between items-center">
                  <span>Granular Permissions</span>
                  <button type="button" onClick={() => setFormData({...formData, permissions: Object.values(PERMISSION_MATRIX).flat()})} className="text-xs text-[#FFA000] hover:underline">Select All</button>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {Object.entries(PERMISSION_MATRIX).map(([category, perms]) => {
                    const allSelected = perms.every(p => formData.permissions.includes(p));
                    return (
                      <div key={category} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                          <span className="font-bold text-sm text-slate-800">{category}</span>
                          <button type="button" onClick={() => toggleCategory(category)} className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                            {allSelected ? "Clear" : "All"}
                          </button>
                        </div>
                        <div className="space-y-2">
                          {perms.map(perm => (
                            <label key={perm} className="flex items-center gap-2 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                checked={formData.permissions.includes(perm)}
                                onChange={() => togglePermission(perm)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">
                                {perm.split(".")[1].toUpperCase()}
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
            
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-8 flex items-center gap-2 rounded-full">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

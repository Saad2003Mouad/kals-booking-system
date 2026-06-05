"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Users, Plus, Shield, ShieldAlert, CheckCircle2, XCircle, Loader2, Edit, AlertCircle, Info } from "lucide-react";

type Staff = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: string;
};

const ROLES = ["OWNER", "ADMIN", "DISPATCHER", "DRIVER", "SUPPORT", "VIEWER"];

// Fixed permission matrix based on lib/rbac.ts for visual presentation
const ROLE_PERMISSIONS_DISPLAY: Record<string, string[]> = {
  OWNER: [
    "Full Admin Access", "Manage Settings", "Manage Users & Roles", "Manage Service Areas", 
    "Manage Packages", "View Dashboard Stats", "View & Update All Bookings", "Assign Drivers"
  ],
  ADMIN: [
    "Operational Admin Access", "View Settings", "Manage Service Areas", "Manage Packages",
    "View Dashboard Stats", "View & Update All Bookings", "Assign Drivers"
  ],
  DISPATCHER: [
    "View Dashboard Stats", "View & Update Bookings", "Assign Drivers", "View Customers", "View Notifications"
  ],
  DRIVER: [
    "View Assigned Jobs Only", "Update Assigned Job Status"
  ],
  SUPPORT: [
    "Limited Dashboard Stats (No Revenue)", "View Bookings", "View & Update Customers", "View Notifications"
  ],
  VIEWER: [
    "View Dashboard Stats", "View Bookings (Read-only)", "View Packages (Read-only)", "View Customers"
  ]
};

export default function AdminStaffPage() {
  const { data: session } = useSession();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "SUPPORT" });
  const [saving, setSaving] = useState(false);

  const loggedInRole = (session?.user as any)?.role || "DRIVER";

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

  useEffect(() => { 
    if (loggedInRole === "OWNER") {
      fetchStaff(); 
    } else {
      setLoading(false);
      setError("Access Denied: Only users with the OWNER role are authorized to manage staff and permissions.");
    }
  }, [fetchStaff, loggedInRole]);

  const openAdd = () => {
    setEditingStaff(null);
    setFormData({ name: "", email: "", password: "", role: "SUPPORT" });
    setShowModal(true);
  };

  const openEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({ name: s.name, email: s.email, password: "", role: s.role });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingStaff ? `/api/admin/users/${editingStaff.id}` : `/api/admin/users`;
      const method = editingStaff ? "PATCH" : "POST";
      
      // When saving/updating, permissions are derived directly from the role server-side.
      // We pass the role. If we want legacy compatibility, we pass the role's default list.
      const rolePermissions = ROLE_PERMISSIONS_DISPLAY[formData.role] || [];
      const body = editingStaff ? { role: formData.role, permissions: rolePermissions } : { ...formData, permissions: rolePermissions };
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const json = await res.ok ? await res.json() : null;
      if (res.ok && json && json.success) {
        setShowModal(false);
        fetchStaff();
      } else {
        alert(json?.error || "Failed to save user (Only OWNER role can perform this action)");
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
        {loggedInRole === "OWNER" && (
          <button onClick={openAdd} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Staff Member
          </button>
        )}
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-200 flex flex-col items-center justify-center text-center max-w-xl mx-auto mt-10">
          <ShieldAlert className="w-12 h-12 mb-3 text-red-500" />
          <h3 className="font-bold text-lg">Access Denied</h3>
          <p className="text-sm font-semibold mt-2 leading-relaxed">{error}</p>
        </div>
      ) : (
        <div className="grid xl:grid-cols-3 gap-6">
          {/* Staff List Table */}
          <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden h-fit">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">User</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Role</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.map(s => {
                    const isTargetOwner = s.role === "OWNER";
                    return (
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
                          <span className={`px-2.5 py-1 rounded-md text-[11px] font-black tracking-wide ${isTargetOwner ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                            {s.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {/* Protect owner users from modification by non-owners, though only owner can view this page anyway */}
                          {(!isTargetOwner || loggedInRole === "OWNER") && (
                            <button onClick={() => openEdit(s)} className="text-slate-400 hover:text-blue-600 transition-colors p-2">
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Predefined Matrix Card */}
          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h2 className="font-bold text-base text-slate-800 flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-blue-500" /> Predefined Access Profiles
              </h2>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Roles are managed by predefined permission profiles. Granular permissions are assigned automatically based on the selected System Role and enforced server-side.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Role Permission Profiles</h3>
              <div className="space-y-4 divide-y divide-slate-100">
                {ROLES.map(role => (
                  <div key={role} className="pt-3 first:pt-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-slate-800 tracking-wide">{role}</span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {ROLE_PERMISSIONS_DISPLAY[role]?.length || 0} rules
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ROLE_PERMISSIONS_DISPLAY[role]?.map(perm => (
                        <span key={perm} className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800">{editingStaff ? "Edit Staff Roles" : "Add Staff Member"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500"><XCircle className="w-6 h-6"/></button>
            </div>
            
            <form onSubmit={handleSave} className="overflow-y-auto p-6 flex-1 space-y-5">
              <div className="space-y-4">
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
                    {ROLES.map(r => {
                      // Prevent non-owners from selecting OWNER, though page is OWNER only anyway
                      if (r === "OWNER" && loggedInRole !== "OWNER") return null;
                      return <option key={r} value={r}>{r}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Predefined Permissions for Role</h3>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2 max-h-[180px] overflow-y-auto">
                  {(ROLE_PERMISSIONS_DISPLAY[formData.role] || []).map(p => (
                    <div key={p} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
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

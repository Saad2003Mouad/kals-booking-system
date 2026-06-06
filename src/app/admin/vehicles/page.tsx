"use client";
import { useState, useEffect } from "react";
import { 
  Plus, Search, Truck, Pencil, Trash2, X, CheckCircle2, 
  Wrench, CalendarDays, MoreHorizontal, MapPin, Loader2, AlertCircle, ShieldCheck
} from "lucide-react";

const STATUS_STYLE: Record<string, { bg: string, text: string, border: string, dot: string, label: string }> = {
  AVAILABLE:   { bg: "bg-emerald-50/70", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", label: "Available" },
  ON_JOB:      { bg: "bg-amber-50/70", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", label: "On Job" },
  MAINTENANCE: { bg: "bg-rose-50/70", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500", label: "Maintenance" },
};

const TRUCK_IMG = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/68370bab3a2a59b9eecd7910_5429ba7e106f479fe18b0f9ad0cf5de3_boston-legend-ice-cream-truck-white-header-bg.avif";
const VAN_IMG = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif"; // Logo or fallback sprinter icon

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ code:"", name:"", type:"TRUCK", status:"AVAILABLE", driver:"", location:"" });

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vehicles");
      if (res.ok) setVehicles(await res.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const filtered = vehicles.filter(v =>
    `${v.name} ${v.code} ${v.driver || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { 
    setForm({ code:"", name:"", type:"TRUCK", status:"AVAILABLE", driver:"", location:"Boston Metro" }); 
    setEditing(null); 
    setError("");
    setModal(true); 
  };
  
  const openEdit = (v: any) => { 
    setForm({ code:v.code, name:v.name, type:v.type, status:v.status, driver:v.driver||"", location:v.location||"" }); 
    setEditing(v); 
    setError("");
    setModal(true); 
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(editing ? `/api/admin/vehicles/${editing.id}` : "/api/admin/vehicles", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save vehicle.");
      } else {
        setModal(false);
        fetchVehicles();
      }
    } catch (e) {
      setError("Network error saving vehicle.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this vehicle from the active fleet?")) return;
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete vehicle.");
      } else {
        fetchVehicles();
      }
    } catch (e) {
      alert("Network error deleting vehicle.");
    }
  };

  return (
    <div className="space-y-8 pb-10" style={{ fontFamily:"'Inter', 'Nunito', sans-serif" }}>
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFA000]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fleet Control</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#000223]">Fleet & Vehicles</h1>
          <p className="text-slate-500 font-semibold mt-1 text-sm">Monitor live availability, driver assignments, and maintenance logs</p>
        </div>
        <button 
          onClick={openAdd} 
          className="px-5 py-2.5 rounded-xl text-sm font-black text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4.5 h-4.5" /> Add Vehicle
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label:"Total Fleet",  value: vehicles.length,                             bg:"from-slate-50 to-white", text:"text-[#000223]" },
          { label:"Available",    value: vehicles.filter(v=>v.status==="AVAILABLE").length, bg:"from-emerald-50/50 to-white", text:"text-emerald-600" },
          { label:"On Assignment",value: vehicles.filter(v=>v.status==="ON_JOB").length,    bg:"from-amber-50/50 to-white", text:"text-amber-600" },
          { label:"Maintenance",  value: vehicles.filter(v=>v.status==="MAINTENANCE").length, bg:"from-red-50/50 to-white", text:"text-rose-600" },
        ].map((s,i) => (
          <div key={i} className={`bg-gradient-to-br ${s.bg} rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden group`}>
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-all duration-300" />
            <div className={`text-3xl font-black ${s.text} mb-1 tracking-tight`}>{s.value}</div>
            <div className="text-xs text-slate-450 font-black uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            value={search} 
            onChange={e=>setSearch(e.target.value)} 
            placeholder="Search by code, model name, or assigned driver..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 transition-all bg-[#FAF8F0]/30 text-[#000223] text-[16px]" 
          />
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex justify-center items-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFA000]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-600">No vehicles match your search</h3>
          <p className="text-sm font-semibold text-slate-450 mt-1">Try adjusting search parameters or add a new vehicle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(v => {
            const SInfo = STATUS_STYLE[v.status] || STATUS_STYLE.AVAILABLE;
            const isVan = v.type === "VAN";
            return (
              <div key={v.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group hover:-translate-y-0.5">
                
                {/* Vehicle Card Header Image */}
                <div className="relative h-36 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FAF8F0]/50 to-transparent pointer-events-none" />
                  
                  {isVan ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                        <Truck className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black tracking-widest uppercase text-slate-400">Sprinter Van</span>
                    </div>
                  ) : (
                    <img 
                      src={TRUCK_IMG} 
                      alt="" 
                      className="h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" 
                    />
                  )}
                  
                  {/* Status Tag Overlay */}
                  <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md bg-white/95 border ${SInfo.border} shadow-sm ${SInfo.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${SInfo.dot} animate-pulse`} />
                    {SInfo.label}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-[10px] font-black text-[#FFA000] uppercase tracking-widest">{v.code}</div>
                        <h3 className="text-[15px] font-black tracking-tight text-[#000223] mt-0.5 truncate">{v.name}</h3>
                      </div>
                      <span className="text-[9.5px] font-black bg-slate-100 text-slate-650 px-2 py-0.5 rounded uppercase tracking-wider">
                        {v.type}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        {v.driver ? (
                          <span>Assigned: <span className="text-[#000223] font-black">{v.driver}</span></span>
                        ) : (
                          <span className="text-slate-400 italic font-medium">Driver: Unassigned</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="truncate">Zone: <span className="text-[#000223] font-black">{v.location || "Boston Metro"}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                    <button 
                      onClick={()=>openEdit(v)} 
                      className="flex-1 py-2 bg-slate-50 hover:bg-[#000223] hover:text-white text-slate-600 rounded-lg text-xs font-black transition-all border border-slate-200/50"
                    >
                      Edit Details
                    </button>
                    <button 
                      onClick={()=>remove(v.id)} 
                      className="w-9 h-9 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-lg transition-colors border border-rose-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-[#000223]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black tracking-tight text-[#000223]">
                {editing ? "Edit Vehicle" : "Add New Vehicle"}
              </h2>
              <button 
                onClick={()=>setModal(false)} 
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-650 text-xs font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Asset Code / Identifier</label>
                <input 
                  disabled={!!editing} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 transition-all disabled:opacity-50 text-[16px]" 
                  placeholder="E.g. TRUCK-6" 
                  value={form.code} 
                  onChange={e=>setForm({...form,code:e.target.value})} 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Display Label</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 transition-all text-[16px]" 
                  placeholder="E.g. Classic Americano 6" 
                  value={form.name} 
                  onChange={e=>setForm({...form,name:e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Vehicle Type</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 transition-all bg-white" 
                    value={form.type} 
                    onChange={e=>setForm({...form,type:e.target.value})}
                  >
                    <option value="TRUCK">Americano Truck</option>
                    <option value="VAN">Sprinter Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Status</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 transition-all bg-white" 
                    value={form.status} 
                    onChange={e=>setForm({...form,status:e.target.value})}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_JOB">On Job</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Zone (Resolved on dispatch)</label>
                <input 
                  disabled 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-400 outline-none bg-slate-50 cursor-not-allowed" 
                  value={form.location || "Boston Metro"} 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Driver (Resolved on dispatch)</label>
                <input 
                  disabled 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-400 outline-none bg-slate-50 cursor-not-allowed" 
                  value={form.driver || "Unassigned"} 
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button 
                disabled={saving} 
                onClick={()=>setModal(false)} 
                className="flex-1 py-3.5 rounded-xl font-black text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={saving} 
                onClick={save} 
                className="flex-1 py-3.5 rounded-xl font-black text-sm text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {editing ? "Save Changes" : "Create Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}

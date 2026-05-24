"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Truck, Pencil, Trash2, X, CheckCircle2, Wrench, CalendarDays, MoreHorizontal, MapPin, Loader2, AlertCircle } from "lucide-react";

const INIT = [
  { id:"1", code:"TRUCK-1", name:"Classic Americano 1", type:"TRUCK", status:"AVAILABLE", driver:"Mike R.", location:"Boston Metro" },
  { id:"2", code:"TRUCK-2", name:"Classic Americano 2", type:"TRUCK", status:"ON_JOB",   driver:"James T.", location:"Cambridge" },
  { id:"3", code:"TRUCK-3", name:"Classic Americano 3", type:"TRUCK", status:"AVAILABLE", driver:"Sarah L.", location:"Somerville" },
  { id:"4", code:"TRUCK-4", name:"Premium Americano 1", type:"TRUCK", status:"MAINTENANCE", driver:null, location:"Garage" },
  { id:"5", code:"TRUCK-5", name:"Premium Americano 2", type:"TRUCK", status:"AVAILABLE", driver:"David K.", location:"Boston Metro" },
  { id:"6", code:"VAN-1",   name:"Sprinter Van",        type:"VAN",   status:"AVAILABLE", driver:"Ana M.", location:"Waltham" },
  { id:"7", code:"VAN-2",   name:"Dodge Van",           type:"VAN",   status:"ON_JOB",   driver:"Carlos B.", location:"Newton" },
];

const STATUS_STYLE: Record<string, { bg: string, text: string, border: string, icon: any }> = {
  AVAILABLE:   { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", icon: CheckCircle2 },
  ON_JOB:      { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", icon: Truck },
  MAINTENANCE: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: Wrench },
};

const TRUCK_IMG = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/68370bab3a2a59b9eecd7910_5429ba7e106f479fe18b0f9ad0cf5de3_boston-legend-ice-cream-truck-white-header-bg.avif";

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
    if (!confirm("Remove this vehicle?")) return;
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color:"#000223" }}>Fleet & Vehicles</h1>
          <p className="text-slate-500 font-semibold mt-1 text-sm">Monitor availability and manage maintenance</p>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 rounded-xl text-sm font-black text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label:"Total Fleet",  value: vehicles.length,                             bg:"from-slate-50 to-white", text:"text-[#000223]" },
          { label:"Available",    value: vehicles.filter(v=>v.status==="AVAILABLE").length, bg:"from-emerald-50 to-white", text:"text-emerald-600" },
          { label:"On Assignment",value: vehicles.filter(v=>v.status==="ON_JOB").length,    bg:"from-amber-50 to-white", text:"text-amber-600" },
          { label:"Maintenance",  value: vehicles.filter(v=>v.status==="MAINTENANCE").length, bg:"from-red-50 to-white", text:"text-red-600" },
        ].map((s,i) => (
          <div key={i} className={`bg-gradient-to-br ${s.bg} rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden group`}>
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-colors" />
            <div className={`text-3xl font-black ${s.text} mb-1 tracking-tight`}>{s.value}</div>
            <div className="text-sm text-slate-500 font-bold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, code, or driver..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all bg-slate-50" />
        </div>
      </div>

      {/* Grid / Loading States */}
      {loading ? (
        <div className="flex justify-center items-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFA000]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-black text-slate-600">No vehicles found</h3>
          <p className="text-sm font-semibold text-slate-400 mt-1">Try adding a vehicle or adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(v => {
            const SInfo = STATUS_STYLE[v.status] || STATUS_STYLE.AVAILABLE;
            return (
              <div key={v.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group">
                <div className="relative h-32 bg-slate-100 flex items-center justify-center p-4">
                  <img src={TRUCK_IMG} alt="" className="h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider backdrop-blur-md bg-white/90 border border-slate-200/50 shadow-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${v.status==="AVAILABLE"?"bg-emerald-500":v.status==="ON_JOB"?"bg-amber-500":"bg-red-500"}`} />
                    {v.status.replace("_"," ")}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-xs font-black text-slate-400 mb-0.5">{v.code}</div>
                      <div className="text-[15px] font-black tracking-tight text-[#000223]">{v.name}</div>
                    </div>
                    <button onClick={()=>openEdit(v)} className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#000223] hover:bg-slate-100 flex items-center justify-center transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-2.5 flex-1">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                      <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400"><CalendarDays className="w-3.5 h-3.5" /></div>
                      {v.driver ? <span>Driven by <span className="text-[#000223]">{v.driver}</span></span> : <span className="text-slate-400 italic">Unassigned</span>}
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                      <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400"><MapPin className="w-3.5 h-3.5" /></div>
                      {v.location}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex gap-2">
                    <button onClick={()=>openEdit(v)} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-black transition-colors">Edit Details</button>
                    <button onClick={()=>remove(v.id)} className="w-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-[#000223]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200" style={{ animation: "bl-pop 0.3s ease-out both" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black tracking-tight" style={{ color:"#000223" }}>{editing ? "Edit Vehicle" : "Add Vehicle"}</h2>
              <button onClick={()=>setModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Code</label><input disabled={!!editing} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all disabled:opacity-50" placeholder="TRUCK-6" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} /></div>
              <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Display Name</label><input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all" placeholder="Classic Americano 6" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Type</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all bg-white" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                    <option value="TRUCK">Americano Truck</option>
                    <option value="VAN">Sprinter / Van</option>
                  </select>
                </div>
                <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Status</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all bg-white" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_JOB">On Job</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Location / Zone (Info Only)</label>
                <input disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-500 outline-none bg-slate-50 cursor-not-allowed" placeholder="Boston Metro" value={form.location || "Boston Metro"} />
                <p className="text-[10px] text-slate-400 font-bold mt-1">Location is automatically resolved from active job assignments.</p>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Driver (Info Only)</label>
                <input disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-500 outline-none bg-slate-50 cursor-not-allowed" placeholder="Unassigned" value={form.driver || "Unassigned"} />
                <p className="text-[10px] text-slate-400 font-bold mt-1">Driver assignment is set on booking dispatch.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button disabled={saving} onClick={()=>setModal(false)} className="flex-1 py-3 rounded-xl font-black text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50">Cancel</button>
              <button disabled={saving} onClick={save} className="flex-1 py-3 rounded-xl font-black text-sm text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {editing ? "Save Changes" : "Add Vehicle"}
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

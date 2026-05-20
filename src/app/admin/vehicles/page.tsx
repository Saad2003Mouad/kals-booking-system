"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Truck, Pencil, Trash2, X, CheckCircle2, Wrench, CalendarDays, MoreHorizontal, MapPin } from "lucide-react";

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
  const [vehicles, setVehicles] = useState<any[]>(INIT);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<typeof INIT[0] | null>(null);
  const [form, setForm] = useState({ code:"", name:"", type:"TRUCK", status:"AVAILABLE", driver:"", location:"" });

  const filtered = vehicles.filter(v =>
    `${v.name} ${v.code} ${v.driver || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm({ code:"", name:"", type:"TRUCK", status:"AVAILABLE", driver:"", location:"Boston Metro" }); setEditing(null); setModal(true); };
  const openEdit = (v: any) => { setForm({ code:v.code, name:v.name, type:v.type, status:v.status, driver:v.driver||"", location:v.location||"" }); setEditing(v); setModal(true); };
  const save = async () => {
    if (editing) setVehicles(p => p.map(v => v.id === editing.id ? { ...v, ...form, driver: form.driver || null } : v));
    else setVehicles(p => [...p, { id: Date.now().toString(), ...form, driver: form.driver || null }]);
    setModal(false);
  };
  const remove = (id: string) => confirm("Remove this vehicle?") && setVehicles(p => p.filter(v => v.id !== id));

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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(v => {
          const SInfo = STATUS_STYLE[v.status] || STATUS_STYLE.AVAILABLE;
          const Icon = SInfo.icon;
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-[#000223]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" style={{ animation: "bl-pop 0.3s ease-out both" }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black tracking-tight" style={{ color:"#000223" }}>{editing ? "Edit Vehicle" : "Add Vehicle"}</h2>
              <button onClick={()=>setModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Code</label><input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all" placeholder="TRUCK-6" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} /></div>
              <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Display Name</label><input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all" placeholder="Classic Americano 6" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Type</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                    <option value="TRUCK">Americano Truck</option>
                    <option value="VAN">Sprinter / Van</option>
                  </select>
                </div>
                <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Status</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                    <option value="AVAILABLE">Available</option>
                    <option value="ON_JOB">On Job</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
              </div>
              <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Location / Zone</label><input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all" placeholder="Boston Metro" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} /></div>
              <div><label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Driver (optional)</label><input className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all" placeholder="Driver name" value={form.driver} onChange={e=>setForm({...form,driver:e.target.value})} /></div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={()=>setModal(false)} className="flex-1 py-3 rounded-xl font-black text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={save} className="flex-1 py-3 rounded-xl font-black text-sm text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] hover:shadow-lg transition-all flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {editing?"Save Changes":"Add Vehicle"}</button>
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

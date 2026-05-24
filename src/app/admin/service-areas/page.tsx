"use client";
import { useState, useEffect, useCallback } from "react";
import {
  MapPin, Plus, Search, Trash2, ToggleLeft, ToggleRight,
  Download, Upload, Loader2, CheckCircle2, AlertCircle,
  X, RefreshCw, Edit2, Save
} from "lucide-react";

type ZipRecord = {
  id: string;
  zip: string;
  city: string;
  county: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
};

const FN = "'Inter','Nunito',sans-serif";

function Toast({ type, msg, onClose }: { type: "success" | "error"; msg: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-bold border animate-in slide-in-from-right-5 duration-300 ${type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
      {type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
    </div>
  );
}

function AddZipModal({ onAdd, onClose }: { onAdd: (zip: string, city: string, county: string, notes: string) => Promise<void>; onClose: () => void }) {
  const [zip, setZip]       = useState("");
  const [city, setCity]     = useState("");
  const [county, setCounty] = useState("");
  const [notes, setNotes]   = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState("");

  const handle = async () => {
    if (!/^\d{5}$/.test(zip)) { setErr("ZIP must be exactly 5 digits"); return; }
    if (!city.trim()) { setErr("City is required"); return; }
    setSaving(true); setErr("");
    try { await onAdd(zip, city, county, notes); onClose(); }
    catch (e: any) { setErr(e.message || "Failed to add ZIP"); }
    finally { setSaving(false); }
  };

  const inCls = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FFA000] outline-none font-semibold text-sm text-slate-800 bg-white transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" style={{ fontFamily: FN }}>
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black" style={{ color: "#000223" }}>Add ZIP Code</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Add a Massachusetts service area ZIP</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          {err && <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm font-bold"><AlertCircle className="w-4 h-4 shrink-0" />{err}</div>}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">ZIP Code *</label>
            <input value={zip} onChange={e => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="02115" maxLength={5} className={inCls} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">City / Neighborhood *</label>
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Boston (Fenway)" className={inCls} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">County</label>
            <input value={county} onChange={e => setCounty(e.target.value)} placeholder="Suffolk" className={inCls} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Notes (optional)</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Special notes or conditions" className={inCls} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-black border-2 border-slate-200 text-slate-500 hover:border-slate-400 transition-all">Cancel</button>
          <button onClick={handle} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50" style={{ background: "#000223", color: "#FFA000" }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {saving ? "Adding…" : "Add ZIP Code"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ record, onSave, onClose }: { record: ZipRecord; onSave: (id: string, data: Partial<ZipRecord>) => Promise<void>; onClose: () => void }) {
  const [city, setCity]     = useState(record.city);
  const [county, setCounty] = useState(record.county || "");
  const [notes, setNotes]   = useState(record.notes || "");
  const [saving, setSaving] = useState(false);

  const handle = async () => {
    setSaving(true);
    try { await onSave(record.id, { city, county: county || null, notes: notes || null }); onClose(); }
    finally { setSaving(false); }
  };

  const inCls = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FFA000] outline-none font-semibold text-sm text-slate-800 bg-white transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" style={{ fontFamily: FN }}>
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black" style={{ color: "#000223" }}>Edit ZIP {record.zip}</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Update service area details</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"><X className="w-4 h-4 text-slate-500" /></button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">City / Neighborhood *</label>
            <input value={city} onChange={e => setCity(e.target.value)} className={inCls} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">County</label>
            <input value={county} onChange={e => setCounty(e.target.value)} placeholder="Suffolk" className={inCls} />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Notes</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Special notes" className={inCls} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-black border-2 border-slate-200 text-slate-500 hover:border-slate-400 transition-all">Cancel</button>
          <button onClick={handle} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black shadow-md hover:shadow-lg disabled:opacity-50 transition-all" style={{ background: "#000223", color: "#FFA000" }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServiceAreasPage() {
  const [records, setRecords]     = useState<ZipRecord[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filterActive, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd]     = useState(false);
  const [editRec, setEditRec]     = useState<ZipRecord | null>(null);
  const [toast, setToast]         = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [seeding, setSeeding]     = useState(false);
  const [deleting, setDeleting]   = useState(false);

  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/service-areas");
      const data = await res.json();
      setRecords(data.data || []);
    } catch {
      showToast("error", "Failed to load service areas");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const filtered = records.filter(r => {
    const matchSearch = !search || r.zip.includes(search) || r.city.toLowerCase().includes(search.toLowerCase()) || (r.county || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterActive === "all" || (filterActive === "active" ? r.isActive : !r.isActive);
    return matchSearch && matchFilter;
  });

  const activeCount   = records.filter(r => r.isActive).length;
  const inactiveCount = records.length - activeCount;

  const handleAdd = async (zip: string, city: string, county: string, notes: string) => {
    const res = await fetch("/api/admin/service-areas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zip, city, county, notes }),
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.error || "Failed to add");
    }
    await load();
    showToast("success", `ZIP code ${zip} added successfully`);
  };

  const handleToggle = async (rec: ZipRecord) => {
    await fetch(`/api/admin/service-areas/${rec.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !rec.isActive }),
    });
    setRecords(r => r.map(x => x.id === rec.id ? { ...x, isActive: !x.isActive } : x));
    showToast("success", `${rec.zip} ${rec.isActive ? "deactivated" : "activated"}`);
  };

  const handleEdit = async (id: string, data: Partial<ZipRecord>) => {
    await fetch(`/api/admin/service-areas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await load();
    showToast("success", "ZIP code updated");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this ZIP code from service area?")) return;
    await fetch(`/api/admin/service-areas/${id}`, { method: "DELETE" });
    setRecords(r => r.filter(x => x.id !== id));
    showToast("success", "ZIP code removed");
  };

  const handleBulkDelete = async () => {
    if (!selected.size || !confirm(`Delete ${selected.size} selected ZIP codes?`)) return;
    setDeleting(true);
    try {
      await fetch("/api/admin/service-areas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      setRecords(r => r.filter(x => !selected.has(x.id)));
      setSelected(new Set());
      showToast("success", `${selected.size} ZIP codes deleted`);
    } finally {
      setDeleting(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm("This will import all ZIP codes from the static list. Existing ZIPs will not be overwritten. Continue?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/service-areas/seed", { method: "POST" });
      const d = await res.json();
      await load();
      showToast("success", d.message || "Seed complete");
    } catch {
      showToast("error", "Seed failed");
    } finally {
      setSeeding(false);
    }
  };

  const exportCsv = () => {
    const rows = [["ZIP", "City", "County", "Active", "Notes"], ...records.map(r => [r.zip, r.city, r.county || "", r.isActive ? "Yes" : "No", r.notes || ""])];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "service-areas.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("success", "CSV exported");
  };

  const toggleSelect = (id: string) => {
    setSelected(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r.id)));
  };

  return (
    <div className="max-w-6xl mx-auto pb-12" style={{ fontFamily: FN }}>
      {toast && <Toast type={toast.type} msg={toast.msg} onClose={() => setToast(null)} />}
      {showAdd && <AddZipModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
      {editRec && <EditModal record={editRec} onSave={handleEdit} onClose={() => setEditRec(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,160,0,0.12)" }}>
              <MapPin className="w-5 h-5" style={{ color: "#FFA000" }} />
            </div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: "#000223" }}>Service Areas</h1>
          </div>
          <p className="text-slate-500 font-semibold text-sm ml-13">Manage Massachusetts ZIP codes where Boston Legend operates</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={handleSeed} disabled={seeding} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black border-2 border-slate-200 text-slate-600 hover:border-[#FFA000] hover:text-[#000223] transition-all disabled:opacity-50">
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {seeding ? "Seeding…" : "Seed from Default List"}
          </button>
          <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black border-2 border-slate-200 text-slate-600 hover:border-slate-400 transition-all">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all" style={{ background: "#000223", color: "#FFA000" }}>
            <Plus className="w-4 h-4" /> Add ZIP Code
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total ZIPs", value: records.length, color: "#000223", bg: "rgba(0,2,35,0.06)" },
          { label: "Active", value: activeCount, color: "#10B981", bg: "rgba(16,185,129,0.08)" },
          { label: "Inactive", value: inactiveCount, color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black shrink-0" style={{ background: s.bg, color: s.color }}>{s.value}</div>
            <div className="text-sm font-bold text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-300 pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ZIP, city, or county…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-100 focus:border-[#FFA000] outline-none text-sm font-semibold text-slate-700 bg-slate-50 focus:bg-white transition-all" />
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 shrink-0">
          {(["all", "active", "inactive"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg text-xs font-black capitalize transition-all"
              style={filterActive === f ? { background: "#000223", color: "#FFA000" } : { color: "#6B7280" }}>
              {f}
            </button>
          ))}
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border-2 border-slate-100 hover:border-slate-300 text-slate-400 hover:text-slate-600 transition-all shrink-0">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl mb-3 text-sm font-bold text-amber-800">
          <span>{selected.size} selected</span>
          <button onClick={handleBulkDelete} disabled={deleting} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-black hover:bg-red-600 transition-colors disabled:opacity-50">
            {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            Delete Selected
          </button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-amber-600 hover:text-amber-800 text-xs font-bold">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-4 py-3 text-left w-10">
                  <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleAll} className="w-4 h-4 rounded accent-amber-500 cursor-pointer" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-400">ZIP</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-400">City / Neighborhood</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-400 hidden md:table-cell">County</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-400 hidden lg:table-cell">Notes</th>
                <th className="px-4 py-3 text-right text-xs font-black uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-16"><Loader2 className="w-6 h-6 animate-spin mx-auto" style={{ color: "#FFA000" }} /></td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16">
                    <MapPin className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                    <p className="font-black text-slate-400 text-sm">No ZIP codes found</p>
                    <p className="text-xs text-slate-300 font-semibold mt-1">Add ZIP codes or click "Seed from Default List"</p>
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id} className={`hover:bg-amber-50/30 transition-colors ${selected.has(r.id) ? "bg-amber-50/50" : ""}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)}
                      className="w-4 h-4 rounded accent-amber-500 cursor-pointer" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-black text-sm" style={{ color: "#000223" }}>{r.zip}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-700">{r.city}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs font-semibold text-slate-400">{r.county || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(r)} className="flex items-center gap-1.5 group">
                      {r.isActive
                        ? <><ToggleRight className="w-5 h-5 text-emerald-500 group-hover:text-emerald-600" /><span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">Active</span></>
                        : <><ToggleLeft className="w-5 h-5 text-slate-300 group-hover:text-slate-400" /><span className="text-xs font-black text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">Inactive</span></>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs text-slate-400 font-semibold truncate max-w-32 block">{r.notes || "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditRec(r)} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs font-bold text-slate-400">
            Showing {filtered.length} of {records.length} ZIP codes
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className="mt-5 flex items-start gap-3 px-5 py-4 bg-blue-50 border border-blue-100 rounded-2xl">
        <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-blue-800">Live Service Area Validation</p>
          <p className="text-xs font-semibold text-blue-600 mt-0.5">
            Only <strong>active</strong> ZIP codes appear in the customer booking form. Deactivating a ZIP immediately removes it from the dropdown without requiring a redeployment.
            The system also falls back to the static list if the database table is empty.
          </p>
        </div>
      </div>
    </div>
  );
}

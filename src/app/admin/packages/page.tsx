"use client";
import { useEffect, useState } from "react";
import { Loader2, Plus, Edit2, Package as PackageIcon, Trash2, CheckCircle2, XCircle, AlertCircle, ImageIcon, Save } from "lucide-react";

type Package = any;

const EMPTY_PACKAGE = {
  name: "",
  description: "",
  serviceType: "AMERICANO_TRUCK",
  price: 0,
  servings: 50,
  extraPiecePrice: 3.00,
  sortOrder: 10,
  image: "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67dc601bc29781a5af163351_image-01-products-boston-legend-ice-cream-truck.webp",
  isActive: true,
  features: []
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(EMPTY_PACKAGE);
  const [saving, setSaving] = useState(false);
  const [featuresText, setFeaturesText] = useState("");

  const loadPackages = () => {
    setLoading(true);
    fetch("/api/admin/packages")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          // Sort by sortOrder
          setPackages(data.data.sort((a: any, b: any) => a.sortOrder - b.sortOrder));
        } else {
          setError("Failed to load packages or DB is offline.");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Network error fetching packages.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPackages(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_PACKAGE });
    setFeaturesText("");
    setShowModal(true);
  };

  const openEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    let parsedFeatures: string[] = [];
    if (typeof pkg.features === "string") {
      try { parsedFeatures = JSON.parse(pkg.features); } catch(e) { parsedFeatures = pkg.features.split(","); }
    } else if (Array.isArray(pkg.features)) {
      parsedFeatures = pkg.features;
    }
    setFormData({
      ...pkg,
      price: pkg.price || pkg.basePrice,
      servings: pkg.servings || pkg.includedQty,
      image: pkg.imageUrl || pkg.image
    });
    setFeaturesText(parsedFeatures.join("\n"));
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        features: featuresText.split("\\n").map(s => s.trim()).filter(s => s)
      };

      const url = editingId ? `/api/admin/packages/${editingId}` : "/api/admin/packages";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      
      if (res.ok && json.success) {
        setShowModal(false);
        loadPackages();
      } else {
        alert(json.error || "Failed to save package");
      }
    } catch (err) {
      alert("Network error saving package");
    }
    setSaving(false);
  };

  const toggleStatus = async (pkg: Package) => {
    if(!confirm(`Are you sure you want to ${pkg.isActive ? 'DEACTIVATE' : 'ACTIVATE'} ${pkg.name}?`)) return;
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !pkg.isActive })
      });
      if (res.ok) loadPackages();
    } catch (e) { alert("Failed to toggle status"); }
  };

  const deletePackage = async (pkg: Package) => {
    if(!confirm(`WARNING: Are you sure you want to PERMANENTLY DELETE ${pkg.name}?`)) return;
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok && json.success) {
        loadPackages();
      } else {
        alert(json.error || "Failed to delete package");
      }
    } catch (e) { alert("Failed to delete package"); }
  };

  return (
    <div className="pb-12" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#000223] flex items-center gap-3">
            <PackageIcon className="w-8 h-8 text-[#FFA000]" />
            Manage Packages
          </h1>
          <p className="text-slate-500 font-semibold mt-1 text-sm">Add, edit, or disable Boston Legend packages. Changes sync instantly.</p>
        </div>
        <button onClick={openAdd} className="btn-primary py-2.5 px-5 flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Package
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl mb-8 flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="font-bold">Error</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFA000]" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.length === 0 && !error && (
            <div className="col-span-full text-center py-12 text-slate-500 font-medium">
              No packages found in the database.
            </div>
          )}
          {packages.map(pkg => (
            <div key={pkg.id} className={`bg-white border rounded-3xl p-5 shadow-sm transition-all ${pkg.isActive ? 'border-slate-200 hover:border-[#FFA000]/50' : 'border-slate-200 opacity-60 bg-slate-50'}`}>
              
              <div className="relative h-32 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img src={pkg.imageUrl || pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => openEdit(pkg)} className="p-2 bg-white/90 hover:bg-white rounded-lg text-slate-700 hover:text-blue-600 shadow-sm transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deletePackage(pkg)} className="p-2 bg-white/90 hover:bg-white rounded-lg text-slate-700 hover:text-red-600 shadow-sm transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <div className="font-black text-lg text-[#000223] leading-tight">{pkg.name}</div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-black text-[#FFA000]">${pkg.price || pkg.basePrice}</span>
                <span className="text-xs font-black bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md tracking-wider">
                  {pkg.serviceType === 'AMERICANO_TRUCK' ? 'TRUCK' : 'VAN'}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-600 font-semibold mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between"><span>Servings:</span> <span className="font-black text-[#000223]">{pkg.servings || pkg.includedQty}</span></div>
                <div className="flex justify-between"><span>Extra Piece:</span> <span className="font-black text-[#000223]">${pkg.extraPiecePrice}</span></div>
                <div className="flex justify-between"><span>Sort Order:</span> <span className="font-black text-[#000223]">{pkg.sortOrder || 0}</span></div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {pkg.isActive ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-500" /><span className="text-xs font-black tracking-wide text-emerald-600">ACTIVE</span></>
                  ) : (
                    <><XCircle className="w-4 h-4 text-slate-400" /><span className="text-xs font-black tracking-wide text-slate-500">DISABLED</span></>
                  )}
                </div>
                <button onClick={() => toggleStatus(pkg)} className="text-xs font-bold text-slate-500 hover:text-blue-600 underline">
                  Toggle Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-black text-xl text-[#000223] flex items-center gap-2">
                <PackageIcon className="w-5 h-5 text-[#FFA000]"/> {editingId ? "Edit Package" : "New Package"}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors"><XCircle className="w-6 h-6"/></button>
            </div>
            
            <form onSubmit={handleSave} className="overflow-y-auto p-6 flex-1 bg-white">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Image & Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="label-premium">Package Name</label>
                    <input required value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="input-premium py-2.5 w-full text-sm font-bold" placeholder="E.g. The Legend Classic" />
                  </div>
                  <div>
                    <label className="label-premium">Description</label>
                    <textarea required value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="input-premium py-2 w-full text-sm h-24" placeholder="Brief description for customers..." />
                  </div>
                  <div>
                    <label className="label-premium flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Image URL</label>
                    <input required value={formData.image} onChange={e=>setFormData({...formData, image:e.target.value})} className="input-premium py-2 w-full text-xs font-mono" placeholder="https://..." />
                  </div>
                </div>

                {/* Pricing & Logistics */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-premium">Base Price ($)</label>
                      <input required type="number" step="0.01" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} className="input-premium py-2 w-full font-black text-[#FFA000]" />
                    </div>
                    <div>
                      <label className="label-premium">Included Servings</label>
                      <input required type="number" value={formData.servings} onChange={e=>setFormData({...formData, servings:e.target.value})} className="input-premium py-2 w-full font-bold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-premium">Extra Piece Price ($)</label>
                      <input required type="number" step="0.01" value={formData.extraPiecePrice} onChange={e=>setFormData({...formData, extraPiecePrice:e.target.value})} className="input-premium py-2 w-full font-bold" />
                    </div>
                    <div>
                      <label className="label-premium">Service Type</label>
                      <select value={formData.serviceType} onChange={e=>setFormData({...formData, serviceType:e.target.value})} className="input-premium py-2 w-full text-sm font-bold">
                        <option value="AMERICANO_TRUCK">Ice Cream Truck</option>
                        <option value="VAN">Delivery Van</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="label-premium">Sort Order</label>
                      <input required type="number" value={formData.sortOrder} onChange={e=>setFormData({...formData, sortOrder:e.target.value})} className="input-premium py-2 w-full font-bold" />
                    </div>
                  </div>
                </div>

                {/* Features list */}
                <div className="md:col-span-2">
                  <label className="label-premium">Features (One per line)</label>
                  <textarea 
                    value={featuresText} 
                    onChange={e=>setFeaturesText(e.target.value)} 
                    className="input-premium py-2 w-full text-sm h-32 leading-relaxed" 
                    placeholder={"Premium Ice Cream\\nMusic Included\\nCustom Menu"} 
                  />
                  <p className="text-xs font-semibold text-slate-400 mt-1">These will appear as bullet points under the package.</p>
                </div>

              </div>
            </form>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary py-2.5 px-6">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 px-8 flex items-center gap-2 text-sm">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                {editingId ? "Save Changes" : "Create Package"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Loader2, Plus, Edit2, Package as PackageIcon, Trash2, CheckCircle2, XCircle, AlertCircle, ImageIcon, Save, X } from "lucide-react";

type Package = any;

const EMPTY_PACKAGE = {
  name: "",
  description: "",
  serviceType: "AMERICANO_TRUCK",
  price: 0,
  servings: 50,
  extraPiecePrice: 5,
  extraGuestPrice: 5,
  durationMins: 60,
  sortOrder: 10,
  image: "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67dc601bc29781a5af163351_image-01-products-boston-legend-ice-cream-truck.webp",
  isActive: true,
  features: []
};

function PremiumImageUploader({
  value,
  onChange
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(value || null);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLocalPreview(value || null);
    setError("");
  }, [value]);

  const handleFile = async (file: File) => {
    setError("");
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are allowed.");
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size exceeds 5MB limit.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setLocalPreview(data.url);
        onChange(data.url);
      } else {
        setError(data.error || "Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setLocalPreview(null);
    onChange("");
  };

  return (
    <div className="space-y-4">
      <label className="block text-xs font-black uppercase tracking-widest text-[#000223]">Package Image</label>
      
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed p-6 transition-all flex flex-col items-center justify-center text-center bg-slate-50 min-h-[160px] ${
          dragActive ? "border-[#FFA000] bg-amber-50/40" : "border-slate-200 hover:border-slate-350"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFA000]" />
            <p className="text-xs font-bold text-slate-500">Uploading to secure storage...</p>
          </div>
        ) : localPreview ? (
          <div className="relative w-full max-w-[200px] h-32 rounded-xl overflow-hidden shadow-sm border border-slate-100">
            <img src={localPreview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={handleRemove}
              className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/75 text-white hover:bg-black transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-slate-550">
              Drag and drop an image here, <label className="text-[#FFA000] hover:underline cursor-pointer font-black">choose a file<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleChange} /></label>, or paste an image URL.
            </div>
            <div className="text-[10px] text-slate-400 font-bold">
              Recommended: 1200×800px, JPG/PNG/WebP. Max size: 5MB.
            </div>
          </div>
        )}
      </div>

      {localPreview && localPreview.startsWith("https://") && (
        <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-xl text-[11px] text-emerald-800 font-bold flex items-start gap-2 leading-relaxed">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>
            <strong>Success!</strong> Image is uploaded to secure production storage.
          </span>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-650 font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5"/> {error}</p>
      )}

      <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
        <button 
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 flex items-center justify-between bg-[#FAF6EF]/50 hover:bg-[#FAF6EF]/85 text-[#000223] font-black text-xs border-b border-slate-200/40"
        >
          <span>Advanced: Paste image URL</span>
          <span className="text-[10px] font-black text-[#FFA000]">{showAdvanced ? "HIDE" : "SHOW"}</span>
        </button>
        {showAdvanced && (
          <div className="p-4 bg-white">
            <input 
              type="url"
              value={value} 
              onChange={e => {
                const url = e.target.value;
                onChange(url);
                if (url.startsWith("http")) {
                  setLocalPreview(url);
                }
              }} 
              className="w-full py-2.5 px-4 rounded-xl border-2 font-mono text-sm outline-none transition-all bg-[#FAF8F0]/30 text-[#000223] border-slate-200 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 placeholder:text-slate-400 text-[16px]" 
              placeholder="https://example.com/image.jpg" 
            />
            <p className="text-[9.5px] font-semibold text-slate-400 mt-1.5">Provide a web address to save this image permanently in the database.</p>
          </div>
        )}
      </div>

    </div>
  );
}

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
            <div key={pkg.id} className={`bg-white border rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${pkg.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'}`}>
              
              <div className="relative h-44 w-full rounded-3xl overflow-hidden mb-5 bg-slate-50 border border-slate-100">
                <img src={pkg.imageUrl || pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button onClick={() => openEdit(pkg)} className="p-2.5 bg-white/95 hover:bg-white rounded-xl text-slate-700 hover:text-blue-600 shadow-md transition-all hover:scale-105">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deletePackage(pkg)} className="p-2.5 bg-white/95 hover:bg-white rounded-xl text-slate-700 hover:text-red-600 shadow-md transition-all hover:scale-105">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <div className="font-black text-xl text-[#000223] leading-tight">{pkg.name}</div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-black text-[#FFA000]">${(pkg.price || pkg.basePrice || 0).toFixed(2)}</span>
                <span className="text-xs font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-md tracking-wider">
                  {pkg.serviceType === 'AMERICANO_TRUCK' ? 'TRUCK' : 'VAN'}
                </span>
              </div>

              <div className="space-y-2.5 text-sm text-[#000223]/70 font-bold mb-5 bg-[#FAF6EF] p-4.5 rounded-2xl border border-[#FAF6EF]/80">
                <div className="flex justify-between"><span>Servings:</span> <span className="font-black text-[#000223]">{pkg.servings || pkg.includedQty}</span></div>
                <div className="flex justify-between"><span>Extra Guest:</span> <span className="font-black text-[#000223]">${pkg.extraGuestPrice ?? pkg.extraPiecePrice}/person</span></div>
                <div className="flex justify-between"><span>Duration:</span> <span className="font-black text-[#000223]">{pkg.durationMins ?? 60} min</span></div>
                <div className="flex justify-between"><span>Sort Order:</span> <span className="font-black text-[#000223]">{pkg.sortOrder || 0}</span></div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {pkg.isActive ? (
                    <><CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /><span className="text-xs font-black tracking-wide text-emerald-600">ACTIVE</span></>
                  ) : (
                    <><XCircle className="w-4.5 h-4.5 text-slate-400" /><span className="text-xs font-black tracking-wide text-slate-500">DISABLED</span></>
                  )}
                </div>
                <button onClick={() => toggleStatus(pkg)} className="text-xs font-black text-[#000223]/60 hover:text-blue-600 transition-colors uppercase tracking-wider">
                  Toggle Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000223]/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200 border border-slate-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-black text-xl text-[#000223] flex items-center gap-2">
                <PackageIcon className="w-5 h-5 text-[#FFA000]"/> {editingId ? "Edit Package" : "New Package"}
              </h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-red-500 transition-colors"><XCircle className="w-6 h-6"/></button>
            </div>
            
            <form onSubmit={handleSave} className="overflow-y-auto p-8 flex-1 bg-white space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Image & Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="label-premium">Package Name</label>
                    <input required value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full py-3.5 px-5 rounded-2xl border-2 font-semibold text-base outline-none transition-all bg-white text-[#000223] border-slate-100 placeholder:text-slate-400 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15" placeholder="E.g. The Legend Classic" />
                  </div>
                  <div>
                    <label className="label-premium">Description</label>
                    <textarea required value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full py-3.5 px-5 rounded-2xl border-2 font-semibold text-base outline-none transition-all bg-white text-[#000223] border-slate-100 placeholder:text-slate-400 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15 h-28" placeholder="Brief description for customers..." />
                  </div>
                  <PremiumImageUploader 
                    value={formData.image} 
                    onChange={url => setFormData({ ...formData, image: url })} 
                  />
                </div>

                {/* Pricing & Logistics */}
                <div className="space-y-4 bg-[#FAF6EF] p-6 rounded-3xl border border-slate-100/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-premium">Base Price ($)</label>
                      <input required type="number" step="0.01" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} className="w-full py-3.5 px-5 rounded-2xl border-2 font-black text-base outline-none transition-all bg-white text-[#FFA000] border-slate-100 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15" />
                    </div>
                    <div>
                      <label className="label-premium">Included Servings</label>
                      <input required type="number" value={formData.servings} onChange={e=>setFormData({...formData, servings:e.target.value})} className="w-full py-3.5 px-5 rounded-2xl border-2 font-semibold text-base outline-none transition-all bg-white text-[#000223] border-slate-100 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-premium">Extra Guest Price ($)</label>
                      <input required type="number" step="0.01" value={formData.extraGuestPrice ?? formData.extraPiecePrice} onChange={e=>setFormData({...formData, extraGuestPrice:e.target.value, extraPiecePrice:e.target.value})} className="w-full py-3.5 px-5 rounded-2xl border-2 font-semibold text-base outline-none transition-all bg-white text-[#000223] border-slate-100 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15" />
                    </div>
                    <div>
                      <label className="label-premium">Duration (mins)</label>
                      <input required type="number" value={formData.durationMins ?? 60} onChange={e=>setFormData({...formData, durationMins:e.target.value})} className="w-full py-3.5 px-5 rounded-2xl border-2 font-semibold text-base outline-none transition-all bg-white text-[#000223] border-slate-100 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-premium">Service Type</label>
                      <select value={formData.serviceType} onChange={e=>setFormData({...formData, serviceType:e.target.value})} className="w-full py-3.5 px-5 rounded-2xl border-2 font-semibold text-base outline-none transition-all bg-white text-[#000223] border-slate-100 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15">
                        <option value="AMERICANO_TRUCK">Ice Cream Truck</option>
                        <option value="VAN">Delivery Van</option>
                      </select>
                    </div>
                    <div>
                      <label className="label-premium">Sort Order</label>
                      <input required type="number" value={formData.sortOrder} onChange={e=>setFormData({...formData, sortOrder:e.target.value})} className="w-full py-3.5 px-5 rounded-2xl border-2 font-semibold text-base outline-none transition-all bg-white text-[#000223] border-slate-100 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15" />
                    </div>
                  </div>
                </div>

                {/* Features list */}
                <div className="md:col-span-2">
                  <label className="label-premium">Features (One per line)</label>
                  <textarea 
                    value={featuresText} 
                    onChange={e=>setFeaturesText(e.target.value)} 
                    className="w-full py-3.5 px-5 rounded-2xl border-2 font-semibold text-base outline-none transition-all bg-white text-[#000223] border-slate-100 placeholder:text-slate-400 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15 h-32 leading-relaxed" 
                    placeholder={"Premium Ice Cream\nMusic Included\nCustom Menu"} 
                  />
                  <p className="text-xs font-semibold text-slate-400 mt-1.5">These will appear as bullet points under the package.</p>
                </div>

              </div>
            </form>
            
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary py-3 px-6 rounded-2xl font-extrabold text-sm border-2 border-slate-200/80 bg-white text-[#000223] transition-all hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary py-3 px-8 rounded-2xl font-black text-sm text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] hover:shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
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

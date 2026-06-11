"use client";
import { useState, useEffect } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2, RotateCcw, MapPin, Clock, DollarSign, Zap, Navigation, Calendar, Unplug } from "lucide-react";

// ─── Setting definitions with labels, helpers, groups ────────────────────────
const SETTING_GROUPS = [
  {
    id: "distance",
    label: "Distance & Travel",
    icon: Navigation,
    color: "#FFA000",
    settings: [
      { key: "FREE_MILES",                      label: "Free Miles",                     helper: "Miles included free before travel fee starts",                              unit: "mi",   default: "10"   },
      { key: "RATE_PER_MILE",                   label: "Rate per Mile",                  helper: "Travel fee charged per mile beyond free miles ($)",                        unit: "$/mi", default: "2.25" },
      { key: "DISTANCE_REVIEW_THRESHOLD_MILES", label: "Distance Review Threshold",      helper: "Miles beyond which bookings go to Pending Review (not rejected)",          unit: "mi",   default: "30"   },
      { key: "MAX_DISTANCE_MILES",              label: "Typical Max Range (soft flag)",  helper: "Info flag only — adds EXCEEDS_TYPICAL_RANGE label. NEVER causes rejection", unit: "mi",   default: "45"   },
    ],
  },
  {
    id: "booking",
    label: "Booking & Pricing",
    icon: DollarSign,
    color: "#10B981",
    settings: [
      { key: "AUTO_CONFIRM_THRESHOLD",  label: "Auto-Confirm Threshold",  helper: "Minimum total ($) for automatic confirmation without admin review",  unit: "$",  default: "500" },
    ],
  },
  {
    id: "hours",
    label: "Business Hours (Mon–Fri: 8AM–10PM, Sat–Sun: 9AM–10PM)",
    icon: Clock,
    color: "#6366F1",
    settings: [
      { key: "BUSINESS_START_WEEKDAY",  label: "Weekday Open",   helper: "Opening hour Mon–Fri, 24h (8 = 8:00 AM)",   unit: "h",  default: "8"  },
      { key: "BUSINESS_END_WEEKDAY",    label: "Weekday Close",  helper: "Closing hour Mon–Fri, 24h (22 = 10:00 PM)", unit: "h",  default: "22" },
      { key: "BUSINESS_START_WEEKEND",  label: "Weekend Open",   helper: "Opening hour Sat–Sun, 24h (9 = 9:00 AM)",   unit: "h",  default: "9"  },
      { key: "BUSINESS_END_WEEKEND",    label: "Weekend Close",  helper: "Closing hour Sat–Sun, 24h (22 = 10:00 PM)", unit: "h",  default: "22" },
    ],
  },
  {
    id: "system",
    label: "System & Notifications",
    icon: Zap,
    color: "#3B82F6",
    settings: [
      { key: "ADMIN_ALERT_EMAIL", label: "Admin Alert Email", helper: "Email address to receive chat escalations and alerts", unit: "", default: "ops@bostonlegend.com" },
    ],
  },
];

const ALL_KEYS = SETTING_GROUPS.flatMap(g => g.settings.map(s => s.key));
const DEFAULTS: Record<string,string> = Object.fromEntries(
  SETTING_GROUPS.flatMap(g => g.settings.map(s => [s.key, s.default]))
);

export default function SettingsPage() {
  const [values, setValues]     = useState<Record<string,string>>(DEFAULTS);
  const [original, setOriginal] = useState<Record<string,string>>(DEFAULTS);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState<{type:"success"|"error"; msg:string}|null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then((data: Record<string,string>) => {
        const merged = { ...DEFAULTS, ...data };
        setValues(merged);
        setOriginal(merged);
      })
      .finally(() => setLoading(false));
  }, []);

  const isDirty = ALL_KEYS.some(k => values[k] !== original[k]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Save failed");
      setOriginal({ ...values });
      setToast({ type: "success", msg: "Settings saved successfully." });
    } catch {
      setToast({ type: "error", msg: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      const res = await fetch("/api/auth/google/disconnect", { method: "POST" });
      if (!res.ok) throw new Error("Disconnect failed");
      
      const newValues = { ...values };
      delete newValues["google_calendar_refresh_token"];
      delete newValues["google_calendar_access_token"];
      setValues(newValues);
      setOriginal(newValues);
      
      setToast({ type: "success", msg: "Google Calendar disconnected." });
    } catch {
      setToast({ type: "error", msg: "Failed to disconnect Google Calendar." });
    }
  };

  const handleReset = () => setValues({ ...original });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#FFA000" }} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-12" style={{ fontFamily: "'Inter','Nunito',sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-bold transition-all ${toast.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "#000223" }}>Platform Settings</h1>
          <p className="text-slate-500 font-semibold mt-1 text-sm">Configure pricing, distance rules, and business hours. Changes take effect immediately.</p>
        </div>
        <div className="flex gap-2">
          {isDirty && (
            <button onClick={handleReset} className="px-4 py-2.5 rounded-xl text-sm font-black border-2 border-slate-200 text-slate-500 hover:border-slate-400 transition-all flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Discard
            </button>
          )}
          <button onClick={handleSave} disabled={saving || !isDirty}
            className="px-6 py-2.5 rounded-xl text-sm font-black shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
            style={{ background: "#000223", color: isDirty ? "#FFA000" : "#666" }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Setting Groups */}
      <div className="space-y-6">
        {SETTING_GROUPS.map(group => {
          const Icon = group.icon;
          return (
            <div key={group.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Group header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${group.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: group.color }} />
                </div>
                <div>
                  <h2 className="text-base font-black" style={{ color: "#000223" }}>{group.label}</h2>
                </div>
              </div>
              {/* Settings rows */}
              <div className="divide-y divide-slate-50">
                {group.settings.map(s => {
                  const changed = values[s.key] !== original[s.key];
                  return (
                    <div key={s.key} className="px-6 py-5 flex items-center gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm" style={{ color: "#000223" }}>{s.label}</span>
                          {changed && <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-lg">unsaved</span>}
                        </div>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{s.helper}</p>
                        <p className="text-[10px] text-slate-300 font-mono mt-1">key: {s.key}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type={s.key.includes("EMAIL") ? "text" : "number"}
                          value={values[s.key] ?? s.default}
                          onChange={e => setValues(v => ({ ...v, [s.key]: e.target.value }))}
                          className={`${s.key.includes("EMAIL") ? "w-64 text-left" : "w-28 text-center"} px-3 py-2.5 rounded-xl border-2 font-black text-sm outline-none transition-all`}
                          style={{
                            borderColor: changed ? "#FFA000" : "#E5E7EB",
                            background: changed ? "#FFFBEB" : "#F8F9FC",
                            color: "#000223",
                            fontFamily: s.key.includes("EMAIL") ? "inherit" : "monospace",
                          }}
                          step={s.key.includes("EMAIL") ? undefined : "any"}
                        />
                        <span className="text-xs font-bold text-slate-400 w-8">{s.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Google Calendar Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-black" style={{ color: "#000223" }}>Google Calendar Integration</h2>
            </div>
          </div>
          <div className="px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#000223]">Connection Status</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Connect your Google Workspace account to automatically sync confirmed bookings.
                </p>
              </div>
              <div>
                {values["google_calendar_refresh_token"] ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                    <AlertCircle className="w-3.5 h-3.5" /> Disconnected
                  </span>
                )}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              {!values["google_calendar_refresh_token"] ? (
                <a
                  href="/api/auth/google"
                  className="px-5 py-2.5 rounded-xl text-sm font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Connect Google Account
                </a>
              ) : (
                <button
                  onClick={handleDisconnectGoogle}
                  className="px-5 py-2.5 rounded-xl text-sm font-black text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-all flex items-center gap-2"
                >
                  <Unplug className="w-4 h-4" /> Disconnect Calendar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
        <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-black text-blue-800">Live Settings</p>
          <p className="text-xs font-semibold text-blue-600 mt-0.5">
            All values are read directly from the database by the AI Engine on every booking request. No code redeployment needed.
          </p>
        </div>
      </div>
    </div>
  );
}

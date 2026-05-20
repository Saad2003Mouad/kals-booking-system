"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { MapPin, Clock, Users, CheckCircle2, Navigation, Phone, Loader2, LogOut, Map, Calendar, Briefcase } from "lucide-react";

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

const STATUS_OPTIONS = [
  { value: "PENDING",    label: "Pending",     color: "#9CA3AF",  bg: "#F3F4F6" },
  { value: "ON_THE_WAY", label: "On the Way",  color: "#3B82F6",  bg: "#EFF6FF" },
  { value: "ARRIVED",    label: "Arrived",     color: "#F59E0B",  bg: "#FFFBEB" },
  { value: "COMPLETED",  label: "Completed",   color: "#10B981",  bg: "#ECFDF5" },
];

type Assignment = {
  id: string; jobStatus: string; driverNote: string | null;
  booking: {
    bookingNumber: string; eventDate: string; startTime: string; durationMins: number;
    address: string; city: string; zip: string; eventType: string; guests: number;
    totalAmount: number; notes: string | null;
    customer: { firstName: string; lastName: string; phone: string; email: string };
    vehicle: { code: string; name: string } | null;
    package: { name: string } | null;
  };
};

export default function DriverDashboard() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [note, setNote]         = useState("");
  const [mapMode, setMapMode]   = useState(false);

  useEffect(() => {
    fetchJobs();
    const t = setInterval(fetchJobs, 30000);
    return () => clearInterval(t);
  }, []);

  const fetchJobs = async () => {
    try {
      const r = await fetch("/api/driver/jobs");
      if (r.ok) setAssignments(await r.json());
    } catch {} finally { setLoading(false); }
  };

  const updateStatus = async (id: string, jobStatus: string) => {
    setUpdating(id);
    await fetch(`/api/driver/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobStatus, driverNote: note }),
    });
    await fetchJobs();
    setUpdating(null);
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, jobStatus } : null);
  };

  const statusStyle = (s: string) => STATUS_OPTIONS.find(o => o.value === s) ?? STATUS_OPTIONS[0];
  const todayStr  = new Date().toISOString().split("T")[0];
  const todayJobs = assignments.filter(a => a.booking.eventDate.startsWith(todayStr));
  const upcoming  = assignments.filter(a => !a.booking.eventDate.startsWith(todayStr));
  const mapsUrl   = (a: Assignment) =>
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${a.booking.address},${a.booking.city},MA ${a.booking.zip}`)}`;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #000223 0%, #001a4c 100%)" }}>
      <div className="text-center">
        <Image src={LOGO} alt="Boston Legend" width={160} height={54} className="h-12 w-auto mx-auto mb-6" unoptimized />
        <Loader2 className="w-8 h-8 animate-spin mx-auto" style={{ color: "#FFA000" }} />
      </div>
    </div>
  );

  const renderCard = (a: Assignment) => {
    const s = statusStyle(a.jobStatus);
    const date = new Date(a.booking.eventDate + "T12:00:00");
    const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    return (
      <div key={a.id}
        onClick={() => { setSelected(a); setNote(a.driverNote || ""); setMapMode(false); }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 group">

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-black text-base" style={{ color: "#000223" }}>#{a.booking.bookingNumber}</div>
            <div className="text-xs font-bold text-gray-400 mt-0.5">{a.booking.eventType}</div>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-black" style={{ background: s.bg, color: s.color }}>
            {s.label}
          </span>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: "#FFA000" }} />
            {dateStr} · {a.booking.startTime}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "#FFA000" }} />
            {a.booking.address}, {a.booking.city}
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
            <Users className="w-4 h-4 flex-shrink-0" style={{ color: "#FFA000" }} />
            {a.booking.guests} guests · {a.booking.durationMins} min
          </div>
        </div>

        {/* Navigate Button */}
        <a href={mapsUrl(a)} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-black transition-all hover:opacity-90"
          style={{ background: "#000223", color: "#FFA000" }}>
          <Navigation className="w-3.5 h-3.5" /> Navigate
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: "#F4F4F5", fontFamily: "'Nunito', sans-serif" }}>

      {/* ── TOP NAV ── */}
      <div className="sticky top-0 z-40 shadow-sm" style={{ background: "#000223" }}>
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={LOGO} alt="Boston Legend" width={120} height={40} className="h-9 w-auto" unoptimized />
            <div className="h-5 w-px bg-white/20" />
            <div className="text-xs font-black text-white/50 uppercase tracking-widest">Driver</div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all hover:bg-white/10"
            style={{ color: "#9CA3AF" }}>
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* ── GREETING STRIP ── */}
      <div style={{ background: "linear-gradient(135deg, #FFA000 0%, #FFB300 100%)" }}>
        <div className="max-w-lg mx-auto px-4 py-5">
          <div className="font-black text-xl" style={{ color: "#000223" }}>
            Hey, {session?.user?.name?.split(" ")[0]} 👋
          </div>
          <div className="text-sm font-bold mt-0.5" style={{ color: "rgba(0,2,35,0.6)" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="max-w-lg mx-auto px-4 -mt-1 pb-2">
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: "Today",    value: todayJobs.length,   icon: "📅" },
            { label: "Upcoming", value: upcoming.length,    icon: "🗓️" },
            { label: "Total",    value: assignments.length, icon: "🍦" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black" style={{ color: "#000223" }}>{s.value}</div>
              <div className="text-xs text-gray-400 font-bold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── JOB LISTS ── */}
      <div className="max-w-lg mx-auto px-4 py-4 space-y-6 pb-20">
        {todayJobs.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: "#FFA000" }} />
              <h2 className="font-black text-xs uppercase tracking-widest text-gray-500">Today's Jobs</h2>
            </div>
            <div className="space-y-3">{todayJobs.map(renderCard)}</div>
          </div>
        )}

        {upcoming.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <h2 className="font-black text-xs uppercase tracking-widest text-gray-500">Upcoming</h2>
            </div>
            <div className="space-y-3">{upcoming.map(renderCard)}</div>
          </div>
        )}

        {assignments.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🍦</div>
            <h2 className="text-xl font-black mb-2" style={{ color: "#000223" }}>No jobs assigned yet</h2>
            <p className="text-gray-400 font-semibold">Your assigned jobs will appear here.</p>
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[92vh] overflow-y-auto">

            {/* Tab switcher */}
            <div className="flex border-b border-gray-100">
              <button onClick={() => setMapMode(false)}
                className={`flex-1 py-3.5 text-sm font-black transition-colors ${!mapMode ? "border-b-2 border-[#FFA000]" : "text-gray-400"}`}
                style={!mapMode ? { color: "#000223" } : {}}>
                Details
              </button>
              <button onClick={() => setMapMode(true)}
                className={`flex-1 py-3.5 text-sm font-black transition-colors flex items-center justify-center gap-1.5 ${mapMode ? "border-b-2 border-[#FFA000]" : "text-gray-400"}`}
                style={mapMode ? { color: "#000223" } : {}}>
                <Map className="w-4 h-4" /> Map
              </button>
            </div>

            {mapMode ? (
              <div className="relative">
                <iframe
                  title="Event Location"
                  width="100%" height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(`${selected.booking.address},${selected.booking.city},MA ${selected.booking.zip}`)}&output=embed`}
                />
                <a href={mapsUrl(selected)} target="_blank" rel="noopener"
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-6 py-3 rounded-full font-black shadow-xl transition-all hover:scale-105"
                  style={{ background: "#FFA000", color: "#000223" }}>
                  <Navigation className="w-4 h-4" /> Open in Google Maps
                </a>
              </div>
            ) : (
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <div className="font-black text-xl" style={{ color: "#000223" }}>#{selected.booking.bookingNumber}</div>
                    <div className="text-gray-400 font-semibold text-sm mt-0.5">{selected.booking.eventType}</div>
                  </div>
                  <button onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all text-xl font-bold">
                    ×
                  </button>
                </div>

                {/* Info block */}
                <div className="space-y-3 mb-6 rounded-2xl p-4" style={{ background: "#F8F9FC" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,160,0,0.15)" }}>
                      <Clock className="w-4 h-4" style={{ color: "#FFA000" }} />
                    </div>
                    <div>
                      <div className="font-black text-sm" style={{ color: "#000223" }}>{selected.booking.startTime}</div>
                      <div className="text-xs text-gray-400 font-semibold">{selected.booking.durationMins} min event</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,160,0,0.15)" }}>
                      <MapPin className="w-4 h-4" style={{ color: "#FFA000" }} />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-700">{selected.booking.address}</div>
                      <div className="text-xs text-gray-400 font-semibold">{selected.booking.city}, MA {selected.booking.zip}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,160,0,0.15)" }}>
                      <Phone className="w-4 h-4" style={{ color: "#FFA000" }} />
                    </div>
                    <a href={`tel:${selected.booking.customer.phone}`}
                      className="font-bold text-sm transition-colors hover:text-[#FFA000]" style={{ color: "#000223" }}>
                      {selected.booking.customer.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,160,0,0.15)" }}>
                      <Users className="w-4 h-4" style={{ color: "#FFA000" }} />
                    </div>
                    <div className="font-semibold text-sm text-gray-700">
                      {selected.booking.guests} guests · {selected.booking.package?.name ?? ""}
                    </div>
                  </div>
                  {selected.booking.notes && (
                    <div className="border-t border-gray-200 pt-3 mt-3 text-gray-500 font-medium text-sm italic">
                      📝 {selected.booking.notes}
                    </div>
                  )}
                </div>

                {/* Status Buttons */}
                <div className="font-black text-xs uppercase tracking-widest text-gray-400 mb-3">Update Status</div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {STATUS_OPTIONS.map(s => {
                    const isActive = selected.jobStatus === s.value;
                    return (
                      <button key={s.value}
                        disabled={updating !== null || isActive}
                        onClick={() => updateStatus(selected.id, s.value)}
                        className="py-3 rounded-xl text-xs font-black transition-all"
                        style={{
                          background: isActive ? s.color : s.bg,
                          color: isActive ? "white" : s.color,
                          opacity: updating !== null && !isActive ? 0.6 : 1,
                        }}>
                        {updating === selected.id && !isActive ? "…" : s.label}
                      </button>
                    );
                  })}
                </div>

                {/* Note */}
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add a note (overtime, issues, etc.)…"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 outline-none resize-none mb-3 transition-all"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                  onFocus={e => (e.target.style.borderColor = "#FFA000")}
                  onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
                />

                {/* Complete CTA */}
                {selected.jobStatus !== "COMPLETED" && (
                  <button
                    onClick={() => updateStatus(selected.id, "COMPLETED")}
                    disabled={updating !== null}
                    className="w-full py-3.5 rounded-xl font-black flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: "#10B981", color: "white" }}>
                    <CheckCircle2 className="w-5 h-5" /> Mark as Completed
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

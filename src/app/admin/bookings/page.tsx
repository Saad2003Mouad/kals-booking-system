"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Eye, Search, Filter, RefreshCw, CheckCircle2, Clock,
  XCircle, Loader2, CalendarDays, User, DollarSign, Truck,
} from "lucide-react";

type Booking = {
  id: string;
  bookingNumber: string;
  status: string;
  eventDate: string;
  startTime: string;
  address: string;
  city: string;
  guests: number;
  durationMins: number;
  notes: string | null;
  customer: { firstName: string; lastName: string; phone: string };
  vehicle: { name: string; type: string } | null;
  package: { name: string; basePrice: number } | null;
  quote: { totalAmount: number } | null;
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  PENDING_REVIEW:  { label: "Pending Review",  bg: "bg-amber-50",   text: "text-amber-600",  icon: Clock },
  PENDING_PAYMENT: { label: "Pending Payment", bg: "bg-blue-50",    text: "text-blue-600",   icon: DollarSign },
  CONFIRMED:       { label: "Confirmed",       bg: "bg-emerald-50", text: "text-emerald-700",icon: CheckCircle2 },
  COMPLETED:       { label: "Completed",       bg: "bg-slate-50",   text: "text-slate-600",  icon: CheckCircle2 },
  CANCELLED:       { label: "Cancelled",       bg: "bg-red-50",     text: "text-red-600",    icon: XCircle },
  REJECTED:        { label: "Rejected",        bg: "bg-rose-50",    text: "text-rose-600",   icon: XCircle },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("ALL");
  const [updating, setUpdating]   = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.ok) {
        const json = await res.json();
        setBookings(json.data || []);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const confirmBooking = async (id: string) => {
    setUpdating(id);
    await fetch(`/api/admin/bookings/${id}/status`, { 
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CONFIRMED" })
    });
    await fetchBookings();
    setUpdating(null);
  };

  const filtered = bookings.filter(b => {
    const matchSearch =
      `${b.customer.firstName} ${b.customer.lastName} ${b.bookingNumber} ${b.city}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    ALL:             bookings.length,
    PENDING_REVIEW:  bookings.filter(b => b.status === "PENDING_REVIEW").length,
    PENDING_PAYMENT: bookings.filter(b => b.status === "PENDING_PAYMENT").length,
    CONFIRMED:       bookings.filter(b => b.status === "CONFIRMED").length,
  };

  return (
    <div className="space-y-6 pb-10" style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "#000223" }}>Bookings</h1>
          <p className="text-slate-500 font-semibold mt-1 text-sm">
            {counts.PENDING_REVIEW} pending review · {counts.PENDING_PAYMENT} pending payment · {counts.CONFIRMED} confirmed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/api/admin/export?type=bookings"
            download
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-slate-600 bg-white border border-slate-200 shadow-sm hover:border-[#FFA000] hover:text-[#000223] transition-all"
          >
            Export CSV
          </a>
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: "ALL",             label: "Total",           color: "text-[#000223]",   bg: "from-slate-50 to-white" },
          { key: "PENDING_REVIEW",  label: "Needs Review",    color: "text-amber-600",   bg: "from-amber-50 to-white" },
          { key: "PENDING_PAYMENT", label: "Awaiting Payment",color: "text-blue-600",    bg: "from-blue-50 to-white" },
          { key: "CONFIRMED",       label: "Confirmed",       color: "text-emerald-600", bg: "from-emerald-50 to-white" },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setStatus(s.key)}
            className={`bg-gradient-to-br ${s.bg} rounded-2xl border shadow-sm p-5 text-left transition-all ${statusFilter === s.key ? "border-[#FFA000] ring-2 ring-[#FFA000]/20" : "border-slate-200"}`}
          >
            <div className={`text-3xl font-black ${s.color} mb-1`}>{counts[s.key as keyof typeof counts]}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search bookings, customers, city…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10 transition-all bg-slate-50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:border-[#FFA000] bg-slate-50 cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="PENDING_PAYMENT">Pending Payment</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFA000]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-black text-slate-600">No bookings found</h3>
            <p className="text-sm font-semibold text-slate-400 mt-1">
              {search ? "Try adjusting your search" : "Bookings will appear here when customers reserve"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400">Booking</th>
                  <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400">Customer</th>
                  <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400">Date & Time</th>
                  <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400">Package / Vehicle</th>
                  <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400">Total</th>
                  <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400">Status</th>
                  <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(b => {
                  const sc = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.PENDING;
                  const StatusIcon = sc.icon;
                  const eventDate = new Date(b.eventDate + "T12:00:00");
                  const dateStr = eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

                  return (
                    <tr key={b.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="font-black text-sm text-[#000223]">#{b.bookingNumber}</div>
                        <div className="text-xs text-slate-400 font-semibold mt-0.5">{b.guests} guests · {b.durationMins} min</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-sm text-slate-800">{b.customer.firstName} {b.customer.lastName}</div>
                        <div className="text-xs text-slate-400 font-semibold mt-0.5">{b.customer.phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-sm text-slate-800">{dateStr}</div>
                        <div className="text-xs text-slate-400 font-semibold mt-0.5">{b.startTime} · {b.city}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-sm text-slate-800">{b.package?.name ?? "—"}</div>
                        <div className="text-xs text-slate-400 font-semibold mt-0.5">{b.vehicle?.name ?? "Unassigned"}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-black text-sm text-[#000223]">
                          ${b.quote?.totalAmount?.toFixed(0) ?? b.package?.basePrice?.toFixed(0) ?? "—"}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black ${sc.bg} ${sc.text}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {b.status === "PENDING_REVIEW" && (
                            <Link
                              href={`/admin/bookings/${b.id}`}
                              className="px-3 py-1.5 rounded-lg text-xs font-black text-white transition-all hover:opacity-90 flex items-center gap-1 bg-amber-500"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Review
                            </Link>
                          )}
                          <Link
                            href={`/admin/bookings/${b.id}`}
                            className="px-3 py-1.5 rounded-lg text-xs font-black text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

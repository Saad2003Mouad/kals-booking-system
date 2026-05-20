"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, User, MapPin, CalendarClock, DollarSign, Truck, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

type DetailBooking = any;

export default function AdminBookingDetailPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<DetailBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [internalNote, setInternalNote] = useState("");

  const loadBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${params.id}`);
      if (res.ok) {
        const json = await res.json();
        setBooking(json.data);
      }
    } catch (e) { }
    setLoading(false);
  };

  useEffect(() => { loadBooking(); }, [params.id]);

  const updateStatus = async (status: string) => {
    setUpdating(status);
    try {
      await fetch(`/api/admin/bookings/${params.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNote })
      });
      await loadBooking();
    } catch (e) { }
    setUpdating("");
  };

  if (loading) return <div className="flex items-center justify-center p-24"><Loader2 className="w-8 h-8 animate-spin text-[#FFA000]"/></div>;
  if (!booking) return <div className="p-24 text-center">Booking not found</div>;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in zoom-in duration-300">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-6 font-medium bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Bookings
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-[#000223] flex items-center gap-3">
            #{booking.bookingNumber}
            <span className={`px-3 py-1 text-[11px] rounded-full font-black uppercase tracking-widest ${
              booking.status.includes("PENDING") ? "bg-amber-100 text-amber-700" :
              booking.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
              booking.status === "REJECTED" || booking.status === "CANCELLED" ? "bg-red-100 text-red-700" :
              "bg-slate-100 text-slate-700"
            }`}>
              {booking.status.replace("_", " ")}
            </span>
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">Placed on {new Date(booking.createdAt).toLocaleString()}</p>
        </div>

        {booking.status === "PENDING_REVIEW" && (
          <div className="flex gap-3 w-full md:w-auto p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <button disabled={!!updating} onClick={() => updateStatus("REJECTED")} className="btn-secondary py-2 px-6 text-sm text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"><XCircle className="w-4 h-4"/> Reject</button>
            <button disabled={!!updating} onClick={() => updateStatus("PENDING_PAYMENT")} className="btn-primary py-2 px-6 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2">
              {updating === "PENDING_PAYMENT" ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4"/>}
              Approve and Mark Pending Payment
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-[#000223]"><User className="w-5 h-5 text-[#FFA000]" /> Customer Details</h3>
          <div className="space-y-4 text-sm font-semibold">
            <div className="flex justify-between items-center"><span className="text-slate-400">Name:</span> <span className="text-slate-800">{booking.customer.firstName} {booking.customer.lastName}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Email:</span> <a href={`mailto:${booking.customer.email}`} className="text-blue-600 hover:underline">{booking.customer.email}</a></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Phone:</span> <a href={`tel:${booking.customer.phone}`} className="text-blue-600 hover:underline">{booking.customer.phone}</a></div>
          </div>
        </div>

        {/* Event Info */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-[#000223]"><CalendarClock className="w-5 h-5 text-blue-500" /> Event Details</h3>
          <div className="space-y-4 text-sm font-semibold">
            <div className="flex justify-between items-center"><span className="text-slate-400">Date:</span> <span className="text-slate-800">{new Date(booking.eventDate).toLocaleDateString()}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Start Time:</span> <span className="text-slate-800">{booking.startTime}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Duration:</span> <span className="text-slate-800">{booking.durationMins} mins</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Guests:</span> <span className="text-slate-800">{booking.guests}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Type:</span> <span className="text-slate-800">{booking.eventType}</span></div>
          </div>
        </div>

        {/* Location Info */}
        <div className="card-premium p-6 md:col-span-2">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-[#000223]"><MapPin className="w-5 h-5 text-rose-500" /> Location</h3>
          <p className="text-slate-800 bg-slate-50 font-semibold p-4 rounded-xl border border-slate-100">{booking.address}, {booking.city}, {booking.zip}</p>
        </div>

        {/* Pricing Info */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-[#000223]"><DollarSign className="w-5 h-5 text-emerald-500" /> Pricing Breakdown</h3>
          <div className="space-y-3 text-sm font-bold pb-4 border-b border-slate-100 mb-4">
            <div className="flex justify-between items-center"><span className="text-slate-400">Base Price:</span> <span className="text-slate-800">${booking.quote?.basePrice?.toFixed(2) || "0.00"}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Travel Fee:</span> <span className="text-slate-800">${booking.quote?.travelFee?.toFixed(2) || "0.00"}</span></div>
          </div>
          <div className="flex justify-between items-center text-xl font-black">
            <span className="text-[#000223]">Total:</span>
            <span className="text-emerald-600">${booking.totalAmount?.toFixed(2) || "0.00"}</span>
          </div>
        </div>

        {/* Dispatch Actions */}
        <div className="card-premium p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-[#000223]"><Truck className="w-5 h-5 text-indigo-500" /> Dispatch Assignment</h3>
            <div className="space-y-4 font-semibold text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-slate-400 mb-1">Assigned Vehicle</div>
                <div className="text-slate-800 text-base">{booking.assignment?.vehicle?.code || "Unassigned"}</div>
              </div>
            </div>
          </div>
          <button disabled className="btn-secondary w-full py-2.5 mt-6 border-slate-200 opacity-50 cursor-not-allowed flex items-center justify-center gap-2">
            Manage Fleet Assignment <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full text-slate-500 uppercase tracking-wider">Coming Soon</span>
          </button>
        </div>
      </div>
      
      {booking.status === "PENDING_REVIEW" && (
        <div className="mt-6 card-premium p-6 border-amber-200 bg-amber-50/30">
          <label className="block text-sm font-black text-amber-800 mb-2">Add Internal Note (visible to staff only)</label>
          <textarea 
            value={internalNote} onChange={e=>setInternalNote(e.target.value)}
            className="w-full p-3 rounded-xl border border-amber-200 text-sm font-semibold outline-none focus:border-amber-400 bg-white" 
            rows={3} placeholder="E.g. Travel fee adjusted due to traffic conditions..." 
          />
        </div>
      )}
    </div>
  );
}

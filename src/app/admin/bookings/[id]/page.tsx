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

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const loadBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${params.id}`);
      if (res.ok) {
        const json = await res.json();
        setBooking(json.data);
        if (json.data.assignment) {
          setSelectedVehicleId(json.data.assignment.vehicleId || "");
          setSelectedDriverId(json.data.assignment.driverId || "");
        } else if (json.data.vehicleId) {
          setSelectedVehicleId(json.data.vehicleId);
        }
      }
    } catch (e) { }
    setLoading(false);
  };

  useEffect(() => {
    loadBooking();
    const fetchDropdowns = async () => {
      try {
        const [resV, resD] = await Promise.all([
          fetch("/api/admin/vehicles"),
          fetch("/api/admin/drivers")
        ]);
        if (resV.ok) setVehicles(await resV.json());
        if (resD.ok) {
          // Flatten drivers if nested inside user structure
          const driversData = await resD.json();
          setDrivers(driversData);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchDropdowns();
  }, [params.id]);

  const saveAssignment = async () => {
    setAssigning(true);
    try {
      const res = await fetch(`/api/admin/bookings/${params.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: selectedVehicleId,
          driverId: selectedDriverId || null
        })
      });
      if (res.ok) {
        alert("Assignment saved successfully!");
        await loadBooking();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to save assignment.");
      }
    } catch (e) {
      alert("Network error saving assignment.");
    } finally {
      setAssigning(false);
    }
  };

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

  let breakdown: any = {};
  try {
    if (booking.quote?.snapshotJson) {
      breakdown = JSON.parse(booking.quote.snapshotJson);
    }
  } catch (e) { }

  const packageName = breakdown.packageName ?? (booking.package?.name || "Custom Package");
  const packagePrice = breakdown.packagePrice ?? (booking.quote?.basePrice ?? 250);
  const includedGuests = breakdown.includedGuests ?? (booking.package?.servings ?? 50);
  const includedServiceMins = breakdown.includedServiceMins ?? ((booking.package as any)?.durationMins ?? booking.package?.includedMinutes ?? booking.durationMins);
  const extraGuestsFee = breakdown.additionalGuestsFee ?? (booking.quote?.extraPieceFee ?? 0);
  const extraServiceFee = breakdown.additionalServiceFee ?? (booking.extraServiceFee ?? 0);
  const travelFee = breakdown.travelFee ?? (booking.quote?.travelFee ?? 0);
  const additionalStopsFee = breakdown.additionalStopsFee ?? (booking.additionalStopsFee ?? 0);
  const estimatedTotal = breakdown.estimatedTotal ?? booking.totalAmount;

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
          <div className="flex flex-col gap-2 p-4 bg-amber-50 rounded-2xl border border-amber-200 w-full md:w-auto">
            <div className="text-xs font-black text-amber-800 uppercase tracking-wider mb-1">
              Review Reason: {booking.quote?.snapshotJson ? (() => {
                try {
                  const snap = JSON.parse(booking.quote.snapshotJson);
                  if (snap.aiFlags?.includes("LONG_DISTANCE_LOW_PACKAGE_VALUE")) {
                    return "Long distance + package below $500";
                  }
                  if (snap.aiFlags?.includes("NO_VEHICLE_AVAILABLE")) {
                    return "Vehicle availability needs manual review";
                  }
                } catch(e){}
                return "Long distance + package below $500";
              })() : "Long distance + package below $500"}
            </div>
            <div className="flex gap-3">
              <button disabled={!!updating} onClick={() => updateStatus("REJECTED")} className="btn-secondary py-2 px-6 text-sm text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"><XCircle className="w-4 h-4"/> Reject</button>
              <button disabled={!!updating} onClick={() => updateStatus("CONFIRMED")} className="btn-primary py-2 px-6 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2">
                {updating === "CONFIRMED" ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4"/>}
                Approve Booking
              </button>
            </div>
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
            <div className="flex justify-between items-center"><span className="text-slate-400">Service Time:</span> <span className="text-slate-800">{includedServiceMins} mins {breakdown.additionalServiceMins ? `(+${breakdown.additionalServiceMins} mins)` : ''}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Guests:</span> <span className="text-slate-800">{booking.guests}</span></div>
            <div className="flex justify-between items-center"><span className="text-slate-400">Type:</span> <span className="text-slate-800">{booking.eventType}</span></div>
          </div>
        </div>

        {/* Location Info & Route Stops */}
        <div className="card-premium p-6 md:col-span-2">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-[#000223]"><MapPin className="w-5 h-5 text-rose-500" /> Route & Stops</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col border-l-2 border-slate-200 pl-4 py-1 relative">
              <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-2 border-2 border-white"></div>
              <span className="text-xs font-black uppercase text-emerald-600 mb-1">Primary Location</span>
              <span className="font-bold text-[#000223] text-sm">{booking.address}</span>
              <span className="font-semibold text-slate-500 text-xs">{booking.city}, {booking.zip}</span>
            </div>
            
            {booking.stops?.map((stop: any, idx: number) => (
              <div key={stop.id} className="flex flex-col border-l-2 border-slate-200 pl-4 py-1 relative">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-2 border-2 border-white"></div>
                <span className="text-xs font-black uppercase text-blue-600 mb-1">Additional Stop {idx + 1}</span>
                <span className="font-bold text-[#000223] text-sm">{stop.street}</span>
                <span className="font-semibold text-slate-500 text-xs">{stop.city}, {stop.state} {stop.zipCode}</span>
                {stop.notes && (
                  <span className="font-semibold text-slate-400 text-xs mt-1.5 italic">📝 {stop.notes}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Info */}
        <div className="card-premium p-6">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-[#000223]"><DollarSign className="w-5 h-5 text-emerald-500" /> Pricing Breakdown</h3>
          <div className="space-y-3 text-sm font-bold pb-4 border-b border-slate-100 mb-4">
            <div className="flex justify-between items-center"><span className="text-slate-400">Package ({packageName}):</span> <span className="text-slate-800">${packagePrice.toFixed(2)}</span></div>
            {extraGuestsFee > 0 && (
              <div className="flex justify-between items-center"><span className="text-slate-400">Extra Guests Fee:</span> <span className="text-slate-800">${extraGuestsFee.toFixed(2)}</span></div>
            )}
            {extraServiceFee > 0 && (
              <div className="flex justify-between items-center"><span className="text-slate-400">Additional Service Time:</span> <span className="text-slate-800">${extraServiceFee.toFixed(2)}</span></div>
            )}
            {travelFee > 0 && (
              <div className="flex justify-between items-center"><span className="text-slate-400">Travel Fee:</span> <span className="text-slate-800">${travelFee.toFixed(2)}</span></div>
            )}
            {additionalStopsFee > 0 && (
              <div className="flex justify-between items-center"><span className="text-slate-400">Additional Stops Fee:</span> <span className="text-slate-800">${additionalStopsFee.toFixed(2)}</span></div>
            )}
          </div>
          <div className="flex justify-between items-center text-xl font-black">
            <span className="text-[#000223]">Total:</span>
            <span className="text-emerald-600">${estimatedTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Dispatch Actions */}
        <div className="card-premium p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-[#000223]"><Truck className="w-5 h-5 text-indigo-500" /> Dispatch Assignment</h3>
            <div className="space-y-4 font-semibold text-sm">
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={e => setSelectedVehicleId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold text-sm bg-white outline-none focus:border-[#FFA000]"
                >
                  <option value="">Unassigned</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.code} - {v.name} ({v.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">Driver</label>
                <select
                  value={selectedDriverId}
                  onChange={e => setSelectedDriverId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-bold text-sm bg-white outline-none focus:border-[#FFA000]"
                >
                  <option value="">Unassigned</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <button
            onClick={saveAssignment}
            disabled={assigning || !selectedVehicleId}
            className="w-full py-2.5 mt-6 rounded-xl font-black text-sm text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {assigning ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4"/>}
            Save Assignment
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

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
  const [customPrice, setCustomPrice] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{ action: string; title: string; desc: string; confirmText: string; confirmColor: string } | null>(null);

  // Edit booking state
  const [editMode, setEditMode] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editFields, setEditFields] = useState<Record<string, string>>({});

  const loadBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${params.id}`);
      if (res.ok) {
        const json = await res.json();
        setBooking(json.data);
        setInternalNote(json.data.internalNote || "");
        setCustomPrice(json.data.totalAmount > 0 ? String(json.data.totalAmount) : "");
        setCustomerNotes(json.data.notes || "");
        if (json.data.assignment) {
          setSelectedVehicleId(json.data.assignment.vehicleId || "");
          setSelectedDriverId(json.data.assignment.driverId || "");
        } else if (json.data.vehicleId) {
          setSelectedVehicleId(json.data.vehicleId);
        }
        // Populate edit fields
        setEditFields({
          eventDate: json.data.eventDate?.split("T")[0] || "",
          startTime: json.data.startTime || "",
          durationMins: String(json.data.durationMins || 60),
          guests: String(json.data.guests || ""),
          address: json.data.address || "",
          city: json.data.city || "",
          zip: json.data.zip || "",
          eventType: json.data.eventType || "",
          notes: json.data.notes || "",
          internalNote: json.data.internalNote || "",
          totalAmount: json.data.totalAmount > 0 ? String(json.data.totalAmount) : "",
        });
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

  const executeStatusUpdate = async (status: string) => {
    setUpdating(status);
    setConfirmModal(null);
    try {
      await fetch(`/api/admin/bookings/${params.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internalNote, customPrice, customerNotes })
      });
      await loadBooking();
    } catch (e) { }
    setUpdating("");
  };

  const saveEdits = async () => {
    setEditSaving(true);
    try {
      const res = await fetch(`/api/admin/bookings/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFields),
      });
      if (res.ok) {
        setEditMode(false);
        await loadBooking();
      } else {
        const json = await res.json();
        alert(json.error || "Failed to save changes.");
      }
    } catch (e) {
      alert("Network error saving booking.");
    }
    setEditSaving(false);
  };

  const requestStatusUpdate = (status: string) => {
    if (!booking) return;
    if (status === "REJECTED") {
       setConfirmModal({ action: status, title: "Reject Booking", desc: "Are you sure you want to reject this booking? This will cancel it completely.", confirmText: "Reject", confirmColor: "bg-red-600 hover:bg-red-700" });
    } else if (status === "CONFIRMED" && booking.status === "PENDING_REVIEW") {
       setConfirmModal({ action: status, title: "Approve Booking", desc: "Are you sure you want to approve this quote and lock in the price?", confirmText: "Approve", confirmColor: "bg-emerald-600 hover:bg-emerald-700" });
    } else if (status === "CANCELLED") {
       setConfirmModal({ action: status, title: "Approve Cancellation", desc: "Are you sure you want to cancel this booking? This action cannot be undone.", confirmText: "Cancel Booking", confirmColor: "bg-red-600 hover:bg-red-700" });
    } else if (status === "CONFIRMED" && booking.status === "CANCELLATION_REQUESTED") {
       setConfirmModal({ action: status, title: "Keep Booking", desc: "Are you sure you want to deny the cancellation request and keep the booking active?", confirmText: "Keep Booking", confirmColor: "bg-[#000223] hover:bg-[#000445]" });
    } else {
       executeStatusUpdate(status);
    }
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
  const vehiclesRequired = breakdown.vehiclesRequired ?? 1;
  const locationMode = breakdown.locationMode ?? "SINGLE_LOCATION";
  const additionalVehicleSetupFee = breakdown.additionalVehicleSetupFee ?? 0;
  const additionalLocationServiceFee = breakdown.additionalLocationServiceFee ?? additionalStopsFee;
  const weekendFee = breakdown.weekendFee ?? 0;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in zoom-in duration-300">
      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-[#000223] mb-2">{confirmModal.title}</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">{confirmModal.desc}</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmModal(null)} className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={() => executeStatusUpdate(confirmModal.action)} className={`px-4 py-2 rounded-xl text-sm font-bold text-white transition-colors ${confirmModal.confirmColor}`}>
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      <Link href="/admin/bookings" className="inline-flex items-center gap-2 text-sm text-[#000223]/70 hover:text-[#000223] mb-6 font-bold bg-white border border-slate-100 shadow-sm px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5">
        <ChevronLeft className="w-4 h-4" /> Back to Bookings
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-[#000223] flex items-center gap-3">
            #{booking.bookingNumber}
            <span className={`px-3 py-1 text-[11px] rounded-full font-black uppercase tracking-widest ${
              booking.status.includes("PENDING") ? "bg-amber-100 text-amber-700" :
              booking.status === "CANCELLATION_REQUESTED" ? "bg-red-100 text-red-700" :
              booking.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
              booking.status === "REJECTED" || booking.status === "CANCELLED" ? "bg-slate-200 text-slate-600" :
              "bg-slate-100 text-slate-700"
            }`}>
              {booking.status.replace(/_/g, " ")}
            </span>
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">Placed on {new Date(booking.createdAt).toLocaleString("en-US")}</p>
        </div>

        {booking.status === "CANCELLATION_REQUESTED" && (
          <div className="flex flex-col gap-4 p-5 bg-red-50 rounded-2xl border border-red-200 w-full md:w-auto shadow-sm">
            <div>
              <div className="text-xs font-black text-red-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Cancellation Requested
              </div>
              <div className="text-sm font-semibold text-slate-700">
                Customer requested to cancel this booking.<br/>
                <span className="font-bold">Reason:</span> {booking.cancellationReason || "Not provided."}
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                disabled={!!updating} 
                onClick={() => requestStatusUpdate("CONFIRMED")} 
                className="btn-secondary py-2.5 px-6 text-sm font-bold text-[#000223] border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 flex items-center gap-2 rounded-xl"
              >
                Keep Booking
              </button>
              <button 
                disabled={!!updating} 
                onClick={() => requestStatusUpdate("CANCELLED")} 
                className="btn-primary py-2.5 px-6 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 rounded-xl"
              >
                {updating === "CANCELLED" ? <Loader2 className="w-4 h-4 animate-spin"/> : <XCircle className="w-4 h-4"/>}
                Approve Cancellation
              </button>
            </div>
          </div>
        )}

        {booking.status === "PENDING_REVIEW" && (() => {
          const isCustomPackage = booking.package?.slug === "custom-event-package" || booking.package?.serviceType === "CUSTOM";
          const reviewReason = isCustomPackage 
            ? "Custom package request for 200+ guests requires manual quote pricing."
            : (booking.quote?.snapshotJson ? (() => {
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
              })() : "Long distance + package below $500");

          return (
            <div className="flex flex-col gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-200 w-full md:w-auto shadow-sm">
              <div>
                <div className="text-xs font-black text-amber-800 uppercase tracking-wider mb-1">
                  Review Reason
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  {reviewReason}
                </div>
              </div>

              {isCustomPackage && (
                <div className="space-y-4 border-t border-amber-200 pt-4">
                  <div>
                    <label className="block text-xs font-black text-amber-900 uppercase tracking-wider mb-1">Final Custom Price ($)</label>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="w-full max-w-md p-2.5 rounded-xl border border-slate-200 font-bold text-sm bg-white text-[#000223] outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/15"
                      placeholder="E.g. 1500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-amber-900 uppercase tracking-wider mb-1">Customer-facing Notes / Pricing Notes</label>
                    <textarea
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-sm bg-white text-[#000223] outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/15"
                      rows={3}
                      placeholder="E.g. Approved custom quote including Sprinter Van setup, 200 portions, and 2 stops."
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button disabled={!!updating} onClick={() => requestStatusUpdate("REJECTED")} className="btn-secondary py-2.5 px-6 text-sm text-red-650 border-red-200 hover:bg-red-50 disabled:opacity-50 flex items-center gap-2 rounded-xl bg-white font-bold"><XCircle className="w-4 h-4"/> Reject</button>
                <button 
                  disabled={!!updating || (isCustomPackage && !customPrice)} 
                  onClick={() => requestStatusUpdate("CONFIRMED")} 
                  className="btn-primary py-2.5 px-6 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 rounded-xl text-white font-bold"
                >
                  {updating === "CONFIRMED" ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle2 className="w-4 h-4"/>}
                  Approve Booking
                </button>
              </div>
            </div>
          );
        })()}
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
          
          {/* Custom Pricing Status */}
          {(() => {
            const isCustomPackage = booking.package?.slug === "custom-event-package" || booking.package?.serviceType === "CUSTOM";
            return (
              <div className="mb-4 p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center font-bold text-xs">
                <span className="text-slate-500 uppercase tracking-wider">Pricing System</span>
                <span className={`px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[10px] ${
                  isCustomPackage ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700"
                }`}>
                  {isCustomPackage ? "Custom Quote" : "Standard Fixed"}
                </span>
              </div>
            );
          })()}

          {(() => {
            const isCustomPackage = booking.package?.slug === "custom-event-package" || booking.package?.serviceType === "CUSTOM";
            if (isCustomPackage && booking.status === "PENDING_REVIEW") {
              return (
                <div className="py-4 border-b border-slate-100 mb-4 text-sm font-semibold text-slate-500 space-y-2">
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-250 p-2.5 rounded-lg leading-relaxed">
                    ⚠️ <strong>Pending Quote Review:</strong> This booking has no fixed price yet. Please review details, compute travel and weekend fees, and enter a final custom price.
                  </p>
                </div>
              );
            }
            return (
              <div className="space-y-3 text-sm font-semibold pb-4 border-b border-slate-100 mb-4 text-slate-800">
                <div className="flex justify-between items-center"><span className="text-slate-400">Location Mode:</span> <span>{locationMode}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-400">Vehicles Required:</span> <span>{vehiclesRequired}</span></div>
                <div className="h-px bg-slate-100 my-2" />
                <div className="flex justify-between items-center"><span className="text-slate-400">Package ({packageName}):</span> <span>${packagePrice.toFixed(2)}</span></div>
                {extraGuestsFee > 0 && (
                  <div className="flex justify-between items-center"><span className="text-slate-400">Extra Guests Fee:</span> <span>${extraGuestsFee.toFixed(2)}</span></div>
                )}
                {extraServiceFee > 0 && (
                  <div className="flex justify-between items-center"><span className="text-slate-400">Additional Service Time:</span> <span>${extraServiceFee.toFixed(2)}</span></div>
                )}
                {additionalLocationServiceFee > 0 && (
                  <div className="flex justify-between items-center"><span className="text-slate-400">Additional Location Service Fee:</span> <span>${additionalLocationServiceFee.toFixed(2)}</span></div>
                )}
                {additionalVehicleSetupFee > 0 && (
                  <div className="flex justify-between items-center"><span className="text-slate-400">Additional Vehicle Setup Fee:</span> <span>${additionalVehicleSetupFee.toFixed(2)}</span></div>
                )}
                {weekendFee > 0 && (
                  <div className="flex justify-between items-center"><span className="text-slate-400">Weekend Event Fee:</span> <span>${weekendFee.toFixed(2)}</span></div>
                )}
                {travelFee > 0 && (
                  <div className="flex justify-between items-center"><span className="text-slate-400">Travel Fee:</span> <span>${travelFee.toFixed(2)}</span></div>
                )}
              </div>
            );
          })()}

          <div className="flex justify-between items-center text-xl font-black mb-4">
            <span className="text-[#000223]">Total Amount:</span>
            <span className="text-emerald-600">${estimatedTotal.toFixed(2)}</span>
          </div>

          {/* Weekend notice in Admin Details */}
          {(() => {
            if (!booking.eventDate) return null;
            const day = new Date(booking.eventDate.toString().split('T')[0] + "T12:00:00").getDay();
            const isWeekendDay = day === 0 || day === 6;
            if (isWeekendDay) {
              return (
                <div className="mt-4 p-3 rounded-xl text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 leading-relaxed">
                  📅 <strong>Weekend Event:</strong> Saturday/Sunday bookings include a $25 weekend event fee. Please verify this is factored into the custom total.
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* Dispatch Actions */}
        <div className="card-premium p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-[#000223]"><Truck className="w-5 h-5 text-[#FFA000]" /> Dispatch Assignment</h3>
            <div className="space-y-4 font-semibold text-sm">
              <div>
                <label className="label-premium">Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={e => setSelectedVehicleId(e.target.value)}
                  className="w-full py-3.5 px-4.5 rounded-2xl border-2 font-semibold text-base outline-none transition-all bg-white text-[#000223] border-slate-100 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15"
                >
                  <option value="">Unassigned</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.code} - {v.name} ({v.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-premium">Driver</label>
                <select
                  value={selectedDriverId}
                  onChange={e => setSelectedDriverId(e.target.value)}
                  className="w-full py-3.5 px-4.5 rounded-2xl border-2 font-semibold text-base outline-none transition-all bg-white text-[#000223] border-slate-100 focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15"
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
            className="w-full py-4 rounded-2xl font-black text-base text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-6"
            style={{ boxShadow: "0 8px 24px rgba(255,160,0,0.15)" }}
          >
            {assigning ? <Loader2 className="w-5 h-5 animate-spin"/> : <CheckCircle2 className="w-5 h-5"/>}
            Save Assignment
          </button>
        </div>
      </div>
      
      {booking.status === "PENDING_REVIEW" && (
        <div className="mt-6 card-premium p-8 border-amber-200 bg-amber-50/20">
          <label className="block text-sm font-black text-amber-900 mb-2 uppercase tracking-wider">Add Internal Note (visible to staff only)</label>
          <textarea 
            value={internalNote} onChange={e=>setInternalNote(e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-amber-200/60 text-base font-semibold outline-none focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15 bg-white text-[#000223]" 
            rows={4} placeholder="E.g. Travel fee adjusted due to traffic conditions..." 
          />
        </div>
      )}

      {/* ── Edit Booking Panel ── */}
      <div className="mt-6 card-premium p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-[#000223] flex items-center gap-2">
            ✏️ Edit Booking Details
          </h3>
          <button
            onClick={() => setEditMode(v => !v)}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {editMode ? "Cancel" : "Edit"}
          </button>
        </div>

        {!editMode ? (
          <p className="text-sm font-semibold text-slate-400">Click "Edit" to modify booking details such as event date, time, guests, address, notes, or total amount.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Event Date", key: "eventDate", type: "date" },
              { label: "Start Time", key: "startTime", type: "text", placeholder: "e.g. 2:00 PM" },
              { label: "Duration (mins)", key: "durationMins", type: "number" },
              { label: "Guests", key: "guests", type: "number" },
              { label: "Event Type", key: "eventType", type: "text" },
              { label: "Address", key: "address", type: "text" },
              { label: "City", key: "city", type: "text" },
              { label: "ZIP Code", key: "zip", type: "text" },
              { label: "Total Amount ($)", key: "totalAmount", type: "number" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                <input
                  type={type}
                  value={editFields[key] || ""}
                  onChange={e => setEditFields(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full py-2.5 px-3.5 rounded-xl border-2 border-slate-100 font-semibold text-sm bg-white text-[#000223] outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/15 transition-colors"
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Customer Notes</label>
              <textarea
                value={editFields.notes || ""}
                onChange={e => setEditFields(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full py-2.5 px-3.5 rounded-xl border-2 border-slate-100 font-semibold text-sm bg-white text-[#000223] outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/15 transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Internal Note (staff only)</label>
              <textarea
                value={editFields.internalNote || ""}
                onChange={e => setEditFields(f => ({ ...f, internalNote: e.target.value }))}
                rows={2}
                className="w-full py-2.5 px-3.5 rounded-xl border-2 border-slate-100 font-semibold text-sm bg-white text-[#000223] outline-none focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/15 transition-colors"
              />
            </div>

            <div className="md:col-span-2 flex justify-end pt-2">
              <button
                onClick={saveEdits}
                disabled={editSaving}
                className="px-8 py-3 rounded-2xl font-black text-base text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {editSaving ? <Loader2 className="w-5 h-5 animate-spin"/> : <CheckCircle2 className="w-5 h-5"/>}
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

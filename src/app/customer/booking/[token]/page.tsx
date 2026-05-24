"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Clock, MapPin, Phone, Mail, Users, CheckCircle2, 
  AlertCircle, XCircle, Loader2, Edit, Calendar, DollarSign, ArrowLeft, ArrowRight
} from "lucide-react";

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  PENDING_REVIEW:  { label: "Under Review",    bg: "bg-amber-50 border-amber-200",   text: "text-amber-700",  icon: Clock },
  PENDING_PAYMENT: { label: "Awaiting Payment", bg: "bg-blue-50 border-blue-200",    text: "text-blue-700",   icon: DollarSign },
  CONFIRMED:       { label: "Confirmed",       bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700",icon: CheckCircle2 },
  COMPLETED:       { label: "Completed",       bg: "bg-slate-50 border-slate-200",   text: "text-slate-600",  icon: CheckCircle2 },
  CANCELLED:       { label: "Cancelled",       bg: "bg-red-50 border-red-200",     text: "text-red-700",    icon: XCircle },
  REJECTED:        { label: "Rejected",        bg: "bg-rose-50 border-rose-200",    text: "text-rose-700",   icon: XCircle },
};

export default function CustomerBookingPortal({ params }: { params: { token: string } }) {
  const [booking, setBooking] = useState<any>(null);
  const [paymentEnabled, setPaymentEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modals / Actions State
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState<"CHANGE" | "CANCEL" | null>(null);
  
  // Form values
  const [editForm, setEditForm] = useState({ email: "", phone: "", notes: "" });
  const [requestReason, setRequestReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");

  const loadBooking = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customer/bookings/${params.token}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setBooking(json.data);
        if (json.paymentEnabled !== undefined) {
          setPaymentEnabled(json.paymentEnabled);
        }
        setEditForm({
          email: json.data.customer.email || "",
          phone: json.data.customer.phone || "",
          notes: json.data.notes || ""
        });
      } else {
        setError(json.error || "We couldn't retrieve your booking details. Please verify your link.");
      }
    } catch (e) {
      setError("Network error fetching booking. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBooking();
  }, [params.token]);

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/customer/bookings/${params.token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setBooking(json.data);
        setShowEditModal(false);
        alert("Contact information updated successfully!");
      } else {
        alert(json.error || "Failed to update contact info.");
      }
    } catch (e) {
      alert("Network error.");
    }
    setSubmitting(false);
  };

  const handleRequestAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestReason.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/customer/bookings/${params.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: showRequestModal,
          reason: requestReason
        })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSubmitSuccess(`Your ${showRequestModal === "CANCEL" ? "cancellation" : "modification"} request was submitted to the operations team.`);
        setRequestReason("");
        setTimeout(() => {
          setShowRequestModal(null);
          setSubmitSuccess("");
        }, 4000);
      } else {
        alert(json.error || "Failed to submit request.");
      }
    } catch (e) {
      alert("Network error.");
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Image src={LOGO} alt="Boston Legend" width={160} height={54} className="h-12 w-auto mx-auto mb-6" unoptimized />
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#FFA000]" />
      </div>
    </div>
  );

  if (error || !booking) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-[#000223] mb-2">Access Denied</h2>
        <p className="text-slate-500 font-semibold text-sm leading-relaxed mb-6">{error || "Invalid secure token."}</p>
        <a href="https://bostonlegendwebflowio.vercel.app/" className="inline-block py-2.5 px-6 rounded-xl font-black text-sm text-white bg-[#000223] hover:bg-[#FFA000] hover:text-[#000223] transition-all">
          Back to Website
        </a>
      </div>
    </div>
  );

  const sc = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING_REVIEW;
  const StatusIcon = sc.icon;
  
  const eventDate = new Date(booking.eventDate + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Top Banner Header */}
      <div className="sticky top-0 z-40 bg-[#000223] shadow-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Image src={LOGO} alt="Boston Legend" width={120} height={40} className="h-9 w-auto" unoptimized />
          <span className="text-xs font-black text-white/50 uppercase tracking-widest">Client Portal</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-8 space-y-6">
        
        {/* Status Header Block */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Booking Reference</span>
          <h1 className="text-3xl font-black text-[#000223] mt-1">#{booking.bookingNumber}</h1>
          <div className="mt-4 flex items-center justify-center">
            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-black border ${sc.bg} ${sc.text}`}>
              <StatusIcon className="w-4 h-4" />
              {sc.label}
            </span>
          </div>
        </div>

        {/* Customer & Info Block */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-black text-xs uppercase tracking-widest text-slate-400">Contact Details</h2>
            <button onClick={() => setShowEditModal(true)} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Edit className="w-3.5 h-3.5"/> Edit details
            </button>
          </div>
          <div className="space-y-4 text-sm font-bold">
            <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="text-[#000223]">{booking.customer.firstName} {booking.customer.lastName}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Email</span><span className="text-slate-700">{booking.customer.email}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Phone</span><span className="text-slate-700">{booking.customer.phone}</span></div>
            {booking.notes && (
              <div className="border-t border-slate-100 pt-4 mt-4 text-slate-500 font-semibold italic text-xs">
                📝 Notes: {booking.notes}
              </div>
            )}
          </div>
        </div>

        {/* Event Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-5">Event Details</h2>
          <div className="space-y-4 text-sm font-semibold">
            {[
              { label: "Date",     value: eventDate, icon: Calendar },
              { label: "Time",     value: booking.startTime, icon: Clock },
              { label: "Duration", value: `${booking.durationMins} minutes`, icon: Clock },
              { label: "Guests",   value: `${booking.guests} servings included`, icon: Users },
              { label: "Location",  value: `${booking.address}, ${booking.city}, MA ${booking.zip}`, icon: MapPin },
            ].map((row, idx) => {
              const Icon = row.icon;
              return (
                <div key={idx} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 flex justify-between">
                    <span className="text-slate-400">{row.label}</span>
                    <span className="text-right font-black text-[#000223] ml-4">{row.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Estimate Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-5">Package & Estimated Total</h2>
          <div className="space-y-4 text-sm font-semibold">
            <div className="flex justify-between"><span className="text-slate-400">Selected Package</span><span className="font-black text-[#000223]">{booking.package?.name || "Standard Event"}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Servings Size</span><span className="font-black text-[#000223]">{booking.package?.servings || 50} Servings</span></div>
            {booking.quote && (
              <>
                <div className="flex justify-between"><span className="text-slate-400">Total Distance</span><span className="font-black text-[#000223]">{Number(booking.quote.distanceMiles).toFixed(1)} miles</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Travel Fee</span><span className="font-black text-[#000223]">{Number(booking.quote.travelFee) > 0 ? `$${Number(booking.quote.travelFee).toFixed(2)}` : "Free ($0.00)"}</span></div>
              </>
            )}
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
              <span className="text-slate-800 font-bold text-base">Estimated Price</span>
              <span className="text-2xl font-black text-emerald-600">${Number(booking.quote?.totalAmount ?? booking.totalAmount).toFixed(2)}</span>
            </div>
            
            {paymentEnabled ? (
              booking.status === "PENDING_PAYMENT" && (
                <a href={`/checkout/${booking.id}`} className="mt-4 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-center shadow-lg transition-all flex items-center justify-center gap-2 print:hidden">
                  <DollarSign className="w-5 h-5"/> Complete Secure Payment
                </a>
              )
            ) : (
              <div className="mt-4 p-4 bg-amber-50/50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-800 space-y-1">
                <p className="font-black uppercase tracking-wider mb-1 flex items-center gap-1">💵 Cash Payment Policy</p>
                <p>No online payment required. Payment will be collected in cash at the end of your event.</p>
              </div>
            )}
          </div>
        </div>

        {/* Policies Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-5">Booking Policies</h2>
          <div className="space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
              <p className="font-black text-[#000223] mb-1">📍 Distance Policy</p>
              <p>The first 10 miles are free. Any additional miles will be calculated based on the travel distance from our garage at <strong>Boston Revere, 84 Fernwood Ave</strong> to your event location.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
              <p className="font-black text-[#000223] mb-1">👥 Extra Guests</p>
              <p>If your guest count increases, we'll be prepared. Extra guests beyond the included package count are calculated at <strong>$5 per person</strong>.</p>
            </div>
          </div>
        </div>

        {/* Self-Service Operations & Print */}
        <div className="space-y-3 print:hidden">
          {["PENDING_REVIEW", "PENDING_PAYMENT", "CONFIRMED"].includes(booking.status) && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => setShowRequestModal("CHANGE")} className="flex-1 py-3 bg-white border-2 border-slate-200 text-[#000223] hover:border-[#000223] rounded-2xl font-black text-sm shadow-sm transition-all">
                Request Booking Change
              </button>
              <button onClick={() => setShowRequestModal("CANCEL")} className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-black text-sm border-2 border-transparent transition-all">
                Request Cancellation
              </button>
            </div>
          )}
          
          <button onClick={() => window.print()} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-sm">
            Print Confirmation / Save PDF
          </button>
        </div>

        <style>{`
          @media print {
            body { background: white !important; color: black !important; }
            header, .print\\:hidden, button, a, form { display: none !important; }
            .shadow-sm, .shadow-xl { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
          }
        `}</style>

      </div>

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-[#000223]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-black text-[#000223] mb-6">Update Contact Details</h2>
            <form onSubmit={handleUpdateContact} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Email Address</label>
                <input required type="email" value={editForm.email} onChange={e=>setEditForm({...editForm, email:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold outline-none focus:border-[#FFA000]" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Phone Number</label>
                <input required type="tel" value={editForm.phone} onChange={e=>setEditForm({...editForm, phone:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold outline-none focus:border-[#FFA000]" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Booking Notes</label>
                <textarea value={editForm.notes} onChange={e=>setEditForm({...editForm, notes:e.target.value})} className="w-full px-4 py-2 rounded-xl border border-slate-200 font-bold outline-none focus:border-[#FFA000]" rows={3} placeholder="Add specific gate details or request details..." />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" disabled={submitting} onClick={()=>setShowEditModal(false)} className="flex-1 py-2.5 rounded-xl font-black text-sm bg-slate-100 hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl font-black text-sm text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] flex items-center justify-center gap-1.5">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin"/>} Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST MODAL (CHANGE/CANCEL) */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-[#000223]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-black text-[#000223] mb-4">
              {showRequestModal === "CANCEL" ? "Request Cancellation" : "Request Change"}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mb-5 leading-relaxed">
              {showRequestModal === "CANCEL"
                ? "Let us know why you need to cancel. Our policy details apply, and we will update you shortly."
                : "Describe the dates, times, or servings adjustments you require. A staff member will review and update your schedule."}
            </p>
            
            {submitSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{submitSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRequestAction} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Reason & Details</label>
                <textarea required value={requestReason} onChange={e=>setRequestReason(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold outline-none focus:border-[#FFA000]" rows={4} placeholder={showRequestModal === "CANCEL" ? "E.g. Weather conditions..." : "E.g. Change time from 2:00 PM to 4:00 PM..."} />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" disabled={submitting} onClick={()=>setShowRequestModal(null)} className="flex-1 py-2.5 rounded-xl font-black text-sm bg-slate-100 hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={submitting || !requestReason.trim()} className="flex-1 py-2.5 rounded-xl font-black text-sm text-white bg-[#000223] hover:bg-[#FFA000] hover:text-[#000223] flex items-center justify-center gap-1.5">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin"/>} Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

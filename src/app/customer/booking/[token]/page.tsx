"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Clock, MapPin, Phone, Mail, Users, CheckCircle2, 
  AlertCircle, XCircle, Loader2, Edit, Calendar, DollarSign, Printer, ArrowRight, HelpCircle
} from "lucide-react";

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: any; desc: string }> = {
  PENDING_REVIEW:  { label: "Under Review",    bg: "bg-amber-50 border-amber-200 text-amber-700",   text: "text-amber-700",  icon: Clock, desc: "Our team is reviewing your event details. We'll update you shortly!" },
  PENDING_PAYMENT: { label: "Awaiting Payment", bg: "bg-blue-50 border-blue-200 text-blue-700",    text: "text-blue-700",   icon: DollarSign, desc: "Your booking is approved! We are finalizing the details." },
  CONFIRMED:       { label: "Confirmed",       bg: "bg-emerald-50 border-emerald-200 text-emerald-700", text: "text-emerald-700",icon: CheckCircle2, desc: "Awesome! Your legendary ice cream event is fully confirmed." },
  COMPLETED:       { label: "Completed",       bg: "bg-slate-100 border-slate-200 text-slate-700",   text: "text-slate-600",  icon: CheckCircle2, desc: "This event has been completed. Thank you for choosing Boston Legend!" },
  CANCELLED:       { label: "Cancelled",       bg: "bg-red-50 border-red-200 text-red-700",     text: "text-red-700",    icon: XCircle, desc: "This booking request has been cancelled." },
  REJECTED:        { label: "Needs Info / Rejected",        bg: "bg-rose-50 border-rose-200 text-rose-700",    text: "text-rose-700",   icon: XCircle, desc: "This request requires updates or has been declined." },
};

export default function CustomerBookingPortal({ params }: { params: { token: string } }) {
  const [booking, setBooking] = useState<any>(null);
  const [paymentEnabled, setPaymentEnabled] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div className="text-center">
        <img src={LOGO} alt="Boston Legend" className="h-16 w-auto mx-auto mb-6 animate-pulse" />
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#FFA000]" />
      </div>
    </div>
  );

  if (error || !booking) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Header */}
      <header className="bg-[#000223] py-4 px-6 border-b border-white/10 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/"><img src={LOGO} alt="Boston Legend" className="h-10 w-auto" /></a>
          <a href="/packages" className="px-5 py-2.5 rounded-full font-black text-sm bg-[#FFA000] text-[#000223] hover:bg-white transition-all shadow-md">
            Start Your Booking
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-white rounded-[32px] p-10 border border-slate-100 shadow-[0_20px_50px_rgba(0,2,35,0.06)] text-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-[#FFA000]" />
          </div>
          <h2 className="text-2xl font-black text-[#000223] mb-4">Booking Not Found</h2>
          <p className="text-slate-500 font-bold leading-relaxed mb-8">
            We couldn’t find this booking, but we’d love to help you plan your next ice cream event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/packages" className="py-3 px-8 rounded-full font-black text-sm text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] transition-all shadow-md">
              Start Your Booking
            </a>
            <a href="/contact-us" className="py-3 px-8 rounded-full font-black text-sm text-white bg-[#000223] hover:bg-[#001a4c] transition-all shadow-md">
              Contact Boston Legend
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 py-6 border-t border-slate-200 text-center text-xs text-slate-400 font-bold">
        &copy; {new Date().getFullYear()} Boston Legend. All rights reserved.
      </footer>
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

  const quote = booking.quote;
  const pkg = booking.package;

  // Calculate dynamic servings breakdown
  const servingsLimit = pkg?.servings ?? 50;
  const extraPiecePrice = pkg?.extraPiecePrice ?? 5;
  const extraGuestsCount = Math.max(0, booking.guests - servingsLimit);
  const extraGuestsFee = extraGuestsCount * extraPiecePrice;

  // Travel calculation
  const totalMiles = quote?.distanceMiles ?? 0;
  const freeMiles = 10;
  const billableMiles = Math.max(0, totalMiles - freeMiles);
  const travelFee = quote?.travelFee ?? 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24" style={{ fontFamily: "'Nunito', sans-serif" }}>
      {/* Top Banner Header */}
      <header className="sticky top-0 z-40 bg-[#000223] border-b border-white/10 shadow-md print:hidden">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="Boston Legend" className="h-10 w-auto" />
            <span className="hidden sm:inline-block h-6 w-px bg-white/20"></span>
            <span className="hidden sm:inline-block text-xs font-black text-white/60 uppercase tracking-widest">Customer Portal</span>
          </div>
          
          <div className="flex items-center gap-3">
            <a href={`/customer/booking/${params.token}`} className="hidden md:inline-flex items-center text-xs font-black text-[#FFA000] border border-[#FFA000]/30 hover:border-[#FFA000] px-4 py-2 rounded-full transition-all">
              View My Booking
            </a>
            <a href="/packages" className="px-5 py-2.5 rounded-full font-black text-xs bg-[#FFA000] text-[#000223] hover:bg-white hover:text-[#000223] transition-all shadow-md">
              Book Another Event
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-[#000223] text-white py-12 px-6 border-b border-slate-800 relative overflow-hidden shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-[#FFA000]">Booking Reference</span>
                <span className="text-xs text-white/40 font-bold">•</span>
                <span className="text-sm font-mono font-bold text-white/80">#{booking.bookingNumber}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                {pkg?.name || "Ice Cream Truck Booking"}
              </h1>
              <p className="text-white/60 font-semibold text-sm max-w-xl">
                {sc.desc}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <span className={`inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full text-sm font-black border ${sc.bg}`}>
                <StatusIcon className="w-4 h-4" />
                {sc.label}
              </span>
              <p className="text-xs text-white/40 font-bold">Updated: {new Date(booking.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Quick Actions (Change, Cancel, Print) */}
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap gap-3.5 print:hidden">
            {["PENDING_REVIEW", "PENDING_PAYMENT", "CONFIRMED"].includes(booking.status) && (
              <>
                <button onClick={() => setShowRequestModal("CHANGE")} className="flex-1 sm:flex-initial py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white rounded-full font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" /> Request a Change
                </button>
                <button onClick={() => setShowRequestModal("CANCEL")} className="flex-1 sm:flex-initial py-3 px-6 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-full font-black text-sm transition-all flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" /> Request Cancellation
                </button>
              </>
            )}
            <button onClick={() => window.print()} className="flex-1 sm:flex-initial py-3 px-6 bg-[#FFA000] hover:bg-white text-[#000223] rounded-full font-black text-sm transition-all flex items-center justify-center gap-2 shadow-md">
              <Printer className="w-4 h-4" /> Print Confirmation
            </button>
          </div>
        </div>
      </div>

      {/* Grid of structured cards */}
      <div className="max-w-4xl mx-auto px-6 mt-12 grid md:grid-cols-2 gap-8">
        
        {/* Card 1: Event Details */}
        <div className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_10px_45px_rgba(0,0,0,0.04)]">
          <h2 className="font-black text-xs uppercase tracking-widest text-[#FFA000] mb-6 flex items-center gap-2">
            <span>📅</span> Event Details
          </h2>
          <div className="space-y-4.5 text-sm font-semibold text-slate-700">
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Date</span>
              <span className="font-black text-[#000223]">{eventDate}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Serving Time</span>
              <span className="font-black text-[#000223]">{booking.startTime}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Duration</span>
              <span className="font-black text-[#000223]">{booking.durationMins} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Expected Guests</span>
              <span className="font-black text-[#000223]">{booking.guests} servings</span>
            </div>
          </div>
        </div>

        {/* Card 2: Package Details */}
        <div className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_10px_45px_rgba(0,0,0,0.04)]">
          <h2 className="font-black text-xs uppercase tracking-widest text-[#FFA000] mb-6 flex items-center gap-2">
            <span>🍦</span> Package Details
          </h2>
          <div className="space-y-4.5 text-sm font-semibold text-slate-700">
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Selected Package</span>
              <span className="font-black text-[#000223]">{pkg?.name || "Standard Event"}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Included Servings</span>
              <span className="font-black text-[#000223]">{servingsLimit} Servings</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Package Base Price</span>
              <span className="font-black text-[#000223]">${(pkg?.price ?? 250).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Extra Servings Rate</span>
              <span className="font-black text-emerald-600">${extraPiecePrice}/person</span>
            </div>
          </div>
        </div>

        {/* Card 3: Customer Contact */}
        <div className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_10px_45px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-black text-xs uppercase tracking-widest text-[#FFA000] flex items-center gap-2">
              <span>👤</span> Contact Contact
            </h2>
            <button onClick={() => setShowEditModal(true)} className="text-xs font-black text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1">
              <Edit className="w-3.5 h-3.5"/> Edit contact info
            </button>
          </div>
          <div className="space-y-4.5 text-sm font-semibold text-slate-700">
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Customer Name</span>
              <span className="font-black text-[#000223]">{booking.customer.firstName} {booking.customer.lastName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Email</span>
              <span className="font-black text-[#000223]">{booking.customer.email}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Phone</span>
              <span className="font-black text-[#000223]">{booking.customer.phone}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 mb-1">Event Location</span>
              <span className="font-black text-[#000223] text-left">{booking.address}, {booking.city}, MA {booking.zip}</span>
            </div>
            {booking.notes && (
              <div className="border-t border-slate-100 pt-4 text-slate-500 font-semibold italic text-xs">
                📝 Notes: {booking.notes}
              </div>
            )}
          </div>
        </div>

        {/* Card 4: Travel & Mileage */}
        <div className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_10px_45px_rgba(0,0,0,0.04)]">
          <h2 className="font-black text-xs uppercase tracking-widest text-[#FFA000] mb-6 flex items-center gap-2">
            <span>📍</span> Travel & Mileage
          </h2>
          <div className="space-y-4.5 text-sm font-semibold text-slate-700">
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Origin</span>
              <span className="font-black text-[#000223]">Boston Revere — 84 Fernwood Ave</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Total Miles</span>
              <span className="font-black text-[#000223]">{totalMiles.toFixed(1)} miles</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Free Miles</span>
              <span className="font-black text-[#000223]">{freeMiles} miles</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Billable Miles</span>
              <span className="font-black text-[#000223]">{billableMiles.toFixed(1)} miles</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-400">Travel Fee</span>
              <span className="font-black text-amber-600">${travelFee.toFixed(2)}</span>
            </div>
            
            <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 text-xs text-amber-800 font-semibold flex items-center justify-between">
              <span>🎁 Your first 10 miles are FREE.</span>
              <span className="font-black uppercase tracking-wider text-[10px] bg-amber-600 text-white py-0.5 px-2 rounded-full">Included</span>
            </div>
          </div>
        </div>

        {/* Card 5: Payment Policy */}
        <div className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_10px_45px_rgba(0,0,0,0.04)]">
          <h2 className="font-black text-xs uppercase tracking-widest text-[#FFA000] mb-6 flex items-center gap-2">
            <span>💵</span> Payment Policy
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <span className="text-slate-400 font-bold">Estimated Total</span>
              <span className="text-2xl font-black text-emerald-600">${booking.totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-xs font-semibold text-slate-700 leading-relaxed">
              <p className="font-black text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1">💵 Cash Payment Policy</p>
              <p>Payment will be collected in cash at the end of the event.</p>
              <p className="mt-1.5 font-bold text-slate-400">No online payment or credit card checkouts are required to reserve.</p>
            </div>
          </div>
        </div>

        {/* Card 6: Change / Cancellation Policy */}
        <div className="bg-white rounded-[24px] p-7 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_10px_45px_rgba(0,0,0,0.04)]">
          <h2 className="font-black text-xs uppercase tracking-widest text-[#FFA000] mb-6 flex items-center gap-2">
            <span>📋</span> Change & Cancellation Policy
          </h2>
          <div className="space-y-4 text-xs font-semibold text-slate-500 leading-relaxed">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
              <p className="font-black text-[#000223] mb-1">⏱ Change Deadline</p>
              <p>Please submit any guest counts, date, or time changes at least <strong>48 hours</strong> prior to your event. We will do our best to accommodate schedule shifts.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
              <p className="font-black text-[#000223] mb-1">❄️ Weather Contingency</p>
              <p>In case of severe rain or storms, you can reschedule for free up to 2 hours before the start. Cancellations are free if rescheduled.</p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          header, .print\\:hidden, button, a, form { display: none !important; }
          .shadow-sm, .shadow-xl { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
        }
      `}</style>

      {/* EDIT CONTACT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-[#000223]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
            <h2 className="text-xl font-black text-[#000223] mb-6">Update Contact Details</h2>
            <form onSubmit={handleUpdateContact} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Email Address</label>
                <input required type="email" value={editForm.email} onChange={e=>setEditForm({...editForm, email:e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold outline-none focus:border-[#FFA000]" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Phone Number</label>
                <input required type="tel" value={editForm.phone} onChange={e=>setEditForm({...editForm, phone:e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold outline-none focus:border-[#FFA000]" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Booking Notes</label>
                <textarea value={editForm.notes} onChange={e=>setEditForm({...editForm, notes:e.target.value})} className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold outline-none focus:border-[#FFA000]" rows={3} placeholder="Add gate details or special requests..." />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" disabled={submitting} onClick={()=>setShowEditModal(false)} className="flex-1 py-3 rounded-full font-black text-sm bg-slate-100 hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-full font-black text-sm text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] flex items-center justify-center gap-1.5">
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
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
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
                <textarea required value={requestReason} onChange={e=>setRequestReason(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 font-bold outline-none focus:border-[#FFA000]" rows={4} placeholder={showRequestModal === "CANCEL" ? "E.g. Weather conditions..." : "E.g. Change time from 2:00 PM to 4:00 PM..."} />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" disabled={submitting} onClick={()=>setShowRequestModal(null)} className="flex-1 py-3 rounded-full font-black text-sm bg-slate-100 hover:bg-slate-200">Cancel</button>
                <button type="submit" disabled={submitting || !requestReason.trim()} className="flex-1 py-3 rounded-full font-black text-sm text-white bg-[#000223] hover:bg-[#FFA000] hover:text-[#000223] flex items-center justify-center gap-1.5">
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

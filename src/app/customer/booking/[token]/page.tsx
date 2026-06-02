"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Clock, MapPin, Phone, Mail, Users, CheckCircle2, 
  AlertCircle, XCircle, Loader2, Edit, Calendar, DollarSign, Printer, ArrowRight, HelpCircle, Ticket
} from "lucide-react";

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; icon: any; desc: string }> = {
  PENDING_REVIEW:  { label: "Under Review",    bg: "bg-amber-100",   border: "border-amber-300", text: "text-amber-800",  icon: Clock, desc: "Our team is reviewing your event details and will prepare your custom quote. We'll reach out via WhatsApp!" },
  PENDING_PAYMENT: { label: "Awaiting Payment", bg: "bg-blue-100",    border: "border-blue-300", text: "text-blue-800",   icon: DollarSign, desc: "Your booking is approved! We are finalizing the details." },
  CONFIRMED:       { label: "Confirmed",       bg: "bg-emerald-100", border: "border-emerald-300", text: "text-emerald-800",icon: CheckCircle2, desc: "Awesome! Your legendary ice cream event is fully confirmed." },
  COMPLETED:       { label: "Completed",       bg: "bg-slate-100",   border: "border-slate-300", text: "text-slate-800",  icon: CheckCircle2, desc: "This event has been completed. Thank you for choosing Boston Legend!" },
  CANCELLED:       { label: "Cancelled",       bg: "bg-red-100",     border: "border-red-300", text: "text-red-800",    icon: XCircle, desc: "This booking request has been cancelled." },
  REJECTED:        { label: "Needs Info / Rejected",        bg: "bg-rose-100",    border: "border-rose-300", text: "text-rose-800",   icon: XCircle, desc: "This request requires updates or has been declined." },
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
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6EF]">
      <div className="text-center animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[#FFA000]/20 blur-2xl animate-pulse"></div>
          <img src={LOGO} alt="Boston Legend" className="h-20 w-auto relative z-10 mx-auto mb-6" />
        </div>
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#FFA000]" />
        <p className="mt-4 font-black text-[#000223] tracking-widest uppercase text-xs">Loading Portal</p>
      </div>
    </div>
  );

  if (error || !booking) return (
    <div className="min-h-screen bg-[#FAF6EF] flex flex-col justify-between font-['Nunito',sans-serif]">
      <header className="bg-[#000223] py-4 px-6 border-b border-white/10 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/"><img src={LOGO} alt="Boston Legend" className="h-10 w-auto" /></a>
          <a href="/packages" className="px-5 py-2.5 rounded-full font-black text-sm bg-[#FFA000] text-[#000223] hover:bg-white transition-all shadow-md">
            Start Your Booking
          </a>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-white rounded-[32px] p-10 border border-slate-100 shadow-[0_20px_50px_rgba(0,2,35,0.06)] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-amber-400"></div>
          <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-[#FFA000]" />
          </div>
          <h2 className="text-2xl font-black text-[#000223] mb-4">Booking Not Found</h2>
          <p className="text-slate-500 font-bold leading-relaxed mb-8">
            We couldn’t find this booking. The link might have expired or the booking number is incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/packages" className="py-3 px-8 rounded-full font-black text-sm text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] transition-all shadow-md">
              Start New Booking
            </a>
            <a href="/contact-us" className="py-3 px-8 rounded-full font-black text-sm text-white bg-[#000223] hover:bg-slate-800 transition-all shadow-md">
              Contact Support
            </a>
          </div>
        </div>
      </main>
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

  let breakdown: any = {};
  try {
    if (quote?.snapshotJson) {
      breakdown = JSON.parse(quote.snapshotJson);
    }
  } catch (e) {
    console.error("Failed to parse quote snapshot:", e);
  }

  // Calculated fields
  const servingsLimit = breakdown.includedGuests ?? (pkg?.servings ?? 50);
  const extraPiecePrice = breakdown.extraGuestPrice ?? (pkg?.extraGuestPrice ?? pkg?.extraPiecePrice ?? 5);
  const extraGuestsCount = breakdown.additionalGuests ?? Math.max(0, booking.guests - servingsLimit);
  const extraGuestsFee = breakdown.additionalGuestsFee ?? (extraGuestsCount * extraPiecePrice);
  const totalMiles = breakdown.distanceMiles ?? (quote?.distanceMiles ?? 0);
  const freeMiles = breakdown.freeMiles ?? 10;
  const billableMiles = breakdown.billableMiles ?? Math.max(0, totalMiles - freeMiles);
  const travelFee = breakdown.travelFee ?? (quote?.travelFee ?? 0);
  const includedServiceMins = breakdown.includedServiceMins ?? (pkg?.durationMins ?? pkg?.includedMinutes ?? booking.durationMins);
  const extraServiceMins = breakdown.additionalServiceMins ?? (booking.extraServiceMins || 0);
  const extraServiceFee = breakdown.additionalServiceFee ?? (booking.extraServiceFee || ((extraServiceMins / 30) * 35));
  const packageName = breakdown.packageName ?? (pkg?.name || "Ice Cream Truck Booking");
  const packagePrice = breakdown.packagePrice ?? (pkg?.price ?? 250);
  const stopsCount = breakdown.additionalStopsCount ?? booking.additionalStops;
  const stopsFee = breakdown.additionalStopsFee ?? (booking.additionalStopsFee ?? 0);
  const estimatedTotal = breakdown.estimatedTotal ?? booking.totalAmount;
  const isCustomPkg = pkg?.slug === "custom-event-package" || (pkg as any)?.serviceType === "CUSTOM";

  return (
    <div className="min-h-screen bg-[#FAF6EF] pb-24 font-['Nunito',sans-serif] selection:bg-[#FFA000] selection:text-[#000223]">
      
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-[#000223]/95 backdrop-blur-md border-b border-white/10 shadow-md print:hidden">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/"><img src={LOGO} alt="Boston Legend" className="h-10 w-auto" /></a>
            <div className="hidden sm:block h-6 w-px bg-white/20"></div>
            <span className="hidden sm:block text-xs font-black text-[#FFA000] uppercase tracking-widest">Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/packages" className="px-5 py-2.5 rounded-full font-black text-xs bg-[#FFA000] text-[#000223] hover:bg-white hover:text-[#000223] transition-all shadow-[0_0_15px_rgba(255,160,0,0.4)]">
              Book Another Event
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section (VIP Ticket Style) */}
      <div className="bg-[#000223] text-white pt-10 pb-20 px-6 relative overflow-hidden shadow-[0_10px_30px_rgba(0,2,35,0.15)] rounded-b-[40px]">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] rounded-full bg-[#FFA000]/20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] rounded-full bg-blue-500/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mt-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <Ticket className="w-4 h-4 text-[#FFA000] rotate-45" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFA000]">Booking Reference:</span>
              <span className="text-xs font-mono font-black text-white">{booking.bookingNumber}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              {packageName}
            </h1>
            
            <p className="text-white/70 font-bold text-sm md:text-base max-w-xl leading-relaxed border-l-2 border-[#FFA000] pl-4">
              {sc.desc}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 shrink-0">
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 ${sc.bg} ${sc.border} shadow-lg`}>
              {booking.status === "PENDING_REVIEW" && (
                <span className="relative flex h-3 w-3 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
              <StatusIcon className={`w-5 h-5 ${sc.text}`} />
              <span className={`text-sm font-black uppercase tracking-wider ${sc.text}`}>{sc.label}</span>
            </div>
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
              Last Updated: {new Date(booking.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20 print:hidden mb-12">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,2,35,0.08)] flex flex-wrap gap-2 justify-center md:justify-end">
          {["PENDING_REVIEW", "PENDING_PAYMENT", "CONFIRMED"].includes(booking.status) && (
            <>
              <button onClick={() => setShowRequestModal("CHANGE")} className="flex-1 sm:flex-initial py-2.5 px-5 bg-slate-50 hover:bg-slate-100 text-[#000223] rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 border border-slate-200">
                <Edit className="w-4 h-4 text-blue-500" /> Request Change
              </button>
              <button onClick={() => setShowRequestModal("CANCEL")} className="flex-1 sm:flex-initial py-2.5 px-5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 border border-rose-200">
                <XCircle className="w-4 h-4" /> Cancel Booking
              </button>
            </>
          )}
          <button onClick={() => window.print()} className="flex-1 sm:flex-initial py-2.5 px-5 bg-[#000223] hover:bg-slate-800 text-white rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md">
            <Printer className="w-4 h-4 text-[#FFA000]" /> Print Receipt
          </button>
        </div>
      </div>

      {/* Grid of structured cards */}
      <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-6 relative z-10">
        
        {/* Card 1: Event Details */}
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors pointer-events-none"></div>
          <h2 className="font-black text-[11px] uppercase tracking-[0.2em] text-[#000223] mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">📅</span> Event Details
          </h2>
          <div className="space-y-4 text-sm font-bold text-slate-500">
            <div className="flex justify-between items-center">
              <span>Date</span>
              <span className="font-black text-[#000223] bg-slate-50 px-3 py-1 rounded-lg">{eventDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Serving Time</span>
              <span className="font-black text-[#000223] bg-slate-50 px-3 py-1 rounded-lg">{booking.startTime}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Duration</span>
              <span className="font-black text-[#000223]">{includedServiceMins} mins</span>
            </div>
            {extraServiceMins > 0 && (
              <div className="flex justify-between items-center text-amber-600">
                <span>Extra Time</span>
                <span className="font-black bg-amber-50 px-2 py-0.5 rounded">+{extraServiceMins} mins (+${extraServiceFee.toFixed(2)})</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <span>Expected Guests</span>
              <span className="font-black text-[#000223] bg-[#FFA000]/20 text-[#000223] px-3 py-1 rounded-lg">{booking.guests} People</span>
            </div>
          </div>
        </div>

        {/* Card 2: Package Details */}
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all">
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-amber-50 rounded-full blur-2xl group-hover:bg-amber-100 transition-colors pointer-events-none"></div>
          <h2 className="font-black text-[11px] uppercase tracking-[0.2em] text-[#000223] mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">🍦</span> Package Details
          </h2>
          <div className="space-y-4 text-sm font-bold text-slate-500">
            <div className="flex justify-between items-center">
              <span>Package</span>
              <span className="font-black text-[#000223] text-right truncate max-w-[180px]">{packageName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Included Servings</span>
              <span className="font-black text-[#000223]">{servingsLimit} Servings</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Base Price</span>
              <span className="font-black text-[#000223]">${packagePrice.toFixed(2)}</span>
            </div>
            {stopsCount > 0 && (
              <div className="flex justify-between items-center text-emerald-600">
                <span>Additional Stops ({stopsCount})</span>
                <span className="font-black bg-emerald-50 px-2 py-0.5 rounded">+${stopsFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <span>Extra Guest Rate</span>
              <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">${extraPiecePrice}/person</span>
            </div>
          </div>
        </div>

        {/* Card 3: Contact & Location */}
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all md:col-span-2">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h2 className="font-black text-[11px] uppercase tracking-[0.2em] text-[#000223] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">👤</span> Contact & Event Location
            </h2>
            <button onClick={() => setShowEditModal(true)} className="text-xs font-black text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
              <Edit className="w-3.5 h-3.5"/> Edit Details
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-sm font-bold text-slate-500">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Customer Name</span>
                <span className="font-black text-[#000223] text-base">{booking.customer.firstName} {booking.customer.lastName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-300" />
                <span className="font-black text-[#000223]">{booking.customer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-300" />
                <span className="font-black text-[#000223]">{booking.customer.phone}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 mt-1">
                  <MapPin className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Primary Setup Location</p>
                  <p className="font-black text-[#000223] leading-snug">{booking.address}</p>
                  <p className="font-bold text-slate-500 text-xs mt-0.5">{booking.city}, MA {booking.zip}</p>
                  {booking.notes && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <p className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-1">Notes / Instructions</p>
                      <p className="text-xs font-semibold text-slate-600 italic">"{booking.notes}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Route Timeline (If multi-stop) */}
        {booking.stops && booking.stops.length > 0 && (
          <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden md:col-span-2">
            <h2 className="font-black text-[11px] uppercase tracking-[0.2em] text-[#000223] mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">🗺️</span> Multi-Stop Routing
            </h2>
            
            <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-400 before:via-blue-400 before:to-slate-200">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-[-29px] md:static"></div>
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Start: Location 1</span>
                  <p className="font-black text-[#000223] text-sm mt-1">{booking.address}</p>
                  <p className="font-bold text-slate-500 text-xs">{booking.city}, {booking.zip}</p>
                </div>
              </div>

              {booking.stops.map((stop: any, idx: number) => (
                <div key={stop.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-4 border-white bg-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-[-29px] md:static"></div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Stop {idx + 2}</span>
                    <p className="font-black text-[#000223] text-sm mt-1">{stop.street}</p>
                    <p className="font-bold text-slate-500 text-xs">{stop.city}, {stop.state} {stop.zipCode}</p>
                    {stop.notes && (
                      <p className="text-xs font-semibold text-slate-400 mt-2 italic bg-slate-50 p-2 rounded-lg">"{stop.notes}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Card 5: Travel & Mileage */}
        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all">
          <h2 className="font-black text-[11px] uppercase tracking-[0.2em] text-[#000223] mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
            <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">📍</span> Travel & Logistics
          </h2>
          <div className="space-y-4 text-sm font-bold text-slate-500">
            <div className="flex justify-between items-center">
              <span>Total Route Distance</span>
              <span className="font-black text-[#000223]">{totalMiles.toFixed(1)} miles</span>
            </div>
            <div className="flex justify-between items-center text-emerald-600">
              <span>Free Miles Included</span>
              <span className="font-black bg-emerald-50 px-2 py-0.5 rounded">{freeMiles} miles</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Billable Miles</span>
              <span className="font-black text-[#000223]">{billableMiles.toFixed(1)} miles</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <span>Travel Fee</span>
              <span className="font-black text-amber-600">${travelFee.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Card 6: Payment Policy */}
        <div className="bg-white rounded-3xl p-1 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-between">
          {/* Inner wrapper with gradient */}
          <div className="bg-gradient-to-br from-[#000223] to-[#001a4c] rounded-[28px] p-6 h-full flex flex-col justify-between text-white relative">
            <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-[#FFA000]/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div>
              <h2 className="font-black text-[11px] uppercase tracking-[0.2em] text-white/70 mb-4 flex items-center gap-2">
                <span className="text-[#FFA000]">💵</span> Billing Summary
              </h2>
              
              <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
                <span className="text-white/80 font-bold text-sm">Estimated Total</span>
                {isCustomPkg ? (
                  <span className="text-2xl font-black text-[#FFA000]">Custom Quote</span>
                ) : (
                  <span className="text-4xl font-black text-[#FFA000] tracking-tight">${estimatedTotal.toFixed(2)}</span>
                )}
              </div>
            </div>

            {isCustomPkg ? (
              <div className="space-y-2 mt-4 relative z-10">
                <p className="text-xs font-bold text-white/80 mb-2 leading-relaxed">Our team will reach out via WhatsApp to finalize your custom quote:</p>
                {[
                  { num: "617-999-3803", wa: "16179993803" },
                  { num: "781-921-3233", wa: "17819213233" }
                ].map(({ num, wa }) => (
                  <a key={wa} href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-black text-sm text-[#000223] bg-white hover:bg-slate-100 transition-all shadow-sm">
                    <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    WhatsApp {num}
                  </a>
                ))}
              </div>
            ) : (
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 mt-4 relative z-10">
                <p className="text-xs font-bold text-white/80 leading-relaxed">
                  {breakdown.paymentPolicy || "Payment is collected after the service is successfully provided."}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">No Upfront Credit Card Required</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* EDIT CONTACT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-[#000223]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-[#000223]">Edit Details</h2>
              <button onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateContact} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Email Address</label>
                <input required type="email" value={editForm.email} onChange={e=>setEditForm({...editForm, email:e.target.value})} className="w-full py-3.5 px-4 rounded-xl border-2 font-bold text-sm outline-none transition-all bg-slate-50 text-[#000223] border-slate-200 placeholder:text-slate-400 focus:border-[#FFA000] focus:bg-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Phone Number</label>
                <input required type="tel" value={editForm.phone} onChange={e=>setEditForm({...editForm, phone:e.target.value})} className="w-full py-3.5 px-4 rounded-xl border-2 font-bold text-sm outline-none transition-all bg-slate-50 text-[#000223] border-slate-200 placeholder:text-slate-400 focus:border-[#FFA000] focus:bg-white" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Booking Notes / Instructions</label>
                <textarea value={editForm.notes} onChange={e=>setEditForm({...editForm, notes:e.target.value})} className="w-full py-3.5 px-4 rounded-xl border-2 font-bold text-sm outline-none transition-all bg-slate-50 text-[#000223] border-slate-200 placeholder:text-slate-400 focus:border-[#FFA000] focus:bg-white" rows={3} placeholder="Add gate details or special requests..." />
              </div>
              
              <div className="pt-4">
                <button type="submit" disabled={submitting} className="w-full py-4 rounded-xl font-black text-sm text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] transition-colors flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(255,160,0,0.25)]">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving...</> : "Save Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST MODAL (CHANGE/CANCEL) */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-[#000223]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-black text-[#000223]">
                {showRequestModal === "CANCEL" ? "Cancel Request" : "Change Request"}
              </h2>
              <button onClick={() => setShowRequestModal(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-slate-500 font-bold mb-6 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {showRequestModal === "CANCEL"
                ? "Let us know why you need to cancel. Our policy details apply, and we will update your booking shortly."
                : "Describe the dates, times, or servings adjustments you require. A staff member will review and update your schedule."}
            </p>
            
            {submitSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-bold mb-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{submitSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRequestAction} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Reason & Details</label>
                <textarea required value={requestReason} onChange={e=>setRequestReason(e.target.value)} className="w-full py-3.5 px-4 rounded-xl border-2 font-bold text-sm outline-none transition-all bg-slate-50 text-[#000223] border-slate-200 placeholder:text-slate-400 focus:border-[#FFA000] focus:bg-white" rows={4} placeholder={showRequestModal === "CANCEL" ? "E.g. Weather conditions..." : "E.g. Change time from 2:00 PM to 4:00 PM..."} />
              </div>
              
              <div className="pt-4">
                <button type="submit" disabled={submitting || !requestReason.trim()} className="w-full py-4 rounded-xl font-black text-sm text-white bg-[#000223] hover:bg-[#FFA000] hover:text-[#000223] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin"/> Submitting...</> : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

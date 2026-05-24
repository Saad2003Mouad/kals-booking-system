"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, XCircle, Clock, AlertCircle, CreditCard, MapPin, Navigation } from "lucide-react";
import { SERVICE_AREAS } from "@/lib/serviceAreas";
import OtpVerification from "./OtpVerification";
const MapPicker = dynamic(()=>import("./MapPicker"),{ssr:false,loading:()=><div className="rounded-2xl bg-gray-100 animate-pulse" style={{height:280}}/>});

// ─── Shared premium input component ──────────────────────────────────────────
const FN = "'Nunito',sans-serif";
const inputBase = "w-full px-4 py-3.5 rounded-2xl border-2 font-semibold text-gray-800 outline-none transition-all bg-white";
const inputFocus = "focus:border-[#FFA000] focus:shadow-[0_0_0_3px_rgba(255,160,0,0.12)]";
const labelBase = "block text-xs font-black uppercase tracking-widest text-gray-400 mb-2";

function Field({ label, helper, error, children }: { label:string; helper?:string; error?:string; children:React.ReactNode }) {
  return (
    <div>
      <label className={labelBase}>{label}</label>
      {children}
      {error  && <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">⚠ {error}</p>}
      {!error && helper && <p className="text-gray-400 text-xs font-semibold mt-1.5">{helper}</p>}
    </div>
  );
}

function FormInput({ label, value, onChange, type="text", placeholder="", min="", helper="", error="" }:
  { label:string; value:string; onChange:(v:string)=>void; type?:string; placeholder?:string; min?:string; helper?:string; error?:string }) {
  return (
    <Field label={label} helper={helper} error={error}>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} min={min}
        className={`${inputBase} ${inputFocus} ${error?"border-red-400 bg-red-50":"border-gray-200"}`}
        style={{fontFamily:FN}} autoComplete="off"/>
    </Field>
  );
}

function SelectField({ label, value, onChange, options, placeholder="Select…", helper="" }:
  { label:string; value:string; onChange:(v:string)=>void; options:string[]; placeholder?:string; helper?:string }) {
  return (
    <Field label={label} helper={helper}>
      <select value={value} onChange={e=>onChange(e.target.value)}
        className={`${inputBase} ${inputFocus} border-gray-200`} style={{fontFamily:FN}}>
        <option value="">{placeholder}</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );
}

function ZipSelector({ zip, city, onZipChange, serviceZones }:{ zip:string; city:string; onZipChange:(zip:string,city:string)=>void; serviceZones:{zip:string;city:string}[] }) {
  const [open, setOpen]   = useState(false);
  const [search, setSearch] = useState("");
  // Use dynamic DB zones first, fallback to static list
  const zones = serviceZones.length > 0 ? serviceZones : SERVICE_AREAS;
  const filtered = search.length>=2
    ? zones.filter(a=>a.zip.startsWith(search)||a.city.toLowerCase().includes(search.toLowerCase())).slice(0,12)
    : [];

  return (
    <div className="md:col-span-2 grid md:grid-cols-2 gap-5">
      <div className="relative">
        <label className={labelBase}>ZIP Code</label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-4 w-4 h-4 text-gray-300 pointer-events-none"/>
          <input
            value={zip||search}
            onChange={e=>{ setSearch(e.target.value); setOpen(true); if(e.target.value.length===5){ const found=zones.find(a=>a.zip===e.target.value); if(found) onZipChange(found.zip,found.city); } }}
            onFocus={()=>setOpen(true)}
            placeholder="02115 or Boston…"
            className={`${inputBase} ${inputFocus} border-gray-200 pl-10`}
            style={{fontFamily:FN}} autoComplete="off"/>
        </div>
        {open && filtered.length>0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-gray-200 shadow-2xl z-50 max-h-52 overflow-y-auto">
            {filtered.map(a=>(
              <button key={a.zip} type="button" onClick={()=>{ onZipChange(a.zip,a.city); setSearch(""); setOpen(false); }}
                className="w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors flex items-center justify-between border-b border-gray-50 last:border-0">
                <span className="font-bold text-sm" style={{color:"#000223"}}>{a.city}</span>
                <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">{a.zip}</span>
              </button>
            ))}
          </div>
        )}
        {open && search.length>=2 && filtered.length===0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl border border-red-100 shadow-xl z-50 p-4 text-center">
            <p className="text-red-600 font-bold text-sm">Outside service area</p>
            <p className="text-gray-400 text-xs mt-1">We serve Massachusetts only</p>
          </div>
        )}
        <p className="text-gray-400 text-xs font-semibold mt-1.5">Massachusetts service area</p>
      </div>
      <div>
        <label className={labelBase}>City (auto-filled)</label>
        <input readOnly value={city} placeholder="Select ZIP above"
          className={`${inputBase} border-gray-200 bg-gray-50 text-gray-500 cursor-default`}
          style={{fontFamily:FN}}/>
      </div>
    </div>
  );
}
// ──────────────────────────────────────────────────────────────────────────────


type Pkg = { id:string; name:string; type?:string; serviceType?:string; includedMinutes?:number; includedQty?:number; servings?:number; basePrice?:number; price?:number; extraPiecePrice?:number; description?:string; slug?:string };
type Quote = { basePrice:number; travelFee:number; overtimeFee:number; extraPieceFee:number; totalAmount:number; distanceMiles:number; extraPiecePrice:number; breakdown:{label:string;amount:number}[] };
type AIResult = { decision?:{ verdict:string; customerMessage:string; alternativeTimes?:string[] }; booking?:{ id:string; bookingNumber:string }; paymentUrl?:string; paymentEnabled?:boolean; customerPortalUrl?:string };

const EVENT_TYPES = ["Birthday Party","Corporate Event","Wedding Reception","Block Party","School Event","Fundraiser","Launch Party","Reunion","Sports Event","Other"];
const STEPS = ["Package","Event Details","Contact","Verify","Review"];

export default function BookingForm() {
  const searchParams = useSearchParams();
  const packageParamId = searchParams.get("package") || searchParams.get("packageId");
  const [step, setStep]   = useState(0);
  const [pkgList, setPkgList] = useState<{TRUCK:Pkg[];VAN:Pkg[]}>({TRUCK:[],VAN:[]});
  const [pkgTab, setPkgTab]   = useState<"TRUCK"|"VAN">("TRUCK");
  const [sel, setSel]     = useState<Pkg|null>(null);
  const [eventDate, setEventDate]   = useState("");
  const [startTime, setStartTime]   = useState("");
  const [durationMins, setDuration] = useState("60");
  const [guests, setGuests]         = useState("50");
  const [eventType, setEventType]   = useState("");
  const [address, setAddress]       = useState("");
  const [zip, setZip]               = useState("");
  const [city, setCity]             = useState("");
  const [notes, setNotes]           = useState("");
  const extraServings = "0";
  const [firstName, setFirst]       = useState("");
  const [lastName, setLast]         = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [lat, setLat]               = useState<number|null>(null);
  const [lng, setLng]               = useState<number|null>(null);
  const [drivingMiles, setDMiles]   = useState(0);
  const [mapTravelFee, setMapFee]   = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);
  const [quote, setQuote]   = useState<Quote|null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteErr, setQuoteErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AIResult|null>(null);
  const [phoneErr, setPhoneErr] = useState("");
  const [submitErr, setSubmitErr] = useState("");
  const [serviceZones, setServiceZones] = useState<{zip:string;city:string}[]>([]);

  useEffect(()=>{ 
    fetch("/api/packages").then(r=>r.json()).then((pRes:any)=>{
      // The new API wraps packages in `data`, the old one didn't. Handling both.
      const p = Array.isArray(pRes) ? pRes : (pRes.data || []);
      setPkgList({TRUCK:p.filter((x:any)=>x.type==="TRUCK" || x.serviceType==="AMERICANO_TRUCK"),VAN:p.filter((x:any)=>x.type==="VAN" || x.serviceType==="SPRINTER_VAN")});
      if (packageParamId) {
        const found = p.find((x:any) => x.id === packageParamId || x.slug === packageParamId);
        if (found) {
          setPkgTab((found.type==="TRUCK" || found.serviceType==="AMERICANO_TRUCK") ? "TRUCK" : "VAN");
          setSel(found);
          setStep(1); // Auto-advance to details
        }
      }
    });
    // Load dynamic service zones from DB (falls back to static list if empty)
    fetch("/api/service-areas")
      .then(r=>r.ok?r.json():null)
      .then((d:any)=>{ if(d?.data?.length) setServiceZones(d.data.map((z:any)=>({zip:z.zip,city:z.city}))); })
      .catch(()=>{}); // silent fallback to static
  },[packageParamId]);

  const handleZipChange = useCallback((z:string, c:string)=>{ setZip(z); setCity(c); },[]);

  const toEnNum = (str: string) => {
    if (!str) return str;
    return String(str)
      .replace(/[٠-٩]/g, d => '0123456789'[d.charCodeAt(0) - 1632])
      .replace(/[۰-۹]/g, d => '0123456789'[d.charCodeAt(0) - 1776]);
  };

  const formatEnDate = (d: string) => {
    if (!d) return "";
    try {
      const parts = d.split("-");
      if (parts.length === 3) {
        return `${parts[1]}/${parts[2]}/${parts[0]}`;
      }
      return new Date(d + "T12:00:00").toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch { return d; }
  };
  const formatEnTime = (t: string) => {
    // Display time in 24h HH:mm format — no AM/PM
    if (!t) return "";
    try {
      const [h,m] = t.split(":");
      return `${h.padStart(2,"0")}:${(m||"00").padStart(2,"0")}`;
    } catch { return t; }
  };

  const fetchQuote = async () => {
    setQuoting(true); setQuoteErr("");
    const payload = { 
      packageId: sel?.id, 
      zip, 
      guests: parseInt(toEnNum(guests) || "0"), 
      durationMins: parseInt(toEnNum(durationMins) || "60"), 
      extraServings: parseInt(toEnNum(extraServings) || "0"),
      distanceMiles: drivingMiles 
    };
    console.log("Quote payload:", payload);
    const r = await fetch("/api/quotes",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
    const d = await r.json();
    if(!r.ok){ setQuoteErr(d.error || JSON.stringify(d)); setQuoting(false); return; }
    setQuote(d); setStep(2); setQuoting(false);
  };

  const validatePhone = (p: string) => {
    const clean = toEnNum(p).replace(/\D/g, "");
    if (!clean || clean.length < 10) return "Please enter a valid phone number (at least 10 digits).";
    return "";
  };

  const submit = async () => {
    // Inline phone validation before API call
    const pErr = validatePhone(phone);
    if (pErr) { setPhoneErr(pErr); setStep(2); setSubmitting(false); return; }
    setPhoneErr("");
    setSubmitErr("");
    setSubmitting(true);
    const cleanPhone = toEnNum(phone).replace(/[^\d+\-\s()]/g, "");
    const payload = {
      packageId: sel?.id,
      eventDate: toEnNum(eventDate),
      startTime: toEnNum(startTime).replace(" ص", " AM").replace(" م", " PM"),
      durationMins: parseInt(toEnNum(durationMins) || "60"),
      guests: parseInt(toEnNum(guests) || "0"),
      eventType,
      address,
      city,
      zip,
      notes,
      extraServings: parseInt(toEnNum(extraServings) || "0"),
      firstName,
      lastName,
      email,
      phone: cleanPhone,
      totalAmount: quote?.totalAmount,
      travelFee: quote?.travelFee,
      overtimeFee: quote?.overtimeFee,
      extraPieceFee: quote?.extraPieceFee,
      distanceMiles: quote?.distanceMiles,
      latitude: lat,
      longitude: lng
    };
    console.log("Booking payload:", payload);
    const r = await fetch("/api/bookings",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
    const d:AIResult & { error?: string, missingFields?: string[] } = await r.json();
    if (!r.ok) {
      console.error("Booking failed:", d);
      // Show field-level error for phone if that's the culprit
      if (d.missingFields?.includes("phone")) {
        setPhoneErr("Please enter your phone number before completing the booking.");
        setStep(2);
      } else {
        setSubmitErr(d.error || "Something went wrong. Please try again.");
      }
      setSubmitting(false);
      return;
    }
    setResult(d); setSubmitting(false);
  };

  // ── Result screens ──────────────────────────────────────────────────────
  if(result){
    const { decision, booking } = result;
    if(decision?.verdict==="REJECTED") return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6"><XCircle className="w-10 h-10 text-red-500"/></div>
        <h2 className="text-2xl font-black mb-3" style={{color:"#000223"}}>Request Not Available</h2>
        <p className="text-gray-600 font-semibold leading-relaxed mb-8">{decision.customerMessage}</p>
        {decision.alternativeTimes&&decision.alternativeTimes.length>0&&(
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-black mb-4 flex items-center gap-2" style={{color:"#000223"}}><Clock className="w-5 h-5 text-[#FFA000]"/>Available Times</h3>
            <div className="flex flex-wrap gap-3">
              {decision.alternativeTimes.map(t=>(
                <button key={t} onClick={()=>{setStartTime(t);setResult(null);setStep(1);}} className="px-5 py-2.5 rounded-full font-black text-sm border-2 hover:bg-[#000223] hover:text-[#000223] transition-all" style={{borderColor:"#000223",color:"#000223"}}>{t}</button>
              ))}
            </div>
          </div>
        )}
        <button onClick={()=>setResult(null)} className="px-8 py-3 rounded-full font-black border-2" style={{borderColor:"#000223",color:"#000223"}}>Modify Request</button>
      </div>
    );
    if(decision?.verdict==="PENDING_REVIEW") return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6"><AlertCircle className="w-10 h-10 text-amber-500"/></div>
        <h2 className="text-2xl font-black mb-3" style={{color:"#000223"}}>Request Received</h2>
        <p className="font-mono font-black text-lg mb-4" style={{color:"#000223"}}>#{booking?.bookingNumber}</p>
        <p className="text-gray-600 font-semibold leading-relaxed mb-8">Your booking request is being reviewed by our team. You can track updates or request changes anytime from your booking page.</p>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-left text-sm text-blue-700 font-semibold space-y-1.5 max-w-sm mx-auto mb-8">
          <p>✓ Team reviews request details</p><p>✓ Confirmation sent to {email}</p><p>✓ Payment will be collected in cash at the end of the event.</p>
        </div>
        <a href={result.customerPortalUrl??`/customer/booking/${booking?.id}`} className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-black text-white shadow-xl hover:bg-[#FFA000] hover:text-[#000223] transition-all bg-[#000223]">
          View or Manage Your Booking
        </a>
      </div>
    );
    const paymentEnabled = result.paymentEnabled !== false;
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-emerald-500"/></div>
        <h2 className="text-3xl font-black mb-3" style={{color:"#000223"}}>Booking Confirmed</h2>
        <p className="font-mono font-black text-lg mb-4" style={{color:"#000223"}}>#{booking?.bookingNumber}</p>
        
        {paymentEnabled ? (
          <>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8 max-w-sm mx-auto">
              <div className="flex justify-between pt-2"><span className="font-black" style={{color:"#000223"}}>Total Due</span><span className="text-xl font-black" style={{color:"#FFA000"}}>${quote?.totalAmount.toFixed(2)}</span></div>
            </div>
            <a href={result.paymentUrl??`/checkout/${booking?.id}`} className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-black text-[#000223] shadow-xl" style={{background:"#000223"}}>
              <CreditCard className="w-5 h-5"/> Pay ${quote?.totalAmount.toFixed(2)}
            </a>
            <p className="text-xs text-gray-400 font-semibold mt-4">🔒 Secured by Stripe</p>
          </>
        ) : (
          <>
            <p className="text-gray-600 font-semibold leading-relaxed mb-8">Your ice cream event request has been confirmed. Payment will be collected in cash at the end of the event.</p>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8 max-w-sm mx-auto text-left text-sm font-semibold text-slate-700">
              <p className="text-center font-black text-emerald-600 text-base mb-2">Cash Payment</p>
              <p className="mb-1 text-xs text-slate-500">Total estimated amount: <span className="font-black text-slate-800">${quote?.totalAmount.toFixed(2)}</span></p>
              <p className="text-xs text-slate-500">Payment will be collected in cash at the end of the event.</p>
            </div>
            <a href={result.customerPortalUrl??result.paymentUrl??`/customer/booking/${booking?.id}`} className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-black text-white bg-[#000223] shadow-xl hover:bg-[#FFA000] hover:text-[#000223] transition-all">
              View or Manage Your Booking
            </a>
          </>
        )}
      </div>
    );
  }

  const listPkgs = pkgList[pkgTab];

  return (
    <div className="booking-wrapper" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-4 py-8 relative z-10 bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl mb-12">

      {/* Progress */}
      <div className="sm:hidden text-center mb-6">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">Step {step + 1} of 5</p>
        <p className="text-lg font-black text-[#000223]">{STEPS[step]}</p>
      </div>

      <div className="flex items-center gap-2 mb-8 sm:mb-12">
        {STEPS.map((s,i)=>(
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all" style={{background:i<=step?"#000223":"#F3F4F6",color:i<=step?"#FFA000":"#9CA3AF"}}>
                {i<step?<CheckCircle2 className="w-5 h-5"/>:i+1}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider mt-1.5 whitespace-nowrap hidden sm:block" style={{color:i<=step?"#000223":"#9CA3AF"}}>{s}</span>
            </div>
            {i<STEPS.length-1&&<div className="flex-1 h-0.5 mx-2 mb-0 sm:mb-4 rounded-full transition-all" style={{background:i<step?"#FFA000":"#E5E7EB"}}/>}
          </div>
        ))}
      </div>

      {/* ── STEP 0: Package ── */}
      {step===0&&(
        <div>
          <h2 className="text-2xl font-black mb-1" style={{color:"#000223"}}>Choose Your Package</h2>
          <p className="text-gray-400 font-semibold mb-6 text-sm">Select the vehicle type and package that fits your event</p>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
            {(["TRUCK","VAN"] as const).map(t=>(
              <button key={t} onClick={()=>{setPkgTab(t);setSel(null);}} className="flex-1 py-3 rounded-xl font-black text-sm transition-all"
                style={pkgTab===t?{background:"#000223",color:"#FFA000",boxShadow:"0 4px 12px rgba(0,2,35,0.2)"}:{color:"#6B7280"}}>
                {t==="TRUCK"?"🚐 Americano Truck":"🚌 Sprinter / Dodge Van"}
              </button>
            ))}
          </div>
          {/* Package Cards */}
          <div className="space-y-3 mb-6">
            {listPkgs.length===0&&<div className="text-center py-12 text-gray-400"><Loader2 className="w-7 h-7 animate-spin mx-auto mb-3"/><p className="font-semibold">Loading packages…</p></div>}
            {listPkgs.map((p:any)=>(
              <button key={p.id} onClick={()=>setSel(p)}
                className="w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 group"
                style={{borderColor:sel?.id===p.id?"#FFA000":"#F3F4F6",background:sel?.id===p.id?"linear-gradient(135deg,#FFFBEB,#FFF8DC)":"white",boxShadow:sel?.id===p.id?"0 8px 24px rgba(255,160,0,0.15)":"none"}}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-all" style={{background:sel?.id===p.id?"#FFF0B3":"#F8F9FC"}}>
                  {(p.type==="TRUCK"||p.serviceType==="AMERICANO_TRUCK")?"🚐":"🚌"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-base" style={{color:"#000223"}}>{p.name}</div>
                  <div className="text-gray-400 font-semibold text-sm mt-0.5">
                    {p.includedQty||p.servings} servings · {p.includedMinutes||60} min included
                  </div>
                  <div className="text-xs text-gray-300 font-semibold mt-0.5">+${p.extraPiecePrice||(p.type==="TRUCK"?5:4)}/extra serving</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="font-black text-2xl" style={{color:sel?.id===p.id?"#FFA000":"#000223"}}>${p.basePrice||p.price}</div>
                  {sel?.id===p.id&&<div className="text-xs font-black text-emerald-600 mt-1">✓ Selected</div>}
                </div>
              </button>
            ))}
          </div>
          <div className="p-4 rounded-2xl border border-amber-100 bg-amber-50 text-sm text-amber-700 font-semibold mb-6 flex items-start gap-3">
            <span className="text-lg">💡</span>
            <span>Not sure about guest count? Start with 30 servings — we'll adjust at the event based on actual attendance.</span>
          </div>
          <div className="flex justify-end">
            <button onClick={()=>setStep(1)} disabled={!sel}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black shadow-lg disabled:opacity-40 hover:-translate-y-0.5 transition-all"
              style={{background:"#000223",color:"#FFA000"}}>
              Continue <ArrowRight className="w-5 h-5"/>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 1: Event Details ── */}
      {step===1&&(
        <div>
          <h2 className="text-2xl font-black mb-1" style={{color:"#000223"}}>Event Details</h2>
          <p className="text-gray-400 font-semibold mb-6 text-sm">Tell us about your event so we can prepare perfectly</p>
          <div className="grid md:grid-cols-2 gap-5">
            <FormInput label="Event Date" value={eventDate} onChange={setEventDate} type="date"
              min={new Date().toISOString().split("T")[0]} helper="Select a future date for your event"/>
            <FormInput label="Start Time" value={startTime} onChange={setStartTime} type="time"
              helper="When should we arrive and start serving?"/>
            <Field label="Duration" helper={`Package includes ${sel?.includedMinutes||60} min. Overtime billed per 30 min.`}>
              <select value={durationMins} onChange={e=>setDuration(e.target.value)}
                className={`${inputBase} ${inputFocus} border-gray-200`} style={{fontFamily:FN}}>
                {[45,60,90,120,150,180,240].map(m=><option key={m} value={m}>{m} min{sel&&m>(sel.includedMinutes||60)?` (+${Math.ceil((m-(sel.includedMinutes||60))/30)} overtime blocks)`:" (included)"}</option>)}
              </select>
            </Field>
            <FormInput label="Estimated Guests" value={guests} onChange={v=>setGuests(toEnNum(v))} type="number" min="1"
              helper="Approximate number of people at the event"/>
            <div className="md:col-span-2">
              <SelectField label="Event Type" value={eventType} onChange={setEventType}
                options={EVENT_TYPES} placeholder="Select event type…" helper="Helps us customize the experience for you"/>
            </div>
            <div className="md:col-span-2">
              <FormInput label="Street Address" value={address} onChange={setAddress} placeholder="123 Main Street"
                helper="The exact address where the truck should park"/>
            </div>
            <ZipSelector zip={zip} city={city} onZipChange={handleZipChange} serviceZones={serviceZones}/>
            {/* Map */}
            <div className="md:col-span-2">
              <label className={labelBase}>📍 Pin Event Location on Map</label>
              <p className="text-xs text-gray-400 font-semibold mb-2">Click map to set event location. Distance is always calculated from <strong>Boston Revere — 84 Fernwood Ave</strong> — your device location is never used as the origin.</p>
              <MapPicker lat={lat} lng={lng} address={address} onLocationChange={(la,lo,addr,c,z,dm,tf)=>{
                setLat(la); setLng(lo);
                if(addr) setAddress(addr);
                if(c) setCity(c);
                if(z) setZip(z);
                setDMiles(dm); setMapFee(tf);
              }}/>
              {drivingMiles > 0 && (
                <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                  <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase mb-2">Travel Distance</h4>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-lg font-black text-[#000223]">
                        {drivingMiles.toFixed(1)} miles
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        from our garage at Boston Revere — 84 Fernwood Ave
                      </p>
                    </div>
                    <span className="text-2xl">🎁</span>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-xs text-amber-800 font-semibold space-y-1">
                    <p className="font-black text-amber-900 text-sm flex items-center gap-1.5">
                      <span>First 10 miles are FREE</span>
                    </p>
                    <p className="text-slate-500">Only additional miles after the first 10 are calculated.</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                    {drivingMiles <= 10 ? (
                      <div className="w-full">
                        <p className="text-emerald-700 font-black">Great news! Your event is within our free 10-mile travel zone.</p>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Travel fee: $0</p>
                      </div>
                    ) : (
                      <div className="w-full flex justify-between items-center">
                        <div>
                          <p className="text-[#000223] font-bold">Your first 10 miles are free.</p>
                          <p className="text-xs font-semibold text-slate-500">Billable miles: {(drivingMiles - 10).toFixed(1)} miles</p>
                        </div>
                        <span className="text-base font-black text-amber-700">Estimated travel fee: ${mapTravelFee.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <FormInput label="Notes (optional)" value={notes} onChange={setNotes} placeholder="Gate code, allergies, special requests…"
              helper="Any details that would help us prepare"/>
          </div>
          {quoteErr&&<div className="mt-5 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 font-bold text-sm">⚠ {quoteErr}</div>}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6">
            <button onClick={()=>setStep(0)} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-black border-2 w-full sm:w-auto" style={{borderColor:"#000223",color:"#000223"}}><ArrowLeft className="w-5 h-5"/>Back</button>
            <button onClick={fetchQuote} disabled={quoting||!eventDate||!startTime||!zip||!eventType||!address}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-black shadow-lg disabled:opacity-40 hover:-translate-y-0.5 transition-all w-full sm:w-auto" style={{background:"#000223",color:"#FFA000"}}>
              {quoting?<><Loader2 className="w-5 h-5 animate-spin"/>Calculating…</>:<>Get My Quote <ArrowRight className="w-5 h-5"/>  </>}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Contact ── */}
      {step===2&&(
        <div>
          <h2 className="text-2xl font-black mb-1" style={{color:"#000223"}}>Your Information</h2>
          <p className="text-gray-400 font-semibold mb-5 text-sm">We'll use this to confirm your booking and send updates</p>
          {quote&&(
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 mb-6 flex items-center justify-between">
              <span className="font-bold text-sm text-gray-500">Estimated Total</span>
              <span className="text-2xl font-black" style={{color:"#FFA000"}}>${quote.totalAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-5">
            <FormInput label="First Name" value={firstName} onChange={setFirst} placeholder="Jane" helper="As it appears on your ID"/>
            <FormInput label="Last Name" value={lastName} onChange={setLast} placeholder="Smith"/>
            <FormInput label="Email Address" value={email} onChange={setEmail} type="email" placeholder="jane@email.com" helper="OTP code will be sent here"/>
            <div>
              <label className={labelBase}>Phone Number *</label>
              <input type="tel" value={phone}
                onChange={e=>{ setPhone(toEnNum(e.target.value)); if(phoneErr) setPhoneErr(""); }}
                onBlur={()=>{ const err=validatePhone(phone); setPhoneErr(err); }}
                placeholder="(617) 555-0000"
                className={`${inputBase} ${inputFocus} ${phoneErr?"border-red-400 bg-red-50":"border-gray-200"}`}
                style={{fontFamily:FN}} autoComplete="tel"/>
              {phoneErr?<p className="text-red-500 text-xs font-bold mt-1.5">⚠ {phoneErr}</p>
                :<p className="text-gray-400 text-xs font-semibold mt-1.5">US number preferred · we may call to confirm</p>}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6">
            <button onClick={()=>setStep(1)} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-black border-2 w-full sm:w-auto" style={{borderColor:"#000223",color:"#000223"}}><ArrowLeft className="w-5 h-5"/>Back</button>
            <button onClick={()=>{ const err=validatePhone(phone); if(err){setPhoneErr(err);return;} setStep(3); }} disabled={!firstName||!lastName||!email||!phone}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-black shadow-lg disabled:opacity-40 hover:-translate-y-0.5 transition-all w-full sm:w-auto" style={{background:"#000223",color:"#FFA000"}}>
              Verify Email <ArrowRight className="w-5 h-5"/>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: OTP Verification ── */}
      {step===3&&(
        <div>
          <h2 className="text-2xl font-black mb-6" style={{color:"#000223"}}>Verify Your Email</h2>
          {otpVerified?(
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3"/>
              <p className="font-black" style={{color:"#000223"}}>Email Verified!</p>
              <button onClick={()=>setStep(4)} className="mt-4 btn-primary">Continue to Review <ArrowRight className="w-4 h-4"/></button>
            </div>
          ):(
            <OtpVerification email={email} firstName={firstName} onVerified={()=>{setOtpVerified(true);setStep(4);}}/>
          )}
          <div className="flex justify-start pt-6">
            <button onClick={()=>setStep(2)} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-black border-2 w-full sm:w-auto" style={{borderColor:"#000223",color:"#000223"}}><ArrowLeft className="w-5 h-5"/>Back</button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Review ── */}
      {step===4&&quote&&(
        <div>
          <h2 className="text-2xl font-black mb-1" style={{color:"#000223"}}>Review & Confirm</h2>
          <p className="text-gray-400 font-semibold mb-5 text-sm">Please verify your details before we send to our AI dispatch system</p>
          {submitErr&&<div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-bold text-sm">⚠ {submitErr}</div>}
          {/* Package Card */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm mb-4 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2">
              <span className="text-base">🚐</span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Package</span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <div className="font-black" style={{color:"#000223"}}>{sel?.name}</div>
                <div className="text-sm text-gray-400 font-semibold mt-0.5">{sel?.includedQty||sel?.servings} servings · {sel?.includedMinutes||60} min base</div>
              </div>
              <div className="font-black text-xl" style={{color:"#FFA000"}}>${sel?.basePrice||sel?.price}</div>
            </div>
          </div>
          {/* Event Card */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm mb-4 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">📅 Event Details</span>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                ["Type", eventType],
                ["Date", formatEnDate(eventDate)],
                ["Time", formatEnTime(startTime)],
                ["Duration", `${durationMins} min`],
                ["Guests", toEnNum(guests)],
                ["Location", `${address}, ${city} ${zip}`],
                ["Garage Origin", "Boston Revere — 84 Fernwood Ave"],
                ["Total Distance", `${quote.distanceMiles.toFixed(1)} miles`],
                ["Free Miles Zone", "First 10.0 miles FREE"],
                ["Billable Distance", `${Math.max(0, quote.distanceMiles - 10).toFixed(1)} miles`],
                ["Travel Fee", quote.travelFee > 0 ? `$${quote.travelFee.toFixed(2)}` : "Free ($0.00)"]
              ].map(([l,v])=>(
                <div key={l} className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-gray-400 font-bold">{l}</span>
                  <span className="font-black text-right max-w-[60%]" style={{color:"#000223"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Contact Card */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm mb-4 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">👤 Contact</span>
            </div>
            <div className="divide-y divide-gray-50">
              {[["Name",`${firstName} ${lastName}`],["Email",email],["Phone",phone]].map(([l,v])=>(
                <div key={l} className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-gray-400 font-bold">{l}</span>
                  <span className="font-black" style={{color:"#000223"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Pricing Card */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 p-5 mb-5">
            <div className="text-xs font-black uppercase tracking-widest text-amber-600 mb-3">💰 Pricing Breakdown</div>
            {quote.breakdown.map((b,i)=>(b.amount!==0||i===0)&&(
              <div key={i} className="flex justify-between py-1.5 text-sm">
                <span className="font-semibold text-gray-600">{b.label}</span>
                <span className="font-black" style={{color:b.amount<0?"#10B981":"#000223"}}>{b.amount<0?`-$${Math.abs(b.amount).toFixed(2)}`:`$${b.amount.toFixed(2)}`}</span>
              </div>
            ))}
            <div className="border-t border-amber-200 mt-3 pt-3 flex justify-between items-center">
              <span className="font-black text-base" style={{color:"#000223"}}>Total</span>
              <span className="text-2xl font-black" style={{color:"#FFA000"}}>${quote.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-xs text-center text-gray-400 font-semibold mb-5">📍 Travel always calculated from <strong>Boston Legend garage: Boston Revere — 84 Fernwood Ave</strong></p>
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6">
            <button onClick={()=>setStep(3)} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-black border-2 w-full sm:w-auto" style={{borderColor:"#000223",color:"#000223"}}><ArrowLeft className="w-5 h-5"/>Back</button>
            <button onClick={submit} disabled={submitting}
              className="inline-flex items-center justify-center gap-3 px-6 sm:px-10 py-4 rounded-full font-black shadow-xl disabled:opacity-50 hover:-translate-y-0.5 transition-all text-base sm:text-lg w-full sm:w-auto" style={{background:"linear-gradient(135deg,#000223,#001a4c)",color:"#FFA000"}}>
              {submitting?<><Loader2 className="w-5 h-5 animate-spin"/>Processing…</>
                :<><CheckCircle2 className="w-5 h-5"/>Confirm Booking Request</>}
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

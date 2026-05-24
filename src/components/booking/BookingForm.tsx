"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  XCircle,
  Clock,
  AlertCircle,
  CreditCard,
  MapPin,
  Navigation,
  Mail,
  Phone,
  User,
  Shield,
  DollarSign,
  Calendar,
  Users,
  Star
} from "lucide-react";
import { SERVICE_AREAS } from "@/lib/serviceAreas";
import OtpVerification from "./OtpVerification";

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-2xl bg-cream-50 animate-pulse border-2 border-dashed border-amber-200 flex items-center justify-center"
      style={{ height: 280 }}
    >
      <div className="text-center text-amber-500">
        <MapPin className="w-8 h-8 mx-auto mb-2 animate-bounce" />
        <p className="text-xs font-bold">Loading map…</p>
      </div>
    </div>
  )
});

// ─── Design tokens (Boston Legend Palette) ────────────────────────────────────
const NAVY = "#000223";
const GOLD = "#FFA000";
const CREAM = "#FFFDF5";
const CREAM_LIGHT = "#FAF8F0";
const BROWN = "#3D1C00";
const SOFT_BORDER = "#E8E3D5";
const FN = "'Nunito', 'Inter', sans-serif";

// ─── Shared Premium UI Components ─────────────────────────────────────────────
function Field({
  label,
  helper,
  error,
  children
}: {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        className="block text-xs font-black uppercase tracking-[0.15em]"
        style={{ color: NAVY, opacity: 0.6 }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-sm font-bold flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}
      {!error && helper && (
        <p
          className="text-xs font-semibold"
          style={{ color: NAVY, opacity: 0.45 }}
        >
          {helper}
        </p>
      )}
    </div>
  );
}

function PremiumInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  min = "",
  helper = "",
  error = "",
  icon: Icon
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  min?: string;
  helper?: string;
  error?: string;
  icon?: any;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <Field label={label} helper={helper} error={error}>
      <div className="relative w-full">
        {Icon && (
          <Icon
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors"
            style={{ color: focused ? GOLD : error ? "#EF4444" : "#A3A3C2" }}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full py-4 pr-5 rounded-2xl border-2 font-semibold text-base outline-none transition-all"
          style={{
            fontFamily: FN,
            fontSize: "16px",
            paddingLeft: Icon ? "2.75rem" : "1.25rem",
            borderColor: error ? "#FCA5A5" : focused ? GOLD : SOFT_BORDER,
            background: error ? "#FFF5F5" : CREAM,
            color: NAVY,
            boxShadow: focused
              ? `0 0 0 4px rgba(255, 160, 0, 0.15)`
              : error
              ? "0 0 0 4px rgba(239, 68, 68, 0.05)"
              : "none"
          }}
          autoComplete="off"
        />
      </div>
    </Field>
  );
}

function PremiumSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  helper = "",
  icon: Icon
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  helper?: string;
  icon?: any;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <Field label={label} helper={helper}>
      <div className="relative w-full">
        {Icon && (
          <Icon
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors"
            style={{ color: focused ? GOLD : "#A3A3C2" }}
          />
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full py-4 pr-10 rounded-2xl border-2 font-semibold text-base outline-none transition-all appearance-none"
          style={{
            fontFamily: FN,
            fontSize: "16px",
            paddingLeft: Icon ? "2.75rem" : "1.25rem",
            borderColor: focused ? GOLD : SOFT_BORDER,
            background: CREAM,
            color: NAVY,
            boxShadow: focused ? `0 0 0 4px rgba(255, 160, 0, 0.15)` : "none"
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-solid border-t-4 border-l-4 border-r-4 border-transparent"
          style={{ borderTopColor: NAVY, opacity: 0.5, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomWidth: 0 }}
        />
      </div>
    </Field>
  );
}

function ZipSelector({
  zip,
  city,
  onZipChange,
  serviceZones
}: {
  zip: string;
  city: string;
  onZipChange: (zip: string, city: string) => void;
  serviceZones: { zip: string; city: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  
  const zones = serviceZones.length > 0 ? serviceZones : SERVICE_AREAS;
  const filtered =
    search.length >= 2
      ? zones
          .filter(
            (a) =>
              a.zip.startsWith(search) ||
              a.city.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 12)
      : [];

  return (
    <div className="md:col-span-2 grid md:grid-cols-2 gap-5">
      <div className="relative flex flex-col gap-2 w-full">
        <label
          className="block text-xs font-black uppercase tracking-[0.15em]"
          style={{ color: NAVY, opacity: 0.6 }}
        >
          ZIP Code
        </label>
        <div className="relative">
          <MapPin
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors"
            style={{ color: focused ? GOLD : "#A3A3C2" }}
          />
          <input
            value={zip || search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
              if (e.target.value.length === 5) {
                const found = zones.find((a) => a.zip === e.target.value);
                if (found) onZipChange(found.zip, found.city);
              }
            }}
            onFocus={() => {
              setOpen(true);
              setFocused(true);
            }}
            onBlur={() => {
              setFocused(false);
              setTimeout(() => setOpen(false), 250);
            }}
            placeholder="02115 or Boston…"
            className="w-full py-4 pl-12 pr-5 rounded-2xl border-2 font-semibold text-base outline-none transition-all"
            style={{
              fontFamily: FN,
              fontSize: "16px",
              borderColor: focused ? GOLD : SOFT_BORDER,
              background: CREAM,
              color: NAVY,
              boxShadow: focused ? `0 0 0 4px rgba(255, 160, 0, 0.15)` : "none"
            }}
            autoComplete="off"
          />
        </div>
        {open && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 max-h-56 overflow-y-auto divide-y divide-slate-50">
            {filtered.map((a) => (
              <button
                key={a.zip}
                type="button"
                onMouseDown={() => {
                  onZipChange(a.zip, a.city);
                  setSearch("");
                  setOpen(false);
                }}
                className="w-full text-left px-5 py-3.5 hover:bg-amber-50/50 transition-colors flex items-center justify-between"
              >
                <span className="font-black text-sm" style={{ color: NAVY }}>
                  {a.city}
                </span>
                <span
                  className="font-mono text-xs font-bold px-2 py-1 rounded-lg border"
                  style={{
                    background: CREAM,
                    borderColor: SOFT_BORDER,
                    color: GOLD
                  }}
                >
                  {a.zip}
                </span>
              </button>
            ))}
          </div>
        )}
        {open && search.length >= 2 && filtered.length === 0 && (
          <div
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-red-100 p-4 text-center z-50 shadow-xl"
            style={{ background: "#FFF5F5" }}
          >
            <p className="text-red-600 font-black text-sm">Outside service area</p>
            <p className="text-red-400 text-xs font-bold mt-1">We serve Massachusetts only</p>
          </div>
        )}
        <p
          className="text-xs font-semibold"
          style={{ color: NAVY, opacity: 0.45 }}
        >
          Massachusetts service area
        </p>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label
          className="block text-xs font-black uppercase tracking-[0.15em]"
          style={{ color: NAVY, opacity: 0.6 }}
        >
          City (auto-filled)
        </label>
        <input
          readOnly
          value={city}
          placeholder="Select ZIP above"
          className="w-full py-4 px-5 rounded-2xl border-2 font-semibold text-base outline-none cursor-default"
          style={{
            fontFamily: FN,
            fontSize: "16px",
            borderColor: SOFT_BORDER,
            background: CREAM_LIGHT,
            color: NAVY,
            opacity: 0.8
          }}
        />
      </div>
    </div>
  );
}

type Pkg = {
  id: string;
  name: string;
  type?: string;
  serviceType?: string;
  includedMinutes?: number;
  includedQty?: number;
  servings?: number;
  basePrice?: number;
  price?: number;
  extraPiecePrice?: number;
  description?: string;
  slug?: string;
};

type Quote = {
  basePrice: number;
  travelFee: number;
  overtimeFee: number;
  extraPieceFee: number;
  totalAmount: number;
  distanceMiles: number;
  extraPiecePrice: number;
  breakdown: { label: string; amount: number }[];
};

type AIResult = {
  decision?: {
    verdict: string;
    customerMessage: string;
    alternativeTimes?: string[];
  };
  booking?: { id: string; bookingNumber: string };
  paymentUrl?: string;
  paymentEnabled?: boolean;
  customerPortalUrl?: string;
};

const EVENT_TYPES = [
  "Birthday Party",
  "Corporate Event",
  "Wedding Reception",
  "Block Party",
  "School Event",
  "Fundraiser",
  "Launch Party",
  "Reunion",
  "Sports Event",
  "Other"
];
const STEPS = ["Package", "Event Details", "Contact", "Verify", "Review"];

export default function BookingForm() {
  const searchParams = useSearchParams();
  const packageParamId = searchParams.get("package") || searchParams.get("packageId");
  const [step, setStep] = useState(0);
  const [pkgList, setPkgList] = useState<{ TRUCK: Pkg[]; VAN: Pkg[] }>({
    TRUCK: [],
    VAN: []
  });
  const [pkgTab, setPkgTab] = useState<"TRUCK"|"VAN">("TRUCK");
  const [sel, setSel] = useState<Pkg | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [durationMins, setDuration] = useState("60");
  const [guests, setGuests] = useState("50");
  const [eventType, setEventType] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const extraServings = "0";
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [drivingMiles, setDMiles] = useState(0);
  const [mapTravelFee, setMapFee] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteErr, setQuoteErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [phoneErr, setPhoneErr] = useState("");
  const [submitErr, setSubmitErr] = useState("");
  const [serviceZones, setServiceZones] = useState<{ zip: string; city: string }[]>([]);
  const [phoneFocused, setPhoneFocused] = useState(false);

  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((pRes: any) => {
        const p = Array.isArray(pRes) ? pRes : pRes.data || [];
        setPkgList({
          TRUCK: p.filter((x: any) => x.type === "TRUCK" || x.serviceType === "AMERICANO_TRUCK"),
          VAN: p.filter((x: any) => x.type === "VAN" || x.serviceType === "SPRINTER_VAN")
        });
        if (packageParamId) {
          const found = p.find((x: any) => x.id === packageParamId || x.slug === packageParamId);
          if (found) {
            setPkgTab((found.type === "TRUCK" || found.serviceType === "AMERICANO_TRUCK") ? "TRUCK" : "VAN");
            setSel(found);
            setStep(1);
          }
        }
      });

    fetch("/api/service-areas")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: any) => {
        if (d?.data?.length)
          setServiceZones(d.data.map((z: any) => ({ zip: z.zip, city: z.city })));
      })
      .catch(() => {});
  }, [packageParamId]);

  const handleZipChange = useCallback((z: string, c: string) => {
    setZip(z);
    setCity(c);
  }, []);

  const toEnNum = (str: string) => {
    if (!str) return str;
    return String(str)
      .replace(/[٠-٩]/g, (d) => "0123456789"[d.charCodeAt(0) - 1632])
      .replace(/[۰-۹]/g, (d) => "0123456789"[d.charCodeAt(0) - 1776]);
  };

  const formatEnDate = (d: string) => {
    if (!d) return "";
    try {
      const parts = d.split("-");
      if (parts.length === 3) {
        return `${parts[1]}/${parts[2]}/${parts[0]}`;
      }
      return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    } catch {
      return d;
    }
  };

  const formatEnTime = (t: string) => {
    if (!t) return "";
    try {
      const [h, m] = t.split(":");
      return `${h.padStart(2, "0")}:${(m || "00").padStart(2, "0")}`;
    } catch {
      return t;
    }
  };

  const fetchQuote = async () => {
    setQuoting(true);
    setQuoteErr("");
    const payload = {
      packageId: sel?.id,
      zip,
      guests: parseInt(toEnNum(guests) || "0"),
      durationMins: parseInt(toEnNum(durationMins) || "60"),
      extraServings: parseInt(toEnNum(extraServings) || "0"),
      distanceMiles: drivingMiles
    };
    const r = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const d = await r.json();
    if (!r.ok) {
      setQuoteErr(d.error || JSON.stringify(d));
      setQuoting(false);
      return;
    }
    setQuote(d);
    setStep(2);
    setQuoting(false);
  };

  const validatePhone = (p: string) => {
    const clean = toEnNum(p).replace(/\D/g, "");
    if (!clean || clean.length < 10)
      return "Please enter a valid phone number (at least 10 digits).";
    return "";
  };

  const submit = async () => {
    const pErr = validatePhone(phone);
    if (pErr) {
      setPhoneErr(pErr);
      setStep(2);
      setSubmitting(false);
      return;
    }
    setPhoneErr("");
    setSubmitErr("");
    setSubmitting(true);
    const cleanPhone = toEnNum(phone).replace(/[^\d+\-\s()]/g, "");
    const payload = {
      packageId: sel?.id,
      eventDate: toEnNum(eventDate),
      startTime: toEnNum(startTime),
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
    const r = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const d: AIResult & { error?: string; missingFields?: string[] } = await r.json();
    if (!r.ok) {
      if (d.missingFields?.includes("phone")) {
        setPhoneErr("Please enter your phone number before completing the booking.");
        setStep(2);
      } else {
        setSubmitErr(d.error || "Something went wrong. Please try again.");
      }
      setSubmitting(false);
      return;
    }
    setResult(d);
    setSubmitting(false);
  };

  // ─── Result Screens ─────────────────────────────────────────────────────────
  if (result) {
    const { decision, booking } = result;
    if (decision?.verdict === "REJECTED") {
      return (
        <div className="max-w-2xl mx-auto px-6 py-20 text-center" style={{ fontFamily: FN }}>
          <div className="w-24 h-24 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <XCircle className="w-12 h-12 text-rose-500 animate-pulse" />
          </div>
          <h2 className="text-3xl font-black mb-4 tracking-tight" style={{ color: NAVY }}>
            Request Not Available
          </h2>
          <p className="text-slate-600 font-semibold leading-relaxed mb-10 max-w-lg mx-auto">
            {decision.customerMessage}
          </p>
          {decision.alternativeTimes && decision.alternativeTimes.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-8 mb-10 text-left max-w-lg mx-auto">
              <h3 className="font-black text-lg mb-4 flex items-center gap-2" style={{ color: NAVY }}>
                <Clock className="w-5 h-5 text-amber-500" /> Alternative Available Times
              </h3>
              <div className="flex flex-wrap gap-3">
                {decision.alternativeTimes.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setStartTime(t);
                      setResult(null);
                      setStep(1);
                    }}
                    className="px-5 py-3 rounded-full font-black text-sm border-2 bg-white hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md"
                    style={{ borderColor: NAVY, color: NAVY }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setResult(null)}
            className="px-10 py-4 rounded-full font-black text-white hover:-translate-y-0.5 transition-all shadow-xl"
            style={{ background: NAVY }}
          >
            Modify Request Details
          </button>
        </div>
      );
    }

    if (decision?.verdict === "PENDING_REVIEW") {
      return (
        <div className="max-w-2xl mx-auto px-6 py-20 text-center" style={{ fontFamily: FN }}>
          <div className="w-24 h-24 rounded-3xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Clock className="w-12 h-12 text-amber-500 animate-spin-slow" />
          </div>
          <h2 className="text-3xl font-black mb-2 tracking-tight" style={{ color: NAVY }}>
            Request Received
          </h2>
          <p className="font-mono font-black text-xl mb-6 px-4 py-1.5 rounded-full border bg-slate-50 inline-block" style={{ color: GOLD, borderColor: SOFT_BORDER }}>
            #{booking?.bookingNumber}
          </p>
          <p className="text-slate-600 font-semibold leading-relaxed mb-10 max-w-lg mx-auto">
            Your ice cream catering booking request is being reviewed by our dispatch team. We will contact you shortly to confirm assignments.
          </p>
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-left text-sm text-emerald-800 font-semibold space-y-3 max-w-md mx-auto mb-10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Team reviews scheduling & routing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Confirmation details sent to: {email}</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Payment collected in cash after event. No deposit needed.</span>
            </div>
          </div>
          <a
            href={result.customerPortalUrl ?? `/customer/booking/${booking?.id}`}
            className="inline-flex items-center gap-2 px-12 py-4.5 rounded-full font-black text-white shadow-xl hover:-translate-y-0.5 transition-all text-base"
            style={{ background: NAVY }}
          >
            View or Manage Your Booking
          </a>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center" style={{ fontFamily: FN }}>
        <div className="w-24 h-24 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black mb-2 tracking-tight" style={{ color: NAVY }}>
          Booking Confirmed
        </h2>
        <p className="font-mono font-black text-xl mb-6 px-4 py-1.5 rounded-full border bg-slate-50 inline-block" style={{ color: GOLD, borderColor: SOFT_BORDER }}>
          #{booking?.bookingNumber}
        </p>

        <p className="text-slate-600 font-semibold leading-relaxed mb-10 max-w-lg mx-auto">
          Your booking is locked in. Payment will be collected in cash after your event.
        </p>

        <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 mb-10 max-w-md mx-auto text-left text-sm font-semibold text-slate-700">
          <p className="text-center font-black text-emerald-600 text-base mb-3">Cash Payment Policy</p>
          <div className="flex justify-between py-1.5 border-b border-dashed border-amber-200">
            <span>Estimated Total:</span>
            <span className="font-black text-slate-800">${quote?.totalAmount.toFixed(2)}</span>
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center leading-relaxed">
            No upfront deposits or credit card pre-authorizations are required.
          </p>
        </div>

        <a
          href={result.customerPortalUrl ?? `/customer/booking/${booking?.id}`}
          className="inline-flex items-center gap-2 px-12 py-4.5 rounded-full font-black text-white shadow-xl hover:-translate-y-0.5 transition-all text-base"
          style={{ background: NAVY }}
        >
          View or Manage Your Booking
        </a>
      </div>
    );
  }

  const listPkgs = pkgList[pkgTab];

  return (
    <div className="booking-wrapper py-6 sm:py-12" style={{ fontFamily: FN, background: CREAM_LIGHT }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-10 bg-white shadow-2xl rounded-[2.5rem] border border-slate-100">
        
        {/* Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between sm:hidden mb-4">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Step {step + 1} of 5
            </span>
            <span className="text-sm font-black" style={{ color: NAVY }}>
              {STEPS[step]}
            </span>
          </div>

          <div className="hidden sm:flex items-center justify-between gap-2 px-4 mb-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all border-2"
                    style={{
                      background: i === step ? NAVY : i < step ? "#EBFBEE" : "white",
                      color: i === step ? GOLD : i < step ? "#10B981" : "#A3A3C2",
                      borderColor: i === step ? NAVY : i < step ? "#A7F3D0" : SOFT_BORDER
                    }}
                  >
                    {i < step ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : i + 1}
                  </div>
                  <span
                    className="text-[11px] font-black uppercase tracking-wider mt-2.5 whitespace-nowrap"
                    style={{ color: i <= step ? NAVY : "#9CA3AF", opacity: i <= step ? 1 : 0.6 }}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-1 mx-4 rounded-full transition-all"
                    style={{
                      background: i < step ? "#10B981" : SOFT_BORDER,
                      opacity: i < step ? 0.8 : 0.4
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── STEP 0: Package ── */}
        {step === 0 && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: NAVY }}>
                Choose Your Package
              </h2>
              <p className="text-slate-400 font-semibold text-sm mt-1">
                Select the vehicle type and package that fits your event size
              </p>
            </div>

            {/* Vehicle Tabs */}
            <div className="flex gap-3 mb-8 p-1.5 rounded-2xl border-2" style={{ background: CREAM, borderColor: SOFT_BORDER }}>
              {(["TRUCK", "VAN"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setPkgTab(t);
                    setSel(null);
                  }}
                  className="flex-1 py-4 rounded-xl font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  style={
                    pkgTab === t
                      ? { background: NAVY, color: GOLD, boxShadow: "0 6px 20px rgba(0,2,35,0.15)" }
                      : { color: NAVY, opacity: 0.6 }
                  }
                >
                  {t === "TRUCK" ? "🚐 Americano Truck" : "🚌 Sprinter / Dodge Van"}
                </button>
              ))}
            </div>

            {/* Package Cards List */}
            <div className="space-y-4 mb-8">
              {listPkgs.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                  <p className="font-bold text-sm">Loading premium packages…</p>
                </div>
              )}
              {listPkgs.map((p: any) => {
                const isSelected = sel?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSel(p)}
                    className="w-full text-left p-6 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center gap-5 hover:shadow-xl hover:-translate-y-0.5 group bg-white"
                    style={{
                      borderColor: isSelected ? GOLD : SOFT_BORDER,
                      boxShadow: isSelected ? "0 10px 30px rgba(255,160,0,0.12)" : "none"
                    }}
                  >
                    {/* Vehicle Icon Badge */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{ background: isSelected ? "#FFF0B3" : CREAM }}
                    >
                      {p.type === "TRUCK" || p.serviceType === "AMERICANO_TRUCK" ? "🚐" : "🚌"}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-lg sm:text-xl tracking-tight" style={{ color: NAVY }}>
                          {p.name}
                        </span>
                        {isSelected && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 font-semibold text-sm mt-1.5 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-slate-400" /> {p.includedQty || p.servings} Servings Included
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-slate-400" /> {p.includedMinutes || 60} Min Duration
                        </span>
                      </div>
                      <div className="text-xs font-semibold mt-1 flex items-center gap-1" style={{ color: GOLD }}>
                        <Star className="w-3.5 h-3.5 fill-current" /> Extra servings billed at ${p.extraPiecePrice || (p.type === "TRUCK" ? 5 : 4)} each
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex-shrink-0 text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-dashed border-slate-100 flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 sm:hidden">
                        Base Price:
                      </span>
                      <span className="text-3xl font-black tracking-tight" style={{ color: isSelected ? GOLD : NAVY }}>
                        ${p.basePrice || p.price}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Microcopy note */}
            <div className="p-5 rounded-3xl border border-amber-100 bg-amber-50/50 text-sm text-slate-700 font-semibold mb-8 flex items-start gap-3.5 leading-relaxed">
              <span className="text-xl shrink-0 mt-0.5">💡</span>
              <div>
                <p className="font-black text-amber-900">Need more servings?</p>
                <p className="text-slate-600 mt-0.5">
                  Select the package closest to your estimate. Extra servings are calculated and charged based on actual count served at the event.
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="flex justify-end">
              <button
                onClick={() => setStep(1)}
                disabled={!sel}
                className="inline-flex items-center gap-2 px-10 py-4.5 rounded-full font-black text-base shadow-xl disabled:opacity-40 hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
                style={{ background: NAVY, color: GOLD }}
              >
                Continue to Details <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Event Details ── */}
        {step === 1 && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: NAVY }}>
                Event Details
              </h2>
              <p className="text-slate-400 font-semibold text-sm mt-1">
                Provide timing and location for dispatch scheduling
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <PremiumInput
                label="Event Date"
                value={eventDate}
                onChange={setEventDate}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                icon={Calendar}
                helper="Select a future calendar date"
              />
              <PremiumInput
                label="Start Time (24h format)"
                value={startTime}
                onChange={setStartTime}
                type="time"
                icon={Clock}
                helper="HH:mm format (e.g. 14:00 for 2:00 PM)"
              />

              <Field
                label="Duration"
                helper={`Included in package: ${sel?.includedMinutes || 60} mins. Overtime billed per 30 min.`}
              >
                <div className="relative w-full">
                  <select
                    value={durationMins}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full py-4 pl-5 pr-10 rounded-2xl border-2 font-semibold text-base outline-none appearance-none"
                    style={{ fontFamily: FN, borderColor: SOFT_BORDER, background: CREAM, color: NAVY }}
                  >
                    {[45, 60, 90, 120, 150, 180, 240].map((m) => (
                      <option key={m} value={m}>
                        {m} min
                        {sel && m > (sel.includedMinutes || 60)
                          ? ` (+${Math.ceil((m - (sel.includedMinutes || 60)) / 30)} overtime blocks)`
                          : " (included)"}
                      </option>
                    ))}
                  </select>
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-solid border-t-4 border-l-4 border-r-4 border-transparent"
                    style={{ borderTopColor: NAVY, opacity: 0.5, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomWidth: 0 }}
                  />
                </div>
              </Field>

              <PremiumInput
                label="Estimated Guests"
                value={guests}
                onChange={(v) => setGuests(toEnNum(v))}
                type="number"
                min="1"
                icon={Users}
                helper="Approximate guest attendance count"
              />

              <div className="md:col-span-2">
                <PremiumSelect
                  label="Event Type"
                  value={eventType}
                  onChange={setEventType}
                  options={EVENT_TYPES}
                  placeholder="Select type of event…"
                  icon={Star}
                  helper="Helps our drivers coordinate themed setup"
                />
              </div>

              <div className="md:col-span-2">
                <PremiumInput
                  label="Street Address"
                  value={address}
                  onChange={setAddress}
                  placeholder="e.g. 123 Main Street"
                  icon={Navigation}
                  helper="Event setup location address"
                />
              </div>

              <ZipSelector
                zip={zip}
                city={city}
                onZipChange={handleZipChange}
                serviceZones={serviceZones}
              />

              {/* Map Selection */}
              <div className="md:col-span-2 border-t border-dashed border-slate-100 pt-6">
                <label className="block text-xs font-black uppercase tracking-[0.15em] mb-2" style={{ color: NAVY, opacity: 0.6 }}>
                  📍 Set Setup Location on Map
                </label>
                <p className="text-xs font-semibold text-slate-400 mb-4">
                  Drag the pin or click on the map to set setup spot. Coordinates calculate travel distances from our garage.
                </p>

                <MapPicker
                  lat={lat}
                  lng={lng}
                  address={address}
                  onLocationChange={(la, lo, addr, c, z, dm, tf) => {
                    setLat(la);
                    setLng(lo);
                    if (addr) setAddress(addr);
                    if (c) setCity(c);
                    if (z) setZip(z);
                    setDMiles(dm);
                    setMapFee(tf);
                  }}
                />

                {/* Travel Distance Card */}
                {drivingMiles > 0 && (
                  <div
                    className="mt-6 p-6 rounded-3xl border-2 text-left transition-all"
                    style={{ background: "#FBFBFC", borderColor: SOFT_BORDER }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                          Travel Calculation
                        </span>
                        <span className="text-2xl font-black tracking-tight mt-1 block" style={{ color: NAVY }}>
                          {drivingMiles.toFixed(1)} miles
                        </span>
                      </div>
                      <span className="text-3xl">🎁</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 border-t border-dashed border-slate-200 pt-4 text-xs font-bold text-slate-600">
                      <div>
                        <span className="text-slate-400 block">First 10.0 miles:</span>
                        <span className="text-emerald-600 text-sm font-black">FREE ZONE</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Billable miles:</span>
                        <span className="text-sm font-black text-slate-800">
                          {Math.max(0, drivingMiles - 10).toFixed(1)} miles
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between text-xs sm:text-sm font-black text-amber-800">
                      <span>Travel Fee:</span>
                      <span>
                        {drivingMiles <= 10 ? (
                          <span className="text-emerald-600">Free ($0.00)</span>
                        ) : (
                          <span>${mapTravelFee.toFixed(2)}</span>
                        )}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 font-semibold mt-3 text-center">
                      📍 Origin garage: <strong>Boston Revere — 84 Fernwood Ave</strong>
                    </p>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <PremiumInput
                  label="Special Notes or Delivery Instructions"
                  value={notes}
                  onChange={setNotes}
                  placeholder="Gate code, parking instructions, flavor requests…"
                  helper="Help us navigate setup at your location"
                />
              </div>
            </div>

            {quoteErr && (
              <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 font-bold text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{quoteErr}</span>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-10">
              <button
                onClick={() => setStep(0)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-full font-black border-2 w-full sm:w-auto transition-all"
                style={{ borderColor: NAVY, color: NAVY }}
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={fetchQuote}
                disabled={quoting || !eventDate || !startTime || !zip || !eventType || !address}
                className="inline-flex items-center justify-center gap-2 px-10 py-4.5 rounded-full font-black shadow-xl disabled:opacity-40 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                style={{ background: NAVY, color: GOLD }}
              >
                {quoting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Calculating…
                  </>
                ) : (
                  <>
                    Request Quote <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Contact ── */}
        {step === 2 && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: NAVY }}>
                Customer Information
              </h2>
              <p className="text-slate-400 font-semibold text-sm mt-1">
                Enter your details to generate your digital catering quote
              </p>
            </div>

            {quote && (
              <div
                className="p-5 rounded-3xl border-2 mb-8 flex items-center justify-between"
                style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                    Estimated Total
                  </span>
                  <span className="text-2xl font-black tracking-tight mt-0.5 block" style={{ color: NAVY }}>
                    ${quote.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Payment Method
                  </span>
                  <span className="text-sm font-black mt-1 block" style={{ color: NAVY }}>
                    💵 Cash after event
                  </span>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <PremiumInput
                label="First Name"
                value={firstName}
                onChange={setFirst}
                placeholder="Jane"
                icon={User}
                helper="As listed on government ID"
              />
              <PremiumInput
                label="Last Name"
                value={lastName}
                onChange={setLast}
                placeholder="Smith"
                icon={User}
              />
              <PremiumInput
                label="Email Address"
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="jane@example.com"
                icon={Mail}
                helper="OTP verification code will be sent here"
              />

              <div className="flex flex-col gap-2 w-full">
                <label
                  className="block text-xs font-black uppercase tracking-[0.15em]"
                  style={{ color: NAVY, opacity: 0.6 }}
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors"
                    style={{ color: phoneErr ? "#EF4444" : phoneFocused ? GOLD : "#A3A3C2" }}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(toEnNum(e.target.value));
                      if (phoneErr) setPhoneErr("");
                    }}
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={(e) => {
                      setPhoneFocused(false);
                      const err = validatePhone(phone);
                      setPhoneErr(err);
                    }}
                    placeholder="(617) 555-0000"
                    className="w-full py-4 pl-12 pr-5 rounded-2xl border-2 font-semibold text-base outline-none transition-all"
                    style={{
                      fontFamily: FN,
                      fontSize: "16px",
                      borderColor: phoneErr ? "#FCA5A5" : phoneFocused ? GOLD : SOFT_BORDER,
                      background: phoneErr ? "#FFF5F5" : CREAM,
                      color: NAVY,
                      boxShadow: phoneFocused
                        ? `0 0 0 4px rgba(255, 160, 0, 0.15)`
                        : phoneErr
                        ? "0 0 0 4px rgba(239, 68, 68, 0.05)"
                        : "none"
                    }}
                    autoComplete="tel"
                  />
                </div>
                {phoneErr ? (
                  <p className="text-red-500 text-sm font-bold flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {phoneErr}
                  </p>
                ) : (
                  <p
                    className="text-xs font-semibold"
                    style={{ color: NAVY, opacity: 0.45 }}
                  >
                    US phone number preferred for delivery dispatch
                  </p>
                )}
              </div>
            </div>

            {/* Trust Note Card */}
            <div className="flex items-center gap-3.5 p-5 rounded-3xl border border-slate-200 mt-8" style={{ background: CREAM }}>
              <Shield className="w-5 h-5 shrink-0" style={{ color: GOLD }} />
              <p className="text-xs font-semibold leading-relaxed text-slate-500">
                Privacy Protection: Your details will only be used to facilitate scheduling dispatch, sending automated updates, and confirmation notifications.
              </p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-10">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-full font-black border-2 w-full sm:w-auto transition-all"
                style={{ borderColor: NAVY, color: NAVY }}
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={() => {
                  const err = validatePhone(phone);
                  if (err) {
                    setPhoneErr(err);
                    return;
                  }
                  setStep(3);
                }}
                disabled={!firstName || !lastName || !email || !phone}
                className="inline-flex items-center justify-center gap-2 px-10 py-4.5 rounded-full font-black shadow-xl disabled:opacity-40 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                style={{ background: NAVY, color: GOLD }}
              >
                Verify Contact Details <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: OTP Verification ── */}
        {step === 3 && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: NAVY }}>
                Verify Your Email
              </h2>
              <p className="text-slate-400 font-semibold text-sm mt-1">
                Enter the passcode sent to your email to confirm contact details
              </p>
            </div>

            {otpVerified ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-lg font-black" style={{ color: NAVY }}>
                  Email Verified!
                </p>
                <button
                  onClick={() => setStep(4)}
                  className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-black shadow-lg"
                  style={{ background: NAVY }}
                >
                  Proceed to Review <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <OtpVerification
                email={email}
                firstName={firstName}
                onVerified={() => {
                  setOtpVerified(true);
                  setStep(4);
                }}
              />
            )}

            <div className="flex justify-start mt-10">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-full font-black border-2 w-full sm:w-auto transition-all"
                style={{ borderColor: NAVY, color: NAVY }}
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Review & Confirm ── */}
        {step === 4 && quote && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: NAVY }}>
                Review & Confirm
              </h2>
              <p className="text-slate-400 font-semibold text-sm mt-1">
                Please verify details before submitting booking dispatch
              </p>
            </div>

            {submitErr && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-700 font-bold text-sm flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{submitErr}</span>
              </div>
            )}

            <div className="space-y-6 mb-8">
              {/* Package Summary Card */}
              <div className="rounded-3xl border bg-white overflow-hidden" style={{ borderColor: SOFT_BORDER }}>
                <div
                  className="px-5 py-4 border-b flex items-center gap-2"
                  style={{ borderColor: CREAM_LIGHT, background: CREAM_LIGHT }}
                >
                  <span className="text-lg">🚐</span>
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: NAVY, opacity: 0.6 }}>
                    Catering Package
                  </span>
                </div>
                <div className="px-5 py-5 flex items-center justify-between">
                  <div>
                    <span className="font-black text-lg block" style={{ color: NAVY }}>
                      {sel?.name}
                    </span>
                    <span className="text-sm text-slate-500 font-semibold mt-1 block">
                      {sel?.includedQty || sel?.servings} servings included · {sel?.includedMinutes || 60} mins setup
                    </span>
                  </div>
                  <span className="font-black text-2xl" style={{ color: GOLD }}>
                    ${sel?.basePrice || sel?.price}
                  </span>
                </div>
              </div>

              {/* Event Details Summary Card */}
              <div className="rounded-3xl border bg-white overflow-hidden" style={{ borderColor: SOFT_BORDER }}>
                <div
                  className="px-5 py-4 border-b flex items-center gap-2"
                  style={{ borderColor: CREAM_LIGHT, background: CREAM_LIGHT }}
                >
                  <span className="text-lg">📅</span>
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: NAVY, opacity: 0.6 }}>
                    Scheduling Details
                  </span>
                </div>
                <div className="divide-y" style={{ borderColor: CREAM_LIGHT }}>
                  {[
                    ["Event Type", eventType],
                    ["Event Date", formatEnDate(eventDate)],
                    ["Start Time", formatEnTime(startTime)],
                    ["Duration", `${durationMins} min`],
                    ["Guests", toEnNum(guests)],
                    ["Location", `${address}, ${city} ${zip}`],
                    ["Garage", "Boston Revere — 84 Fernwood Ave"],
                    ["Distance", `${quote.distanceMiles.toFixed(1)} miles total`],
                    ["Free zone", "First 10.0 miles FREE"],
                    ["Billable", `${Math.max(0, quote.distanceMiles - 10).toFixed(1)} miles`],
                    ["Travel Fee", quote.travelFee > 0 ? `$${quote.travelFee.toFixed(2)}` : "Free ($0.00)"]
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between px-5 py-3.5 text-sm">
                      <span className="font-bold text-slate-400">{l}</span>
                      <span className="font-black text-right max-w-[65%]" style={{ color: NAVY }}>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Contact Summary Card */}
              <div className="rounded-3xl border bg-white overflow-hidden" style={{ borderColor: SOFT_BORDER }}>
                <div
                  className="px-5 py-4 border-b flex items-center gap-2"
                  style={{ borderColor: CREAM_LIGHT, background: CREAM_LIGHT }}
                >
                  <span className="text-lg">👤</span>
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: NAVY, opacity: 0.6 }}>
                    Customer Contact Info
                  </span>
                </div>
                <div className="divide-y" style={{ borderColor: CREAM_LIGHT }}>
                  {[
                    ["Name", `${firstName} ${lastName}`],
                    ["Email", email],
                    ["Phone", phone]
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between px-5 py-3.5 text-sm">
                      <span className="font-bold text-slate-400">{l}</span>
                      <span className="font-black" style={{ color: NAVY }}>
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown details */}
              <div
                className="rounded-3xl border-2 p-6"
                style={{ background: "linear-gradient(135deg, #FFFDF9, #FFFBEB)", borderColor: "#FDE68A" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5" style={{ color: GOLD }} />
                  <span className="text-xs font-black uppercase tracking-wider" style={{ color: NAVY, opacity: 0.6 }}>
                    Catering Fee Breakdown
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {quote.breakdown.map(
                    (b, i) =>
                      (b.amount !== 0 || i === 0) && (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span className="font-semibold text-slate-500">{b.label}</span>
                          <span
                            className="font-black"
                            style={{ color: b.amount < 0 ? "#10B981" : NAVY }}
                          >
                            {b.amount < 0
                              ? `-$${Math.abs(b.amount).toFixed(2)}`
                              : `$${b.amount.toFixed(2)}`}
                          </span>
                        </div>
                      )
                  )}
                </div>
                <div className="border-t border-amber-200 pt-4 flex justify-between items-center">
                  <span className="font-black text-base" style={{ color: NAVY }}>
                    Estimated Total Amount
                  </span>
                  <span className="text-3xl font-black" style={{ color: GOLD }}>
                    ${quote.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Cash Policy Banner */}
              <div
                className="flex items-start gap-4 p-5 rounded-3xl border"
                style={{ background: "rgba(16,185,129,0.05)", borderColor: "#A7F3D0" }}
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-black text-sm text-emerald-900">Cash Payment on Delivery</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-1 leading-relaxed">
                    No card authorization required. Payments are collected in cash at the end of the catering event.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-[10px] text-slate-400 font-semibold mb-6">
              📍 Pricing calculations based on travel distances from <strong>Boston Revere — 84 Fernwood Ave</strong>
            </p>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-full font-black border-2 w-full sm:w-auto transition-all"
                style={{ borderColor: NAVY, color: NAVY }}
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-3 px-12 py-4.5 rounded-full font-black text-base shadow-xl disabled:opacity-50 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                style={{ background: `linear-gradient(135deg, ${NAVY}, #001a4c)`, color: GOLD }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Submit Booking Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

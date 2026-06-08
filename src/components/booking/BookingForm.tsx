"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Star,
  Truck
} from "lucide-react";
import { SERVICE_AREAS } from "@/lib/serviceAreas";
import OtpVerification from "./OtpVerification";
import LocationVerificationWidget from "./LocationVerificationWidget";
import { calcDistance, haversineDistanceMiles } from "@/lib/maps";

const MapPicker = dynamic(() => import("./MapPicker"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-2xl bg-white/50 animate-pulse border-2 border-dashed border-amber-200/50 flex items-center justify-center backdrop-blur-md"
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
const SOFT_BORDER = "rgba(0, 2, 35, 0.08)";
const FN = "var(--font-sans), 'Plus Jakarta Sans', 'Inter', sans-serif";
const F_SERIF = "var(--font-playfair), 'Playfair Display', serif";

// ─── Shared Premium UI Components ─────────────────────────────────────────────

/** Floating label input field — modern underline style */
function PremiumInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = " ",
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
  const floated = focused || value.length > 0;

  return (
    <div className="relative w-full group">
      {/* Floating container */}
      <div
        className="relative w-full transition-all duration-300"
        style={{
          background: focused
            ? "rgba(255,255,255,0.97)"
            : error
            ? "rgba(255,240,240,0.90)"
            : "rgba(255,255,255,0.82)",
          borderRadius: 18,
          border: focused
            ? `2px solid ${GOLD}`
            : error
            ? "2px solid rgba(220,38,38,0.5)"
            : "2px solid rgba(0,2,35,0.10)",
          boxShadow: focused
            ? `0 0 0 5px rgba(255,160,0,0.13), 0 8px 32px rgba(0,0,0,0.05)`
            : error
            ? "0 0 0 4px rgba(220,38,38,0.07)"
            : "0 2px 10px rgba(0,0,0,0.04)",
          backdropFilter: "blur(16px)",
          transition: "all 0.25s cubic-bezier(.4,0,.2,1)"
        }}
      >
        {/* Icon */}
        {Icon && (
          <div
            className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
            style={{ color: focused ? GOLD : error ? "#EF4444" : "#94A3B8" }}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
        {/* Floating Label */}
        <label
          className="absolute pointer-events-none font-black tracking-wide transition-all duration-200 select-none"
          style={{
            left: Icon ? "3.0rem" : "1.1rem",
            top: floated ? "0.5rem" : "50%",
            transform: floated ? "none" : "translateY(-50%)",
            fontSize: floated ? "10px" : "16px",
            letterSpacing: floated ? "0.16em" : "0.01em",
            textTransform: floated ? "uppercase" : "none",
            color: focused ? GOLD : error ? "#DC2626" : "#94A3B8",
            fontFamily: FN,
            zIndex: 1
          }}
        >
          {label}
        </label>
        {/* Actual Input */}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=""
          min={min}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full outline-none bg-transparent font-bold"
          style={{
            fontFamily: FN,
            fontSize: "1.2rem",
            lineHeight: 1.4,
            paddingTop: "1.65rem",
            paddingBottom: "0.75rem",
            paddingLeft: Icon ? "3.0rem" : "1.1rem",
            paddingRight: "1.1rem",
            color: NAVY,
            letterSpacing: "0.01em",
            caretColor: GOLD
          }}
          autoComplete="off"
        />
      </div>
      {/* Helper / Error */}
      {error ? (
        <p className="flex items-center gap-1.5 mt-2 ml-1 text-red-700 font-bold text-sm" style={{ fontFamily: FN }}>
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </p>
      ) : helper ? (
        <p className="mt-2 ml-1 text-slate-500 font-semibold text-sm" style={{ fontFamily: FN }}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}

/** Floating label select — matching style */
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
  const floated = focused || value.length > 0;

  return (
    <div className="relative w-full">
      <div
        className="relative w-full transition-all duration-300"
        style={{
          background: focused ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.82)",
          borderRadius: 18,
          border: `2px solid ${focused ? GOLD : "rgba(0,2,35,0.10)"}`,
          boxShadow: focused
            ? `0 0 0 5px rgba(255,160,0,0.13), 0 8px 32px rgba(0,0,0,0.05)`
            : "0 2px 10px rgba(0,0,0,0.04)",
          backdropFilter: "blur(16px)",
          transition: "all 0.25s cubic-bezier(.4,0,.2,1)"
        }}
      >
        {Icon && (
          <div
            className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300"
            style={{ color: focused ? GOLD : "#94A3B8" }}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
        {/* Floating Label */}
        <label
          className="absolute pointer-events-none font-black tracking-wide transition-all duration-200 select-none"
          style={{
            left: Icon ? "3.0rem" : "1.1rem",
            top: floated ? "0.5rem" : "50%",
            transform: floated ? "none" : "translateY(-50%)",
            fontSize: floated ? "10px" : "16px",
            letterSpacing: floated ? "0.16em" : "0.01em",
            textTransform: floated ? "uppercase" : "none",
            color: focused ? GOLD : "#94A3B8",
            fontFamily: FN,
            zIndex: 1
          }}
        >
          {label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full outline-none bg-transparent font-bold appearance-none cursor-pointer"
          style={{
            fontFamily: FN,
            fontSize: "1.2rem",
            lineHeight: 1.4,
            paddingTop: "1.65rem",
            paddingBottom: "0.75rem",
            paddingLeft: Icon ? "3.0rem" : "1.1rem",
            paddingRight: "2.8rem",
            color: value ? NAVY : "transparent",
            letterSpacing: "0.01em"
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o} style={{ color: NAVY }}>
              {o}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300"
          style={{ transform: focused ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={focused ? GOLD : "#94A3B8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
      {helper && (
        <p className="mt-2 ml-1 text-slate-500 font-semibold text-sm" style={{ fontFamily: FN }}>{helper}</p>
      )}
    </div>
  );
}

/** Legacy wrapper — kept to avoid refactoring all call sites */
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
        className="block text-xs font-black uppercase tracking-[0.18em]"
        style={{ color: NAVY, opacity: 0.7, fontFamily: FN }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-700 text-sm font-bold flex items-center gap-1.5 mt-1">
          <AlertCircle className="w-4 h-4" /> {error}
        </p>
      )}
      {!error && helper && (
        <p className="text-sm font-semibold leading-relaxed text-slate-500 mt-1" style={{ fontFamily: FN }}>
          {helper}
        </p>
      )}
    </div>
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
  // Show results from 1 char — up to 20 matches
  const filtered =
    search.length >= 1
      ? zones
          .filter(
            (a) =>
              a.zip.startsWith(search) ||
              a.city.toLowerCase().startsWith(search.toLowerCase())
          )
          .slice(0, 20)
      : [];

  return (
    <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
      {/* ZIP Input — floating label style */}
      <div className="relative flex flex-col gap-2 w-full">
        <div
          className="relative w-full transition-all duration-300"
          style={{
            background: focused ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.82)",
            borderRadius: 18,
            border: `2px solid ${focused ? GOLD : "rgba(0,2,35,0.10)"}`,
            boxShadow: focused
              ? `0 0 0 5px rgba(255,160,0,0.13), 0 8px 32px rgba(0,0,0,0.05)`
              : "0 2px 10px rgba(0,0,0,0.04)",
            backdropFilter: "blur(16px)",
            transition: "all 0.25s cubic-bezier(.4,0,.2,1)"
          }}
        >
          <div
            className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300"
            style={{ color: focused ? GOLD : "#94A3B8" }}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <label
            className="absolute pointer-events-none font-black tracking-wide transition-all duration-200 select-none"
            style={{
              left: "3.0rem",
              top: (focused || zip || search) ? "0.5rem" : "50%",
              transform: (focused || zip || search) ? "none" : "translateY(-50%)",
              fontSize: (focused || zip || search) ? "10px" : "16px",
              letterSpacing: (focused || zip || search) ? "0.16em" : "0.01em",
              textTransform: (focused || zip || search) ? "uppercase" : "none",
              color: focused ? GOLD : "#94A3B8",
              fontFamily: FN,
              zIndex: 1
            }}
          >
            ZIP Code
          </label>
          <input
            value={focused ? search : (zip ? `${zip}${city ? ` — ${city}` : ""}` : search)}
            onChange={(e) => {
              // Clear parent selection first so input is fully writable
              if (zip) onZipChange("", "");
              setSearch(e.target.value);
              setOpen(true);
              if (e.target.value.length === 5) {
                const found = zones.find((a) => a.zip === e.target.value);
                if (found) { onZipChange(found.zip, found.city); setSearch(""); }
              }
            }}
            onFocus={() => { setSearch(""); setOpen(true); setFocused(true); }}
            onBlur={() => { setFocused(false); setTimeout(() => setOpen(false), 250); }}
            placeholder=""
            className="w-full outline-none bg-transparent font-bold"
            style={{
              fontFamily: FN,
              fontSize: "1.2rem",
              lineHeight: 1.4,
              paddingTop: "1.65rem",
              paddingBottom: "0.75rem",
              paddingLeft: "3.0rem",
              paddingRight: "1.1rem",
              color: NAVY,
              caretColor: GOLD
            }}
            autoComplete="off"
          />
        </div>
        {/* Dropdown */}
        {open && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white/97 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100/50">
            {filtered.map((a) => (
              <button
                key={a.zip}
                type="button"
                onMouseDown={() => { onZipChange(a.zip, a.city); setSearch(""); setOpen(false); }}
                className="w-full text-left px-5 py-4 hover:bg-amber-50/60 transition-colors flex items-center justify-between"
              >
                <span className="font-extrabold text-base" style={{ color: NAVY, fontFamily: FN }}>{a.city}</span>
                <span className="font-mono text-sm font-black px-3 py-1 rounded-lg" style={{ background: "rgba(255,160,0,0.12)", color: GOLD }}>{a.zip}</span>
              </button>
            ))}
          </div>
        )}
        {open && search.length >= 3 && filtered.length === 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border-2 border-red-200/80 p-5 text-center z-50 shadow-xl" style={{ background: "rgba(254,242,242,0.97)" }}>
            <p className="text-red-700 font-black text-base">Outside service area</p>
            <p className="text-red-500 text-sm font-bold mt-1">We serve Massachusetts only</p>
          </div>
        )}
        <p className="mt-2 ml-1 text-slate-500 font-semibold text-sm" style={{ fontFamily: FN }}>Massachusetts service area</p>
      </div>

      {/* City — read-only floating label */}
      <div className="relative flex flex-col gap-2 w-full">
        <div
          className="relative w-full"
          style={{
            background: "rgba(0,2,35,0.04)",
            borderRadius: 18,
            border: "2px solid rgba(0,2,35,0.07)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
          }}
        >
          <label
            className="absolute pointer-events-none font-black tracking-wide select-none"
            style={{
              left: "1.1rem",
              top: city ? "0.5rem" : "50%",
              transform: city ? "none" : "translateY(-50%)",
              fontSize: city ? "10px" : "16px",
              letterSpacing: city ? "0.16em" : "0.01em",
              textTransform: city ? "uppercase" : "none",
              color: "#94A3B8",
              fontFamily: FN,
              transition: "all 0.2s"
            }}
          >
            City (auto-filled)
          </label>
          <input
            readOnly
            value={city}
            placeholder=""
            className="w-full outline-none bg-transparent font-bold cursor-default"
            style={{
              fontFamily: FN,
              fontSize: "1.2rem",
              paddingTop: "1.65rem",
              paddingBottom: "0.75rem",
              paddingLeft: "1.1rem",
              paddingRight: "1.1rem",
              color: NAVY
            }}
          />
        </div>
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
  durationMins?: number;
  includedQty?: number;
  servings?: number;
  basePrice?: number;
  price?: number;
  extraPiecePrice?: number;
  extraGuestPrice?: number;
  description?: string;
  slug?: string;
};

type Quote = {
  basePrice: number;
  travelFee: number;
  overtimeFee: number;
  extraPieceFee: number;
  additionalServiceFee: number;
  extraServiceMins: number;
  additionalStopsFee: number;
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
const STEP_ICONS = ["🎁", "📅", "👤", "🔐", "✅"];

export default function BookingForm() {
  const wizardTopRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const packageParamId = searchParams.get("package") || searchParams.get("packageId");
  const [step, setStepRaw] = useState(0);
  const setStep = (n: number) => {
    setStepRaw(n);
    setTimeout(() => {
      wizardTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };
  const [pkgList, setPkgList] = useState<{ TRUCK: Pkg[]; VAN: Pkg[] }>({
    TRUCK: [],
    VAN: []
  });
  const [pkgTab, setPkgTab] = useState<"TRUCK"|"VAN">("TRUCK");
  const [sel, setSel] = useState<Pkg | null>(null);
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [additionalGuests, setAdditionalGuests] = useState(0);
  const [eventType, setEventType] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const extraServings = "0"; // legacy — extra guests handled by extraGuestPrice from package
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
  const [hasMultipleLocations, setHasMultipleLocations] = useState(false);
  const [extraServiceMins, setExtraServiceMins] = useState(0);
  const [customPkg, setCustomPkg] = useState<Pkg | null>(null);
  const [customGuestCount, setCustomGuestCount] = useState<number | "">(250);
  const [vehiclePreference, setVehiclePreference] = useState("Not sure");

  const getWhatsAppUrl = (waPhone: string) => {
    const b = result?.booking;
    const refText = b ? `#${b.bookingNumber}` : "Pending";
    const guestNum = b ? ((b as any).guests || customGuestCount || 201) : (customGuestCount || 201);
    const duration = sel?.slug === "custom-event-package" ? "Flexible/Custom" : `${(sel as any)?.durationMins ?? sel?.includedMinutes ?? 60} mins`;
    const primaryAddr = primaryLoc.formattedAddress || `${address}, ${city}, MA ${zip}`;
    const stopsList = bookingStops.length > 0 
      ? bookingStops.map((s: any, i: number) => `Stop ${i+2}: ${s.formattedAddress || s.street}`).join(", ")
      : "None";
    const travelDist = drivingMiles ? `${drivingMiles.toFixed(1)} miles` : "Calculating...";
    
    const msg = `Hello! I just submitted a Custom Quote request. Here are the event details:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Phone: ${phone}
- Event Date: ${formatEnDate(eventDate)}
- Event Time: ${formatEnTime(startTime)}
- Guests: ${guestNum}
- Requested Duration: ${duration}
- Preferred Vehicle: ${vehiclePreference}
- Primary Location: ${primaryAddr}
- Additional Locations: ${stopsList}
- Extra Service Time: ${extraServiceMins > 0 ? `${extraServiceMins} mins` : "None"}
- Travel Distance: ${travelDist}
- Notes: ${notes || "None"}
- Booking Reference: ${refText}`;

    return `https://wa.me/${waPhone}?text=${encodeURIComponent(msg)}`;
  };

  const [primaryLoc, setPrimaryLoc] = useState<any>({
    street: "",
    city: "",
    state: "MA",
    zipCode: "",
    latitude: null,
    longitude: null,
    formattedAddress: "",
    placeId: "",
    locationVerificationMethod: "",
    locationVerifiedAt: null
  });
  const [locationMode, setLocationMode] = useState<"SINGLE_LOCATION" | "SEQUENTIAL_STOPS" | "SIMULTANEOUS_MULTI_VEHICLE" | "NEEDS_REVIEW">("SINGLE_LOCATION");
  const [bookingStops, setBookingStops] = useState<any[]>([]);

  useEffect(() => {
    setAddress(primaryLoc.street || "");
    setCity(primaryLoc.city || "");
    setZip(primaryLoc.zipCode || "");
    setLat(primaryLoc.latitude);
    setLng(primaryLoc.longitude);
  }, [primaryLoc]);

  useEffect(() => {
    if (zip && zip !== primaryLoc.zipCode) {
      setPrimaryLoc((prev: any) => ({
        ...prev,
        zipCode: zip,
        city: city || prev.city
      }));
    }
  }, [zip, city]);

  useEffect(() => {
    if (primaryLoc.latitude === null || primaryLoc.longitude === null) {
      setDMiles(0);
      setMapFee(0);
      return;
    }

    const freeMiles = 10;
    const ratePerMile = 2.25;
    let totalDist = 0;

    if (locationMode === "SINGLE_LOCATION") {
      const d = calcDistance(primaryLoc.latitude, primaryLoc.longitude, freeMiles, ratePerMile);
      totalDist = d.drivingMiles;
    } else if (locationMode === "SEQUENTIAL_STOPS" || locationMode === "NEEDS_REVIEW") {
      const initial = calcDistance(primaryLoc.latitude, primaryLoc.longitude, freeMiles, ratePerMile);
      totalDist = initial.drivingMiles;
      let lastLat = primaryLoc.latitude;
      let lastLng = primaryLoc.longitude;
      for (const stop of bookingStops) {
        if (stop.latitude !== null && stop.longitude !== null) {
          const straight = haversineDistanceMiles(lastLat, lastLng, stop.latitude, stop.longitude);
          const driving = Math.round(straight * 1.35 * 10) / 10;
          totalDist += driving;
          lastLat = stop.latitude;
          lastLng = stop.longitude;
        }
      }
    } else if (locationMode === "SIMULTANEOUS_MULTI_VEHICLE") {
      const initial = calcDistance(primaryLoc.latitude, primaryLoc.longitude, freeMiles, ratePerMile);
      totalDist = initial.drivingMiles;
      for (const stop of bookingStops) {
        if (stop.latitude !== null && stop.longitude !== null) {
          const d = calcDistance(stop.latitude, stop.longitude, freeMiles, ratePerMile);
          totalDist += d.drivingMiles;
        }
      }
    }

    const billable = Math.max(0, totalDist - freeMiles);
    const fee = Math.round(billable * ratePerMile * 100) / 100;
    setDMiles(totalDist);
    setMapFee(fee);
  }, [primaryLoc, bookingStops, locationMode]);
 
  useEffect(() => {
    fetch("/api/packages")
      .then((r) => r.json())
      .then((pRes: any) => {
        const p = Array.isArray(pRes) ? pRes : pRes.data || [];
        const custom = p.find((x: any) => x.slug === "custom-event-package" || x.serviceType === "CUSTOM");
        if (custom) setCustomPkg(custom);

        setPkgList({
          TRUCK: p.filter((x: any) => x.type === "TRUCK" || x.serviceType === "AMERICANO_TRUCK"),
          VAN: p.filter((x: any) => x.type === "VAN" || x.serviceType === "SPRINTER_VAN")
        });
        if (packageParamId) {
          const found = p.find((x: any) => x.id === packageParamId || x.slug === packageParamId);
          if (found) {
            if (found.slug === "custom-event-package" || found.serviceType === "CUSTOM") {
              setPkgTab("TRUCK");
            } else {
              setPkgTab((found.type === "TRUCK" || found.serviceType === "AMERICANO_TRUCK") ? "TRUCK" : "VAN");
            }
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

    // Custom Event Package: validate and skip quote API, go straight to contact step
    const isCustom = sel?.slug === "custom-event-package" || (sel as any)?.serviceType === "CUSTOM";
    if (isCustom) {
      if (customGuestCount === "" || customGuestCount <= 200) {
        setQuoteErr("Custom Event Package is exclusively for events with more than 200 guests. Please enter 201 or more.");
        setQuoting(false);
        return;
      }
      setQuote(null);
      setStep(2);
      setQuoting(false);
      return;
    }

    // Duration comes from the package, NOT from user input
    const pkgDuration = (sel as any)?.durationMins ?? sel?.includedMinutes ?? 60;
    const payload = {
      packageId: sel?.id,
      zip: primaryLoc.zipCode || zip,
      address: primaryLoc.street || address,
      city: primaryLoc.city || city,
      guests: additionalGuests,           // only extra guests beyond included
      durationMins: pkgDuration,
      distanceMiles: drivingMiles,
      additionalStops: bookingStops.length,
      bookingStops,
      extraServiceMins,
      locationMode,
      primaryLocation: primaryLoc,
      eventDate,
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
    if (isCustom && (customGuestCount === "" || customGuestCount <= 200)) {
      setSubmitErr("Custom Event Package is exclusively for events with more than 200 guests. Please enter 201 or more.");
      setStep(1);
      setSubmitting(false);
      return;
    }

    const pErr = validatePhone(phone);
    if (pErr) {
      setPhoneErr(pErr);
      setStep(2);
      setSubmitting(false);
      return;
    }
    
    if (locationMode !== "SINGLE_LOCATION" && bookingStops.length > 0) {
      for (let i = 0; i < bookingStops.length; i++) {
        const stop = bookingStops[i];
        if (!stop.street || !stop.city || !stop.state || !stop.zipCode) {
          setSubmitErr(`Please fill out all address fields for Stop #${i + 1}`);
          setSubmitting(false);
          return;
        }
        if (stop.zipCode.length !== 5) {
          setSubmitErr(`Please enter a valid 5-digit ZIP code for Stop #${i + 1}`);
          setSubmitting(false);
          return;
        }
        if (stop.latitude === null || stop.longitude === null) {
          setSubmitErr(`Please verify the address for Stop #${i + 1}`);
          setSubmitting(false);
          return;
        }
      }
    }

    setPhoneErr("");
    setSubmitErr("");
    setSubmitting(true);
    const cleanPhone = toEnNum(phone).replace(/[^\d+\-\s()]/g, "");
    const pkgDuration = isCustom ? 30 : ((sel as any)?.durationMins ?? sel?.includedMinutes ?? 60);
    const payload = {
      packageId: sel?.slug ?? sel?.id,   // send slug to allow server OR lookup by id/slug
      eventDate: toEnNum(eventDate),
      startTime: toEnNum(startTime),
      durationMins: pkgDuration,
      guests: isCustom ? (customGuestCount || 201) : (sel?.servings ?? sel?.includedQty ?? 50) + additionalGuests,
      additionalGuests: isCustom ? 0 : additionalGuests,
      eventType,
      address: primaryLoc.street || address,
      city: primaryLoc.city || city,
      zip: primaryLoc.zipCode || zip,
      notes,
      extraServings: 0,
      firstName,
      lastName,
      email,
      phone: cleanPhone,
      totalAmount: isCustom ? 0 : (quote?.totalAmount ?? 0),
      travelFee: isCustom ? 0 : (quote?.travelFee ?? 0),
      overtimeFee: isCustom ? 0 : (quote?.overtimeFee ?? 0),
      extraPieceFee: isCustom ? 0 : (quote?.extraPieceFee ?? 0),
      distanceMiles: isCustom ? 0 : (quote?.distanceMiles ?? 0),
      additionalStops: bookingStops.length,
      additionalStopsFee: isCustom ? 0 : bookingStops.length * 50,
      extraServiceMins: isCustom ? 0 : extraServiceMins,
      extraServiceFee: isCustom ? 0 : (quote?.additionalServiceFee ?? 0),
      bookingStops,
      latitude: primaryLoc.latitude || lat,
      longitude: primaryLoc.longitude || lng,
      locationMode,
      primaryLocation: primaryLoc,
      vehiclePreference: isCustom ? vehiclePreference : null,
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
        setSubmitErr(d.error || "An unexpected error occurred. Please try again.");
      }
      setSubmitting(false);
      return;
    }

    setResult(d);
    setSubmitting(false);
  };

  // ─── Result Screens ──────────────────────────────────────────────────
  if (result) {
    const { decision, booking } = result;

    /* ── REJECTED ── */
    if (decision?.verdict === "REJECTED") {
      return (
        <div className="min-h-[60vh] flex items-center justify-center py-16 px-6" style={{ fontFamily: FN }}>
          <div className="max-w-lg w-full">
            <div className="rounded-3xl border-2 border-rose-200/80 p-5 sm:p-14 text-center" style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(24px)" }}>
              <div className="w-20 h-20 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-7">
                <XCircle className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight" style={{ color: NAVY, fontFamily: F_SERIF }}>Request Not Available</h2>
              <p className="text-slate-600 font-semibold text-base sm:text-lg leading-relaxed mb-8">{decision.customerMessage}</p>
              {decision.alternativeTimes && decision.alternativeTimes.length > 0 && (
                <div className="rounded-2xl p-6 mb-8 text-left" style={{ background: "rgba(255,160,0,0.07)", border: "2px solid rgba(255,160,0,0.25)" }}>
                  <h3 className="font-black text-base mb-4 flex items-center gap-2" style={{ color: NAVY }}>
                    <Clock className="w-5 h-5 text-amber-500" /> Available Alternative Times
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {decision.alternativeTimes.map((t) => (
                      <button key={t} onClick={() => { setStartTime(t); setResult(null); setStep(1); }}
                        className="px-5 py-2.5 rounded-full font-black text-sm border-2 bg-white hover:-translate-y-0.5 hover:shadow-md transition-all"
                        style={{ borderColor: NAVY, color: NAVY }}>{t}</button>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => setResult(null)}
                className="w-full py-4.5 rounded-2xl font-black text-base text-white shadow-xl hover:-translate-y-0.5 transition-all"
                style={{ background: NAVY }}>Try Different Details</button>
            </div>
          </div>
        </div>
      );
    }

    /* ── PENDING REVIEW ── */
    if (decision?.verdict === "PENDING_REVIEW") {
      const isCustomQuoteResult = (decision as any)?.flags?.includes("CUSTOM_QUOTE") || sel?.slug === "custom-event-package" || (sel as any)?.serviceType === "CUSTOM";
      return (
        <div className="min-h-[60vh] flex items-center justify-center py-16 px-6" style={{ fontFamily: FN }}>
          <div className="max-w-lg w-full">
            <div className="rounded-3xl border-2 border-amber-300/60 overflow-hidden" style={{ background: "rgba(255,255,255,0.90)", backdropFilter: "blur(24px)" }}>
              {/* Top Banner */}
              <div className="px-5 py-6 sm:px-8 sm:py-7" style={{ background: isCustomQuoteResult ? "linear-gradient(135deg, #000223 0%, #001a4c 100%)" : "linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-xs uppercase tracking-[0.2em] mb-1" style={{ color: isCustomQuoteResult ? "#FFA000" : "rgba(255,255,255,0.8)" }}>
                      {isCustomQuoteResult ? "Custom Quote Request" : "Booking Reference"}
                    </p>
                    <p className="font-mono font-black text-2xl text-white">#{booking?.bookingNumber}</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
                    {isCustomQuoteResult ? "🍦" : <Clock className="w-7 h-7 text-white" />}
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-10">
                <h2 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: NAVY, fontFamily: F_SERIF }}>
                  {isCustomQuoteResult ? "Custom Quote Request Received" : "Under Review"}
                </h2>
                <p className="text-slate-600 font-semibold text-sm sm:text-base leading-relaxed mb-6">
                  {isCustomQuoteResult
                    ? "Thank you! Because your event is for more than 200 guests, our team will personally review your request and prepare a custom quote."
                    : (decision?.customerMessage || "Our team will review your request and contact you shortly with confirmation.")}
                </p>
                {isCustomQuoteResult ? (
                  <div className="mb-6 rounded-2xl p-5 border-2 border-blue-200 bg-blue-50">
                    <p className="font-black text-blue-900 text-sm uppercase tracking-wider mb-3">📲 We Will Contact You via WhatsApp</p>
                    <p className="text-blue-800 font-semibold text-sm mb-4 leading-relaxed">
                      Our team will reach out using one of our official WhatsApp numbers:
                    </p>
                    <div className="space-y-2">
                      {[
                        { num: "617-999-3803", wa: "16179993803" },
                        { num: "781-921-3233", wa: "17819213233" },
                        { num: "617-866-2727", wa: "16178662727" },
                      ].map(({ num, wa }) => (
                        <a key={wa} href={getWhatsAppUrl(wa)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm text-white transition-all hover:-translate-y-0.5"
                          style={{ background: "#25D366" }}>
                          <span>💬</span> WhatsApp {num}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    {[
                      { icon: "✅", text: "Team reviews scheduling & routing" },
                      { icon: "📧", text: `Confirmation sent to: ${email}` },
                      { icon: "💳", text: "Payment collected after service — cash, Zelle, Venmo accepted" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "rgba(0,2,35,0.03)", border: "1px solid rgba(0,2,35,0.06)" }}>
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <span className="font-bold text-sm sm:text-base text-slate-700 leading-relaxed">{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                <a href={result?.customerPortalUrl ?? `/customer/booking/${booking?.id}`}
                  className="flex items-center justify-center gap-2.5 w-full py-4.5 rounded-2xl font-black text-base shadow-xl hover:-translate-y-0.5 transition-all"
                  style={{ background: NAVY, color: GOLD }}>View Your Request Status <ArrowRight className="w-5 h-5" /></a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    /* ── CONFIRMED ── */
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-16 px-4 sm:px-6" style={{ fontFamily: FN }}>
        <div className="max-w-lg w-full">
          <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06)" }}>

            {/* —— Top Ticket Header —— */}
            <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #001060 100%)`, padding: "2.5rem 2rem 2rem" }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5" style={{ color: GOLD }} />
                    <span className="font-black text-xs uppercase tracking-[0.22em]" style={{ color: GOLD }}>Booking Confirmed</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight" style={{ fontFamily: F_SERIF }}>Your Experience<br/>is Reserved 🍦</h2>
                </div>
                <div className="text-5xl sm:text-6xl">🎉</div>
              </div>
            </div>

            {/* —— Booking Number Strip —— */}
            <div className="flex items-center justify-between px-6 py-4" style={{ background: GOLD }}>
              <span className="font-black text-xs uppercase tracking-[0.2em]" style={{ color: NAVY }}>Booking Reference</span>
              <span className="font-mono font-black text-lg" style={{ color: NAVY }}>#{booking?.bookingNumber}</span>
            </div>

            {/* —— Card Body —— */}
            <div className="p-4 sm:p-8" style={{ background: "rgba(255,255,255,0.97)" }}>

              {/* Amount Row */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl mb-5" style={{ background: "rgba(0,2,35,0.03)", border: "2px solid rgba(0,2,35,0.07)" }}>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-1">Estimated Total</p>
                  <p className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: NAVY, fontFamily: F_SERIF }}>${quote?.totalAmount?.toFixed(2) ?? "—"}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 mb-1">Payment</p>
                  <p className="font-black text-base" style={{ color: NAVY }}>After Service</p>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">Cash · Zelle · Venmo</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: "Event Date", value: eventDate ? formatEnDate(eventDate) : "—" },
                  { label: "Start Time", value: startTime ? formatEnTime(startTime) : "—" },
                  { label: "Package", value: sel?.name ?? "—" },
                  { label: "Event Type", value: eventType || "—" },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl" style={{ background: "rgba(0,2,35,0.025)", border: "1px solid rgba(0,2,35,0.06)" }}>
                    <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-1">{item.label}</p>
                    <p className="font-black text-sm sm:text-base" style={{ color: NAVY }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Steps */}
              <div className="space-y-3 mb-6">
                {[
                  { emoji: "📧", title: "Confirmation Email Sent", sub: email },
                  { emoji: "📞", title: "Team Will Confirm Details", sub: "Within 24 hours" },
                  { emoji: "🍦", title: "Day of Event", sub: "We arrive 15 min early" },
                  { emoji: "💳", title: "Payment After Service", sub: "Cash, Zelle, Venmo, & more" },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: "rgba(255,160,0,0.1)" }}>{s.emoji}</div>
                    <div className="pt-0.5">
                      <p className="font-black text-sm" style={{ color: NAVY }}>{s.title}</p>
                      <p className="text-xs font-semibold text-slate-500">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href={result?.customerPortalUrl ?? `/customer/booking/${booking?.id}`}
                className="flex items-center justify-center gap-2.5 w-full py-5 rounded-2xl font-black text-lg shadow-2xl hover:-translate-y-1 transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #001060 100%)`, color: GOLD }}
              >
                View & Manage Booking <ArrowRight className="w-5 h-5" />
              </a>

              <p className="text-center text-xs font-semibold text-slate-400 mt-4">
                Questions? Contact us anytime — we're here to make your event perfect.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCustom = sel?.slug === "custom-event-package" || (sel as any)?.serviceType === "CUSTOM";
  const isPrimaryVerified = primaryLoc.latitude !== null && primaryLoc.longitude !== null && primaryLoc.locationVerificationMethod !== "";
  const isAllStopsVerified = bookingStops.every((stop: any) => stop.latitude !== null && stop.longitude !== null && stop.locationVerificationMethod !== "");
  const canContinueStep1 = isPrimaryVerified && (locationMode === "SINGLE_LOCATION" || (bookingStops.length > 0 && isAllStopsVerified));
  const isGuestCountInvalid = isCustom && (customGuestCount === "" || customGuestCount <= 200);

  const listPkgs = pkgList[pkgTab];

  return (
    <div className="booking-wrapper w-full relative" style={{ fontFamily: FN }}>
      {/* Scroll anchor */}
      <div ref={wizardTopRef} style={{ scrollMarginTop: "80px" }} />
      <div className="w-full relative z-10">
        <div className="backdrop-blur-2xl bg-white/75 border-2 border-white/60 shadow-2xl rounded-3xl p-4 sm:p-12 transition-all duration-300">
          
          {/* ── PREMIUM STEPPER ── */}
          <div className="mb-10 sm:mb-14">

            {/* Mobile stepper — pill progress bar */}
            <div className="sm:hidden mb-7">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{STEP_ICONS[step]}</span>
                  <span className="font-black text-base" style={{ color: NAVY, fontFamily: FN }}>
                    {STEPS[step]}
                  </span>
                </div>
                <span
                  className="text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,160,0,0.12)", color: GOLD, fontFamily: FN }}
                >
                  {step + 1} / 5
                </span>
              </div>
              {/* Progress bar */}
              <div className="h-2 w-full rounded-full" style={{ background: "rgba(0,2,35,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((step + 1) / 5) * 100}%`,
                    background: `linear-gradient(90deg, ${GOLD}, #FFB800)`
                  }}
                />
              </div>
            </div>

            {/* Desktop stepper — premium numbered nodes */}
            <div className="hidden sm:flex items-center justify-center gap-0 mb-2">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center">
                  {/* Step node */}
                  <div className="flex flex-col items-center" style={{ minWidth: 72 }}>
                    <div
                      className="relative flex items-center justify-center transition-all duration-400"
                      style={{
                        width: i === step ? 56 : 44,
                        height: i === step ? 56 : 44,
                        borderRadius: i === step ? 18 : 14,
                        background: i < step
                          ? "linear-gradient(135deg, #10B981, #059669)"
                          : i === step
                          ? `linear-gradient(135deg, ${NAVY} 0%, #001a4c 100%)`
                          : "rgba(255,255,255,0.8)",
                        border: i === step
                          ? `3px solid ${GOLD}`
                          : i < step
                          ? "3px solid #A7F3D0"
                          : "2px solid rgba(0,2,35,0.10)",
                        boxShadow: i === step
                          ? `0 0 0 5px rgba(255,160,0,0.18), 0 8px 24px rgba(0,2,35,0.22)`
                          : i < step
                          ? "0 4px 12px rgba(16,185,129,0.25)"
                          : "0 2px 8px rgba(0,0,0,0.04)",
                        transition: "all 0.35s cubic-bezier(.4,0,.2,1)"
                      }}
                    >
                      {i < step ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : i === step ? (
                        <span className="text-base" style={{ color: GOLD, fontWeight: 900, fontFamily: FN }}>
                          {i + 1}
                        </span>
                      ) : (
                        <span className="text-sm" style={{ color: "#9CA3AF", fontWeight: 800, fontFamily: FN }}>
                          {i + 1}
                        </span>
                      )}
                      {/* Active glow pulse */}
                      {i === step && (
                        <span
                          className="absolute inset-0 rounded-[18px] animate-ping"
                          style={{ background: "rgba(255,160,0,0.15)", animationDuration: "2s" }}
                        />
                      )}
                    </div>
                    <span
                      className="text-xs font-black mt-2.5 whitespace-nowrap transition-all duration-300"
                      style={{
                        fontFamily: FN,
                        color: i === step ? NAVY : i < step ? "#059669" : "#9CA3AF",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontSize: i === step ? "11px" : "10px",
                        fontWeight: i === step ? 900 : 700
                      }}
                    >
                      {s}
                    </span>
                  </div>
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div
                      className="relative mx-1 transition-all duration-500"
                      style={{ width: 48, height: 4, borderRadius: 4, flexShrink: 0, overflow: "hidden", background: "rgba(0,2,35,0.07)" }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        style={{
                          width: i < step ? "100%" : "0%",
                          background: `linear-gradient(90deg, ${GOLD}, #059669)`
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── STEP 0: Package ── */}
          {step === 0 && (
            <div>
              <div className="mb-10 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full" style={{ background: "rgba(255,160,0,0.1)", border: "1px solid rgba(255,160,0,0.25)" }}>
                  <span style={{ fontSize: 14, color: GOLD }}>🍦</span>
                  <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: GOLD, fontFamily: FN }}>Step 1 of 5</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: NAVY, fontFamily: F_SERIF }}>
                  Choose Your Package
                </h2>
                <p className="text-slate-500 font-semibold text-base sm:text-lg mt-2 leading-relaxed" style={{ fontFamily: FN }}>
                  Select the vehicle type and package that fits your event size
                </p>
              </div>

              {/* Vehicle Type Tabs — premium pill switcher */}
              <div className="grid grid-cols-2 gap-3 mb-10">
                {(["TRUCK", "VAN"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setPkgTab(t); setSel(null); }}
                    className="relative py-4 sm:py-5 rounded-2xl font-black text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
                    style={
                      pkgTab === t
                        ? {
                            background: `linear-gradient(135deg, ${NAVY} 0%, #001a4c 100%)`,
                            color: GOLD,
                            boxShadow: `0 10px 30px rgba(0,2,35,0.25), 0 0 0 3px rgba(255,160,0,0.25)`,
                            border: `2px solid ${GOLD}`
                          }
                        : {
                            background: "rgba(255,255,255,0.8)",
                            color: NAVY,
                            border: "2px solid rgba(0,2,35,0.10)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                          }
                    }
                  >
                    {pkgTab === t && (
                      <span className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at 30% 50%, #FFA000 0%, transparent 60%)" }} />
                    )}
                    <span className="text-xl">{t === "TRUCK" ? "🚐" : "🚌"}</span>
                    <span>{t === "TRUCK" ? "Americano Truck" : "Sprinter Van"}</span>
                    {pkgTab === t && (
                      <CheckCircle2 className="w-4 h-4 absolute top-2 right-2" style={{ color: GOLD, opacity: 0.8 }} />
                    )}
                  </button>
                ))}
              </div>

              {/* Package Cards List */}
              <div className="space-y-4 mb-10">
                {listPkgs.length === 0 && (
                  <div className="text-center py-20 text-slate-400">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
                    <p className="font-bold text-base sm:text-lg">Loading premium catering packages…</p>
                  </div>
                )}
                {listPkgs.map((p: any) => {
                  const isSelected = sel?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSel(p)}
                      className="w-full text-left transition-all duration-300 group"
                      style={{ outline: "none" }}
                    >
                      <div
                        className="relative rounded-3xl border-2 overflow-hidden transition-all duration-300"
                        style={{
                          borderColor: isSelected ? GOLD : "rgba(0, 2, 35, 0.10)",
                          background: isSelected
                            ? `linear-gradient(135deg, rgba(255,250,235,0.98) 0%, rgba(255,253,245,0.95) 100%)`
                            : "rgba(255,255,255,0.75)",
                          boxShadow: isSelected
                            ? `0 0 0 4px rgba(255,160,0,0.15), 0 20px 50px rgba(255,160,0,0.15)`
                            : "0 4px 20px rgba(0,0,0,0.04)",
                          transform: isSelected ? "translateY(-2px)" : "translateY(0)"
                        }}
                      >
                        {/* Selected ribbon */}
                        {isSelected && (
                          <div
                            className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                            style={{ background: `linear-gradient(90deg, ${GOLD}, #FFB800, ${GOLD})` }}
                          />
                        )}

                        <div className="p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5">
                          {/* Icon */}
                          <div
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 transition-all duration-300 shadow-sm"
                            style={{
                              background: isSelected
                                ? `linear-gradient(135deg, #FFF0B3 0%, #FFE57A 100%)`
                                : CREAM_LIGHT,
                              boxShadow: isSelected ? "0 4px 16px rgba(255,160,0,0.3)" : "none"
                            }}
                          >
                            {p.type === "TRUCK" || p.serviceType === "AMERICANO_TRUCK" ? "🚐" : "🚌"}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span
                                className="font-black text-xl sm:text-2xl tracking-tight leading-tight"
                                style={{ color: isSelected ? NAVY : NAVY, fontFamily: F_SERIF }}
                              >
                                {p.name}
                              </span>
                              {isSelected && (
                                <span
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                                  style={{ background: "#ECFDF5", color: "#059669", border: "1.5px solid #A7F3D0" }}
                                >
                                  <CheckCircle2 className="w-3 h-3" /> Selected
                                </span>
                              )}
                            </div>

                            <div
                              className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mb-3"
                              style={{ color: "#6B7280", fontSize: 14, fontWeight: 700 }}
                            >
                              <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" style={{ color: isSelected ? GOLD : "#9CA3AF" }} />
                                <span style={{ color: isSelected ? NAVY : "#374151" }}>
                                  {p.includedQty || p.servings} servings included
                                </span>
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" style={{ color: isSelected ? GOLD : "#9CA3AF" }} />
                                <span style={{ color: isSelected ? NAVY : "#374151" }}>
                                  {p.durationMins || p.includedMinutes || 60} min service
                                </span>
                              </span>
                            </div>

                            <div
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
                              style={{
                                background: isSelected ? "rgba(255,160,0,0.12)" : "rgba(0,2,35,0.04)",
                                color: isSelected ? "#92400E" : "#6B7280"
                              }}
                            >
                              <Star className="w-3.5 h-3.5" style={{ color: GOLD, fill: GOLD }} />
                              Extra guests: ${p.extraGuestPrice ?? p.extraPiecePrice ?? 5} / person
                            </div>
                          </div>

                          {/* Price block */}
                          <div
                            className="flex-shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-dashed pt-4 sm:pt-0"
                            style={{ borderColor: "rgba(0,2,35,0.10)" }}
                          >
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400 sm:hidden">Base Price</span>
                            <div className="text-right">
                              <span
                                className="block text-3xl sm:text-4xl font-black tracking-tight"
                                style={{ color: isSelected ? GOLD : NAVY, fontFamily: F_SERIF }}
                              >
                                ${p.basePrice || p.price}
                              </span>
                              <span className="text-xs font-bold text-slate-400 block mt-0.5">base price</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Microcopy note */}
              <div className="p-5 sm:p-7 rounded-2xl mb-10 flex items-start gap-4 leading-relaxed" style={{ background: "rgba(255,160,0,0.06)", border: "1.5px solid rgba(255,160,0,0.25)" }}>
                <span className="text-2xl shrink-0">💡</span>
                <div>
                  <p className="font-black text-sm" style={{ color: NAVY }}>Need more servings?</p>
                  <p className="text-slate-600 font-semibold text-sm mt-1">
                    Select the package closest to your estimate. Extra guests beyond the included count are billed at the package rate per person.
                  </p>
                </div>
              </div>

              {/* Custom Event Package — premium distinct card */}
              {customPkg && (
                <div className="mt-2 mb-8">
                  {/* Section divider */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1" style={{ background: "rgba(0,2,35,0.08)" }} />
                    <span
                      className="text-xs font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
                      style={{ background: "rgba(0,2,35,0.05)", color: "#6B7280", fontFamily: FN }}
                    >
                      Large Events — 200+ Guests
                    </span>
                    <div className="h-px flex-1" style={{ background: "rgba(0,2,35,0.08)" }} />
                  </div>

                  <button
                    onClick={() => setSel(customPkg)}
                    className="w-full text-left transition-all duration-300"
                    style={{ outline: "none" }}
                  >
                    <div
                      className="relative rounded-3xl border-2 overflow-hidden transition-all duration-300"
                      style={{
                        borderColor: sel?.id === customPkg.id ? NAVY : "rgba(0,2,35,0.15)",
                        background: sel?.id === customPkg.id
                          ? `linear-gradient(135deg, ${NAVY} 0%, #001a4c 100%)`
                          : `linear-gradient(135deg, rgba(0,2,35,0.03) 0%, rgba(255,253,245,0.9) 100%)`,
                        boxShadow: sel?.id === customPkg.id
                          ? `0 0 0 4px rgba(0,2,35,0.12), 0 20px 50px rgba(0,2,35,0.25)`
                          : "0 4px 20px rgba(0,0,0,0.04)"
                      }}
                    >
                      {/* Decorative top stripe */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{
                          background: sel?.id === customPkg.id
                            ? `linear-gradient(90deg, ${GOLD}, #FFD700, ${GOLD})`
                            : "linear-gradient(90deg, rgba(0,2,35,0.2), rgba(0,2,35,0.1))"
                        }}
                      />

                      <div className="p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5">
                        {/* Icon */}
                        <div
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 shadow-md"
                          style={{
                            background: sel?.id === customPkg.id
                              ? "rgba(255,160,0,0.25)"
                              : "rgba(0,2,35,0.07)"
                          }}
                        >
                          🎪
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className="font-black text-xl sm:text-2xl tracking-tight"
                              style={{
                                color: sel?.id === customPkg.id ? "#FFFFFF" : NAVY,
                                fontFamily: F_SERIF
                              }}
                            >
                              {customPkg.name}
                            </span>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                              style={{
                                background: sel?.id === customPkg.id ? "rgba(255,160,0,0.25)" : "rgba(255,160,0,0.12)",
                                color: sel?.id === customPkg.id ? GOLD : "#92400E",
                                border: `1.5px solid ${sel?.id === customPkg.id ? GOLD : "rgba(255,160,0,0.3)"}`
                              }}
                            >
                              200+ Guests
                            </span>
                            {sel?.id === customPkg.id && (
                              <span
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)" }}
                              >
                                <CheckCircle2 className="w-3 h-3" /> Selected
                              </span>
                            )}
                          </div>

                          <div className="space-y-1.5 mb-3">
                            {[
                              { icon: "👥", text: "For large gatherings of 200+ guests" },
                              { icon: "📋", text: "Team reviews your event details personally" },
                              { icon: "💬", text: "We'll contact you via WhatsApp with your quote" },
                            ].map((item, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span style={{ fontSize: 12 }}>{item.icon}</span>
                                <span
                                  className="text-xs sm:text-sm font-bold"
                                  style={{ color: sel?.id === customPkg.id ? "rgba(255,255,255,0.8)" : "#6B7280" }}
                                >
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Custom pricing block */}
                        <div className="flex-shrink-0 text-center sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0" style={{ borderColor: sel?.id === customPkg.id ? "rgba(255,255,255,0.1)" : "rgba(0,2,35,0.08)" }}>
                          <span
                            className="block text-2xl sm:text-3xl font-black tracking-tight"
                            style={{ color: sel?.id === customPkg.id ? GOLD : NAVY, fontFamily: F_SERIF }}
                          >
                            Custom
                          </span>
                          <span
                            className="block text-xs sm:text-sm font-bold mt-1"
                            style={{ color: sel?.id === customPkg.id ? "rgba(255,255,255,0.6)" : "#9CA3AF" }}
                          >
                            Pricing
                          </span>
                          <span
                            className="block text-xs font-black uppercase tracking-wider mt-2 px-3 py-1 rounded-full"
                            style={{
                              background: sel?.id === customPkg.id ? "rgba(255,160,0,0.2)" : "rgba(0,2,35,0.05)",
                              color: sel?.id === customPkg.id ? GOLD : "#9CA3AF"
                            }}
                          >
                            Team Review
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Action */}
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  disabled={!sel}
                  className="inline-flex items-center gap-3 px-10 sm:px-12 py-4 sm:py-5 rounded-full font-black text-base sm:text-xl shadow-2xl disabled:opacity-40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 w-full sm:w-auto justify-center"
                  style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #001a4c 100%)`, color: GOLD, fontFamily: FN }}
                >
                  Continue to Details <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1: Event Details ── */}
          {step === 1 && (
            <div>
              <div className="mb-10 text-center sm:text-left">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: NAVY, fontFamily: F_SERIF }}>
                  Event Details
                </h2>
                <p className="text-slate-700 font-bold text-lg sm:text-xl mt-2.5 leading-relaxed" style={{ fontFamily: FN }}>
                  Provide timing and location for dispatch scheduling
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <PremiumInput
                  label="Event Date"
                  value={eventDate}
                  onChange={setEventDate}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  icon={Calendar}
                  helper="Select a future calendar date"
                />
                <PremiumSelect
                  label="Start Time (24h format)"
                  value={startTime}
                  onChange={setStartTime}
                  options={Array.from({ length: 48 }, (_, i) => {
                    const h = Math.floor(i / 2).toString().padStart(2, "0");
                    const m = (i % 2 === 0 ? "00" : "30");
                    return `${h}:${m}`;
                  })}
                  placeholder="Select start time…"
                  icon={Clock}
                  helper="Select start time in 24h format (e.g. 14:00)"
                />

                {/* Weekend Notice */}
                {(() => {
                  if (!eventDate) return null;
                  const date = new Date(eventDate + "T12:00:00");
                  const day = date.getDay();
                  const isWeekendDay = day === 0 || day === 6;
                  if (isWeekendDay) {
                    return (
                      <div className="md:col-span-2 bg-blue-50/70 border-2 border-blue-200 rounded-3xl p-6 flex items-center gap-4.5 shadow-sm">
                        <span className="text-3xl">📅</span>
                        <div>
                          <p className="font-black text-[#000223] text-lg sm:text-xl">
                            Weekend Event Notice
                          </p>
                          <p className="text-base font-bold text-slate-700 mt-1">
                            Saturday and Sunday bookings include an additional <strong>$25 weekend event fee</strong>.
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Package duration info banner */}
                <div className="md:col-span-2 bg-amber-50/70 border-2 border-amber-200 rounded-3xl p-6 flex items-center gap-4.5 shadow-sm">
                  <span className="text-3xl">⏱️</span>
                  <div>
                    <p className="font-black text-[#000223] text-lg sm:text-xl">
                      {isCustom ? "Included Service Time: Flexible / Tailored" : `Included Service Time: ${(sel as any)?.durationMins ?? sel?.includedMinutes ?? 60} minutes`}
                    </p>
                    <p className="text-base font-bold text-slate-700 mt-1">
                      {isCustom ? "This package is tailored for large celebrations with over 200 guests." : `This package serves up to ${sel?.servings ?? sel?.includedQty ?? 50} guests.`}
                    </p>
                  </div>
                </div>

                {/* Optional Additional Guests stepper OR Custom Guest Count Input */}
                <div className="md:col-span-2">
                  {isCustom ? (
                    <div>
                      <label className="block text-base font-black uppercase tracking-[0.18em] mb-1.5" style={{ color: NAVY, opacity: 0.95, fontFamily: FN }}>
                        Total Expected Guests
                      </label>
                      <p className="text-sm sm:text-base font-bold text-slate-700 mb-4 leading-relaxed">
                        Please specify the total guest count for your custom request. This package is dedicated to large gatherings and requires a <strong style={{ color: NAVY }}>minimum of 201 guests</strong>.
                      </p>
                      <div className="relative">
                        <input
                          type="number"
                          min="201"
                          value={customGuestCount}
                          onChange={(e) => {
                            const val = e.target.value === "" ? "" : parseInt(e.target.value);
                            setCustomGuestCount(val);
                          }}
                          placeholder="e.g. 250"
                          className="w-full bg-white/40 backdrop-blur-md border-2 rounded-3xl p-5 shadow-sm focus:outline-none transition-all font-black text-2xl text-slate-800 focus:bg-white"
                          style={{
                            borderColor: customGuestCount !== "" && customGuestCount <= 200 ? "rgb(239, 68, 68)" : "rgba(0,2,35,0.12)",
                            fontFamily: F_SERIF
                          }}
                        />
                        {customGuestCount !== "" && customGuestCount <= 200 && (
                          <p className="text-rose-600 text-base font-black mt-3 flex items-center gap-2 animate-pulse">
                            ⚠️ This package is exclusively for large requests of more than 200 guests. Please enter 201 or more.
                          </p>
                        )}
                      </div>

                      {/* Preferred Vehicle Type dropdown */}
                      <div className="mt-6">
                        <PremiumSelect
                          label="Preferred Vehicle Type"
                          value={vehiclePreference}
                          onChange={setVehiclePreference}
                          options={["Truck", "Van", "Not sure"]}
                          placeholder="Select preferred vehicle type..."
                          helper="Select the vehicle type you'd prefer for your event setup."
                          icon={Truck}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-base font-black uppercase tracking-[0.18em] mb-1.5" style={{ color: NAVY, opacity: 0.95, fontFamily: FN }}>
                        Additional Guests (Optional)
                      </label>
                      <p className="text-sm sm:text-base font-bold text-slate-700 mb-5 leading-relaxed">
                        Only enter guests <strong style={{ color: NAVY }}>beyond the included package amount</strong>. Extra guests are billed at ${(sel as any)?.extraGuestPrice ?? sel?.extraPiecePrice ?? 5}/person.
                      </p>
                      <div className="flex items-center gap-6 bg-white/40 backdrop-blur-md border-2 border-slate-200/80 rounded-3xl p-5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => setAdditionalGuests(Math.max(0, additionalGuests - 1))}
                          className="w-14 h-14 rounded-full border-2 font-black text-2xl flex items-center justify-center transition-all hover:bg-slate-100 bg-white"
                          style={{ borderColor: additionalGuests === 0 ? "rgba(0,2,35,0.12)" : NAVY, color: NAVY }}
                        >
                          −
                        </button>
                        <div className="flex-grow text-center">
                          <span className="text-4xl font-black block" style={{ color: NAVY, fontFamily: F_SERIF }}>{additionalGuests}</span>
                          <span className="block text-xs sm:text-sm font-bold text-slate-600 mt-1">additional guest{additionalGuests !== 1 ? "s" : ""}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAdditionalGuests(Math.min(200, additionalGuests + 1))}
                          className="w-14 h-14 rounded-full border-2 font-black text-2xl flex items-center justify-center transition-all hover:bg-amber-50 bg-white"
                          style={{ borderColor: NAVY, color: NAVY }}
                        >
                          +
                        </button>
                        {additionalGuests > 0 && (
                          <div className="px-6 py-3 rounded-2xl font-black text-base sm:text-lg shadow-sm" style={{ background: "rgba(255,160,0,0.18)", color: NAVY }}>
                            +${(additionalGuests * ((sel as any)?.extraGuestPrice ?? sel?.extraPiecePrice ?? 5)).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Service Time selector */}
                <div className="md:col-span-2">
                  <label className="block text-base font-black uppercase tracking-[0.18em] mb-1.5" style={{ color: NAVY, opacity: 0.95, fontFamily: FN }}>
                    Additional Service Time (Optional)
                  </label>
                  <p className="text-sm sm:text-base font-bold text-slate-700 mb-5 leading-relaxed">
                    Every additional <strong style={{ color: NAVY }}>30 minutes</strong> beyond your package's included service time is{" "}
                    <strong style={{ color: NAVY }}>$35</strong>.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[0, 30, 60, 90, 120].map((mins) => {
                      const fee = (mins / 30) * 35;
                      const isSelected = extraServiceMins === mins;
                      return (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setExtraServiceMins(mins)}
                          className="py-5 rounded-2xl border-2 font-black text-base text-center transition-all hover:-translate-y-0.5 shadow-sm"
                          style={{
                            borderColor: isSelected ? NAVY : "rgba(0,2,35,0.12)",
                            background: isSelected ? NAVY : "rgba(255,255,255,0.85)",
                            color: isSelected ? GOLD : NAVY,
                            boxShadow: isSelected ? "0 8px 20px rgba(0,2,35,0.18)" : "none"
                          }}
                        >
                          <span className="block text-xl">{mins === 0 ? "None" : `+${mins} Min`}</span>
                          <span className="block text-xs sm:text-sm mt-1 font-bold opacity-80">{mins === 0 ? "$0" : `$${fee}`}</span>
                        </button>
                      );
                    })}
                  </div>
                  {extraServiceMins > 0 && (
                    <div className="mt-4 flex items-center gap-2.5 text-base font-bold text-amber-955 bg-amber-50/80 border-2 border-amber-200 rounded-2xl px-5 py-4 shadow-sm animate-fade-in">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span>+{extraServiceMins} min additional service time → <strong>+${(extraServiceMins / 30) * 35} added to total</strong></span>
                    </div>
                  )}
                </div>

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
                  <LocationVerificationWidget
                    label="Primary Event Setup Location"
                    value={primaryLoc}
                    onChange={setPrimaryLoc}
                    error={submitErr && !primaryLoc.latitude ? "Please verify your setup location." : undefined}
                  />
                </div>

                {/* Travel Distance Card / Notice */}
                <div className="md:col-span-2 mt-2">
                  {primaryLoc.latitude !== null && primaryLoc.longitude !== null ? (
                    <div
                      className="p-6 rounded-3xl border-2 text-left bg-white/70 backdrop-blur-md shadow-md"
                      style={{ borderColor: "rgba(0, 2, 35, 0.12)", borderLeftColor: GOLD, borderLeftWidth: "6px" }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-650 block">
                            Travel Distance & Routing
                          </span>
                          <span className="text-2xl font-black tracking-tight mt-1 block" style={{ color: NAVY }}>
                            {drivingMiles.toFixed(1)} Miles Total
                          </span>
                        </div>
                        <span className="text-3xl">📍</span>
                      </div>

                      <div className="grid grid-cols-2 gap-6 border-t-2 border-dashed border-slate-200/80 pt-5 text-sm font-bold text-slate-700">
                        <div>
                          <span className="text-slate-500 block">First 10.0 miles:</span>
                          <span className="text-emerald-700 font-extrabold text-base">FREE (Included)</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Billable miles:</span>
                          <span className="text-slate-800 font-extrabold text-base">
                            {Math.max(0, drivingMiles - 10).toFixed(1)} miles
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 p-4 rounded-xl bg-amber-50 border-2 border-amber-200/60 flex items-center justify-between text-base sm:text-lg font-black text-amber-900 shadow-inner">
                        <span>Travel Fee:</span>
                        <span>
                          {drivingMiles <= 10 ? (
                            <span className="text-emerald-755 font-black">Free ($0.00)</span>
                          ) : (
                            <span>${mapTravelFee.toFixed(2)}</span>
                          )}
                        </span>
                      </div>

                      <p className="text-xs text-slate-550 font-bold mt-4 text-center">
                        Garage: <strong>Boston Revere — 84 Fernwood Ave</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center bg-slate-50/50 text-base font-bold text-slate-500 shadow-inner">
                      Confirm your event location to calculate accurate travel distance.
                    </div>
                  )}
                </div>

                {/* ─── Multi-Stop Section ─── */}
                <div className="md:col-span-2 border-t-2 border-slate-200/50 pt-8 mt-6">
                  <label className="block text-base font-black text-[#000223] mb-2">
                    Will this event include more than one location?
                  </label>
                  {/* $50/stop fee notice */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl mb-5 border-2" style={{ background: "rgba(255,160,0,0.07)", borderColor: "rgba(255,160,0,0.35)" }}>
                    <span className="text-2xl shrink-0">💰</span>
                    <div>
                      <p className="font-black text-[#000223] text-sm sm:text-base">Additional Stop Fee: <span style={{ color: "#FFA000" }}>$50 per stop</span></p>
                      <p className="text-slate-600 text-xs sm:text-sm font-bold mt-0.5">Each extra location added to your booking will add $50 to the total. This covers routing and setup time between stops.</p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-slate-600 mb-5">
                    Select a multi-location routing mode if you need catering services across multiple spots.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[
                      { mode: "SINGLE_LOCATION", title: "Single Location", desc: "No, one location only" },
                      { mode: "SEQUENTIAL_STOPS", title: "Sequential Stops", desc: "Multiple stops in order (single vehicle)" },
                      { mode: "SIMULTANEOUS_MULTI_VEHICLE", title: "Simultaneous Multi-Vehicle", desc: "Multiple locations at the same time" },
                      { mode: "NEEDS_REVIEW", title: "Needs Custom Review", desc: "Custom route / complex schedule needs" }
                    ].map((opt) => {
                      const isSel = locationMode === opt.mode;
                      return (
                        <button
                          key={opt.mode}
                          type="button"
                          onClick={() => {
                            setLocationMode(opt.mode as any);
                            if (opt.mode === "SINGLE_LOCATION") {
                              setBookingStops([]);
                            } else if (bookingStops.length === 0) {
                              setBookingStops([{
                                street: "",
                                city: "",
                                state: "MA",
                                zipCode: "",
                                latitude: null,
                                longitude: null,
                                formattedAddress: "",
                                placeId: "",
                                locationVerificationMethod: "",
                                locationVerifiedAt: null,
                                notes: ""
                              }]);
                            }
                          }}
                          className={`p-5 rounded-2xl border-2 text-left transition-all backdrop-blur-sm ${
                            isSel
                              ? "bg-amber-50/60 border-[#FFA000] shadow-md ring-2 ring-amber-100"
                              : "bg-white/60 border-slate-200 hover:bg-slate-50/60"
                          }`}
                        >
                          <div className="font-black text-base text-[#000223] mb-1">{opt.title}</div>
                          <div className="text-xs sm:text-sm text-slate-600 font-bold">{opt.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  {locationMode !== "SINGLE_LOCATION" && (
                    <div className="space-y-6">
                      {bookingStops.map((stop, idx) => (
                        <div key={idx} className="bg-white/70 backdrop-blur-sm border-2 border-slate-200 p-4 sm:p-6 rounded-2xl relative shadow-md space-y-4">
                          <div className="flex justify-between items-center pb-3 border-b border-slate-200/80">
                            <h4 className="font-black text-base text-[#000223]">Stop #{idx + 1}</h4>
                            <button
                              type="button"
                              onClick={() => setBookingStops(bookingStops.filter((_, i) => i !== idx))}
                              className="text-red-650 text-xs sm:text-sm font-black hover:text-red-800 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-50 rounded-xl hover:bg-red-100 transition-all shadow-sm border border-red-200/50"
                            >
                              Remove Stop
                            </button>
                          </div>
                          
                          <LocationVerificationWidget
                            label={`Stop #${idx + 1} Address Details`}
                            value={stop}
                            onChange={(updatedStop) => {
                              const newStops = [...bookingStops];
                              newStops[idx] = { ...newStops[idx], ...updatedStop };
                              setBookingStops(newStops);
                            }}
                          />
                          
                          <div>
                            <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Stop Notes (Optional)</label>
                            <input
                              type="text"
                              value={stop.notes || ""}
                              onChange={(e) => {
                                const newStops = [...bookingStops];
                                newStops[idx].notes = e.target.value;
                                setBookingStops(newStops);
                              }}
                              placeholder="e.g. Set up by the garden gate"
                              className="w-full py-4.5 px-4.5 rounded-xl border-2 border-slate-250 font-bold text-base focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 bg-white"
                            />
                          </div>
                        </div>
                      ))}

                      {bookingStops.length < 5 ? (
                        <button
                          type="button"
                          onClick={() => setBookingStops([...bookingStops, {
                            street: "",
                            city: "",
                            state: "MA",
                            zipCode: "",
                            latitude: null,
                            longitude: null,
                            formattedAddress: "",
                            placeId: "",
                            locationVerificationMethod: "",
                            locationVerifiedAt: null,
                            notes: ""
                          }])}
                          className="w-full py-4 border-2 border-dashed border-[#FFA000] rounded-2xl font-black text-[#FFA000] hover:bg-[#FFA000]/10 transition-all text-base shadow-sm"
                        >
                          + Add Another Stop
                        </button>
                      ) : (
                        <p className="text-center text-sm font-bold text-slate-650 py-4 bg-slate-50 border-2 rounded-2xl">
                          Need more than 5 stops? Add the details in the main notes below and our team will review it.
                        </p>
                      )}
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
                <div className="mt-8 p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 font-bold text-base flex items-center gap-3 shadow-sm animate-fade-in">
                  <AlertCircle className="w-6 h-6 shrink-0 text-rose-600" />
                  <span>{quoteErr}</span>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-14">
                <button
                  onClick={() => setStep(0)}
                  className="inline-flex items-center justify-center gap-2.5 px-10 py-5.5 rounded-full font-black text-lg border-2 w-full sm:w-auto transition-all bg-white hover:bg-slate-50"
                  style={{ borderColor: NAVY, color: NAVY, fontFamily: FN }}
                >
                  <ArrowLeft className="w-5.5 h-5.5" /> Back
                </button>
                <button
                  onClick={fetchQuote}
                  disabled={quoting || !eventDate || !startTime || !eventType || !canContinueStep1 || isGuestCountInvalid}
                  className="inline-flex items-center justify-center gap-3 px-12 py-5.5 rounded-full font-black text-lg sm:text-xl shadow-2xl disabled:opacity-40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 w-full sm:w-auto justify-center"
                  style={{ background: NAVY, color: GOLD, fontFamily: FN }}
                >
                  {quoting ? (
                    <>
                      <Loader2 className="w-5.5 h-5.5 animate-spin" /> Calculating…
                    </>
                  ) : (sel?.slug === "custom-event-package" || (sel as any)?.serviceType === "CUSTOM") ? (
                    <>
                      Continue to Contact <ArrowRight className="w-5.5 h-5.5" />
                    </>
                  ) : (
                    <>
                      Request Quote <ArrowRight className="w-5.5 h-5.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Contact ── */}
          {step === 2 && (
            <div>
              <div className="mb-10 text-center sm:text-left">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: NAVY, fontFamily: F_SERIF }}>
                  Customer Information
                </h2>
                <p className="text-slate-700 font-bold text-lg sm:text-xl mt-2.5 leading-relaxed" style={{ fontFamily: FN }}>
                  Enter your details to generate your digital catering quote
                </p>
              </div>

              {(sel?.slug === "custom-event-package" || (sel as any)?.serviceType === "CUSTOM") ? (
                <div
                  className="p-5 sm:p-8 rounded-3xl border-2 mb-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-md"
                  style={{ background: "rgba(219,234,254,0.7)", borderColor: "#93C5FD" }}
                >
                  <div>
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-blue-800 block" style={{ fontFamily: FN }}>
                      Custom Event Package
                    </span>
                    <span className="text-2xl sm:text-3xl font-black tracking-tight mt-1.5 block" style={{ color: "#1E40AF", fontFamily: F_SERIF }}>
                      Custom Quote
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500 block" style={{ fontFamily: FN }}>
                      Next Step
                    </span>
                    <span className="text-base sm:text-lg font-black mt-1.5 block" style={{ color: "#1E40AF" }}>
                      📲 Team contacts you via WhatsApp
                    </span>
                  </div>
                </div>
              ) : quote ? (
                <div
                  className="p-5 sm:p-8 rounded-3xl border-2 mb-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-md"
                  style={{ background: "rgba(255, 251, 235, 0.8)", borderColor: "#FDE68A" }}
                >
                  <div>
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-800 block" style={{ fontFamily: FN }}>
                      Estimated Total
                    </span>
                    <span className="text-3xl sm:text-4xl font-black tracking-tight mt-1.5 block" style={{ color: NAVY, fontFamily: F_SERIF }}>
                      ${quote.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500 block" style={{ fontFamily: FN }}>
                      Payment Method
                    </span>
                    <span className="text-lg sm:text-xl font-black mt-1.5 block" style={{ color: NAVY }}>
                      💳 Pay After Service
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
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

              <div className="relative w-full">
                <div
                  className="relative w-full transition-all duration-300"
                  style={{
                    background: phoneFocused
                      ? "rgba(255,255,255,0.97)"
                      : phoneErr
                      ? "rgba(255,240,240,0.90)"
                      : "rgba(255,255,255,0.82)",
                    borderRadius: 18,
                    border: phoneFocused
                      ? `2px solid ${GOLD}`
                      : phoneErr
                      ? "2px solid rgba(220,38,38,0.5)"
                      : "2px solid rgba(0,2,35,0.10)",
                    boxShadow: phoneFocused
                      ? `0 0 0 5px rgba(255,160,0,0.13), 0 8px 32px rgba(0,0,0,0.05)`
                      : phoneErr
                      ? "0 0 0 4px rgba(220,38,38,0.07)"
                      : "0 2px 10px rgba(0,0,0,0.04)",
                    backdropFilter: "blur(16px)",
                    transition: "all 0.25s cubic-bezier(.4,0,.2,1)"
                  }}
                >
                  <div
                    className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300"
                    style={{ color: phoneFocused ? GOLD : phoneErr ? "#EF4444" : "#94A3B8" }}
                  >
                    <Phone className="w-5 h-5" />
                  </div>
                  <label
                    className="absolute pointer-events-none font-black tracking-wide transition-all duration-200 select-none"
                    style={{
                      left: "3.0rem",
                      top: (phoneFocused || phone) ? "0.5rem" : "50%",
                      transform: (phoneFocused || phone) ? "none" : "translateY(-50%)",
                      fontSize: (phoneFocused || phone) ? "10px" : "16px",
                      letterSpacing: (phoneFocused || phone) ? "0.16em" : "0.01em",
                      textTransform: (phoneFocused || phone) ? "uppercase" : "none",
                      color: phoneFocused ? GOLD : phoneErr ? "#DC2626" : "#94A3B8",
                      fontFamily: FN,
                      zIndex: 1
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(toEnNum(e.target.value));
                      if (phoneErr) setPhoneErr("");
                    }}
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={() => {
                      setPhoneFocused(false);
                      const err = validatePhone(phone);
                      setPhoneErr(err);
                    }}
                    placeholder=""
                    className="w-full outline-none bg-transparent font-bold"
                    style={{
                      fontFamily: FN,
                      fontSize: "1.2rem",
                      lineHeight: 1.4,
                      paddingTop: "1.65rem",
                      paddingBottom: "0.75rem",
                      paddingLeft: "3.0rem",
                      paddingRight: "1.1rem",
                      color: NAVY,
                      caretColor: GOLD
                    }}
                    autoComplete="tel"
                  />
                </div>
                {phoneErr ? (
                  <p className="flex items-center gap-1.5 mt-2 ml-1 text-red-700 font-bold text-sm" style={{ fontFamily: FN }}>
                    <AlertCircle className="w-4 h-4 shrink-0" /> {phoneErr}
                  </p>
                ) : (
                  <p className="mt-2 ml-1 text-slate-500 font-semibold text-sm" style={{ fontFamily: FN }}>
                    US phone number preferred for catering dispatch
                  </p>
                )}
              </div>
              </div>

              {/* Trust Note Card */}
              <div className="flex items-center gap-4.5 p-6 rounded-3xl border-2 border-slate-200 mt-10 bg-white/60 backdrop-blur-md shadow-sm">
                <Shield className="w-7 h-7 shrink-0 text-[#FFA000]" />
                <p className="text-sm sm:text-base font-bold leading-relaxed text-slate-600">
                  Privacy Protection: Your details will only be used to facilitate scheduling dispatch, sending automated updates, and confirmation notifications.
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-14">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center gap-2.5 px-10 py-5.5 rounded-full font-black text-lg border-2 w-full sm:w-auto transition-all bg-white hover:bg-slate-50"
                  style={{ borderColor: NAVY, color: NAVY, fontFamily: FN }}
                >
                  <ArrowLeft className="w-5.5 h-5.5" /> Back
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
                  className="inline-flex items-center justify-center gap-3 px-12 py-5.5 rounded-full font-black text-lg sm:text-xl shadow-2xl disabled:opacity-40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 w-full sm:w-auto justify-center"
                  style={{ background: NAVY, color: GOLD, fontFamily: FN }}
                >
                  Verify Contact Details <ArrowRight className="w-5.5 h-5.5" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: OTP Verification ── */}
          {step === 3 && (
            <div>
              <div className="mb-10 text-center sm:text-left">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: NAVY, fontFamily: F_SERIF }}>
                  Verify Your Email
                </h2>
                <p className="text-slate-700 font-bold text-lg sm:text-xl mt-2.5 leading-relaxed" style={{ fontFamily: FN }}>
                  Enter the passcode sent to your email to confirm contact details
                </p>
              </div>

              {otpVerified ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-md rounded-full">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black mb-1" style={{ color: NAVY, fontFamily: FN }}>
                    Email Verified!
                  </p>
                  <p className="text-slate-500 font-bold text-base">Proceeding to review your details...</p>
                  <button
                    onClick={() => setStep(4)}
                    className="mt-8 inline-flex items-center gap-3 px-12 py-5.5 rounded-full text-white font-black shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 text-lg"
                    style={{ background: NAVY, fontFamily: FN }}
                  >
                    Proceed to Review <ArrowRight className="w-5.5 h-5.5" />
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

              <div className="flex justify-start mt-12">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center justify-center gap-2.5 px-10 py-5.5 rounded-full font-black text-lg border-2 w-full sm:w-auto transition-all bg-white hover:bg-slate-50"
                  style={{ borderColor: NAVY, color: NAVY, fontFamily: FN }}
                >
                  <ArrowLeft className="w-5.5 h-5.5" /> Back
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Review & Confirm ── */}
          {step === 4 && (quote || sel?.slug === "custom-event-package" || (sel as any)?.serviceType === "CUSTOM") && (
            <div>
              <div className="mb-10 text-center sm:text-left">
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: NAVY, fontFamily: F_SERIF }}>
                  Review & Confirm
                </h2>
                <p className="text-slate-700 font-bold text-lg sm:text-xl mt-2.5 leading-relaxed" style={{ fontFamily: FN }}>
                  Please verify details before submitting booking dispatch
                </p>
              </div>

              {submitErr && (
                <div className="mb-8 p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 font-bold text-base flex items-center gap-3 shadow-sm animate-fade-in">
                  <AlertCircle className="w-6 h-6 shrink-0 text-rose-600" />
                  <span>{submitErr}</span>
                </div>
              )}

              <div className="space-y-6 sm:space-y-8 mb-10">
                {/* Package Summary Card */}
                <div className="rounded-2xl border-2 border-slate-200/80 bg-white/70 backdrop-blur-md overflow-hidden shadow-md">
                  <div className="px-6 py-4 bg-slate-100/80 border-b-2 border-slate-200/80 flex items-center gap-2.5 font-black text-[#000223] text-base sm:text-lg">
                    <span className="text-base sm:text-lg">Catering Package</span>
                  </div>
                  <div className="px-6 py-6 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="font-black text-xl block text-[#000223]">{sel?.name}</span>
                      {(sel?.slug === "custom-event-package" || (sel as any)?.serviceType === "CUSTOM") ? (
                        <span className="text-base font-bold text-blue-700 mt-1.5 block">200+ guests · Custom pricing</span>
                      ) : (
                        <span className="text-base font-bold text-slate-655 mt-1.5 block">
                          {sel?.includedQty || sel?.servings} servings included · {sel?.durationMins || sel?.includedMinutes || 60} mins duration
                        </span>
                      )}
                    </div>
                    {(sel?.slug === "custom-event-package" || (sel as any)?.serviceType === "CUSTOM") ? (
                      <span className="font-black text-xl text-blue-700 shrink-0">Custom Quote</span>
                    ) : (
                      <span className="font-black text-2xl text-[#FFA000] shrink-0">${sel?.basePrice || sel?.price}</span>
                    )}
                  </div>
                </div>

                {/* Event Details Summary Card */}
                <div className="rounded-2xl border-2 border-slate-200/80 bg-white/70 backdrop-blur-md overflow-hidden shadow-md">
                  <div className="px-6 py-4 bg-slate-100/80 border-b-2 border-slate-200/80 flex items-center gap-2.5 font-black text-[#000223] text-base sm:text-lg">
                    <span className="text-base sm:text-lg">Scheduling Details</span>
                  </div>
                  <div className="divide-y-2 divide-slate-100">
                    {[
                      ["Event Type", eventType],
                      ["Event Date", formatEnDate(eventDate)],
                      ["Start Time", formatEnTime(startTime)],
                      ...((sel?.slug === "custom-event-package" || (sel as any)?.serviceType === "CUSTOM")
                        ? [["Guest Count", `${customGuestCount}+ guests (custom event)`]] as [string, string][]
                        : [
                            ["Included Service Time", `${(sel as any)?.durationMins ?? sel?.includedMinutes ?? 60} minutes`],
                            ["Included Guests", `${sel?.servings ?? sel?.includedQty ?? 50} guests`],
                            ...(additionalGuests > 0 ? [["Additional Guests", `+${additionalGuests} guests`]] as [string, string][] : []),
                            ...(extraServiceMins > 0 ? [["Additional Service Time", `+${extraServiceMins} mins`]] as [string, string][] : []),
                          ]),
                      ["Location", `${primaryLoc.formattedAddress || `${address}, ${city} ${zip}`}`],
                      ...(bookingStops.length > 0 ? [["Stops", `${bookingStops.length} additional stop(s)`]] as [string, string][] : []),
                      ["Garage Origin", "Boston Revere — 84 Fernwood Ave"],
                      ...(quote ? [
                        ["Distance", `${quote.distanceMiles.toFixed(1)} miles total`],
                        ["Free Travel Zone", "First 10.0 miles FREE"],
                        ["Billable Miles", `${Math.max(0, quote.distanceMiles - 10).toFixed(1)} miles`],
                        ["Travel Fee", quote.travelFee > 0 ? `$${quote.travelFee.toFixed(2)}` : "Free ($0.00)"]
                      ] as [string, string][] : [])
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between items-center px-6 py-4 text-sm sm:text-base">
                        <span className="font-bold text-slate-600">{l}</span>
                        <span className="font-black text-[#000223] text-right max-w-[65%]">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Contact Summary Card */}
                <div className="rounded-2xl border-2 border-slate-200/80 bg-white/70 backdrop-blur-md overflow-hidden shadow-md">
                  <div className="px-6 py-4 bg-slate-100/80 border-b-2 border-slate-200/80 flex items-center gap-2.5 font-black text-[#000223] text-base sm:text-lg">
                    <span className="text-base sm:text-lg">Customer Contact Info</span>
                  </div>
                  <div className="divide-y-2 divide-slate-100">
                    {[
                      ["Name", `${firstName} ${lastName}`],
                      ["Email", email],
                      ["Phone", phone]
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between items-center px-6 py-4 text-sm sm:text-base">
                        <span className="font-bold text-slate-600">{l}</span>
                        <span className="font-black text-[#000223]">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing breakdown details */}
                {(sel?.slug === "custom-event-package" || (sel as any)?.serviceType === "CUSTOM") ? (
                  <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/70 p-4 sm:p-8 shadow-md">
                    <div className="flex items-center gap-2.5 mb-5 border-b-2 border-blue-100 pb-3">
                      <span className="text-xl">📋</span>
                      <span className="text-base sm:text-lg font-black text-blue-900">Custom Quote Details</span>
                    </div>
                    
                    {/* Estimated Review Summary */}
                    <div className="rounded-xl bg-white/80 border border-blue-200 p-5 mb-5">
                      <h4 className="font-black text-blue-955 text-sm mb-3 uppercase tracking-wider">Estimated Review Summary</h4>
                      <div className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-700">
                        <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
                          <span>Preferred Vehicle Type</span>
                          <span className="font-black text-[#000223]">{vehiclePreference}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
                          <span>Expected Guest Count</span>
                          <span className="font-black text-[#000223]">{customGuestCount || 201} guests</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
                          <span>Calculated Distance</span>
                          <span className="font-black text-[#000223]">{drivingMiles.toFixed(1)} miles</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Review Verdict Status</span>
                          <span className="font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-xs uppercase tracking-wider">PENDING REVIEW</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Policy Summary */}
                    <div className="rounded-xl bg-white/80 border border-blue-200 p-5 mb-5">
                      <h4 className="font-black text-blue-955 text-sm mb-3 uppercase tracking-wider">Pricing Policy Summary</h4>
                      <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm font-semibold text-slate-650">
                        <li>Custom quote tailored specifically for large events (200+ guests).</li>
                        <li>Travel fee applies to routes exceeding 10.0 miles ($2.25/mile).</li>
                        <li>Weekend events (Saturday/Sunday) include a $25 weekend fee.</li>
                        <li>Multi-stop setups include an additional $50/stop location fee.</li>
                        <li>No upfront credit card required — payment collected after service.</li>
                      </ul>
                    </div>

                    <p className="font-black text-blue-900 text-xs uppercase tracking-wider mb-3">📲 Contact our dispatch team via WhatsApp</p>
                    <div className="space-y-2">
                      {[
                        { num: "617-999-3803", wa: "16179993803" },
                        { num: "781-921-3233", wa: "17819213233" },
                        { num: "617-866-2727", wa: "16178662727" },
                      ].map(({ num, wa }) => (
                        <a key={wa} href={getWhatsAppUrl(wa)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm text-white transition-all hover:-translate-y-0.5 hover:opacity-90 shadow-sm"
                          style={{ background: "#25D366" }}>
                          <span>💬</span> WhatsApp {num}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-slate-200/80 bg-white/70 backdrop-blur-md p-4 sm:p-8 shadow-md">
                    <div className="flex items-center gap-2.5 mb-5 border-b-2 border-slate-100 pb-3">
                      <DollarSign className="w-6 h-6 text-[#FFA000]" />
                      <span className="text-base sm:text-lg font-black text-slate-800">
                        Catering Fee Breakdown
                      </span>
                    </div>
                    <div className="space-y-4 mb-6">
                      {(quote?.breakdown ?? []).map(
                        (b, i) =>
                          (b.amount !== 0 || i === 0) && (
                            <div key={i} className="flex justify-between items-start gap-2 text-sm sm:text-base py-2 border-b border-dashed border-slate-200/80 last:border-0">
                              <span className="font-bold text-slate-600 break-words min-w-0 pr-2">{b.label}</span>
                              <span className="font-black text-[#000223] shrink-0">
                                {b.amount < 0
                                  ? `-$${Math.abs(b.amount).toFixed(2)}`
                                  : `$${b.amount.toFixed(2)}`}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                    {locationMode === "SIMULTANEOUS_MULTI_VEHICLE" && (
                      <div className="mt-4 p-4 rounded-xl text-xs sm:text-sm font-bold text-amber-900 bg-amber-50 border border-amber-200 leading-relaxed">
                        <strong>Additional Vehicle Setup Fee:</strong> If your event requires another truck/van for the same package at the same time, each additional vehicle includes a $200 setup and dispatch fee.
                      </div>
                    )}
                    {(() => {
                      if (!eventDate) return null;
                      const date = new Date(eventDate + "T12:00:00");
                      const day = date.getDay();
                      const isWeekendDay = day === 0 || day === 6;
                      if (isWeekendDay) {
                        return (
                          <div className="mt-4 p-4 rounded-xl text-xs sm:text-sm font-bold text-blue-900 bg-blue-50 border border-blue-200 leading-relaxed">
                            <strong>Weekend Event Fee:</strong> Saturday and Sunday bookings include an additional $25 weekend event fee.
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <div className="border-t-2 border-slate-200 pt-5 flex justify-between items-center gap-2">
                      <span className="font-black text-sm sm:text-xl text-[#000223]">Estimated Total Amount</span>
                      <span className="text-2xl sm:text-4xl font-black tracking-tight text-[#FFA000] shrink-0">
                        ${(quote?.totalAmount ?? 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Cash Policy Banner */}
                <div
                  className="flex items-start gap-5 p-6 sm:p-8 rounded-3xl border-2 border-emerald-250 bg-emerald-50/40 shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm border border-emerald-200">
                    <DollarSign className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-black text-lg sm:text-xl text-emerald-950" style={{ fontFamily: F_SERIF }}>Payment After Service</p>
                    <p className="text-sm sm:text-base font-bold text-emerald-805 mt-2 leading-relaxed" style={{ fontFamily: FN }}>
                      Payment is collected after the service. We accept cash, Zelle, Venmo, and other card methods.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-slate-700 font-extrabold mb-8">
                📍 Pricing calculations based on travel distances from <strong>Boston Revere — 84 Fernwood Ave</strong>
              </p>

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-14">
                <button
                  onClick={() => setStep(3)}
                  className="inline-flex items-center justify-center gap-2.5 px-10 py-5.5 rounded-full font-black text-lg border-2 w-full sm:w-auto transition-all bg-white hover:bg-slate-50"
                  style={{ borderColor: NAVY, color: NAVY, fontFamily: FN }}
                >
                  <ArrowLeft className="w-5.5 h-5.5" /> Back
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-3 px-12 py-5.5 rounded-full font-black text-lg sm:text-xl shadow-2xl disabled:opacity-50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 w-full sm:w-auto"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, #001a4c)`, color: GOLD, fontFamily: FN }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5.5 h-5.5 animate-spin" /> Processing Request…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5.5 h-5.5" /> Submit Booking Request
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

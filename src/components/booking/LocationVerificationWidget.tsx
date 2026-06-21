"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Navigation, Loader2, CheckCircle2, AlertCircle, Search, Compass, Map } from "lucide-react";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./PremiumMap"), { ssr: false });

export interface LocationData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number | null;
  longitude: number | null;
  formattedAddress: string;
  placeId: string;
  locationVerificationMethod: string;
  locationVerifiedAt: string | null;
}

interface LocationVerificationWidgetProps {
  label: string;
  value: LocationData;
  onChange: (val: LocationData) => void;
  error?: string;
  serviceZones?: { zip: string; city: string }[];
}

export default function LocationVerificationWidget({
  label,
  value,
  onChange,
  error,
  serviceZones = [],
}: LocationVerificationWidgetProps) {
  const [activeTab, setActiveTab] = useState<"search" | "manual" | "map">("search");

  // ── Search tab state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [searchNoResults, setSearchNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── ZIP autocomplete state (Manual tab) ──
  const [zipFocused, setZipFocused] = useState(false);
  const [zipSuggestions, setZipSuggestions] = useState<{ zip: string; city: string }[]>([]);
  const [showZipDropdown, setShowZipDropdown] = useState(false);
  const zipContainerRef = useRef<HTMLDivElement>(null);

  // ── Shared state ──
  const [verifyingManual, setVerifyingManual] = useState(false);
  const [currentLocLoading, setCurrentLocLoading] = useState(false);
  const [widgetError, setWidgetError] = useState("");

  // ── Close search suggestions on outside click ──
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setSearchFocused(false);
      }
      if (zipContainerRef.current && !zipContainerRef.current.contains(event.target as Node)) {
        setShowZipDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Search autocomplete: debounced, starts at 2 chars ──
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSearchNoResults(false);
      return;
    }
    setSearchNoResults(false);
    setLoadingSuggestions(true);

    const delayDebounce = setTimeout(async () => {
      try {
        // Build a context-aware query — always add Massachusetts context
        const enrichedQuery = q.toLowerCase().includes("ma") || q.toLowerCase().includes("massachusetts")
          ? q
          : `${q}, Massachusetts`;
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(enrichedQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(Array.isArray(data) ? data.slice(0, 8) : []);
          setSearchNoResults(Array.isArray(data) && data.length === 0 && q.length >= 3);
        }
      } catch (err) {
        console.error("Autocomplete search error:", err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 280);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // ── ZIP live autocomplete ──
  useEffect(() => {
    const z = value.zipCode.trim();
    if (z.length === 0 || !zipFocused) {
      setZipSuggestions([]);
      setShowZipDropdown(false);
      return;
    }
    if (serviceZones.length > 0) {
      const filtered = serviceZones.filter((s) => s.zip.startsWith(z));
      setZipSuggestions(filtered.slice(0, 10));
      setShowZipDropdown(filtered.length > 0 && z.length < 5);
    }
  }, [value.zipCode, zipFocused, serviceZones]);

  // ── Auto-populate City when full ZIP entered ──
  useEffect(() => {
    const z = value.zipCode;
    if (z.length === 5 && serviceZones.length > 0) {
      const zone = serviceZones.find((s) => s.zip === z);
      if (zone && zone.city && value.city !== zone.city) {
        onChange({ ...value, city: zone.city });
      }
      setShowZipDropdown(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.zipCode, serviceZones]);

  // ── Handlers ──
  const handleSuggestionSelect = useCallback((item: any) => {
    const parts = item.label.split(",");
    const street = parts[0]?.trim() || "";
    onChange({
      street,
      city: item.city || "",
      state: "MA",
      zipCode: item.zip || "",
      latitude: item.lat,
      longitude: item.lng,
      formattedAddress: item.label,
      placeId: item.placeId || "",
      locationVerificationMethod: "ADDRESS_AUTOCOMPLETE",
      locationVerifiedAt: new Date().toISOString(),
    });
    setSearchQuery(item.label);
    setSuggestions([]);
    setWidgetError("");
  }, [onChange]);

  const handleZipSuggestionSelect = (zone: { zip: string; city: string }) => {
    onChange({
      ...value,
      zipCode: zone.zip,
      city: zone.city,
      latitude: null,
      longitude: null,
      locationVerificationMethod: "",
    });
    setShowZipDropdown(false);
    setZipFocused(false);
  };

  const handleManualVerify = async () => {
    if (!value.street || !value.city || !value.zipCode) {
      setWidgetError("Please fill out Street, City, and ZIP code first.");
      return;
    }
    setVerifyingManual(true);
    setWidgetError("");
    try {
      const fullQuery = `${value.street}, ${value.city}, MA ${value.zipCode}`;
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(fullQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const best = data[0];
          onChange({
            ...value,
            latitude: best.lat,
            longitude: best.lng,
            formattedAddress: best.label,
            locationVerificationMethod: "MANUAL_GEOCODED",
            locationVerifiedAt: new Date().toISOString(),
          });
        } else {
          setWidgetError("We couldn't verify this address. Please use the Search tab or drop a pin on the map.");
        }
      } else {
        setWidgetError("Address verification service is temporarily unavailable.");
      }
    } catch {
      setWidgetError("Verification failed. Please try again.");
    } finally {
      setVerifyingManual(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setWidgetError("Browser location is not supported on this device.");
      return;
    }
    setCurrentLocLoading(true);
    setWidgetError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
          if (res.ok) {
            const geo = await res.json();
            if (geo) {
              const parts = geo.displayName.split(",");
              const street = parts[0]?.trim() || "";
              onChange({
                street,
                city: geo.city || "",
                state: "MA",
                zipCode: geo.zip || "",
                latitude: lat,
                longitude: lng,
                formattedAddress: geo.displayName,
                placeId: "",
                locationVerificationMethod: "CURRENT_LOCATION",
                locationVerifiedAt: new Date().toISOString(),
              });
              setSearchQuery(geo.displayName);
            } else {
              onChange({
                street: "",
                city: "",
                state: "MA",
                zipCode: "",
                latitude: lat,
                longitude: lng,
                formattedAddress: `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                placeId: "",
                locationVerificationMethod: "CURRENT_LOCATION",
                locationVerifiedAt: new Date().toISOString(),
              });
            }
          }
        } catch {
          setWidgetError("Reverse geocoding failed, but coordinates are saved.");
        } finally {
          setCurrentLocLoading(false);
        }
      },
      (err) => {
        setCurrentLocLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setWidgetError("Location permission was denied. Please select the address on the map or verify manually.");
        } else {
          setWidgetError("Could not retrieve current location.");
        }
      }
    );
  };

  const handleMapPin = async (clickedLat: number, clickedLng: number) => {
    setWidgetError("");
    try {
      const res = await fetch(`/api/geocode/reverse?lat=${clickedLat}&lng=${clickedLng}`);
      const geo = res.ok ? await res.json() : null;
      const parts = geo?.displayName ? geo.displayName.split(",") : [];
      const street = parts[0]?.trim() || "";
      const formatted = geo?.displayName ?? `${clickedLat.toFixed(5)}, ${clickedLng.toFixed(5)}`;
      onChange({
        street,
        city: geo?.city ?? "",
        state: "MA",
        zipCode: geo?.zip ?? "",
        latitude: clickedLat,
        longitude: clickedLng,
        formattedAddress: formatted,
        placeId: "",
        locationVerificationMethod: "MAP_SELECTED",
        locationVerifiedAt: new Date().toISOString(),
      });
      setSearchQuery(formatted);
    } catch {
      console.error("Map pin lookup error");
    }
  };

  const isVerified = value.latitude !== null && value.longitude !== null && value.locationVerificationMethod !== "";

  return (
    <div
      className="rounded-2xl p-4 sm:p-8 shadow-md transition-all relative border-2"
      style={{
        borderColor: error ? "rgba(220,38,38,0.5)" : "rgba(0, 2, 35, 0.08)",
        background: error ? "rgba(255,240,240,0.90)" : "rgba(255,255,255,0.82)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100" style={{ borderColor: error ? "rgba(220,38,38,0.15)" : "rgba(0,2,35,0.05)" }}>
        <label className="text-lg sm:text-xl font-black tracking-wide" style={{ color: error ? "#DC2626" : "#000223" }}>{label}</label>
        {isVerified ? (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-full border border-emerald-200 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 animate-pulse" /><span>Needs Verification</span>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {(widgetError || error) && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-sm sm:text-base font-bold flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-600" />
          <span>{widgetError || error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-2 sm:gap-3 mb-5">
        {(["search", "manual", "map"] as const).map((tab) => {
          const icons = { search: <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />, manual: <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />, map: <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> };
          const labels = { search: "Search", manual: "Manual", map: "Map Pin" };
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-2.5 sm:py-3.5 px-1 sm:px-4 text-[11px] min-[350px]:text-xs sm:text-sm font-black rounded-xl border-2 transition-all flex items-center justify-center gap-1 sm:gap-2 ${
                activeTab === tab
                  ? "bg-[#000223] text-[#FFA000] border-[#000223] shadow-md"
                  : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              {icons[tab]}
              <span className="truncate">{labels[tab]}</span>
            </button>
          );
        })}
      </div>

      {/* Current Location button */}
      <div className="mb-5">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={currentLocLoading}
          className="w-full py-3.5 px-5 bg-amber-50/50 hover:bg-amber-50 border-2 border-amber-200/60 text-[#000223] rounded-xl text-sm sm:text-base font-black hover:border-amber-300 transition-all flex items-center justify-center gap-2.5 shadow-sm"
        >
          {currentLocLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#FFA000]" /> : <Compass className="w-5 h-5 text-[#FFA000]" />}
          Use My Current Location
        </button>
      </div>

      {/* ═══ SEARCH TAB ═══ */}
      {activeTab === "search" && (
        <div ref={searchContainerRef} className="relative">
          {/* Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="e.g. 100 Boylston St, Boston…"
              autoComplete="off"
              className="w-full py-4 pl-12 pr-12 rounded-xl border-2 font-bold text-base sm:text-lg outline-none shadow-sm transition-all bg-white"
              style={{
                borderColor: searchFocused ? "#FFA000" : "rgba(0,2,35,0.12)",
                boxShadow: searchFocused ? "0 0 0 4px rgba(255,160,0,0.1)" : "0 2px 6px rgba(0,0,0,0.04)",
                color: "#000223",
              }}
            />
            {loadingSuggestions && (
              <Loader2 className="w-5 h-5 animate-spin text-[#FFA000] absolute right-4 top-1/2 -translate-y-1/2" />
            )}
            {!loadingSuggestions && searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setSuggestions([]); setSearchNoResults(false); searchInputRef.current?.focus(); }}
                className="w-6 h-6 flex items-center justify-center rounded-full absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-sm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Hint text when empty */}
          {!searchQuery && !searchFocused && (
            <p className="mt-2 text-xs sm:text-sm text-slate-400 font-semibold pl-1">
              Type your Massachusetts event address to see suggestions
            </p>
          )}

          {/* Loading state */}
          {loadingSuggestions && searchQuery.length >= 2 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-amber-200 rounded-xl shadow-2xl z-30 px-5 py-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-[#FFA000] shrink-0" />
              <span className="text-sm font-bold text-slate-600">Searching addresses…</span>
            </div>
          )}

          {/* Suggestions dropdown */}
          {!loadingSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-30 overflow-hidden" style={{ borderColor: "rgba(0,2,35,0.12)" }}>
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FFA000]" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{suggestions.length} location{suggestions.length > 1 ? "s" : ""} found</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleSuggestionSelect(item); }}
                    className="w-full text-left px-5 py-3.5 hover:bg-amber-50/60 transition-colors flex items-start gap-3 group"
                  >
                    <MapPin className="w-4 h-4 text-slate-400 group-hover:text-[#FFA000] mt-0.5 shrink-0 transition-colors" />
                    <div>
                      <span className="text-sm sm:text-base font-bold text-slate-800 block leading-snug">{item.label}</span>
                      {item.city && <span className="text-xs font-semibold text-slate-400 mt-0.5 block">{item.city}{item.zip ? `, MA ${item.zip}` : ", MA"}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results state */}
          {!loadingSuggestions && searchNoResults && searchQuery.length >= 3 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl z-30 px-5 py-5 text-center">
              <div className="text-3xl mb-2">📍</div>
              <p className="font-black text-slate-700 text-sm">No addresses found</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Try a different search or use the Manual tab</p>
            </div>
          )}
        </div>
      )}

      {/* ═══ MANUAL TAB ═══ */}
      {activeTab === "manual" && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs sm:text-sm font-bold text-blue-800 flex items-center gap-2">
            <span>💡</span> Fill in your address below, then click <strong>Verify Address</strong> — we'll locate it on the map automatically.
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">Street Address</label>
            <input
              type="text"
              value={value.street}
              onChange={(e) => onChange({ ...value, street: e.target.value, latitude: null, longitude: null, locationVerificationMethod: "" })}
              placeholder="e.g. 139 Tremont St"
              className="w-full py-4 px-4 rounded-xl border-2 border-slate-200 font-bold text-base sm:text-lg focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 bg-white outline-none"
            />
          </div>

          {/* City + ZIP side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">City</label>
              <input
                type="text"
                value={value.city}
                onChange={(e) => onChange({ ...value, city: e.target.value, latitude: null, longitude: null, locationVerificationMethod: "" })}
                placeholder="Boston"
                className="w-full py-4 px-4 rounded-xl border-2 font-bold text-base sm:text-lg focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 bg-white outline-none transition-all"
                style={{
                  borderColor: value.city ? "#FFA000" : "rgb(226,232,240)",
                  background: value.city ? "rgba(255,160,0,0.04)" : "white",
                }}
              />
              {value.city && (
                <p className="text-xs text-emerald-600 font-bold mt-1 pl-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Auto-filled — editable
                </p>
              )}
            </div>

            {/* ZIP with autocomplete */}
            <div ref={zipContainerRef} className="relative">
              <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">ZIP Code</label>
              <input
                type="text"
                value={value.zipCode}
                onFocus={() => setZipFocused(true)}
                onBlur={() => setTimeout(() => { setZipFocused(false); setShowZipDropdown(false); }, 180)}
                onChange={(e) => {
                  const z = e.target.value.replace(/\D/g, "").slice(0, 5);
                  onChange({ ...value, zipCode: z, latitude: null, longitude: null, locationVerificationMethod: "" });
                  setZipFocused(true);
                }}
                placeholder="02111"
                maxLength={5}
                inputMode="numeric"
                className="w-full py-4 px-4 rounded-xl border-2 font-bold text-base sm:text-lg focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 bg-white outline-none"
              />

              {/* ZIP autocomplete dropdown */}
              {showZipDropdown && zipSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border-2 rounded-xl shadow-2xl z-40 overflow-hidden" style={{ borderColor: "rgba(255,160,0,0.5)" }}>
                  <div className="px-3 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                    <Search className="w-3 h-3 text-[#FFA000]" />
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">MA ZIP Codes</span>
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {zipSuggestions.map((zone) => (
                      <button
                        key={zone.zip}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); handleZipSuggestionSelect(zone); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-amber-50/70 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                      >
                        <span className="font-extrabold text-sm" style={{ color: "#000223" }}>{zone.city}</span>
                        <span className="text-xs font-black px-2 py-0.5 rounded-md" style={{ background: "rgba(255,160,0,0.12)", color: "#E08B00" }}>{zone.zip}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ZIP hint */}
          {value.zipCode.length > 0 && value.zipCode.length < 5 && serviceZones.length > 0 && (
            <p className="text-xs text-slate-400 font-semibold pl-1">
              Enter full 5-digit Massachusetts ZIP — City will auto-fill
            </p>
          )}

          {/* Verify button */}
          <button
            type="button"
            onClick={handleManualVerify}
            disabled={verifyingManual || !value.street || !value.zipCode}
            className="w-full py-4 text-[#000223] font-black rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-md disabled:opacity-50"
            style={{ background: verifyingManual || !value.street || !value.zipCode ? "#94A3B8" : "#FFA000" }}
          >
            {verifyingManual && <Loader2 className="w-5 h-5 animate-spin" />}
            {verifyingManual ? "Locating on map…" : "✓ Verify Address & Calculate Distance"}
          </button>
        </div>
      )}

      {/* ═══ MAP TAB ═══ */}
      {activeTab === "map" && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-600">Click on the map to pin the exact event setup location:</p>
          <div className="h-72 rounded-xl overflow-hidden border-2 border-slate-200 relative shadow-inner">
            <LeafletMap lat={value.latitude} lng={value.longitude} onMapClick={handleMapPin} />
          </div>
        </div>
      )}

      {/* Verified address preview */}
      {isVerified && value.formattedAddress && (
        <div className="mt-5 p-4 bg-emerald-50/50 border-2 border-emerald-100 rounded-xl flex items-start gap-3 text-sm font-bold text-emerald-950 shadow-sm animate-fade-in">
          <MapPin className="w-5 h-5 text-[#FFA000] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-emerald-900 block font-black mb-1">Confirmed Delivery Address:</span>
            <span className="leading-relaxed">{value.formattedAddress}</span>
            <span className="block mt-2 text-xs font-semibold text-slate-400">
              Method: {value.locationVerificationMethod.replace(/_/g, " ")} ({value.latitude?.toFixed(5)}, {value.longitude?.toFixed(5)})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

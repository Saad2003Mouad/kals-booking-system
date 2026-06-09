"use client";

import { useState, useEffect, useRef } from "react";
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
}

export default function LocationVerificationWidget({
  label,
  value,
  onChange,
  error,
}: LocationVerificationWidgetProps) {
  const [activeTab, setActiveTab] = useState<"search" | "manual" | "map">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [verifyingManual, setVerifyingManual] = useState(false);
  const [currentLocLoading, setCurrentLocLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [widgetError, setWidgetError] = useState("");

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close autocomplete dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch address suggestions for autocomplete
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Autocomplete search error:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSuggestionSelect = (item: any) => {
    // Parse street from suggestion label
    const parts = item.label.split(",");
    const street = parts[0]?.trim() || "";
    
    const updated: LocationData = {
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
    };

    onChange(updated);
    setSearchQuery(item.label);
    setSuggestions([]);
    setWidgetError("");
  };

  const handleManualVerify = async () => {
    if (!value.street || !value.city || !value.zipCode) {
      setWidgetError("Please fill out Street, City, and ZIP code first.");
      return;
    }

    setVerifyingManual(true);
    setWidgetError("");

    try {
      const fullQuery = `${value.street}, ${value.city}, ${value.state} ${value.zipCode}`;
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(fullQuery)}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const bestMatch = data[0];
          onChange({
            ...value,
            latitude: bestMatch.lat,
            longitude: bestMatch.lng,
            formattedAddress: bestMatch.label,
            locationVerificationMethod: "MANUAL_GEOCODED",
            locationVerifiedAt: new Date().toISOString(),
          });
        } else {
          setWidgetError("We couldn’t verify this address. Please select it from the map, use your current location, or enter a more complete address.");
        }
      } else {
        setWidgetError("Address verification service is temporarily unavailable.");
      }
    } catch (err) {
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
        } catch (err) {
          setWidgetError("Reverse geocoding failed, but coordinates are saved.");
        } finally {
          setCurrentLocLoading(false);
        }
      },
      (err) => {
        setCurrentLocLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setWidgetError("Location permission was denied. Please select the address on the map or verify the address manually.");
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
    } catch (err) {
      console.error("Map pin lookup error:", err);
    }
  };

  const isVerified = value.latitude !== null && value.longitude !== null && value.locationVerificationMethod !== "";

  return (
    <div 
      className="rounded-2xl p-4 sm:p-8 shadow-md transition-all relative border-2"
      style={{
        borderColor: error ? "rgba(220,38,38,0.5)" : "rgba(0, 2, 35, 0.08)",
        background: error ? "rgba(255,240,240,0.90)" : "rgba(255,255,255,0.82)"
      }}
    >
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100" style={{ borderColor: error ? "rgba(220,38,38,0.15)" : "rgba(0,2,35,0.05)" }}>
        <label className="text-lg sm:text-xl font-black tracking-wide" style={{ color: error ? "#DC2626" : "#000223" }}>{label}</label>
        
        {/* Verification Status Badge */}
        {isVerified ? (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-full border border-emerald-200 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-full border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Needs Verification</span>
          </div>
        )}
      </div>

      {/* Widget Error Notification */}
      {(widgetError || error) && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-sm sm:text-base font-bold flex items-start gap-2.5 shadow-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-rose-600" />
          <span>{widgetError || error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mb-5">
        <button
          type="button"
          onClick={() => setActiveTab("search")}
          className={`py-2.5 sm:py-3.5 px-1 sm:px-4 text-[11px] min-[350px]:text-xs sm:text-sm font-black rounded-xl border-2 transition-all flex items-center justify-center gap-1 sm:gap-2 ${
            activeTab === "search"
              ? "bg-[#000223] text-[#FFA000] border-[#000223] shadow-md"
              : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">Search</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`py-2.5 sm:py-3.5 px-1 sm:px-4 text-[11px] min-[350px]:text-xs sm:text-sm font-black rounded-xl border-2 transition-all flex items-center justify-center gap-1 sm:gap-2 ${
            activeTab === "manual"
              ? "bg-[#000223] text-[#FFA000] border-[#000223] shadow-md"
              : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">Manual</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("map")}
          className={`py-2.5 sm:py-3.5 px-1 sm:px-4 text-[11px] min-[350px]:text-xs sm:text-sm font-black rounded-xl border-2 transition-all flex items-center justify-center gap-1 sm:gap-2 ${
            activeTab === "map"
              ? "bg-[#000223] text-[#FFA000] border-[#000223] shadow-md"
              : "bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">Map Pin</span>
        </button>
      </div>

      {/* Geolocation shortcut */}
      <div className="mb-5">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={currentLocLoading}
          className="w-full py-3.5 px-5 bg-amber-50/50 hover:bg-amber-50 border-2 border-amber-200/60 text-[#000223] rounded-xl text-sm sm:text-base font-black hover:border-amber-300 transition-all flex items-center justify-center gap-2.5 shadow-sm"
        >
          {currentLocLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#FFA000]" />
          ) : (
            <Compass className="w-5 h-5 text-[#FFA000]" />
          )}
          Use My Current Location
        </button>
      </div>

      {/* Search Tab Content */}
      {activeTab === "search" && (
        <div ref={searchContainerRef} className="relative">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Start typing your MA event address..."
              className="w-full py-4.5 pl-12 pr-12 rounded-xl border-2 border-slate-250 font-bold text-base sm:text-lg outline-none shadow-sm focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 bg-white"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {loadingSuggestions && (
              <Loader2 className="w-5 h-5 animate-spin text-[#FFA000] absolute right-4 top-1/2 -translate-y-1/2" />
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto divide-y divide-slate-100">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionSelect(item)}
                  className="w-full text-left px-5 py-3.5 text-sm sm:text-base hover:bg-amber-50/40 font-bold text-slate-800 transition-colors block"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manual Tab Content */}
      {activeTab === "manual" && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs sm:text-sm font-bold text-blue-800 flex items-center gap-2">
            <span>💡</span> Fill in your address below then click <strong>Verify & Calculate Distance</strong> — we'll locate it on the map automatically.
          </div>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">City</label>
              <input
                type="text"
                value={value.city}
                onChange={(e) => onChange({ ...value, city: e.target.value, latitude: null, longitude: null, locationVerificationMethod: "" })}
                placeholder="Boston"
                className="w-full py-4 px-4 rounded-xl border-2 border-slate-200 font-bold text-base sm:text-lg focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 bg-white outline-none"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-black text-slate-700 mb-1.5 uppercase tracking-wide">ZIP Code</label>
              <input
                type="text"
                value={value.zipCode}
                onChange={(e) => {
                  const z = e.target.value;
                  onChange({ ...value, zipCode: z, latitude: null, longitude: null, locationVerificationMethod: "" });
                }}
                placeholder="02111"
                maxLength={5}
                className="w-full py-4 px-4 rounded-xl border-2 border-slate-200 font-bold text-base sm:text-lg focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 bg-white outline-none"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualVerify}
            disabled={verifyingManual || !value.street || !value.zipCode}
            className="w-full py-4 bg-[#FFA000] hover:bg-[#E08B00] disabled:opacity-50 text-[#000223] font-black rounded-xl text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 shadow-md"
          >
            {verifyingManual && <Loader2 className="w-5 h-5 animate-spin text-[#000223]" />}
            {verifyingManual ? "Locating on map…" : "✓ Verify Address & Calculate Distance"}
          </button>
        </div>
      )}

      {/* Map Tab Content */}
      {activeTab === "map" && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-600">Click on the map to pin the exact event setup location:</p>
          <div className="h-72 rounded-xl overflow-hidden border-2 border-slate-200 relative shadow-inner">
            <LeafletMap lat={value.latitude} lng={value.longitude} onMapClick={handleMapPin} />
          </div>
        </div>
      )}

      {/* Formatted address preview if verified */}
      {isVerified && value.formattedAddress && (
        <div className="mt-5 p-4.5 bg-emerald-50/50 border-2 border-emerald-100 rounded-xl flex items-start gap-3.5 text-sm font-bold text-emerald-950 shadow-sm animate-fade-in">
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

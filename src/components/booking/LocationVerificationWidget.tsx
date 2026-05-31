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
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all relative">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
        <label className="text-base font-bold text-[#000223]">{label}</label>
        
        {/* Verification Status Badge */}
        {isVerified ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Needs verification</span>
          </div>
        )}
      </div>

      {/* Widget Error Notification */}
      {(widgetError || error) && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{widgetError || error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("search")}
          className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "search"
              ? "bg-[#000223] text-[#FFA000] border-[#000223]"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "manual"
              ? "bg-[#000223] text-[#FFA000] border-[#000223]"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          Manual
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("map")}
          className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "map"
              ? "bg-[#000223] text-[#FFA000] border-[#000223]"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          Map Pin
        </button>
      </div>

      {/* Geolocation shortcut */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={currentLocLoading}
          className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
        >
          {currentLocLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#FFA000]" />
          ) : (
            <Compass className="w-4 h-4 text-[#FFA000]" />
          )}
          Use Current Location
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
              placeholder="Start typing address..."
              className="w-full py-3 pl-10 pr-4 rounded-xl border border-slate-250 font-semibold text-base outline-none shadow-sm focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/10"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            {loadingSuggestions && (
              <Loader2 className="w-4 h-4 animate-spin text-[#FFA000] absolute right-3.5 top-4" />
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-60 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionSelect(item)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0 font-medium text-slate-800 transition-colors block"
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
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Street Address</label>
            <input
              type="text"
              value={value.street}
              onChange={(e) => onChange({ ...value, street: e.target.value, latitude: null, longitude: null, locationVerificationMethod: "" })}
              placeholder="e.g. 139 Tremont St"
              className="w-full py-2.5 px-3 rounded-lg border border-slate-250 text-sm font-semibold focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/5"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">City</label>
              <input
                type="text"
                value={value.city}
                onChange={(e) => onChange({ ...value, city: e.target.value, latitude: null, longitude: null, locationVerificationMethod: "" })}
                placeholder="Boston"
                className="w-full py-2.5 px-3 rounded-lg border border-slate-250 text-sm font-semibold focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/5"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">ZIP Code</label>
              <input
                type="text"
                value={value.zipCode}
                onChange={(e) => onChange({ ...value, zipCode: e.target.value, latitude: null, longitude: null, locationVerificationMethod: "" })}
                placeholder="02111"
                className="w-full py-2.5 px-3 rounded-lg border border-slate-250 text-sm font-semibold focus:border-[#FFA000] focus:ring-2 focus:ring-[#FFA000]/5"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualVerify}
            disabled={verifyingManual}
            className="w-full py-3 bg-[#FFA000] hover:bg-[#E08B00] text-[#000223] font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {verifyingManual && <Loader2 className="w-4 h-4 animate-spin text-[#000223]" />}
            Verify Address & Calculate Distance
          </button>
        </div>
      )}

      {/* Map Tab Content */}
      {activeTab === "map" && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 font-medium">Click on the map to pin the exact event setup location:</p>
          <div className="h-64 rounded-lg overflow-hidden border border-slate-200 relative">
            <LeafletMap lat={value.latitude} lng={value.longitude} onMapClick={handleMapPin} />
          </div>
        </div>
      )}

      {/* Formatted address preview if verified */}
      {isVerified && value.formattedAddress && (
        <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-2.5 text-xs font-semibold text-slate-600">
          <MapPin className="w-4 h-4 text-[#FFA000] shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-800 block mb-0.5">Confirmed Address:</span>
            <span>{value.formattedAddress}</span>
            <span className="block mt-1 text-[10px] text-slate-400">
              Method: {value.locationVerificationMethod.replace("_", " ")} ({value.latitude?.toFixed(5)}, {value.longitude?.toFixed(5)})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

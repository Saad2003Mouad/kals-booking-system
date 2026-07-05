"use client";
import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { calcDistance } from "@/lib/maps";

const PremiumMap = dynamic(() => import("./PremiumMap"), { ssr: false });

interface MapPickerProps {
  lat: number | null;
  lng: number | null;
  address: string;
  onLocationChange: (lat: number, lng: number, address: string, city: string, zip: string, drivingMiles: number, travelFee: number) => void;
}

export default function MapPicker({ lat, lng, address, onLocationChange }: MapPickerProps) {
  const [loading, setLoading] = useState(false);
  const [dist, setDist]       = useState<{ drivingMiles: number; travelFee: number } | null>(null);

  const handleMapClick = async (clickedLat: number, clickedLng: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/geocode/reverse?lat=${clickedLat}&lng=${clickedLng}`);
      const geo = res.ok ? await res.json() : null;
      const addr = geo?.displayName ?? `${clickedLat.toFixed(5)}, ${clickedLng.toFixed(5)}`;
      const city = geo?.city ?? "";
      const zip  = geo?.zip  ?? "";
      const d = calcDistance(clickedLat, clickedLng);
      setDist(d);
      onLocationChange(clickedLat, clickedLng, addr, city, zip, d.drivingMiles, d.travelFee);
    } finally {
      setLoading(false);
    }
  };

  const goToCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: la, longitude: lo } = pos.coords;
      try {
        const res = await fetch(`/api/geocode/reverse?lat=${la}&lng=${lo}`);
        const geo = res.ok ? await res.json() : null;
        const addr = geo?.displayName ?? "";
        const city = geo?.city ?? "";
        const zip  = geo?.zip ?? "";
        const d = calcDistance(la, lo);
        setDist(d);
        onLocationChange(la, lo, addr, city, zip, d.drivingMiles, d.travelFee);
      } finally {
        setLoading(false);
      }
    }, () => setLoading(false));
  };

  // Keep dist updated if props change externally
  useEffect(() => {
    if (lat && lng && !dist) {
      setDist(calcDistance(lat, lng));
    }
  }, [lat, lng, dist]);

  return (
    <div className="relative rounded-3xl overflow-hidden border-2 border-amber-200 shadow-md transition-all hover:shadow-lg group" style={{ height: 400 }}>
      {/* Map layer */}
      <div className="absolute inset-0">
        <PremiumMap lat={lat} lng={lng} onMapClick={handleMapClick} />
      </div>

      {/* Loading overlay wrapper */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center transition-all">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#FFA000" }}/>
            <span className="font-bold text-sm" style={{ color: "#000223" }}>Pinning location…</span>
          </div>
        </div>
      )}

      {/* Info Badge (Distance & Fee) */}
      {dist && dist.drivingMiles > 0 && (
        <div className="absolute top-4 left-4 z-10 glass-card-light px-4 py-2.5 flex items-center gap-2 text-sm font-black transition-all animate-in fade-in slide-in-from-top-4" style={{ color: "#000223", background: "rgba(255,255,255,0.9)" }}>
          <Navigation className="w-4 h-4 text-[#FFA000]"/>
          {dist.drivingMiles.toFixed(1)} mi est.
          {dist.travelFee > 0 ? (
            <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md ml-1">+${dist.travelFee.toFixed(2)}</span>
          ) : (
            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md ml-1">Free Travel</span>
          )}
        </div>
      )}

      {/* Action buttons wrapper */}
      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <button type="button" onClick={goToCurrentLocation}
          className="glass-card-light px-3 py-2.5 sm:px-4 sm:py-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold hover:bg-white hover:scale-105 transition-all animate-fade-in"
          style={{ color: "#000223", background: "rgba(255,255,255,0.9)" }}>
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFA000]"/> Pin My Event Location
        </button>
      </div>
      {/* Origin note */}
      <div className="absolute bottom-4 right-4 z-10 bg-white/90 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 shadow hidden sm:block">
        📍 Distance from: Boston Revere — 84 Fernwood Ave
      </div>

      {/* Helpful hint overlay if no location set */}
      {!lat && !loading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="bg-[#000223]/90 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
            <span className="text-xl animate-bounce">👆</span>
            <span className="font-bold text-sm text-white">Click map to pin event location</span>
          </div>
        </div>
      )}
    </div>
  );
}

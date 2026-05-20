"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BASE_LOCATION } from "@/lib/maps";

// Fix missing Leaflet default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Premium Markers
const BaseIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: `<div style="background:linear-gradient(135deg,#000223,#FFA000);color:#FFA000;border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 8px 24px rgba(0,26,76,0.5);border:3px solid white;transition:all 0.3s;animation:bounce-in 0.5s ease-out;">🏠</div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const DestIcon = L.divIcon({
  className: "custom-leaflet-icon",
  html: `<div style="background:linear-gradient(135deg,#FFA000,#FFD166);border-radius:50% 50% 50% 0;width:40px;height:40px;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(245,166,35,0.6);border:3px solid white;animation:bounce-in 0.5s ease-out;"><span style="transform:rotate(45deg);font-size:16px;">📍</span></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface PremiumMapProps {
  lat: number | null;
  lng: number | null;
  onMapClick: (lat: number, lng: number) => void;
}

function MapEvents({ onMapClick, activeLat, activeLng }: { onMapClick: (lat: number, lng: number) => void; activeLat: number | null; activeLng: number | null }) {
  const map = useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onMapClick(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom(), { animate: true, duration: 0.8 });
    },
  });

  // Pan to marker if props change from outside (e.g., zip autocomplete)
  useEffect(() => {
    if (activeLat && activeLng) {
      map.flyTo([activeLat, activeLng], 14, { animate: true, duration: 1.2 });
    }
  }, [activeLat, activeLng, map]);

  return null;
}

export default function PremiumMap({ lat, lng, onMapClick }: PremiumMapProps) {
  // Always center on Base if no lat/lng provided initially, otherwise center on provided
  const centerLat = lat ?? BASE_LOCATION.lat;
  const centerLng = lng ?? BASE_LOCATION.lng;

  return (
    <div style={{ height: "100%", width: "100%", position: "relative", zIndex: 1 }}>
      {/* Global styles for Leaflet overrides */}
      <style>{`
        .leaflet-container { background: #f8f9fc; font-family: 'Plus Jakarta Sans', sans-serif; }
        .leaflet-control-zoom { border: none !important; box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; border-radius: 12px !important; overflow: hidden; margin: 16px !important; }
        .leaflet-control-zoom a { background: rgba(255,255,255,0.9) !important; backdrop-filter: blur(12px); color: #000223 !important; width: 36px !important; height: 36px !important; line-height: 36px !important; transition: all 0.2s !important; border-bottom: 1px solid rgba(0,0,0,0.05) !important; }
        .leaflet-control-zoom a:hover { background: #000223 !important; color: #FFA000 !important; }
        .leaflet-control-attribution { background: rgba(255,255,255,0.7) !important; backdrop-filter: blur(4px); border-radius: 4px 0 0 0; font-size: 9px !important; color: #9CA3AF !important; }
        .leaflet-control-attribution a { color: #000223 !important; }
        @keyframes bounce-in { 0% { transform: scale(0.3) translateY(20px); opacity: 0; } 50% { transform: scale(1.1) translateY(-5px); } 100% { transform: scale(1) translateY(0); opacity: 1; } }
      `}</style>
      
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={lat ? 14 : 11}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={20}
        />
        
        {/* Custom Zoom Control Positioned elegantly */}
        <ZoomControl position="bottomright" />

        {/* Base Marker */}
        <Marker position={[BASE_LOCATION.lat, BASE_LOCATION.lng]} icon={BaseIcon} />

        {/* Destination Marker */}
        {lat && lng && (
          <Marker position={[lat, lng]} icon={DestIcon} />
        )}

        <MapEvents onMapClick={onMapClick} activeLat={lat} activeLng={lng} />
      </MapContainer>
    </div>
  );
}

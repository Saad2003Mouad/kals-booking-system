import BookingForm from "@/components/booking/BookingForm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Suspense } from "react";

export const metadata = {
  title: "Book Your Ice Cream Truck | Boston Legend",
  description: "Reserve your Boston Legend ice cream truck — instant quote, real-time availability, map-based location picker.",
};

export default function BookingPage() {
  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      
      {/* Decorative Background Image & Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden flex items-center justify-center bg-amber-50">
        <img 
          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6806e0e50044373b2a3731cd_3f0ed1b4c359e3e652e232aa0100b911_boston-legend-ice-cream-truck-service-bg.avif" 
          alt="" 
          className="absolute inset-0 min-w-full min-h-full object-cover opacity-80"
        />
        <div 
          className="absolute top-[-5%] left-[-5%] w-[450px] h-[450px] bg-[#F59E0B] opacity-90"
          style={{ animation: 'organicBlob1 15s ease-in-out infinite alternate' }}
        ></div>
        <div 
          className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-[#FF4081] opacity-90"
          style={{ animation: 'organicBlob2 18s ease-in-out infinite alternate-reverse' }}
        ></div>
      </div>

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", flex: 1 }}>
        <SiteHeader />

        {/* Hero strip without blue background */}
        <div style={{ padding: "48px 24px 12px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 999, marginBottom: 16,
              background: "white", border: "1px solid rgba(255,160,0,0.5)",
              color: "#FFA000", fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}>
              Boston Legend · Reserve Your Truck
            </div>
            <h1 style={{ color: "#000223", fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.15 }}>
              Book Your Ice Cream Experience
            </h1>
            <p style={{ color: "#4B5563", fontSize: 16, fontWeight: 800, margin: 0 }}>
              Get an instant quote · Check real-time availability · Confirm in minutes
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div style={{ flex: 1, padding: "20px 16px 60px" }}>
          <Suspense fallback={
            <div style={{ textAlign: "center", padding: 60 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🍦</div>
              <p style={{ color: "#9CA3AF", fontWeight: 700 }}>Loading booking form…</p>
            </div>
          }>
            <BookingForm />
          </Suspense>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

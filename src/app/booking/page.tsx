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
    <div style={{ fontFamily: "var(--font-sans), sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      
      {/* Decorative Background Image & Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden flex items-center justify-center bg-[#FAF8F5]">
        <img 
          src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/6806e0e50044373b2a3731cd_3f0ed1b4c359e3e652e232aa0100b911_boston-legend-ice-cream-truck-service-bg.avif" 
          alt="" 
          className="absolute inset-0 min-w-full min-h-full object-cover opacity-30"
        />
        {/* Amber Blob */}
        <div 
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#F59E0B] opacity-[0.35] blur-[100px] sm:blur-[140px]"
          style={{ animation: 'organicBlob1 25s ease-in-out infinite alternate' }}
        ></div>
        {/* Violet/Magenta Blob */}
        <div 
          className="absolute bottom-[10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[#FF4081] opacity-[0.25] blur-[120px] sm:blur-[160px]"
          style={{ animation: 'organicBlob2 28s ease-in-out infinite alternate-reverse' }}
        ></div>
        {/* Light Blue Blob */}
        <div 
          className="absolute top-[40%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#06B6D4] opacity-[0.18] blur-[100px]"
          style={{ animation: 'organicBlob1 20s ease-in-out infinite alternate-reverse' }}
        ></div>
      </div>

      <div className="relative w-full z-10 flex flex-col flex-grow">
        {/* Header accent: yellow left → pink right */}
        <div className="absolute top-0 left-0 right-0 h-[80px] z-0 pointer-events-none overflow-hidden">
          {/* Yellow glow — logo area (left) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "260px",
              height: "100%",
              background: "linear-gradient(135deg, #FFD600 0%, #FFEC5C 60%, transparent 100%)",
              opacity: 0.92,
              borderBottomRightRadius: "60px",
            }}
          />
          {/* Pink/rose glow — right side */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "260px",
              height: "100%",
              background: "linear-gradient(225deg, #FF3CAC 0%, #FF85C2 60%, transparent 100%)",
              opacity: 0.85,
              borderBottomLeftRadius: "60px",
            }}
          />
        </div>
        <div className="relative z-10">
          <SiteHeader />
        </div>

        {/* Hero strip without blue background */}
        <div className="py-12 px-6 sm:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 20px", borderRadius: 999, marginBottom: 20,
              background: "white", border: "1px solid rgba(255, 160, 0, 0.4)",
              color: "#FFA000", fontSize: 13, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase",
              boxShadow: "0 6px 20px rgba(255, 160, 0, 0.08)"
            }}>
              ✨ Boston Legend · Reserve Your Experience
            </div>
            <h1 className="text-[#000223] text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6">
              Book Your Ice Cream Experience
            </h1>
            <p className="text-slate-700 text-lg sm:text-xl font-bold max-w-2xl mx-auto">
              Get an instant quote · Check real-time availability · Confirm in minutes
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="w-full flex-grow px-4 sm:px-6 md:px-8 pb-20 flex justify-center">
          <div className="w-full max-w-6xl">
            <Suspense fallback={
              <div className="text-center py-24 bg-white/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl max-w-3xl mx-auto">
                <div className="text-6xl mb-6 animate-bounce">🍦</div>
                <p className="text-slate-650 text-xl font-black">Loading your custom booking experience…</p>
              </div>
            }>
              <BookingForm />
            </Suspense>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

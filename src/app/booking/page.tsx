import BookingForm from "@/components/booking/BookingForm";
import Navigation from "@/components/Navigation";
import SiteFooter from "@/components/SiteFooter";
import { Suspense } from "react";

export const metadata = {
  title: "Book Your Ice Cream Truck | Boston Legend",
  description: "Reserve your Boston Legend ice cream truck — instant quote, real-time availability, map-based location picker.",
};

export default function BookingPage() {
  return (
    <div className="page min-h-screen flex flex-col relative" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
      
      <div className="relative w-full z-10 flex flex-col flex-grow">
        <div style={{ position: "relative", zIndex: 25 }}>
          <Navigation portalType="public" />
        </div>

        <section className="page-head">
          <div className="w-layout-blockcontainer container w-container">
            <h1 className="h1-page-hed">
              <span className="page-titel-top">Boston Legend </span>
              <br />
              Book Your 
              <br />
              <span className="title-event">Experience</span>
            </h1>
            <img 
              src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681d4ed9eee047f1fa20bfc9_decore-line.avif" 
              loading="lazy" 
              width="426" 
              height="36" 
              alt="" 
              className="h1-page-line" 
            />
          </div>
        </section>

        <div className="text-center max-w-2xl mx-auto mt-6 mb-10 px-4">
          <p className="text-slate-700 text-lg sm:text-xl font-bold">
            Get an instant quote · Check real-time availability · Confirm in minutes
          </p>
          <p className="mt-3 text-sm text-slate-500 font-semibold">
            Already booked?{" "}
            <a href="/manage-booking" className="text-[#FFA000] font-black hover:underline">
              Manage your booking here →
            </a>
          </p>
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

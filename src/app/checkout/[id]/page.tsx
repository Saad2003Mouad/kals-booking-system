import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed | Boston Legend Ice Cream Truck",
  description: "Your ice cream truck has been reserved. Get ready for a legendary event!",
};

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      package: true,
      vehicle: true,
      quote: true,
      customer: true,
    },
  });

  if (!booking) notFound();

  const eventDate = new Date(booking.eventDate + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const statusMap: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
    PENDING:   { label: "Pending Review",  color: "#92400E", bg: "#FEF3C7", emoji: "⏳" },
    CONFIRMED: { label: "Confirmed",       color: "#065F46", bg: "#D1FAE5", emoji: "✅" },
    CANCELLED: { label: "Cancelled",       color: "#991B1B", bg: "#FEE2E2", emoji: "❌" },
  };
  const statusInfo = statusMap[booking.status] ?? statusMap.PENDING;

  return (
    <div className="min-h-screen" style={{ background: "#F4F4F5", fontFamily: "'Nunito', sans-serif" }}>

      {/* ── TOP NAV ── */}
      <div style={{ background: "#000223" }}>
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="https://www.bostonlegendicecreamtruck.com">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO} alt="Boston Legend" style={{ height: 36, width: "auto" }} />
          </a>
          <a href="/booking"
            className="text-xs font-black px-4 py-2 rounded-full transition-all hover:opacity-90"
            style={{ background: "#FFA000", color: "#000223" }}>
            New Booking
          </a>
        </div>
      </div>

      {/* ── HERO STRIP ── */}
      <div style={{ background: "linear-gradient(135deg, #FFA000 0%, #FFB300 100%)" }}>
        <div className="max-w-2xl mx-auto px-6 py-10 text-center">
          <div className="text-5xl mb-3">🍦</div>
          <h1 className="text-3xl font-black" style={{ color: "#000223" }}>Booking Confirmed!</h1>
          <p className="text-base font-bold mt-2" style={{ color: "rgba(0,2,35,0.65)" }}>
            Get ready for a legendary sweet experience.
          </p>
        </div>
      </div>

      {/* ── MAIN CARD ── */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

        {/* Confirmation Number */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
          <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Confirmation Number</div>
          <div className="text-3xl font-black" style={{ color: "#000223" }}>#{booking.bookingNumber}</div>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black"
            style={{ background: statusInfo.bg, color: statusInfo.color }}>
            {statusInfo.emoji} {statusInfo.label}
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-5">Event Details</h2>
          <div className="space-y-4">
            {[
              { label: "Date",     value: eventDate },
              { label: "Time",     value: booking.startTime },
              { label: "Duration", value: `${booking.durationMins} minutes` },
              { label: "Guests",   value: `${booking.guests} people` },
              { label: "Type",     value: "Special Event" },
              { label: "Address",  value: `${booking.address}, ${booking.city}, MA ${booking.zip}` },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-start gap-4">
                <span className="text-sm font-bold text-gray-400 flex-shrink-0">{row.label}</span>
                <span className="text-sm font-black text-right" style={{ color: "#000223" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Package & Vehicle */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-5">Package & Vehicle</h2>
          <div className="space-y-4">
            {booking.package && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400">Package</span>
                <span className="text-sm font-black" style={{ color: "#000223" }}>{booking.package.name}</span>
              </div>
            )}
            {booking.vehicle && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400">Vehicle</span>
                <span className="text-sm font-black" style={{ color: "#000223" }}>{booking.vehicle.name}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="text-sm font-black text-gray-500">Total</span>
              <span className="text-xl font-black" style={{ color: "#000223" }}>
                ${Number(booking.quote?.totalAmount ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer */}
        {booking.customer && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-5">Customer</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400">Name</span>
                <span className="text-sm font-black" style={{ color: "#000223" }}>
                  {booking.customer.firstName} {booking.customer.lastName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400">Email</span>
                <span className="text-sm font-semibold text-gray-600">{booking.customer.email ?? "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-400">Phone</span>
                <a href={`tel:${booking.customer.phone}`} className="text-sm font-black hover:text-[#FFA000] transition-colors" style={{ color: "#000223" }}>
                  {booking.customer.phone}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #000223 0%, #001a4c 100%)" }}>
          <h2 className="font-black text-sm text-white mb-4">What happens next?</h2>
          <div className="space-y-3">
            {[
              { step: "1", text: "Our team will review your booking within 24 hours." },
              { step: "2", text: "You'll receive a confirmation email at " + (booking.customer?.email ?? "your email") + "." },
              { step: "3", text: "A driver will be assigned closer to your event date." },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black" style={{ background: "#FFA000", color: "#000223" }}>
                  {item.step}
                </div>
                <p className="text-sm font-semibold text-white/80 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pb-8">
          <a href="https://www.bostonlegendicecreamtruck.com"
            className="flex-1 py-4 rounded-xl font-black text-sm text-center transition-all hover:opacity-90"
            style={{ background: "#000223", color: "#FFA000" }}>
            ← Back to Website
          </a>
          <a href="/booking"
            className="flex-1 py-4 rounded-xl font-black text-sm text-center transition-all hover:opacity-90"
            style={{ background: "#FFA000", color: "#000223" }}>
            Book Another Event 🍦
          </a>
        </div>
      </div>
    </div>
  );
}

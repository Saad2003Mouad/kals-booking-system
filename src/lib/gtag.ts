/**
 * Google Analytics 4 + Google Ads tracking helpers.
 * Usage (client components):
 *   import { trackBookingSubmit, trackOtpSuccess, trackLead } from "@/lib/gtag";
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
export const AW_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";

// ─── Core gtag wrapper ─────────────────────────────────────────
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

function gtag(...args: any[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

// ─── Page View ────────────────────────────────────────────────
export function trackPageView(url: string) {
  if (!GA_ID) return;
  gtag("config", GA_ID, { page_path: url });
}

// ─── BOOKING EVENTS ───────────────────────────────────────────

/** Fired when booking form is submitted (Step 1: lead captured) */
export function trackBookingSubmit(params: {
  packageName: string;
  guests: number;
  city: string;
  totalEstimate: number;
}) {
  gtag("event", "booking_submitted", {
    event_category: "Booking",
    event_label: params.packageName,
    value: params.totalEstimate,
    currency: "USD",
    package_name: params.packageName,
    guest_count: params.guests,
    city: params.city,
  });

  // Google Ads conversion — Booking Lead
  if (AW_ID) {
    gtag("event", "conversion", {
      send_to: `${AW_ID}/booking_lead`,
      value: params.totalEstimate,
      currency: "USD",
    });
  }
}

/** Fired when booking OTP is verified (strong intent signal) */
export function trackOtpSuccess(purpose: string) {
  gtag("event", "otp_verified", {
    event_category: "OTP",
    event_label: purpose,
  });
}

/** Fired when booking is fully confirmed (CONFIRMED status) */
export function trackBookingConfirmed(params: {
  bookingNumber: string;
  packageName: string;
  totalAmount: number;
}) {
  gtag("event", "purchase", {
    event_category: "Booking",
    transaction_id: params.bookingNumber,
    value: params.totalAmount,
    currency: "USD",
    items: [{ item_name: params.packageName, price: params.totalAmount, quantity: 1 }],
  });

  // Google Ads conversion — Booking Confirmed
  if (AW_ID) {
    gtag("event", "conversion", {
      send_to: `${AW_ID}/booking_confirmed`,
      transaction_id: params.bookingNumber,
      value: params.totalAmount,
      currency: "USD",
    });
  }
}

// ─── LEAD EVENTS ──────────────────────────────────────────────

/** Fired when inquiry/contact form is submitted */
export function trackLead(source: string) {
  gtag("event", "generate_lead", {
    event_category: "Lead",
    event_label: source,
  });

  if (AW_ID) {
    gtag("event", "conversion", {
      send_to: `${AW_ID}/contact_form_lead`,
    });
  }
}

// ─── REVIEW EVENTS ────────────────────────────────────────────

/** Fired when user clicks the Google Review button */
export function trackReviewClick() {
  gtag("event", "review_click", {
    event_category: "Reviews",
    event_label: "Google Review Button",
  });
}

// ─── THANK YOU PAGE EVENTS ────────────────────────────────────

/** Fired on /thank-you page load after booking submission */
export function trackThankYouPage(bookingNumber: string) {
  gtag("event", "booking_thank_you", {
    event_category: "Booking",
    event_label: bookingNumber,
  });

  if (AW_ID) {
    gtag("event", "conversion", {
      send_to: `${AW_ID}/thank_you_page`,
    });
  }
}

// ─── STAFF INVITE EVENTS ──────────────────────────────────────
export function trackStaffInviteAccepted() {
  gtag("event", "staff_invite_accepted", {
    event_category: "Admin",
    event_label: "Staff Invite",
  });
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Hash,
  Loader2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const LOGO =
  "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

type Step = "lookup" | "otp" | "success";

export default function ManageBookingPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("lookup");
  const [bookingNumber, setBookingNumber] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    setCountdown(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!bookingNumber.trim() || !email.trim()) {
      setError("Please enter your booking number and email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/customer/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingNumber: bookingNumber.trim(),
          email: email.trim(),
        }),
      });
      const data = await res.json();
      // Dev: capture devCode if returned somehow (not in this route but safe fallback)
      if (data.devCode) setDevCode(data.devCode);
      // Always move to OTP step (generic response)
      setStep("otp");
      startCountdown();
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError("");
    setLoading(true);
    try {
      await fetch("/api/customer/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingNumber: bookingNumber.trim(),
          email: email.trim(),
        }),
      });
      startCountdown();
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleOtpDigit = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (next.every((d) => d) && next.join("").length === 6) {
      submitOtp(next.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      const next = paste.split("");
      setOtp(next);
      otpRefs.current[5]?.focus();
      submitOtp(paste);
    }
    e.preventDefault();
  };

  const submitOtp = async (code: string) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/customer/bookings/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingNumber: bookingNumber.trim(),
          email: email.trim(),
          otp: code,
        }),
      });
      const data = await res.json();
      if (data.success && data.customerPortalUrl) {
        setStep("success");
        setTimeout(() => {
          router.push(data.customerPortalUrl);
        }, 1500);
      } else {
        setError(
          data.message ||
            "We couldn't verify this code. Please check and try again."
        );
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
      }
    } catch {
      setError("Network error. Please try again.");
      setOtp(["", "", "", "", "", ""]);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #FAF8F2 0%, #FFF9EC 50%, #FAF6EF 100%)",
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#000223",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 24px rgba(0,2,35,0.18)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/">
            <img src={LOGO} alt="Boston Legend" style={{ height: 44, width: "auto" }} />
          </Link>
          <Link
            href="/booking"
            style={{
              background: "#FFA000",
              color: "#000223",
              fontWeight: 900,
              fontSize: 13,
              padding: "10px 22px",
              borderRadius: 999,
              textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(255,160,0,0.3)",
            }}
          >
            Book an Event
          </Link>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 16px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 520 }}>
          {/* Title block */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#FFF8E1",
                border: "1px solid rgba(255,160,0,0.35)",
                borderRadius: 999,
                padding: "7px 18px",
                fontSize: 12,
                fontWeight: 900,
                color: "#FFA000",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              🍦 Boston Legend
            </div>
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 40px)",
                fontWeight: 900,
                color: "#000223",
                margin: "0 0 14px",
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
              }}
            >
              Manage Your Booking
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "#64748B",
                fontWeight: 600,
                lineHeight: 1.65,
                margin: 0,
                maxWidth: 440,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Enter your booking number and the email address used for your
              request. For your privacy, we'll send a secure verification code
              before showing your booking details.
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 28,
              padding: "clamp(28px, 6vw, 48px)",
              border: "1.5px solid rgba(0,2,35,0.07)",
              boxShadow:
                "0 8px 32px rgba(0,2,35,0.06), 0 2px 8px rgba(0,2,35,0.04)",
            }}
          >
            {/* ── STEP: LOOKUP ─────────────────────── */}
            {step === "lookup" && (
              <form onSubmit={handleLookup} noValidate>
                <div style={{ marginBottom: 24 }}>
                  <label
                    htmlFor="booking-number"
                    style={{
                      display: "block",
                      fontWeight: 800,
                      fontSize: 13,
                      color: "#000223",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Booking Number
                  </label>
                  <div style={{ position: "relative" }}>
                    <Hash
                      style={{
                        position: "absolute",
                        left: 16,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 18,
                        height: 18,
                        color: "#FFA000",
                        flexShrink: 0,
                      }}
                    />
                    <input
                      id="booking-number"
                      type="text"
                      placeholder="e.g. BL-2024-001"
                      value={bookingNumber}
                      onChange={(e) =>
                        setBookingNumber(e.target.value.toUpperCase())
                      }
                      required
                      autoComplete="off"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        paddingLeft: 48,
                        paddingRight: 20,
                        paddingTop: 16,
                        paddingBottom: 16,
                        borderRadius: 16,
                        border: "2px solid rgba(0,2,35,0.1)",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#000223",
                        outline: "none",
                        fontFamily: "monospace",
                        letterSpacing: "0.05em",
                        background: "#FAFAFA",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "#FFA000")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(0,2,35,0.1)")
                      }
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      fontWeight: 800,
                      fontSize: 13,
                      color: "#000223",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail
                      style={{
                        position: "absolute",
                        left: 16,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 18,
                        height: 18,
                        color: "#FFA000",
                        flexShrink: 0,
                      }}
                    />
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        paddingLeft: 48,
                        paddingRight: 20,
                        paddingTop: 16,
                        paddingBottom: 16,
                        borderRadius: 16,
                        border: "2px solid rgba(0,2,35,0.1)",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#000223",
                        outline: "none",
                        background: "#FAFAFA",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "#FFA000")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(0,2,35,0.1)")
                      }
                    />
                  </div>
                </div>

                {error && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "#FFF1F2",
                      border: "1.5px solid #FECDD3",
                      borderRadius: 12,
                      padding: "12px 16px",
                      marginBottom: 20,
                      color: "#BE123C",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "17px 24px",
                    borderRadius: 16,
                    background: loading ? "#94A3B8" : "#000223",
                    color: "#FFA000",
                    fontWeight: 900,
                    fontSize: 16,
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition: "all 0.2s",
                    boxShadow: loading
                      ? "none"
                      : "0 6px 20px rgba(0,2,35,0.15)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2
                        style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }}
                      />
                      Sending Code…
                    </>
                  ) : (
                    <>
                      <ShieldCheck style={{ width: 20, height: 20 }} />
                      Send Verification Code
                    </>
                  )}
                </button>

                <div
                  style={{
                    marginTop: 28,
                    paddingTop: 20,
                    borderTop: "1px solid rgba(0,2,35,0.07)",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      color: "#94A3B8",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    Don't have a booking yet?{" "}
                    <Link
                      href="/booking"
                      style={{
                        color: "#FFA000",
                        fontWeight: 900,
                        textDecoration: "none",
                      }}
                    >
                      Reserve Now →
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {/* ── STEP: OTP ─────────────────────────── */}
            {step === "otp" && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 20,
                      background: "#FFFBEB",
                      border: "1.5px solid rgba(255,160,0,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                    }}
                  >
                    <Mail style={{ width: 32, height: 32, color: "#FFA000" }} />
                  </div>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 900,
                      color: "#000223",
                      margin: "0 0 10px",
                    }}
                  >
                    Enter Verification Code
                  </h2>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#64748B",
                      fontWeight: 600,
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    If your booking details match, we've sent a secure code to:
                    <br />
                    <strong style={{ color: "#FFA000", fontSize: 15 }}>
                      {email}
                    </strong>
                  </p>
                </div>

                {/* Dev mode hint */}
                {devCode && (
                  <div
                    style={{
                      background: "#EFF6FF",
                      border: "1.5px solid #BFDBFE",
                      borderRadius: 12,
                      padding: "12px 16px",
                      marginBottom: 20,
                      color: "#1E40AF",
                      fontSize: 14,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    🔧 Dev Mode:{" "}
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 18,
                        letterSpacing: 4,
                        color: "#000223",
                        background: "white",
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      {devCode}
                    </span>
                  </div>
                )}

                {/* OTP Input boxes */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "center",
                    marginBottom: 28,
                  }}
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigit(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      autoFocus={i === 0}
                      style={{
                        width: "clamp(40px, 12vw, 56px)",
                        height: "clamp(48px, 14vw, 64px)",
                        borderRadius: 14,
                        border: `2px solid ${digit ? "#FFA000" : "rgba(0,2,35,0.12)"}`,
                        background: digit ? "#FFFBEB" : "#FAFAFA",
                        fontSize: "clamp(20px, 5vw, 28px)",
                        fontWeight: 900,
                        textAlign: "center",
                        color: "#000223",
                        fontFamily: "monospace",
                        outline: "none",
                        boxShadow: digit
                          ? "0 0 0 4px rgba(255,160,0,0.12)"
                          : "none",
                        transition: "all 0.15s",
                      }}
                    />
                  ))}
                </div>

                {error && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: "#FFF1F2",
                      border: "1.5px solid #FECDD3",
                      borderRadius: 12,
                      padding: "12px 16px",
                      marginBottom: 20,
                      color: "#BE123C",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
                    {error}
                  </div>
                )}

                {/* Manual verify button */}
                {otp.every((d) => d) && !loading && (
                  <button
                    onClick={() => submitOtp(otp.join(""))}
                    style={{
                      width: "100%",
                      padding: "17px 24px",
                      borderRadius: 16,
                      background: "#000223",
                      color: "#FFA000",
                      fontWeight: 900,
                      fontSize: 16,
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      marginBottom: 16,
                      boxShadow: "0 6px 20px rgba(0,2,35,0.15)",
                    }}
                  >
                    <ArrowRight style={{ width: 20, height: 20 }} />
                    Verify &amp; Open Booking
                  </button>
                )}

                {loading && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      color: "#64748B",
                      fontWeight: 800,
                      fontSize: 15,
                      marginBottom: 16,
                    }}
                  >
                    <Loader2
                      style={{
                        width: 20,
                        height: 20,
                        color: "#FFA000",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    Verifying…
                  </div>
                )}

                {/* Resend / countdown */}
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  {countdown > 0 ? (
                    <p
                      style={{
                        fontSize: 14,
                        color: "#94A3B8",
                        fontWeight: 700,
                        margin: 0,
                      }}
                    >
                      Resend available in {countdown}s
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={loading}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        color: "#FFA000",
                        fontWeight: 900,
                        fontSize: 14,
                        padding: 0,
                      }}
                    >
                      <RotateCcw style={{ width: 16, height: 16 }} />
                      Resend Code
                    </button>
                  )}
                </div>

                <div
                  style={{
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: "1px solid rgba(0,2,35,0.07)",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      setStep("lookup");
                      setError("");
                      setOtp(["", "", "", "", "", ""]);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94A3B8",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    ← Try a different booking number
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP: SUCCESS ─────────────────────── */}
            {step === "success" && (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#F0FDF4",
                    border: "2px solid #BBF7D0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <CheckCircle2
                    style={{ width: 40, height: 40, color: "#16A34A" }}
                  />
                </div>
                <h2
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: "#000223",
                    margin: "0 0 10px",
                  }}
                >
                  Verified! Opening your booking…
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: "#64748B",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  You will be redirected to your booking portal in a moment.
                </p>
                <div style={{ marginTop: 20 }}>
                  <Loader2
                    style={{
                      width: 28,
                      height: 28,
                      color: "#FFA000",
                      margin: "0 auto",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Security note */}
          <div
            style={{
              textAlign: "center",
              marginTop: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <ShieldCheck
              style={{ width: 16, height: 16, color: "#94A3B8", flexShrink: 0 }}
            />
            <p
              style={{
                fontSize: 13,
                color: "#94A3B8",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Your booking info is protected with email verification.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(0,2,35,0.08)",
          padding: "24px 16px",
          textAlign: "center",
          background: "#FAF8F2",
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: "#94A3B8",
            fontWeight: 600,
            margin: "0 0 6px",
          }}
        >
          © {new Date().getFullYear()} Boston Legend Ice Cream Truck · Greater
          Boston, MA
        </p>
        <p style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600, margin: 0 }}>
          Need help?{" "}
          <a
            href="/contact-us"
            style={{
              color: "#FFA000",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Contact us
          </a>{" "}
          or call{" "}
          <a
            href="tel:6179993803"
            style={{ color: "#FFA000", fontWeight: 800, textDecoration: "none" }}
          >
            617-999-3803
          </a>
        </p>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: #94A3B8; font-weight: 600; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

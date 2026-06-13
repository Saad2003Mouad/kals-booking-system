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
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

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
      if (data.devCode) setDevCode(data.devCode);
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
        setError(data.message || "We couldn't verify this code. Please check and try again.");
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
    <div className="page min-h-screen flex flex-col font-['Nunito',sans-serif] bg-transparent relative overflow-x-hidden">

      <SiteHeader />

      <section className="page-head">
        <div className="w-layout-blockcontainer container w-container">
          <h1 className="h1-page-hed">
            <span className="page-titel-top">Boston Legend </span>
            <br />
            Manage Your 
            <br />
            <span className="title-event">Booking</span>
          </h1>
          <Image 
            src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681d4ed9eee047f1fa20bfc9_decore-line.avif" 
            width={426} 
            height={36} 
            alt="" 
            className="h1-page-line" 
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-6">
        
        <div className="w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="text-center mt-4 mb-8">
            <p className="text-slate-500 font-bold text-sm sm:text-base max-w-[320px] mx-auto">
              Securely access your event details, track status, and request modifications.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            
            <div>
              
              {/* ── STEP: LOOKUP ── */}
              {step === "lookup" && (
                <form onSubmit={handleLookup} className="space-y-6">
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Booking Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. BL-2024-001"
                        value={bookingNumber}
                        onChange={(e) => setBookingNumber(e.target.value.toUpperCase())}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-[#000223] focus:bg-white rounded-xl text-base font-bold text-[#000223] placeholder:text-slate-300 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-[#000223] focus:bg-white rounded-xl text-base font-bold text-[#000223] placeholder:text-slate-300 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-bold animate-in fade-in">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-[#000223] hover:bg-[#FFA000] hover:text-[#000223] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-base tracking-wide flex items-center justify-center gap-2 shadow-sm hover:shadow"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Securing Connection...</>
                    ) : (
                      <><ShieldCheck className="w-5 h-5" /> Authenticate Request</>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-sm font-bold text-slate-400">
                      Need a new booking?{" "}
                      <Link href="/packages" className="text-[#FFA000] font-black hover:underline underline-offset-4">
                        Start Here →
                      </Link>
                    </p>
                  </div>
                </form>
              )}

              {/* ── STEP: OTP ── */}
              {step === "otp" && (
                <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                      <Mail className="w-6 h-6 text-[#FFA000]" />
                    </div>
                    <h2 className="text-2xl font-black text-[#000223] mb-2">Check Your Email</h2>
                    <p className="text-sm font-bold text-slate-500 leading-relaxed">
                      We've sent a secure 6-digit code to:<br/>
                      <span className="text-[#000223] font-black">{email}</span>
                    </p>
                  </div>

                  {devCode && (
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-center">
                      <p className="text-xs font-black text-blue-400 uppercase tracking-wider mb-1">Developer Mode</p>
                      <p className="text-xl font-mono font-black text-blue-700 tracking-widest">{devCode}</p>
                    </div>
                  )}

                  <div className="flex justify-center gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigit(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        autoFocus={i === 0}
                        className={`w-10 h-12 sm:w-12 sm:h-14 rounded-xl border-2 text-center text-xl sm:text-2xl font-black font-mono transition-all outline-none ${
                          digit 
                            ? 'border-[#000223] bg-slate-50 text-[#000223]' 
                            : 'border-slate-200 bg-white text-[#000223] focus:border-[#FFA000] focus:bg-amber-50/10'
                        }`}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-bold animate-in fade-in">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  {otp.every((d) => d) && !loading && (
                    <button
                      onClick={() => submitOtp(otp.join(""))}
                      className="w-full py-3.5 rounded-xl font-bold text-[#000223] bg-[#FFA000] hover:bg-[#e69000] transition-all flex items-center justify-center gap-2 text-base shadow-sm hover:shadow"
                    >
                      <ArrowRight className="w-5 h-5" /> Verify Code
                    </button>
                  )}

                  {loading && (
                    <div className="flex items-center justify-center gap-2 py-4 text-[#FFA000] font-black text-sm">
                      <Loader2 className="w-5 h-5 animate-spin" /> Verifying...
                    </div>
                  )}

                  <div className="text-center pt-2">
                    {countdown > 0 ? (
                      <p className="text-xs font-bold text-slate-400">Resend available in <span className="text-slate-600">{countdown}s</span></p>
                    ) : (
                      <button onClick={handleResend} disabled={loading} className="text-xs font-black text-[#FFA000] hover:text-[#e69000] transition-colors flex items-center justify-center gap-1 mx-auto">
                        <RotateCcw className="w-3.5 h-3.5" /> Resend Code
                      </button>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-100 text-center">
                    <button onClick={() => { setStep("lookup"); setError(""); setOtp(["", "", "", "", "", ""]); }} className="text-xs font-bold text-slate-400 hover:text-[#000223] transition-colors">
                      ← Use a different email
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP: SUCCESS ── */}
              {step === "success" && (
                <div className="text-center py-8 animate-in zoom-in-95 fade-in duration-500">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-black text-[#000223] mb-3">Verified!</h2>
                  <p className="text-sm font-bold text-slate-500 flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#FFA000]" /> Opening your portal...
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

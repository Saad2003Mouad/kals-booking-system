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
    <div className="min-h-screen flex flex-col font-['Nunito',sans-serif] bg-[#FAF6EF] relative overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFA000]/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-pink-400/5 blur-[100px] animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-[#000223] shadow-xl">
        <SiteHeader />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 min-h-[calc(100vh-80px)]">
        
        {/* Glassmorphism Container */}
        <div className="w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-500">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/50 border border-[#FFA000]/30 text-[#FFA000] font-black text-[10px] sm:text-xs uppercase tracking-widest mb-4 shadow-sm backdrop-blur-sm">
              <span className="animate-bounce">🍦</span> Customer Portal
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#000223] tracking-tight leading-tight mb-3">
              Manage Booking
            </h1>
            <p className="text-slate-500 font-bold text-sm sm:text-base max-w-[320px] mx-auto leading-relaxed">
              Securely access your event details, track status, and request modifications.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,2,35,0.1)] relative overflow-hidden">
            {/* Subtle inner highlight */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none rounded-[32px]"></div>
            
            <div className="relative z-10">
              
              {/* ── STEP: LOOKUP ── */}
              {step === "lookup" && (
                <form onSubmit={handleLookup} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
                  
                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-[#FFA000] transition-colors ml-1">
                      Booking Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Hash className="h-5 w-5 text-slate-300 group-focus-within:text-[#FFA000] transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. BL-2024-001"
                        value={bookingNumber}
                        onChange={(e) => setBookingNumber(e.target.value.toUpperCase())}
                        required
                        className="w-full pl-11 pr-4 py-4 bg-white/50 border-2 border-white focus:border-[#FFA000] rounded-2xl text-base font-black text-[#000223] placeholder:text-slate-300 placeholder:font-bold outline-none transition-all shadow-sm focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,160,0,0.1)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 group">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-focus-within:text-[#FFA000] transition-colors ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-[#FFA000] transition-colors" />
                      </div>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-4 bg-white/50 border-2 border-white focus:border-[#FFA000] rounded-2xl text-base font-black text-[#000223] placeholder:text-slate-300 placeholder:font-bold outline-none transition-all shadow-sm focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,160,0,0.1)]"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-rose-50/80 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden py-4 rounded-2xl font-black text-white disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-[0_8px_20px_rgba(0,2,35,0.15)] hover:shadow-[0_12px_25px_rgba(0,2,35,0.25)] active:scale-[0.98]"
                    style={{ background: "#000223" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin text-[#FFA000]" /> Securing Connection...</>
                      ) : (
                        <><ShieldCheck className="w-5 h-5 text-[#FFA000]" /> Authenticate Request</>
                      )}
                    </div>
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-sm font-bold text-slate-400">
                      Need a new booking?{" "}
                      <Link href="/packages" className="text-[#FFA000] font-black hover:underline underline-offset-4 decoration-2">
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
                    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                      <Mail className="w-7 h-7 text-[#FFA000]" />
                    </div>
                    <h2 className="text-2xl font-black text-[#000223] mb-2">Check Your Email</h2>
                    <p className="text-sm font-bold text-slate-500 leading-relaxed">
                      We've sent a secure 6-digit code to:<br/>
                      <span className="text-[#FFA000] font-black">{email}</span>
                    </p>
                  </div>

                  {devCode && (
                    <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl text-center">
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
                            ? 'border-[#FFA000] bg-amber-50 text-[#000223] shadow-[0_0_0_4px_rgba(255,160,0,0.1)]' 
                            : 'border-white bg-white/50 text-[#000223] focus:border-[#FFA000] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,160,0,0.1)]'
                        }`}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-rose-50/80 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  {otp.every((d) => d) && !loading && (
                    <button
                      onClick={() => submitOtp(otp.join(""))}
                      className="w-full relative group overflow-hidden py-4 rounded-2xl font-black text-[#000223] bg-[#FFA000] hover:bg-[#FFB020] transition-all shadow-[0_8px_20px_rgba(255,160,0,0.25)] hover:shadow-[0_12px_25px_rgba(255,160,0,0.35)] active:scale-[0.98] flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2 fade-in"
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
                      <button onClick={handleResend} disabled={loading} className="text-xs font-black text-[#FFA000] hover:text-[#FFB020] transition-colors flex items-center justify-center gap-1 mx-auto">
                        <RotateCcw className="w-3.5 h-3.5" /> Resend Code
                      </button>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-100/50 text-center">
                    <button onClick={() => { setStep("lookup"); setError(""); setOtp(["", "", "", "", "", ""]); }} className="text-xs font-bold text-slate-400 hover:text-[#000223] transition-colors">
                      ← Use a different email
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP: SUCCESS ── */}
              {step === "success" && (
                <div className="text-center py-8 animate-in zoom-in-95 fade-in duration-500">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6 border-4 border-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-3xl font-black text-[#000223] mb-3">Verified!</h2>
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

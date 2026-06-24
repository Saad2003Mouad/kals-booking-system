"use client";
import { useState } from "react";
import { KeyRound, ArrowRight, Loader2, CheckCircle2, AlertCircle, RotateCcw, Eye, EyeOff } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

type Step = "email" | "verify" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const startResendTimer = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
    }, 1000);
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok && data.success) { setStep("verify"); startResendTimer(); }
      else setError(data.error || "Failed to send reset code");
    } catch { setError("Network error. Please try again."); }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password?action=verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code }) });
      const data = await res.json();
      if (res.ok && data.success) setStep("reset");
      else setError(data.error || "Invalid or expired code");
    } catch { setError("Network error."); }
    setLoading(false);
  };

  // Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (res.ok && data.success) { setCode(""); startResendTimer(); }
      else setError(data.error || "Failed to resend");
    } catch { setError("Network error."); }
    setLoading(false);
  };

  // Step 3: Reset Password
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password?action=reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code, newPassword }) });
      const data = await res.json();
      if (res.ok && data.success) setStep("done");
      else setError(data.error || "Failed to reset password");
    } catch { setError("Network error."); }
    setLoading(false);
  };

  return (
    <div className="page min-h-screen flex flex-col bg-transparent">
      <SiteHeader />
      <section className="page-head">
        <div className="w-layout-blockcontainer container w-container">
          <h1 className="h1-page-hed">
            <span className="page-titel-top">Boston Legend </span><br />
            Staff<br />
            <span className="title-event">Portal</span>
          </h1>
        </div>
      </section>

      <main className="flex-1 flex items-start justify-center px-4 pt-8 pb-20">
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFA000] via-[#FFD000] to-[#FFA000]" />

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {(["email", "verify", "reset"] as Step[]).map((s, i) => (
                <div key={s} className={`w-2 h-2 rounded-full transition-all ${step === s || (step === "done" && i < 3) ? "bg-[#FFA000] scale-125" : step !== "email" && i < ["email","verify","reset"].indexOf(step) ? "bg-[#000223]" : "bg-slate-200"}`} />
              ))}
            </div>

            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {step === "email" && (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <KeyRound className="w-6 h-6 text-[#FFA000]" />
                  <div>
                    <h2 className="text-[#000223] font-black text-xl">Reset Password</h2>
                    <p className="text-[#000223]/50 font-medium text-xs">Enter your staff email to receive a reset code</p>
                  </div>
                </div>
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="label-premium">Staff Email Address</label>
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-premium" placeholder="name@bostonlegend.com" autoComplete="email" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-black text-base text-[#FFA000] bg-[#000223] hover:bg-[#000445] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <>Send Reset Code <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </>
            )}

            {step === "verify" && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <KeyRound className="w-6 h-6 text-[#FFA000]" />
                  <div>
                    <h2 className="text-[#000223] font-black text-xl">Enter Reset Code</h2>
                    <p className="text-[#000223]/50 font-medium text-xs">Check <strong>{email}</strong> for your 6-digit code</p>
                  </div>
                </div>
                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="label-premium">6-Digit Code</label>
                    <input required value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} className="input-premium text-center text-2xl font-black tracking-[0.5em]" placeholder="000000" maxLength={6} inputMode="numeric" />
                  </div>
                  <button type="submit" disabled={loading || code.length < 6} className="w-full py-4 rounded-2xl font-black text-base text-[#FFA000] bg-[#000223] hover:bg-[#000445] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : <>Verify Code <ArrowRight className="w-4 h-4" /></>}
                  </button>
                  <div className="text-center">
                    <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || loading} className="text-xs font-bold text-slate-400 hover:text-[#FFA000] disabled:opacity-50 flex items-center gap-1 mx-auto transition-colors">
                      <RotateCcw className="w-3 h-3" /> {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === "reset" && (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <KeyRound className="w-6 h-6 text-[#FFA000]" />
                  <div>
                    <h2 className="text-[#000223] font-black text-xl">Set New Password</h2>
                    <p className="text-[#000223]/50 font-medium text-xs">Choose a strong password for {email}</p>
                  </div>
                </div>
                <form onSubmit={handleReset} className="space-y-4">
                  <div>
                    <label className="label-premium">New Password</label>
                    <div className="relative">
                      <input required type={showPwd ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-premium pr-12" placeholder="Min 8 characters" minLength={8} autoComplete="new-password" />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#000223]">
                        {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="label-premium">Confirm New Password</label>
                    <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-premium" placeholder="Repeat password" minLength={8} autoComplete="new-password" />
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-black text-base text-[#FFA000] bg-[#000223] hover:bg-[#000445] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Resetting...</> : <>Reset Password <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>
              </>
            )}

            {step === "done" && (
              <div className="flex flex-col items-center py-8 gap-4 text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-500" />
                <h2 className="text-xl font-black text-[#000223]">Password Reset Successfully!</h2>
                <p className="text-sm text-slate-500 font-semibold">You can now sign in with your new password.</p>
                <a href="/login" className="btn-primary py-3 px-8 text-sm flex items-center gap-2">Sign In Now <ArrowRight className="w-4 h-4" /></a>
              </div>
            )}
          </div>
          <div className="mt-6 text-center">
            <a href="/login" className="text-xs font-bold text-slate-500 hover:text-[#FFA000] transition-colors">← Back to Login</a>
          </div>
        </div>
      </main>
    </div>
  );
}

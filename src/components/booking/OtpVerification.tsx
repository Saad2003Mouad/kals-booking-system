"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle2, Loader2, RotateCcw, Mail, AlertCircle } from "lucide-react";

interface OtpVerificationProps {
  email: string;
  firstName: string;
  onVerified: () => void;
}

export default function OtpVerification({ email, firstName, onVerified }: OtpVerificationProps) {
  const [digits, setDigits]     = useState(["","","","","",""]);
  const [sending, setSending]   = useState(false);
  const [verifying, setVerify]  = useState(false);
  const [error, setError]       = useState("");
  const [sent, setSent]         = useState(false);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [devCode, setDevCode]   = useState<string|null>(null);
  const refs = useRef<(HTMLInputElement|null)[]>([]);

  const initialized = useRef(false);

  // Auto-send on mount, protected against Strict Mode double execution
  useEffect(() => { 
    if (!initialized.current) {
      initialized.current = true;
      sendCode(); 
    }
  }, []);

  const sendCode = async () => {
    setSending(true); setError(""); setSent(false);
    const res = await fetch("/api/otp/send", {
      method: "POST", headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ email, firstName }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to send."); setSending(false); return; }
    setSent(true); setSending(false);
    if (data.devCode) setDevCode(data.devCode);
    // Countdown 60s before resend
    setCountdown(60);
    const t = setInterval(() => setCountdown(c => { if(c<=1){clearInterval(t);return 0;}return c-1; }), 1000);
  };

  const handleDigit = (i: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...digits]; next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i+1]?.focus();
    // Auto-verify when all 6 filled
    if (next.every(d => d) && next.join("").length === 6) {
      verify(next.join(""));
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i-1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (paste.length === 6) {
      const next = paste.split("");
      setDigits(next);
      refs.current[5]?.focus();
      verify(paste);
    }
    e.preventDefault();
  };

  const verify = async (code: string) => {
    setVerify(true); setError("");
    const res = await fetch("/api/otp/verify", {
      method: "POST", headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setVerify(false);
    if (!res.ok) { setError(data.error ?? "Invalid code."); setDigits(["","","","","",""]); refs.current[0]?.focus(); return; }
    setVerified(true);
    setTimeout(onVerified, 1000);
  };

  if (verified) return (
    <div className="text-center py-16">
      <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <CheckCircle2 className="w-12 h-12 text-emerald-500"/>
      </div>
      <h3 className="text-2xl font-black mb-2" style={{color:"#000223"}}>Email Verified!</h3>
      <p className="text-slate-500 font-bold text-base">Continuing to review…</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-amber-100" style={{background:"#FFFDF5"}}>
          <Mail className="w-10 h-10" style={{color:"#FFA000"}}/>
        </div>
        <h3 className="text-3xl font-black mb-3" style={{color:"#000223"}}>Verify Your Email</h3>
        <p className="text-slate-600 font-bold text-base sm:text-lg leading-relaxed">
          We sent a 6-digit confirmation code to:<br/>
          <span className="font-black text-lg block mt-1" style={{color:"#FFA000"}}>{email}</span>
        </p>
      </div>

      {/* Dev mode hint */}
      {devCode && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50 border-2 border-blue-200 text-blue-800 text-sm sm:text-base font-black text-center shadow-sm">
          🔧 Dev Mode: <span className="font-mono text-lg tracking-widest text-[#000223] ml-1 bg-white px-2 py-0.5 rounded border border-blue-300">{devCode}</span>
        </div>
      )}

      {/* OTP boxes */}
      <div className="flex gap-2 sm:gap-3 justify-center mb-8" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input key={i} ref={el => { refs.current[i] = el; }}
            type="text" inputMode="numeric" maxLength={1} value={d}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="w-10 h-12 sm:w-14 sm:h-16 rounded-2xl border-2 text-center text-xl sm:text-3xl font-black outline-none transition-all focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/15"
            style={{
              borderColor: d ? "#FFA000" : "rgba(0, 2, 35, 0.12)",
              background: d ? "#FFFBEB" : "rgba(255, 255, 255, 0.95)",
              color: "#000223",
              fontFamily: "monospace",
              boxShadow: d ? "0 0 0 5px rgba(255, 160, 0, 0.15)" : "none",
            }}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-800 font-bold text-base text-center shadow-sm flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Verifying state */}
      {verifying && (
        <div className="flex items-center justify-center gap-2.5 text-slate-600 font-black text-base mb-6 animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin text-[#FFA000]"/> Verifying code…
        </div>
      )}

      {/* Manual verify button */}
      {digits.every(d=>d) && !verifying && (
        <button onClick={()=>verify(digits.join(""))} className="w-full py-4.5 rounded-2xl font-black text-lg transition-all duration-300 hover:bg-[#000445] hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl mb-6" style={{background:"#000223",color:"#FFA000"}}>
          Confirm Code
        </button>
      )}

      {/* Resend */}
      <div className="text-center mt-4">
        {sending ? (
          <div className="flex items-center justify-center gap-2 text-slate-500 text-base font-black">
            <Loader2 className="w-5 h-5 animate-spin text-[#FFA000]"/> Requesting code…
          </div>
        ) : countdown > 0 ? (
          <p className="text-slate-500 text-base font-bold">Resend code available in {countdown}s</p>
        ) : (
          <button onClick={sendCode} className="flex items-center gap-2.5 mx-auto text-base font-black hover:opacity-85 transition-opacity" style={{color:"#FFA000"}}>
            <RotateCcw className="w-5 h-5"/> Resend Code
          </button>
        )}
      </div>

      {/* Sending indicator */}
      {sent && !sending && (
        <div className="mt-5 flex items-center justify-center gap-2 text-emerald-700 font-black text-base">
          <CheckCircle2 className="w-5 h-5 text-emerald-600"/> Code sent successfully!
        </div>
      )}
    </div>
  );
}

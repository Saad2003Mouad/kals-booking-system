"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2, Lock, ShieldAlert, Key } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    setError("");
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError("Invalid email or password. Please check your credentials and try again.");
        setLoading(false);
      } else {
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#000223] px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background Gradient Mesh */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-30 pointer-events-none filter blur-[120px]" style={{ background: "radial-gradient(circle, #FFA000, transparent)" }}/>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-20 pointer-events-none filter blur-[100px]" style={{ background: "radial-gradient(circle, #F391BD, transparent)" }}/>
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10 pointer-events-none filter blur-[150px]" style={{ background: "radial-gradient(circle, #FFA000, transparent)" }}/>

      <div className="relative z-10 w-full max-w-md py-8">
        {/* Brand Logo & Heading */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link href="/">
            <Image 
              src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif" 
              alt="Boston Legend Logo" 
              width={180} 
              height={60} 
              className="h-16 w-auto mb-4 filter drop-shadow-lg"
              unoptimized
            />
          </Link>
          <h1 className="text-white font-extrabold text-2xl tracking-tight">Staff Portal</h1>
          <p className="text-slate-400 font-semibold text-xs mt-1.5 uppercase tracking-widest">Boston Legend Central Operations</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#000223]/70 backdrop-blur-2xl rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.6)] p-8 sm:p-10 border border-[#FFA000]/15 relative overflow-hidden">
          {/* Top golden accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFA000] via-[#FFD000] to-[#FFA000]" />

          <h2 className="text-white font-black text-xl mb-1">Welcome Back</h2>
          <p className="text-slate-400 font-medium text-xs mb-6">Sign in to manage bookings, fleet & tasks</p>

          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 font-bold text-xs flex items-start gap-2.5 leading-normal animate-in fade-in duration-200">
              <ShieldAlert className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#FFA000] mb-2">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-700/60 bg-[#000223]/50 font-semibold text-white focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 transition-all outline-none placeholder:text-slate-500 text-sm"
                placeholder="name@bostonlegend.com" 
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-[#FFA000] mb-2">Password</label>
              <div className="relative">
                <input 
                  type={show ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-2xl border border-slate-700/60 bg-[#000223]/50 font-semibold text-white focus:border-[#FFA000] focus:ring-4 focus:ring-[#FFA000]/10 transition-all outline-none placeholder:text-slate-500 text-sm"
                  placeholder="••••••••••••" 
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  onClick={() => setShow(!show)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-sm text-[#000223] transition-all hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-[#FFA000] to-[#FFB300] hover:from-[#FFB300] hover:to-[#FFA000]"
              style={{ boxShadow: "0 8px 24px rgba(255,160,0,0.3)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Collapsible Demo Details */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button 
              type="button" 
              onClick={() => setShowDemo(!showDemo)} 
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <Lock className="w-3.5 h-3.5" />
              {showDemo ? "Hide Demo Credentials" : "Show Demo Credentials"}
            </button>

            {showDemo && (
              <div className="mt-3 p-3.5 rounded-2xl bg-amber-500/5 border border-[#FFA000]/20 text-left space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                <div className="text-[10px] font-black text-[#FFA000] uppercase tracking-wider flex items-center gap-1">
                  <Key className="w-3 h-3" /> Testing Admin Account
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  <div><strong>Email:</strong> <span className="select-all text-white">Ahiyari@outlook.com</span></div>
                  <div><strong>Password:</strong> <span className="select-all text-white">Dvyns1234@</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-[#FFA000] transition-colors">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

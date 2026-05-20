"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="min-h-screen flex" style={{fontFamily:"'Nunito', sans-serif"}}>
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 relative overflow-hidden p-12" style={{background:"linear-gradient(135deg, #000223 0%, #001a4c 100%)"}}>
        {/* Golden glow effects */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 pointer-events-none" style={{background:"radial-gradient(circle, #FFA000, transparent)"}}/>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10 pointer-events-none" style={{background:"radial-gradient(circle, #F391BD, transparent)"}}/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5 pointer-events-none" style={{background:"radial-gradient(circle,#FFA000,transparent)"}}/>

        <div className="relative z-10">
          <Image src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif" alt="Boston Legend" width={180} height={60} className="h-14 w-auto" unoptimized/>
        </div>

        <div className="relative z-10">
          <div className="text-5xl mb-6">🍦</div>
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Staff<br/><span style={{color:"#FFA000"}}>Portal</span>
          </h2>
          <p className="font-semibold text-lg leading-relaxed" style={{color:"rgba(255,255,255,0.55)"}}>
            Manage bookings, dispatch drivers, and keep the legendary experience rolling.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {[{v:"500+",l:"Events Catered"},{v:"12",l:"Packages Available"},{v:"7",l:"Vehicles in Fleet"}].map(s=>(
            <div key={s.l} className="flex items-center gap-4">
              <div className="text-2xl font-black" style={{color:"#FFA000"}}>{s.v}</div>
              <div className="font-semibold text-sm" style={{color:"rgba(255,255,255,0.45)"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <Image src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif" alt="Boston Legend" width={160} height={54} className="h-12 w-auto"/>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
            {/* Top accent strip */}
            <div className="h-1.5 rounded-full mb-8" style={{background:"linear-gradient(90deg,#FFA000,#F06292,#000223)"}}/>

            <h1 className="text-2xl font-black mb-1" style={{color:"#000223"}}>Welcome back</h1>
            <p className="text-gray-400 font-semibold text-sm mb-8">Sign in to your team account</p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 font-bold text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                  className="input-field" placeholder="you@example.com" autoComplete="email"/>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required
                    className="input-field pr-12" placeholder="••••••••••" autoComplete="current-password"/>
                  <button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {show?<EyeOff className="w-5 h-5"/>:<Eye className="w-5 h-5"/>}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl font-black text-base text-[#000223] transition-all hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{background:"linear-gradient(135deg, #FFA000, #FFB300)",color:"#000223",boxShadow:"0 8px 24px rgba(255,160,0,0.4)"}}>
                {loading?<><Loader2 className="w-5 h-5 animate-spin"/>Signing in…</>:<>Sign In <ArrowRight className="w-5 h-5"/></>}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link href="/" className="text-sm font-semibold text-gray-400 hover:text-[#000223] transition-colors">
                ← Back to main site
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 font-semibold mt-6">
            Boston Legend Ice Cream Truck · Staff Portal
          </p>
        </div>
      </div>
    </div>
  );
}

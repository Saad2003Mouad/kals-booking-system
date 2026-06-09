"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#FAF6EF]">
      {/* Header accent bars — match About page style */}
      <div className="absolute top-0 left-0 right-0 h-20 z-20 pointer-events-none overflow-hidden">
        {/* Orange-amber — left */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: 300, height: "100%",
          background: "linear-gradient(105deg, #FF6B00 0%, #FF8C00 45%, #FFA500 70%, transparent 100%)",
          opacity: 1,
          borderBottomRightRadius: 72,
        }} />
        {/* Deep rose — right */}
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: 300, height: "100%",
          background: "linear-gradient(255deg, #C2185B 0%, #E91E8C 45%, #FF4DB2 70%, transparent 100%)",
          opacity: 1,
          borderBottomLeftRadius: 72,
        }} />
      </div>

      {/* Nav */}
      <div style={{ position: "relative", zIndex: 25 }}>
        <SiteHeader />
      </div>

      {/* Page Hero Header — matching /about style */}
      <section className="page-head">
        <div className="w-layout-blockcontainer container w-container">
          <h1 className="h1-page-hed">
            <span className="page-titel-top">Boston Legend </span>
            <br />
            Staff
            <br />
            <span className="title-event">Portal</span>
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

      {/* Login Card */}
      <main className="flex-1 flex items-start justify-center px-4 pt-8 pb-20">
        <div className="relative z-10 w-full max-w-md">
          {/* Background decorative blobs */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20 pointer-events-none filter blur-[120px]" style={{ background: "radial-gradient(circle, #FFA000, transparent)" }}/>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-10 pointer-events-none filter blur-[100px]" style={{ background: "radial-gradient(circle, #000223, transparent)" }}/>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 relative overflow-hidden">
            {/* Top golden accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFA000] via-[#FFD000] to-[#FFA000]" />

            <h2 className="text-[#000223] font-black text-xl mb-1">Welcome Back</h2>
            <p className="text-[#000223]/60 font-medium text-xs mb-6">Sign in to manage bookings, fleet &amp; tasks</p>

            {error && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs flex items-start gap-2.5 leading-normal animate-in fade-in duration-200">
                <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label-premium">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                  className="input-premium"
                  placeholder="name@bostonlegend.com" 
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="label-premium">Password</label>
                <div className="relative">
                  <input 
                    type={show ? "text" : "password"} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required
                    className="input-premium pr-12"
                    placeholder="••••••••••••" 
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShow(!show)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#000223] transition-colors"
                  >
                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-base text-[#FFA000] bg-[#000223] hover:bg-[#000445] transition-all hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                style={{ boxShadow: "0 8px 24px rgba(0,2,35,0.15)" }}
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
          </div>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-xs font-bold text-slate-500 hover:text-[#FFA000] transition-colors">
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

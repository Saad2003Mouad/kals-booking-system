"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#F8F9FC", fontFamily: "'Nunito', sans-serif" }}>
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow" style={{ background: "linear-gradient(135deg, #FFA000, #F06292)" }}>🍦</div>
            <div>
              <div className="font-black text-sm" style={{ color: "#000223" }}>Boston Legend Ice Cream</div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Driver Portal</div>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

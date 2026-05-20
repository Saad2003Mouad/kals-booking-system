"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";
const BRAND_NAVY = "#000223";
const BRAND_GOLD = "#FFA000";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Menu", href: "/menu" },
  {
    label: "Occasions",
    href: "/#occasions",
    dropdown: [
      { label: "Birthday Parties", href: "/occasions/birthday-parties" },
      { label: "Block Parties", href: "/occasions/block-parties" },
      { label: "Corporate Parties", href: "/occasions/corporate-parties" },
      { label: "Fundraisers", href: "/occasions/fundraisers" },
      { label: "Launch Parties", href: "/occasions/launch-parties" },
      { label: "Marketing Events", href: "/occasions/marketing-events" },
      { label: "Wedding Receptions", href: "/occasions/wedding-receptions" },
    ],
  },
  { label: "Packages", href: "/packages" },
  { label: "Contact", href: "/contact-us" },
];

export default function BookingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  return (
    <nav style={{ background: BRAND_NAVY, fontFamily: "'Nunito', sans-serif" }} className="sticky top-0 z-50 shadow-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <a href="/" className="flex-shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Image src={LOGO} alt="Boston Legend" width={160} height={60} className="h-10 w-auto" unoptimized />
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            link.dropdown ? (
              <div key={link.label} className="relative group">
                <button 
                  onMouseEnter={() => setDropOpen(true)}
                  className="flex items-center gap-1 text-sm font-extrabold text-white/70 hover:text-white transition-colors py-2"
                >
                  {link.label} <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div 
                  className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0"
                >
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 w-56 overflow-hidden">
                    {link.dropdown.map(d => (
                      <a key={d.label} href={d.href} className="block px-5 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-amber-50 hover:text-[#000223] transition-colors">
                        {d.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a key={link.label} href={link.href} className="text-sm font-extrabold text-white/70 hover:text-white transition-colors">
                {link.label}
              </a>
            )
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <a href="tel:6179993803" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <Phone className="w-3.5 h-3.5 text-[#FFA000]" />
            <span className="text-sm font-black text-white">617-999-3803</span>
          </a>
          <a 
            href="/login" 
            className="px-6 py-2.5 rounded-full text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
            style={{ background: BRAND_GOLD, color: BRAND_NAVY }}
          >
            Sign In or Sign Up
          </a>
          
          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white/80">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#000223] border-b border-white/5 p-6 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-5">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className="text-lg font-black text-white" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <a href="tel:6179993803" className="flex items-center gap-3 text-white font-black">
              <Phone className="w-5 h-5 text-[#FFA000]" />
              617-999-3803
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

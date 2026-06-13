"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navConfig, PortalType } from "@/config/navigation";

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";

interface NavigationProps {
  portalType?: PortalType;
  customLinks?: { label: string; href: string; isButton?: boolean }[];
}

export default function Navigation({ portalType = "public", customLinks }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const links = customLinks || navConfig[portalType];

  // Close drawer on outside click
  useEffect(() => {
    function handlePointer(e: MouseEvent | TouchEvent) {
      const target = e.target;
      if (!mobileOpen) return;
      if (
        drawerRef.current &&
        hamburgerRef.current &&
        !drawerRef.current.contains(target as Node) &&
        !hamburgerRef.current.contains(target as Node)
      ) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("touchstart", handlePointer, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("touchstart", handlePointer);
    };
  }, [mobileOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeAll = () => setMobileOpen(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .bl-mob-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,2,35,0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 9000;
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .bl-mob-backdrop.open { opacity: 1; pointer-events: auto; }

        @media (max-width: 991px) {
          .nav-menu.w-nav-menu {
            display: flex !important;
            flex-direction: column !important;
            position: fixed !important;
            top: 0 !important; right: 0 !important; bottom: 0 !important;
            width: min(85vw, 310px) !important;
            background: #000223 !important;
            z-index: 9200 !important;
            overflow-y: auto !important;
            padding: 72px 0 40px !important;
            box-shadow: -8px 0 40px rgba(0,0,0,0.45) !important;
            transform: translateX(110%) !important;
            transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .nav-menu.w-nav-menu.w--open { transform: translateX(0) !important; }
          
          .nav-menu.w-nav-menu .nav-link {
            color: #fff !important;
            font-weight: 800 !important;
            font-size: 17px !important;
            padding: 14px 24px !important;
            border-bottom: 1px solid rgba(255,255,255,0.07) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            width: 100% !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
            text-decoration: none;
          }
          .nav-menu.w-nav-menu .nav-link:hover, .nav-menu.w-nav-menu .nav-link.active {
            color: #FFA000 !important;
            background: rgba(255,160,0,0.07) !important;
          }
          
          .bl-mob-signin {
            display: block;
            margin: 20px 16px 0;
            padding: 13px 24px;
            background: #FFA000;
            color: #000223 !important;
            font-weight: 900;
            font-size: 15px;
            border-radius: 50px;
            text-align: center;
            text-decoration: none;
            box-shadow: 0 6px 18px rgba(255,160,0,0.35);
          }
          .bl-mob-signin:hover { background: #FFB300; }
          .menu-button.w-nav-button { display: flex !important; }
        }

        @media (min-width: 992px) {
          .bl-mob-close-btn, .bl-mob-signin { display: none !important; }
          .right-menu-links { display: flex !important; gap: 16px; align-items: center; }
          .menu-button.w-nav-button { display: none !important; }
          .desktop-links { display: flex; align-items: center; gap: 24px; }
          .desktop-link {
            color: #000223;
            font-weight: 800;
            font-size: 14px;
            text-decoration: none;
            transition: color 0.2s;
          }
          .desktop-link:hover, .desktop-link.active {
            color: #FFA000;
          }
        }
      ` }} />

      <div className={`bl-mob-backdrop${mobileOpen ? " open" : ""}`} onClick={closeAll} aria-hidden="true" />

      <header className="header bg-white border-b border-slate-100 shadow-sm" style={{ position: "relative", zIndex: 9100 }}>
        <div className="navbar w-nav px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Logo */}
          <Link href={portalType === "admin" ? "/admin" : "/"} className="flex items-center gap-4" onClick={closeAll}>
            <Image src={LOGO} alt="Boston Legend" width={165} height={63} className="h-10 w-auto" priority />
            {portalType !== "public" && (
              <>
                <div className="hidden sm:block h-6 w-px bg-[#000223]/20"></div>
                <span className="hidden sm:block text-xs font-black text-[#000223] uppercase tracking-widest">
                  {portalType === "admin" ? "Admin" : "Portal"}
                </span>
              </>
            )}
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex desktop-links ml-auto mr-8">
            {links.filter(l => !l.isButton).map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className={`desktop-link ${pathname === link.href ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Nav Buttons & Drawer */}
          <nav ref={drawerRef} className={`nav-menu w-nav-menu${mobileOpen ? " w--open" : ""}`}>
            <button className="bl-mob-close-btn" onClick={closeAll} aria-label="Close" style={{
                position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.12)",
                border: "none", borderRadius: "50%", width: "38px", height: "38px", color: "white", fontSize: "18px",
            }}>✕</button>

            {/* Mobile links */}
            {links.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className={`nav-link ${pathname === link.href ? "active" : ""}`} 
                onClick={closeAll}
              >
                {link.label}
              </Link>
            ))}

            {portalType === "public" && (
              <Link href="/login" className="bl-mob-signin" onClick={closeAll}>
                Sign In or Sign Up
              </Link>
            )}
          </nav>

          {/* Right Action */}
          <div className="right-menu-links shrink-0">
            {links.filter(l => l.isButton).map(link => (
              <Link key={link.label} href={link.href} className="px-5 py-2.5 rounded-full font-black text-xs bg-[#000223] text-white hover:bg-[#FFA000] hover:text-[#000223] transition-all">
                {link.label}
              </Link>
            ))}
            {portalType === "public" && (
              <Link href="/login" className="link-bt menu-bt hidden lg:block">
                Sign In
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <div
            ref={hamburgerRef}
            className={`menu-button w-nav-button${mobileOpen ? " w--open" : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            role="button"
            style={{ position: "relative", zIndex: 9300 }}
          >
            <div className="icon w-icon-nav-menu text-[#000223]" />
          </div>
        </div>
      </header>
    </>
  );
}

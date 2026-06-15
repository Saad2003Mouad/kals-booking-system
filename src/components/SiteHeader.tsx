"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const OCCASIONS = [
  ["birthday-parties", "Birthday Parties"],
  ["block-parties", "Block Parties"],
  ["corporate-parties", "Corporate Parties"],
  ["fundraisers", "Fundraisers"],
  ["launch-parties", "Launch Parties"],
  ["marketing-events", "Marketing Events"],
  ["movie-rental", "Movie Rental"],
  ["photo-sessions", "Photo Sessions"],
  ["reunions", "Reunions"],
  ["school-occasions", "School Occasions"],
  ["sports-occasions", "Sports Occasions"],
  ["wedding-receptions", "Wedding Receptions"],
] as const;

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [occasionsOpen, setOccasionsOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  // Close drawer on outside click (touch + mouse)
  useEffect(() => {
    function handlePointer(e: MouseEvent | TouchEvent) {
      const target = e instanceof TouchEvent ? e.target : e.target;
      if (!mobileOpen) return;
      if (
        drawerRef.current &&
        hamburgerRef.current &&
        !drawerRef.current.contains(target as Node) &&
        !hamburgerRef.current.contains(target as Node)
      ) {
        setMobileOpen(false);
        setOccasionsOpen(false);
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

  const closeAll = () => {
    setMobileOpen(false);
    setOccasionsOpen(false);
  };

  const toggleMobile = () => {
    setMobileOpen((prev) => {
      if (prev) setOccasionsOpen(false);
      return !prev;
    });
  };

  return (
    <>
      {/* ─── Webflow shared CSS ─── */}
      <link
        href="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/css/boston-legend.webflow.shared.fe0e6a837.min.css"
        rel="stylesheet"
        type="text/css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
      />

      {/* ─── Shared mobile-nav styles ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Backdrop ── */
        .bl-mob-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,2,35,0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 9998;
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .bl-mob-backdrop.open {
          opacity: 1; pointer-events: auto;
        }

        /* ── Drawer ── */
        @media (max-width: 991px) {
          .nav-menu.w-nav-menu {
            display: flex !important;
            flex-direction: column !important;
            position: fixed !important;
            top: 0 !important; right: 0 !important; bottom: 0 !important;
            width: min(85vw, 310px) !important;
            background: #000223 !important;
            z-index: 10000 !important;
            overflow-y: auto !important;
            padding: 72px 0 40px !important;
            box-shadow: -8px 0 40px rgba(0,0,0,0.45) !important;
            transform: translateX(110%) !important;
            transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .nav-menu.w-nav-menu.w--open {
            transform: translateX(0) !important;
          }

          /* Nav links in drawer */
          .nav-menu.w-nav-menu .nav-link.w-nav-link,
          .nav-menu.w-nav-menu .nav-link.dropdown.w-dropdown-toggle {
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
          }
          .nav-menu.w-nav-menu .nav-link.w-nav-link:hover,
          .nav-menu.w-nav-menu .nav-link.dropdown.w-dropdown-toggle:hover {
            color: #FFA000 !important;
            background: rgba(255,160,0,0.07) !important;
          }

          /* Sign-in mobile link */
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
          .bl-mob-signin:hover {
            background: #FFB300;
          }

          /* Occasions accordion */
          .bl-occasions-toggle-arrow {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 28px; height: 28px;
            border-radius: 50%;
            background: rgba(255,255,255,0.1);
            transition: transform 0.28s ease, background 0.2s ease;
            flex-shrink: 0;
          }
          .bl-occasions-toggle-arrow.open {
            transform: rotate(180deg);
            background: rgba(255,160,0,0.2);
          }

          .bl-occasions-panel {
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1);
            background: rgba(255,255,255,0.04);
          }
          .bl-occasions-panel.open {
            max-height: 600px;
          }
          .bl-occasions-panel a {
            display: block;
            color: rgba(255,255,255,0.82) !important;
            font-size: 14.5px !important;
            font-weight: 700 !important;
            padding: 11px 24px 11px 36px !important;
            border-bottom: 1px solid rgba(255,255,255,0.04) !important;
            text-decoration: none;
            transition: color 0.18s, background 0.18s;
          }
          .bl-occasions-panel a:hover {
            color: #FFA000 !important;
            background: rgba(255,160,0,0.07) !important;
          }

          /* Dropdown list hidden on mobile – accordion controls it */
          .nav-menu.w-nav-menu .dropdown-list.w-dropdown-list {
            display: none !important;
          }

          /* Hide original Webflow dropdown arrow */
          .nav-menu.w-nav-menu .w-icon-dropdown-toggle {
            display: none !important;
          }

          /* Desktop dropdown hidden on mobile */
          .nav-menu.w-nav-menu .w-dropdown {
            position: static !important;
          }

          /* Hide "right-menu-links" Sign In on mobile — shown in drawer instead */
          .right-menu-links {
            display: none !important;
          }
          .menu-button.w-nav-button {
            display: flex !important;
          }
        }

        /* Desktop: hide mobile-only elements */
        @media (min-width: 992px) {
          .bl-mob-close-btn, .bl-mob-signin, .bl-occasions-panel, .bl-occasions-toggle-arrow {
            display: none !important;
          }
          .right-menu-links {
            display: flex !important;
          }
          .menu-button.w-nav-button {
            display: none !important;
          }
        }
      ` }} />

      {/* ── Backdrop ── */}
      <div
        className={`bl-mob-backdrop${mobileOpen ? " open" : ""}`}
        onClick={closeAll}
        aria-hidden="true"
      />

      <header id="react-site-header" className="header" style={{ position: "relative", zIndex: 9999 }}>
        <div
          data-animation="over-left"
          data-collapse="medium"
          data-duration="400"
          data-easing="ease"
          data-easing2="ease"
          role="banner"
          className="navbar w-nav"
        >
          <div className="container menu w-container">
            {/* Logo */}
            <Link href="/" className="brand w-nav-brand" onClick={closeAll}>
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif"
                loading="lazy"
                width="165"
                height="63"
                alt="Boston Legend ice cream truck logo"
                className="logo"
              />
            </Link>

            {/* ── NAV DRAWER ── */}
            <nav
              ref={drawerRef}
              role="navigation"
              className={`nav-menu w-nav-menu${mobileOpen ? " w--open" : ""}`}
            >
              {/* Close button */}
              <button
                className="bl-mob-close-btn"
                onClick={closeAll}
                aria-label="Close navigation menu"
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "rgba(255,255,255,0.12)",
                  border: "none",
                  borderRadius: "50%",
                  width: "38px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                  fontSize: "18px",
                  lineHeight: "1",
                }}
              >
                ✕
              </button>

              {/* ── Standard links ── */}
              <Link href="/" className="nav-link w-nav-link" onClick={closeAll}>Home</Link>
              <Link href="/about" className="nav-link w-nav-link" onClick={closeAll}>About</Link>
              <Link href="/menu" className="nav-link w-nav-link" onClick={closeAll}>Menu</Link>
              <Link href="/services" className="nav-link w-nav-link" onClick={closeAll}>Services</Link>
              <Link href="/faq" className="nav-link w-nav-link" onClick={closeAll}>FAQ</Link>

              {/* ── Occasions — desktop dropdown / mobile accordion ── */}
              <div className="w-dropdown" style={{ position: "relative" }}>
                {/* Desktop toggle (hover-driven by Webflow CSS) */}
                <div className="nav-link dropdown w-dropdown-toggle"
                  onClick={() => setOccasionsOpen((p) => !p)}
                  role="button"
                  aria-expanded={occasionsOpen}
                  aria-haspopup="true"
                  style={{ cursor: "pointer" }}
                >
                  <div className="dropdown-menu-icon w-icon-dropdown-toggle" />
                  <div>Occasions</div>
                  {/* Mobile-only arrow */}
                  <span className={`bl-occasions-toggle-arrow${occasionsOpen ? " open" : ""}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>

                {/* ── Desktop dropdown (Webflow-handled) ── */}
                <nav className="dropdown-list w-dropdown-list">
                  <div className="w-dyn-list">
                    <div role="list" className="w-dyn-items">
                      {OCCASIONS.map(([slug, label]) => (
                        <div key={slug} role="listitem" className="drop-meu-item w-dyn-item">
                          <Link
                            href={`/occasions/${slug}`}
                            className="dropdown-link w-inline-block"
                            onClick={closeAll}
                          >
                            <div className="dorpdown-move">
                              <div className="dorp-down-b">{label}</div>
                              <div className="dropdown-o">{label}</div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </nav>

                {/* ── Mobile accordion panel ── */}
                <div className={`bl-occasions-panel${occasionsOpen ? " open" : ""}`}>
                  {OCCASIONS.map(([slug, label]) => (
                    <Link
                      key={slug}
                      href={`/occasions/${slug}`}
                      onClick={closeAll}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/packages" className="nav-link w-nav-link" onClick={closeAll}>Packages</Link>
              <Link href="/manage-booking" className="nav-link w-nav-link" onClick={closeAll}>Manage Booking</Link>
              <Link href="/contact-us" className="nav-link w-nav-link" onClick={closeAll}>Contact</Link>

              {/* Mobile-only Sign In CTA */}
              <Link href="/login" className="bl-mob-signin" onClick={closeAll}>
                Sign In or Sign Up
              </Link>
            </nav>

            {/* Desktop Sign-In CTA */}
            <div className="right-menu-links">
              <Link href="/login" className="link-bt menu-bt">
                Sign In or Sign Up
              </Link>
            </div>

            {/* Hamburger */}
            <div
              ref={hamburgerRef}
              className={`menu-button w-nav-button${mobileOpen ? " w--open" : ""}`}
              onClick={toggleMobile}
              role="button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              style={{ position: "relative", zIndex: 9999 }}
            >
              <div className="icon w-icon-nav-menu" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

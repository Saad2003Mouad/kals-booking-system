"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        mobileOpen &&
        menuRef.current &&
        btnRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      {/* Webflow shared CSS */}
      <link
        href="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/css/boston-legend.webflow.shared.fe0e6a837.min.css"
        rel="stylesheet"
        type="text/css"
      />
      {/* Swiper CSS for brand marquee on React-rendered pages */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
      />

      <style dangerouslySetInnerHTML={{__html: `
        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,2,35,0.55);
          z-index: 9000;
          backdrop-filter: blur(4px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .mobile-backdrop.open {
          opacity: 1;
          pointer-events: auto;
        }
        @media (max-width: 991px) {
          .nav-menu.w-nav-menu {
            display: flex !important;
            flex-direction: column !important;
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: min(85vw, 320px) !important;
            background: #000223 !important;
            z-index: 9200 !important;
            overflow-y: auto !important;
            padding: 70px 0 30px !important;
            box-shadow: -8px 0 40px rgba(0,0,0,0.35) !important;
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          .nav-menu.w-nav-menu.w--open {
            transform: translateX(0) !important;
          }
        }
      `}} />

      {/* Mobile overlay backdrop */}
      <div
        className={`mobile-backdrop ${mobileOpen ? "open" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      <header className="header" style={{ position: "relative", zIndex: 9100 }}>
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
            <Link href="/" className="brand w-nav-brand" onClick={closeMenu}>
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif"
                loading="lazy"
                width="165"
                height="63"
                alt="Boston legend ice cream truck logo"
                className="logo"
              />
            </Link>

            {/* ── Nav Panel ── */}
            <nav
              ref={menuRef}
              role="navigation"
              className={`nav-menu w-nav-menu${mobileOpen ? " w--open" : ""}`}
              style={{}}
            >
              {/* Close button inside panel */}
              {mobileOpen && (
                <button
                  onClick={closeMenu}
                  aria-label="Close navigation menu"
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "rgba(255,255,255,0.12)",
                    border: "none",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
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
              )}

              <Link href="/" className="nav-link w-nav-link" onClick={closeMenu}>
                Home
              </Link>
              <Link href="/about" className="nav-link w-nav-link" onClick={closeMenu}>
                About
              </Link>
              <Link href="/menu" className="nav-link w-nav-link" onClick={closeMenu}>
                Menu
              </Link>

              {/* Occasions Dropdown */}
              <div data-hover="true" data-delay="0" className="w-dropdown">
                <div className="nav-link dropdown w-dropdown-toggle">
                  <div className="dropdown-menu-icon w-icon-dropdown-toggle"></div>
                  <div>Occasions</div>
                </div>
                <nav className="dropdown-list w-dropdown-list">
                  <div className="w-dyn-list">
                    <div role="list" className="w-dyn-items">
                      {[
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
                      ].map(([slug, label]) => (
                        <div key={slug} role="listitem" className="drop-meu-item w-dyn-item">
                          <Link
                            href={`/occasions/${slug}`}
                            className="dropdown-link w-inline-block"
                            onClick={closeMenu}
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
              </div>

              <Link href="/packages" className="nav-link w-nav-link" onClick={closeMenu}>
                Packages
              </Link>
              <Link href="/manage-booking" className="nav-link w-nav-link" onClick={closeMenu}>
                Manage Booking
              </Link>
              <Link href="/contact-us" className="nav-link w-nav-link" onClick={closeMenu}>
                Contact
              </Link>
            </nav>

            {/* Desktop Sign-In CTA */}
            <div className="right-menu-links">
              <Link href="/login" className="link-bt menu-bt">
                Sign In or Sign Up
              </Link>
            </div>

            {/* Hamburger button */}
            <div
              ref={btnRef}
              className={`menu-button w-nav-button${mobileOpen ? " w--open" : ""}`}
              onClick={() => setMobileOpen((prev) => !prev)}
              role="button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
              style={{ position: "relative", zIndex: 9300 }}
            >
              <div className="icon w-icon-nav-menu"></div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

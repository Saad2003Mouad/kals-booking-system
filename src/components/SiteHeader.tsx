"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [occasionsOpen, setOccasionsOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Navigate and close the mobile drawer safely
  const handleNavTo = useCallback((href: string) => {
    return (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // 1. Close menu
      setMobileOpen(false);
      setOccasionsOpen(false);
      
      // 2. Remove overflow:hidden from body
      document.body.style.overflow = "";
      
      // 3. Remove any position:fixed or pointer-events styles
      document.body.style.position = "";
      
      // 4. Force cleanup of Webflow's backdrop if it exists
      const backdrop = document.querySelector('.bl-mob-backdrop');
      if (backdrop) backdrop.classList.remove('open');
      
      // Navigate
      const nextJsRoutes = [
        "/admin", "/booking", "/checkout", "/cities", "/customer", 
        "/driver", "/faq", "/login", "/manage-booking", "/menu", 
        "/packages", "/services"
      ];
      
      const isNextRoute = href === "/" || nextJsRoutes.some(route => href.startsWith(route));

      setTimeout(() => {
        if (isNextRoute) {
          router.push(href);
        } else {
          window.location.assign(href);
        }
      }, 50);
    };
  }, [router]);

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

  const closeAll = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMobileOpen(false);
    setOccasionsOpen(false);
  };

  const toggleMobile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

      {/* ─── Custom Mobile Menu Styles (Decoupled from Webflow) ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Backdrop ── */
        .bl-custom-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,2,35,0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 9998;
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .bl-custom-backdrop.open {
          opacity: 1; pointer-events: auto;
        }

        /* ── Drawer ── */
        .bl-custom-mobile-menu {
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: min(85vw, 310px);
          background: #000223;
          z-index: 10000;
          overflow-y: auto;
          padding: 72px 0 40px;
          box-shadow: -8px 0 40px rgba(0,0,0,0.45);
          transform: translateX(110%);
          transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .bl-custom-mobile-menu.open {
          transform: translateX(0);
        }

        /* Nav links in drawer */
        .bl-custom-mobile-menu a.nav-link,
        .bl-custom-mobile-menu .occasions-toggle {
          color: #fff;
          font-weight: 800;
          font-size: 17px;
          padding: 14px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          box-sizing: border-box;
          cursor: pointer;
          text-decoration: none;
          font-family: var(--font-sans), sans-serif;
        }
        .bl-custom-mobile-menu a.nav-link:hover,
        .bl-custom-mobile-menu .occasions-toggle:hover {
          color: #FFA000;
          background: rgba(255,160,0,0.07);
        }

        /* Sign-in mobile link */
        .bl-custom-signin {
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
          font-family: var(--font-sans), sans-serif;
        }
        .bl-custom-signin:hover {
          background: #FFB300;
        }

        /* Occasions accordion */
        .bl-custom-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          transition: transform 0.28s ease, background 0.2s ease;
          flex-shrink: 0;
        }
        .bl-custom-arrow.open {
          transform: rotate(180deg);
          background: rgba(255,160,0,0.2);
        }

        .bl-custom-panel {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255,255,255,0.04);
        }
        .bl-custom-panel.open {
          max-height: 600px;
        }
        .bl-custom-panel a {
          display: block;
          color: rgba(255,255,255,0.82) !important;
          font-size: 14.5px !important;
          font-weight: 700 !important;
          padding: 11px 24px 11px 36px !important;
          border-bottom: 1px solid rgba(255,255,255,0.04) !important;
          text-decoration: none;
          transition: color 0.18s, background 0.18s;
          font-family: var(--font-sans), sans-serif;
        }
        .bl-custom-panel a:hover {
          color: #FFA000 !important;
          background: rgba(255,160,0,0.07) !important;
        }

        /* Custom Hamburger */
        .bl-custom-hamburger {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
          width: 44px;
          height: 44px;
          background: transparent;
          border: none;
          cursor: pointer;
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 9999;
          padding: 8px;
        }
        .bl-custom-hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #000223;
          border-radius: 2px;
          transition: 0.3s;
        }

        @media (min-width: 992px) {
          .bl-custom-mobile-menu, .bl-custom-backdrop, .bl-custom-hamburger {
            display: none !important;
          }
          .desktop-nav-menu {
            display: flex !important;
            align-items: center;
          }
          .sign-in-desktop-only {
            display: flex !important;
          }
        }
        @media (max-width: 991px) {
          .desktop-nav-menu {
            display: none !important;
          }
          .sign-in-desktop-only {
            display: none !important;
          }
        }
      ` }} />

      {/* ── Custom React Backdrop ── */}
      <div
        className={`bl-custom-backdrop${mobileOpen ? " open" : ""}`}
        onClick={closeAll}
        aria-hidden="true"
      />

      <header id="react-site-header" className="header" style={{ position: "relative", zIndex: 9999 }}>
        <div
          role="banner"
          className="navbar"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="container menu w-container" style={{ position: 'relative' }}>
            {/* Logo */}
            <a href="/" className="brand w-nav-brand" onClick={handleNavTo('/')}>
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif"
                loading="lazy"
                width="165"
                height="63"
                alt="Boston Legend ice cream truck logo"
                className="logo"
              />
            </a>

            {/* ── DESKTOP NAV ── */}
            <nav role="navigation" className="desktop-nav-menu nav-menu w-nav-menu">
              <a href="/" className="nav-link w-nav-link">Home</a>
              <a href="/about" className="nav-link w-nav-link">About</a>
              <a href="/menu" className="nav-link w-nav-link">Menu</a>

              <div
                className="w-dropdown"
                style={{ position: "relative" }}
                onMouseEnter={() => setOccasionsOpen(true)}
                onMouseLeave={() => setOccasionsOpen(false)}
              >
                <div
                  className="nav-link dropdown w-dropdown-toggle"
                  style={{ cursor: "pointer" }}
                >
                  <div className="dropdown-menu-icon w-icon-dropdown-toggle" />
                  <div>Occasions</div>
                </div>

                <nav className={`dropdown-list w-dropdown-list${occasionsOpen ? " w--open" : ""}`}>
                  <div className="w-dyn-list">
                    <div role="list" className="w-dyn-items">
                      {OCCASIONS.map(([slug, label]) => (
                        <div key={slug} role="listitem" className="drop-meu-item w-dyn-item">
                          <a
                            href={`/occasions/${slug}`}
                            className="dropdown-link w-inline-block"
                          >
                            <div className="dorpdown-move">
                              <div className="dorp-down-b">{label}</div>
                              <div className="dropdown-o">{label}</div>
                            </div>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>

              <a href="/packages" className="nav-link w-nav-link">Packages</a>
              <a href="/manage-booking" className="nav-link w-nav-link">Manage Booking</a>
              <a href="/contact-us" className="nav-link w-nav-link">Contact</a>
            </nav>

            <div className="right-menu-links desktop-nav-menu sign-in-desktop-only">
              <a href="/login" className="link-bt menu-bt">
                Sign In or Sign Up
              </a>
            </div>

            {/* ── CUSTOM MOBILE HAMBURGER ── */}
            <button
              ref={hamburgerRef}
              className="bl-custom-hamburger"
              onClick={toggleMobile}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            
            {/* ── CUSTOM MOBILE DRAWER ── */}
            <nav
              ref={drawerRef}
              className={`bl-custom-mobile-menu${mobileOpen ? " open" : ""}`}
            >
              {/* Close button */}
              <button
                onClick={closeAll}
                aria-label="Close menu"
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

              <a href="/" className="nav-link" onClick={handleNavTo('/')}>Home</a>
              <a href="/about" className="nav-link" onClick={handleNavTo('/about')}>About</a>
              <a href="/menu" className="nav-link" onClick={handleNavTo('/menu')}>Menu</a>

              {/* Mobile Occasions Accordion */}
              <div>
                <div
                  className="occasions-toggle"
                  onClick={() => setOccasionsOpen((p) => !p)}
                  role="button"
                >
                  <div>Occasions</div>
                  <span className={`bl-custom-arrow${occasionsOpen ? " open" : ""}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>

                <div className={`bl-custom-panel${occasionsOpen ? " open" : ""}`}>
                  {OCCASIONS.map(([slug, label]) => (
                    <a
                      key={slug}
                      href={`/occasions/${slug}`}
                      onClick={handleNavTo(`/occasions/${slug}`)}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              <a href="/packages" className="nav-link" onClick={handleNavTo('/packages')}>Packages</a>
              <a href="/manage-booking" className="nav-link" onClick={handleNavTo('/manage-booking')}>Manage Booking</a>
              <a href="/contact-us" className="nav-link" onClick={handleNavTo('/contact-us')}>Contact</a>

              <a href="/login" className="bl-custom-signin" onClick={handleNavTo('/login')}>
                Sign In or Sign Up
              </a>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}


"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";

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
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Also try to re-init Webflow for dropdown functionality on desktop
  useEffect(() => {
    const w = window as any;
    if (w.Webflow && w.Webflow.destroy) {
      w.Webflow.destroy();
      w.Webflow.ready();
      w.Webflow.require("ix2")?.init();
    }
  }, []);

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <link href="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/css/boston-legend.webflow.shared.fe0e6a837.min.css" rel="stylesheet" type="text/css" />
      <header className="header">
        <div data-animation="over-left" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar w-nav">
          <div className="container menu w-container">
            <Link href="/" className="brand w-nav-brand" onClick={closeMenu}>
              <img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif" loading="lazy" width="165" height="63" alt="Boston legend ice cream truck logo" className="logo"/>
            </Link>
            <nav
              ref={menuRef}
              role="navigation"
              className={`nav-menu w-nav-menu${mobileOpen ? " w--open" : ""}`}
              style={mobileOpen ? { display: "flex", flexDirection: "column" } : {}}
            >
              <Link href="/" className="nav-link w-nav-link" onClick={closeMenu}>Home</Link>
              <Link href="/about" className="nav-link w-nav-link" onClick={closeMenu}>About</Link>
              <Link href="/menu" className="nav-link w-nav-link" onClick={closeMenu}>Menu</Link>
              <div data-hover="true" data-delay="0" className="w-dropdown">
                <div className="nav-link dropdown w-dropdown-toggle">
                  <div className="dropdown-menu-icon w-icon-dropdown-toggle"></div>
                  <div>Occasions</div>
                </div>
                <nav className="dropdown-list w-dropdown-list">
                  <div className="w-dyn-list">
                    <div role="list" className="w-dyn-items">
                      <div role="listitem" className="drop-meu-item w-dyn-item">
                        <Link href="/occasions/birthday-parties" className="dropdown-link w-inline-block" onClick={closeMenu}>
                          <div className="dorpdown-move"><div className="dorp-down-b">Birthday Parties</div><div className="dropdown-o">Birthday Parties</div></div>
                        </Link>
                      </div>
                      <div role="listitem" className="drop-meu-item w-dyn-item">
                        <Link href="/occasions/corporate-parties" className="dropdown-link w-inline-block" onClick={closeMenu}>
                          <div className="dorpdown-move"><div className="dorp-down-b">Corporate Parties</div><div className="dropdown-o">Corporate Parties</div></div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
              <Link href="/packages" className="nav-link w-nav-link" onClick={closeMenu}>Packages</Link>
              <Link href="/manage-booking" className="nav-link w-nav-link" onClick={closeMenu}>Manage Booking</Link>
              <Link href="/contact-us" className="nav-link w-nav-link" onClick={closeMenu}>Contact</Link>
            </nav>
            <div className="right-menu-links">
              <Link href="/login" className="link-bt menu-bt">Sign In or Sign Up</Link>
            </div>
            <div
              ref={btnRef}
              className={`menu-button w-nav-button${mobileOpen ? " w--open" : ""}`}
              onClick={() => setMobileOpen(prev => !prev)}
              role="button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <div className="icon w-icon-nav-menu"></div>
            </div>
          </div>
        </div>
      </header>
      <Script src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=67dc601bc29781a5af1632a2" strategy="lazyOnload" />
      <Script src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/js/webflow.schunk.36b8fb49256177c8.js" strategy="lazyOnload" />
    </>
  );
}

"use client";
import React from "react";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="w-layout-blockcontainer container w-container">
        <div className="row">
          <div className="footer-col-l">
            <img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif" loading="lazy" width="165" height="63" alt="Boston legend ice cream truck logo"/>
            <p className="footer-p">Make your events extra special with our ice cream truck catering! From birthdays to weddings and everything in between, we bring premium flavors and smiles right to your celebration. Serving Greater Boston, we’re here to sweeten every moment.</p>
            <Link href="/booking" className="link-bt">Reserve Now</Link>
            <div className="w-layout-hflex social-row">
              <img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f9407e01489f8f216_boston-legend-ice-cream-truck-facebook.png" loading="lazy" width="20" height="36" alt="Facebook"/>
              <img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f63235d7e7fa1c200_boston-legend-ice-cream-truck-truck-instagram.png" loading="lazy" width="33" height="33" alt="Instagram"/>
              <img src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f48b5da6eaf60bedd_boston-legend-ice-cream-truck-tiktok.png" loading="lazy" width="30" height="34" alt="Tiktok"/>
            </div>
          </div>
          <div className="footer-col-s">
            <div className="footer-titel">Ice Cream Event Catering</div>
            <div className="w-dyn-list">
              <div role="list" className="w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/birthday-parties" className="footer-link w-inline-block">
                    <div className="footer-link-move"><div className="footer-link-w">Birthday Parties</div><div className="footer-link-o">Birthday Parties</div></div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/corporate-parties" className="footer-link w-inline-block">
                    <div className="footer-link-move"><div className="footer-link-w">Corporate Parties</div><div className="footer-link-o">Corporate Parties</div></div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-col-s">
            <div className="footer-titel">Boston Legend</div>
            <div><Link href="/" className="footer-link w-inline-block"><div className="footer-link-move"><div className="footer-link-w">Home</div><div className="footer-link-o">Home</div></div></Link></div>
            <div><Link href="/about" className="footer-link w-inline-block"><div className="footer-link-move"><div className="footer-link-w">About</div><div className="footer-link-o">About</div></div></Link></div>
            <div><Link href="/packages" className="footer-link w-inline-block"><div className="footer-link-move"><div className="footer-link-w">Packages</div><div className="footer-link-o">Packages</div></div></Link></div>
            <div className="footer-titel-s mt-6">Call Us</div>
            <div><a href="tel:6179993803" className="footer-link w-inline-block"><div className="footer-link-move"><div className="footer-link-w">617-999-3803</div><div className="footer-link-o">617-999-3803</div></div></a></div>
            <div className="footer-titel-s mt-4">Work Hours</div>
            <div>Mon-Fri: 8:00AM - 10:00PM</div>
            <div>Sat-Sun: 9:00AM - 10:00PM</div>
          </div>
        </div>
      </div>
      <div className="copyright">
        <div className="w-layout-blockcontainer container w-container">
          <div className="w-layout-hflex copy-flex">
            <div>Boston Legend  Copyright © 2026, All rights reserved.</div>
            <div>Powered by <a href="https://www.dvyns.com/" target="_blank" className="blue-link">DVYNS</a></div>
          </div>
        </div>
      </div>
    </footer>
  );
}

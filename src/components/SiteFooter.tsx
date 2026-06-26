"use client";
import React from "react";
import Link from "next/link";

const OCCASIONS_LIST = [
  { slug: "birthday-parties", name: "Birthday Parties" },
  { slug: "block-parties", name: "Block Parties" },
  { slug: "corporate-parties", name: "Corporate Parties" },
  { slug: "fundraisers", name: "Fundraisers" },
  { slug: "launch-parties", name: "Launch Parties" },
  { slug: "marketing-events", name: "Marketing Events" },
  { slug: "movie-rental", name: "Movie Rental" },
  { slug: "photo-sessions", name: "Photo Sessions" },
  { slug: "reunions", name: "Reunions" },
  { slug: "school-occasions", name: "School Occasions" },
  { slug: "sports-occasions", name: "Sports Occasions" },
  { slug: "wedding-receptions", name: "Wedding Receptions" }
];

const TOP_CITIES = [
  { slug: "boston", name: "Boston" },
  { slug: "cambridge", name: "Cambridge" },
  { slug: "somerville", name: "Somerville" },
  { slug: "brookline", name: "Brookline" },
  { slug: "newton", name: "Newton" },
  { slug: "quincy", name: "Quincy" },
  { slug: "medford", name: "Medford" },
  { slug: "revere", name: "Revere" },
  { slug: "lynn", name: "Lynn" },
  { slug: "waltham", name: "Waltham" },
];

export default function SiteFooter() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .bl-footer {
          background-color: #000223;
          color: #fff;
          padding: 60px 0 0;
          font-family: var(--font-sans, 'Plus Jakarta Sans', sans-serif);
        }
        .bl-footer .bl-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 900px) {
          .bl-footer .bl-footer-inner {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 580px) {
          .bl-footer .bl-footer-inner {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
        .bl-footer-logo {
          margin-bottom: 18px;
          display: block;
        }
        .bl-footer-desc {
          color: rgba(255,255,255,0.65);
          font-size: 15.5px;
          line-height: 1.7;
          margin-bottom: 22px;
        }
        .bl-footer-reserve-btn {
          display: inline-block;
          background: #FFA000;
          color: #000223 !important;
          font-weight: 800;
          font-size: 14px;
          padding: 12px 28px;
          border-radius: 50px;
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: background 0.2s ease;
          margin-bottom: 24px;
        }
        .bl-footer-reserve-btn:hover {
          background: #FFB300;
        }
        .bl-footer-social {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .bl-footer-social img {
          opacity: 0.8;
          transition: opacity 0.2s;
          cursor: pointer;
        }
        .bl-footer-social img:hover {
          opacity: 1;
        }
        .bl-footer-col-title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #FFA000;
          margin-bottom: 18px;
        }
        .bl-footer-col-subtitle {
          font-size: 16px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #FFA000;
          margin-top: 32px;
          margin-bottom: 12px;
        }
        .bl-footer-link {
          display: block;
          color: rgba(255,255,255,0.7) !important;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          padding: 5px 0;
          transition: color 0.18s ease;
        }
        .bl-footer-link:hover {
          color: #FFA000 !important;
        }
        .bl-footer-text {
          color: rgba(255,255,255,0.6);
          font-size: 15px;
          padding: 5px 0;
          line-height: 1.5;
        }
        .bl-footer-copyright {
          margin-top: 48px;
          padding: 20px 24px;
          border-top: 1px solid rgba(255,255,255,0.08);
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .bl-footer-copyright-bar {
          background-color: #000223;
          padding-bottom: 20px;
        }
        .bl-footer-copyright-text {
          color: rgba(255,255,255,0.4);
          font-size: 13px;
        }
        .bl-footer-copyright a {
          color: #FFA000;
          text-decoration: none;
        }
        .bl-footer-copyright a:hover {
          text-decoration: underline;
        }
      `}} />

      <footer className="bl-footer">
        <div className="bl-footer-inner">
          {/* Column 1 — Brand */}
          <div>
            <img
              src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif"
              loading="lazy"
              width={165}
              height={63}
              alt="Boston legend ice cream truck logo"
              className="bl-footer-logo"
            />
            <p className="bl-footer-desc">
              Make your events extra special with our ice cream truck catering! From birthdays to weddings and everything in between, we bring premium flavors and smiles right to your celebration. Serving Greater Boston, we&apos;re here to sweeten every moment.
            </p>
            <Link href="/packages" className="bl-footer-reserve-btn">
              Reserve Now
            </Link>

            <div className="bl-footer-social">
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f9407e01489f8f216_boston-legend-ice-cream-truck-facebook.png"
                loading="lazy"
                width={20}
                height={36}
                alt="Facebook for Boston Legend ice cream truck"
              />
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f63235d7e7fa1c200_boston-legend-ice-cream-truck-truck-instagram.png"
                loading="lazy"
                width={33}
                height={33}
                alt="Instagram for Boston Legend ice cream truck"
              />
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f48b5da6eaf60bedd_boston-legend-ice-cream-truck-tiktok.png"
                loading="lazy"
                width={30}
                height={34}
                alt="TikTok for Boston Legend ice cream truck"
              />
            </div>
          </div>

          {/* Column 2 — Occasions */}
          <div>
            <div className="bl-footer-col-title">Ice Cream Event Catering</div>
            {OCCASIONS_LIST.map((item) => (
              <Link key={item.slug} href={`/occasions/${item.slug}`} className="bl-footer-link">
                {item.name}
              </Link>
            ))}
          </div>

          {/* Column 3 — Site Links, Call, Hours */}
          <div>
            <div className="bl-footer-col-title">Quick Links</div>
            <Link href="/" className="bl-footer-link">Home</Link>
            <Link href="/menu" className="bl-footer-link">Menu</Link>
            <Link href="/packages" className="bl-footer-link">Packages</Link>
            <Link href="/blog" className="bl-footer-link">Blog</Link>
            <Link href="/contact-us" className="bl-footer-link">Contact Us</Link>

            <div className="bl-footer-col-subtitle">Call Us</div>
            <a href="tel:6179993803" className="bl-footer-link">617-999-3803</a>
            <a href="tel:6178662727" className="bl-footer-link">617-866-2727</a>

            <div className="bl-footer-col-subtitle">Work Hours</div>
            <div className="bl-footer-text">Open 24 Hours for Scheduled Events</div>
            <div className="bl-footer-text">Available 24 hours by reservation</div>
          </div>


        </div>

        {/* Copyright Bar */}
        <div className="bl-footer-copyright-bar">
          <div className="bl-footer-copyright flex justify-center w-full">
            <span className="bl-footer-copyright-text text-center w-full block">
              Boston Legend Copyright © {new Date().getFullYear()}, All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
"use client";
import React from "react";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="w-layout-blockcontainer container w-container">
        <div className="row">
          {/* Column 1: Logo, Description, Reserve CTA, Socials */}
          <div className="footer-col-l">
            <img 
              src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif" 
              loading="lazy" 
              width="165" 
              height="63" 
              alt="Boston legend ice cream truck logo"
            />
            <p className="footer-p">
              Make your events extra special with our ice cream truck catering! From birthdays to weddings and everything in between, we bring premium flavors and smiles right to your celebration. Serving Greater Boston, we’re here to sweeten every moment.
            </p>
            <Link href="/booking" className="link-bt">Reserve Now</Link>
            <div className="w-layout-hflex social-row">
              <img 
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f9407e01489f8f216_boston-legend-ice-cream-truck-facebook.png" 
                loading="lazy" 
                width="20" 
                height="36" 
                alt="Facebook for Boston Legend ice cream truck"
              />
              <img 
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f63235d7e7fa1c200_boston-legend-ice-cream-truck-truck-instagram.png" 
                loading="lazy" 
                width="33" 
                height="33" 
                alt="instagram for Boston Legend ice cream truck"
              />
              <img 
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f48b5da6eaf60bedd_boston-legend-ice-cream-truck-tiktok.png" 
                loading="lazy" 
                width="30" 
                height="34" 
                alt="Tiktok for Boston Legend ice cream truck"
              />
            </div>
          </div>

          {/* Column 2: 12 Occasions */}
          <div className="footer-col-s">
            <div className="footer-titel">Ice Cream Event Catering</div>
            <div className="w-dyn-list">
              <div role="list" className="w-dyn-items">
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/birthday-parties" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">Birthday Parties</div>
                      <div className="footer-link-o">Birthday Parties</div>
                    </div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/block-parties" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">Block Parties</div>
                      <div className="footer-link-o">Block Parties</div>
                    </div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/corporate-parties" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">Corporate Parties</div>
                      <div className="footer-link-o">Corporate Parties</div>
                    </div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/fundraisers" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">Fundraisers</div>
                      <div className="footer-link-o">Fundraisers</div>
                    </div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/launch-parties" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">Launch Parties</div>
                      <div className="footer-link-o">Launch Parties</div>
                    </div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/marketing-events" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">Marketing Events</div>
                      <div className="footer-link-o">Marketing Events</div>
                    </div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/movie-rental" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">Movie Rental</div>
                      <div className="footer-link-o">Movie Rental</div>
                    </div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/photo-sessions" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">Photo Sessions</div>
                      <div className="footer-link-o">Photo Sessions</div>
                    </div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/reunions" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">Reunions</div>
                      <div className="footer-link-o">Reunions</div>
                    </div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/school-occasions" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">School Occasions</div>
                      <div className="footer-link-o">School Occasions</div>
                    </div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/sports-occasions" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">Sports Occasions</div>
                      <div className="footer-link-o">Sports Occasions</div>
                    </div>
                  </Link>
                </div>
                <div role="listitem" className="w-dyn-item">
                  <Link href="/occasions/wedding-receptions" className="footer-link w-inline-block">
                    <div className="footer-link-move">
                      <div className="footer-link-w">Wedding Receptions</div>
                      <div className="footer-link-o">Wedding Receptions</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Site Links, Call Us, Work Hours */}
          <div className="footer-col-s">
            <div className="footer-titel">Ice Cream Event Catering</div>
            <div>
              <Link href="/" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">Home</div>
                  <div className="footer-link-o">Home</div>
                </div>
              </Link>
            </div>
            <div>
              <Link href="/menu" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">Menu</div>
                  <div className="footer-link-o">Menu</div>
                </div>
              </Link>
            </div>
            <div>
              <Link href="/packages" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">Products</div>
                  <div className="footer-link-o">Products</div>
                </div>
              </Link>
            </div>
            <div>
              <Link href="/blog" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">Blog</div>
                  <div className="footer-link-o">Blog</div>
                </div>
              </Link>
            </div>
            <div>
              <Link href="/contact-us" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">Contact Us</div>
                  <div className="footer-link-o">Contact Us</div>
                </div>
              </Link>
            </div>
            <div>
              <Link href="/manage-booking" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">Manage Booking</div>
                  <div className="footer-link-o">Manage Booking</div>
                </div>
              </Link>
            </div>

            <div className="footer-titel-s mt-6">Call Us</div>
            <div>
              <a href="tel:6179993803" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">617-999-3803</div>
                  <div className="footer-link-o">617-999-3803</div>
                </div>
              </a>
            </div>
            <div>
              <a href="tel:7819213233" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">781-921-3233</div>
                  <div className="footer-link-o">781-921-3233</div>
                </div>
              </a>
            </div>
            <div>
              <a href="tel:6178662727" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">617-866-2727</div>
                  <div className="footer-link-o">617-866-2727</div>
                </div>
              </a>
            </div>

            <div className="footer-titel-s mt-4">Work Hours</div>
            <div>Open 24 Hours for Scheduled Events</div>
            <div>Available 24 hours by reservation</div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="copyright">
        <div className="w-layout-blockcontainer container w-container">
          <div className="w-layout-hflex copy-flex">
            <div>Boston Legend Copyright © 2026, All rights reserved.</div>
            <div>Powered by <a href="https://www.dvyns.com/" target="_blank" className="blue-link">DVYNS</a></div>
          </div>
        </div>
      </div>
    </footer>
  );
}

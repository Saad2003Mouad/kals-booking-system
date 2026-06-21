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

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="w-layout-blockcontainer container w-container">
        <div className="row">
          {/* العمود الأول */}
          <div className="footer-col-l">
            <img
              src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif"
              loading="lazy"
              width={165}
              height={63}
              alt="Boston legend ice cream truck logo"
            />
            <p className="footer-p">
              Make your events extra special with our ice cream truck catering! From birthdays to weddings and everything in between, we bring premium flavors and smiles right to your celebration. Serving Greater Boston, we’re here to sweeten every moment.
            </p>
            <Link href="/packages" className="link-bt">
              Reserve Now
            </Link>

            <div className="w-layout-hflex social-row">
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
                alt="instagram for Boston Legend ice cream truck"
              />
              <img
                src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/681bd97f48b5da6eaf60bedd_boston-legend-ice-cream-truck-tiktok.png"
                loading="lazy"
                width={30}
                height={34}
                alt="Tiktok for Boston Legend ice cream truck"
              />
            </div>
          </div>

          {/* العمود الثاني: 12 Occasions */}
          <div className="footer-col-s">
            <div className="footer-titel">Ice Cream Event Catering</div>
            <div className="w-dyn-list">
              <div role="list" className="w-dyn-items">
                {OCCASIONS_LIST.map((item) => (
                  <div role="listitem" className="w-dyn-item" key={item.slug}>
                    <Link href={`/occasions/${item.slug}`} className="footer-link w-inline-block">
                      <div className="footer-link-move">
                        <div className="footer-link-w">{item.name}</div>
                        <div className="footer-link-o">{item.name}</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* العمود الثالث: Site Links, Call Us, Work Hours */}
          <div className="footer-col-s">
            <div className="footer-titel">Ice Cream Event Catering</div>

            <div>
              <Link href="/" aria-current="page" className="footer-link w-inline-block w--current">
                <div className="footer-link-move">
                  <div className="footer-link-w">Home</div>
                  <div className="footer-link-o">Home</div>
                </div>
              </Link>
            </div>

            <div>
              <Link href="/about" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">Menu</div>
                  <div className="footer-link-o">Menu</div>
                </div>
              </Link>
            </div>

            <div>
              <Link href="/menu" className="footer-link w-inline-block">
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

            <div className="footer-titel-s">Call Us</div>
            <div>
              <a href="tel:6179993803" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">617-999-3803</div>
                  <div className="footer-link-o">617-999-3803</div>
                </div>
              </a>
            </div>

            <div>
              <a href="tel:+16179993803" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">617-999-3803</div>
                  <div className="footer-link-o">617-999-3803</div>
                </div>
              </a>
            </div>

            <div className="footer-titel-s">Work Hours</div>
            <div>Mon-Fri: 8:00AM - 10:00PM</div>
            <div>Sat-Sun: 9:00AM - 10:00PM</div>
          </div>

        </div>
      </div>

      {/* شريط حقوق الملكية */}
      <div className="copyright">
        <div className="w-layout-blockcontainer container w-container">
          <div className="w-layout-hflex copy-flex">
            <div>Boston Legend Copyright © {new Date().getFullYear()}, All rights reserved.</div>
            <div>
              Powered by <a href="https://www.dvyns.com/" target="_blank" rel="noreferrer" className="blue-link">DVYNS</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
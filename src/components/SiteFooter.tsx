"use client";
import React from "react";
import Link from "next/link";

// قمنا بفصل القائمة هنا لتنظيف الكود وتجنب أخطاء الأقواس المفتوحة
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
      <div className="w-layout-blockcontainer container w-container px-5 md:px-0">

        <div className="row flex flex-col lg:flex-row gap-10 lg:gap-0">

          {/* العمود الأول */}
          <div className="footer-col-l w-full lg:w-2/5">
            <img
              src="https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif"
              loading="lazy"
              width={165}
              height={63}
              alt="Boston legend ice cream truck logo"
            />
            <p className="footer-p mt-4">
              Make your events extra special with our ice cream truck catering! From birthdays to weddings and everything in between, we bring premium flavors and smiles right to your celebration. Serving Greater Boston, we’re here to sweeten every moment.
            </p>
            <Link href="/packages" className="link-bt mt-4 inline-block">
              Reserve Now
            </Link>

            <div className="w-layout-hflex social-row mt-6">
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
          <div className="footer-col-s w-full lg:w-1/3">
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
          <div className="footer-col-s w-full lg:w-1/4">
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
              <Link href="/packages" className="footer-link w-inline-block">
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
              <a href="tel:6178662727" className="footer-link w-inline-block">
                <div className="footer-link-move">
                  <div className="footer-link-w">617-866-2727</div>
                  <div className="footer-link-o">617-866-2727</div>
                </div>
              </a>
            </div>

            <div className="footer-titel-s mt-4">Work Hours</div>
            <div className="mb-2">Open 24 Hours for Scheduled Events</div>
            <div>Available 24 hours by reservation</div>
          </div>

        </div>
      </div>

      {/* شريط حقوق الملكية */}
      <div className="copyright mt-10">
        <div className="w-layout-blockcontainer container w-container">
          <div className="w-layout-hflex copy-flex flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4 md:gap-0">
            <div>Boston Legend Copyright © 2026, All rights reserved.</div>
            <div>
              Powered by <a href="https://www.dvyns.com/" target={"_blank"} rel="noreferrer" className="blue-link">DVYNS</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
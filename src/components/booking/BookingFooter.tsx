"use client";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";

const LOGO = "https://cdn.prod.website-files.com/67dc601bc29781a5af1632a2/67e3936366827af4bed1d0d0_logo-boston-legend-ice-cream-truck.avif";
const BRAND_NAVY = "#000223";
const BRAND_GOLD = "#FFA000";

export default function BookingFooter() {
  return (
    <footer style={{ background: BRAND_NAVY, color: "white" }} className="pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Image src={LOGO} alt="Boston Legend" width={165} height={63} className="mb-6 h-12 w-auto" unoptimized />
            <p className="text-white/60 text-sm font-semibold leading-relaxed mb-8">
              Make your events extra special with our ice cream truck catering! From birthdays to weddings and everything in between, we bring premium flavors and smiles right to your celebration. Serving Greater Boston, we’re here to sweeten every moment.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FFA000] hover:text-[#000223] transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Occasions Col */}
          <div>
            <h4 className="text-lg font-black mb-6 text-white">Event Catering</h4>
            <ul className="space-y-3">
              {["Birthday Parties", "Block Parties", "Corporate Parties", "Fundraisers", "Wedding Receptions", "School Occasions"].map(item => (
                <li key={item}>
                  <a href={`/occasions/${item.toLowerCase().replace(" ", "-")}`} className="text-white/50 hover:text-[#FFA000] text-sm font-bold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="text-lg font-black mb-6 text-white">Company</h4>
            <ul className="space-y-3">
              {["Home", "About Us", "Our Menu", "Packages", "Contact Us", "Privacy Policy"].map(item => (
                <li key={item}>
                  <a href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`} className="text-white/50 hover:text-[#FFA000] text-sm font-bold transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-lg font-black mb-6 text-white">Contact Us</h4>
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Direct Line</div>
                <a href="tel:6179993803" className="text-xl font-black text-[#FFA000] hover:underline">617-999-3803</a>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Office Hours</div>
                <div className="text-sm font-bold text-white/70">Mon-Fri: 8:00AM - 10:00PM</div>
                <div className="text-sm font-bold text-white/70">Sat-Sun: 9:00AM - 10:00PM</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Service Area</div>
                <div className="text-sm font-bold text-white/70">📍 Greater Boston, Massachusetts</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[11px] font-bold text-white/20 uppercase tracking-widest">
            © {new Date().getFullYear()} Boston Legend Ice Cream Truck. All rights reserved.
          </div>
          <div className="text-[11px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1">
            Powered by <span className="text-[#FFA000]">DVYNS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

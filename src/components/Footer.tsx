import { Link } from "react-router-dom";
import { Phone, MapPin, Instagram, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/gabru-logo.png";
import qrCode from "@/assets/gabru-qr.png";
import tiktokQr from "@/assets/gabru-tiktok-qr.png";

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* CTA Banner */}
      <div className="gold-gradient py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-2xl md:text-3xl text-primary-content">Ready for a Premium Experience?</h3>
            <p className="text-primary-content/80 mt-1">Book your appointment today and discover the Gabru difference.</p>
          </div>
          <Link to="/book">
            <Button size="lg" className="btn bg-base-100 text-base-content hover:bg-base-200 border-none font-semibold px-8 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Book Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <img src={logo} alt="Gabru Looks" className="h-20 w-auto mb-4 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" />
            <p className="text-sm text-neutral-content/60 italic font-heading">Where Hair Meets The Artist</p>
            <p className="text-sm text-neutral-content/50 leading-relaxed">Premium grooming experience in Werribee, Australia. Precision cuts, expert styling, and premium care.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span> Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/services", label: "Services" },
                { to: "/shop", label: "Shop" },
                { to: "/gallery", label: "Gallery" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-neutral-content/60 hover:text-primary transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 -ml-6 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-xl text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span> Contact Us
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-sm text-neutral-content/60 group cursor-pointer hover:text-primary transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                </div>
                <span className="mt-1">263 Heaths Rd, Werribee VIC 3030, Australia</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-neutral-content/60 group cursor-pointer hover:text-primary transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                </div>
                <a href="tel:+61460309333" className="transition-colors">+61 460 309 333</a>
              </li>
              <li className="flex items-center gap-4 text-sm text-neutral-content/60 group cursor-pointer hover:text-primary transition-colors">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Instagram className="w-5 h-5 text-primary shrink-0" />
                </div>
                <a href="https://www.instagram.com/gabru_looks/" target="_blank" rel="noopener noreferrer" className="transition-colors">@gabru_looks</a>
              </li>
              <li className="flex items-start gap-4 text-sm text-neutral-content/60">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary shrink-0" />
                </div>
                <div className="mt-1 space-y-1">
                  <p>Mon–Fri: 9:00 AM – 7:00 PM</p>
                  <p>Sat–Sun: 9:00 AM – 6:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* QR Codes */}
          <div>
            <h4 className="font-heading text-xl text-primary mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span> Follow Us
            </h4>
            <div className="flex gap-4">
              <div className="group">
                <p className="text-xs text-neutral-content/40 mb-2 group-hover:text-primary transition-colors">Instagram</p>
                <div className="p-2 bg-base-100 rounded-xl transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <img src={qrCode} alt="Instagram QR Code" className="w-20 h-20 rounded-lg" />
                </div>
              </div>
              <div className="group">
                <p className="text-xs text-neutral-content/40 mb-2 group-hover:text-primary transition-colors">TikTok</p>
                <div className="p-2 bg-base-100 rounded-xl transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <img src={tiktokQr} alt="TikTok QR Code" className="w-20 h-20 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-content/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-content/40">© {new Date().getFullYear()} Gabru Looks | Where Hair Meets The Artist</p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/gabru_looks/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-neutral-content/5 flex items-center justify-center text-neutral-content/60 hover:text-primary hover:bg-primary/20 transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <span className="w-10 h-10 rounded-full bg-neutral-content/5 flex items-center justify-center text-neutral-content/60 hover:text-primary hover:bg-primary/20 transition-all duration-300 hover:scale-110 cursor-pointer">
              <TikTokIcon />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

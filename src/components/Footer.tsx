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
            <h3 className="font-heading text-2xl md:text-3xl text-background">Ready for a Premium Experience?</h3>
            <p className="text-background/80 mt-1">Book your appointment today and discover the Gabru difference.</p>
          </div>
          <Link to="/book">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8">
              Book Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img src={logo} alt="Gabru Looks" className="h-16 w-auto mb-4 brightness-0 invert" />
            <p className="text-sm text-secondary-foreground/60 italic mb-4 font-heading">Where Hair Meets The Artist</p>
            <p className="text-sm text-secondary-foreground/50">Premium grooming experience in Werribee, Australia. Precision cuts, expert styling, and premium care.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg text-primary mb-6">Quick Links</h4>
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
                  <Link to={link.to} className="text-sm text-secondary-foreground/50 hover:text-primary transition-colors flex items-center gap-2">
                    <ArrowRight className="w-3 h-3" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg text-primary mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-secondary-foreground/50">
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                263 Heaths Rd, Werribee VIC 3030, Australia
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/50">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+61460309333" className="hover:text-primary transition-colors">+61 460 309 333</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/50">
                <Instagram className="w-4 h-4 text-primary shrink-0" />
                <a href="https://www.instagram.com/gabru_looks/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@gabru_looks</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-secondary-foreground/50">
                <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p>Mon–Fri: 9:00 AM – 7:00 PM</p>
                  <p>Sat–Sun: 9:00 AM – 6:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          {/* QR Codes */}
          <div>
            <h4 className="font-heading text-lg text-primary mb-6">Follow Us</h4>
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-secondary-foreground/40 mb-2">Instagram</p>
                <img src={qrCode} alt="Instagram QR Code" className="w-24 h-24 rounded-xl border border-secondary-foreground/10" />
              </div>
              <div>
                <p className="text-xs text-secondary-foreground/40 mb-2">TikTok</p>
                <img src={tiktokQr} alt="TikTok QR Code" className="w-24 h-24 rounded-xl border border-secondary-foreground/10" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-secondary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-foreground/40">© 2025 Gabru Looks | Where Hair Meets The Artist</p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/gabru_looks/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-foreground/40 hover:text-primary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <span className="text-secondary-foreground/40 hover:text-primary transition-colors cursor-pointer">
              <TikTokIcon />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

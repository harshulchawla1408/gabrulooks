import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/gabru-logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/shop", label: "Shop" },
  { to: "/gallery", label: "Gallery" },
  { to: "/loyalty", label: "Rewards" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";
  const navBg = scrolled
    ? "bg-black/30 backdrop-blur-md"
    : "bg-transparent";

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
    >
      <div className="container mx-auto flex items-center justify-between h-24 px-4">
        <Link to="/" className="flex items-center gap-3 relative top-1">
          <div className="absolute inset-0 bg-[#C9A14A]/20 blur-xl rounded-full scale-150" />
          <img src={logo} alt="Gabru Looks" className="h-[76px] w-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] relative z-10" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative group text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                location.pathname === link.to
                  ? "text-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
              {location.pathname === link.to ? (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#C9A14A] rounded-full shadow-[0_0_8px_rgba(201,161,74,0.6)]"
                />
              ) : (
                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#C9A14A] rounded-full transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(201,161,74,0.6)]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/book">
            <Button size="sm" className="rounded-full bg-[#C9A14A] hover:bg-[#D4AF37] text-black hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(201,161,74,0.3)] hover:shadow-[0_0_25px_rgba(201,161,74,0.6)] border-none">
              Book Now
            </Button>
          </Link>
          <a href="tel:+61460309333">
            <Button variant="outline" size="sm" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white/80 transition-all duration-300">
              <Phone className="w-4 h-4 mr-1" /> Call
            </Button>
          </a>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button size="sm" variant="outline" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white/80 transition-all duration-300">
                  <User className="w-4 h-4 mr-1" /> Dashboard
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={signOut} className="rounded-full bg-transparent text-white/80 hover:text-red-400 hover:bg-white/10 transition-all duration-300 h-9 w-9 p-0 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="outline" className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white/80 transition-all duration-300">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden rounded-full p-2 text-white hover:bg-white/10 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-base-100/95 backdrop-blur-2xl border-b border-primary/10 overflow-hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium tracking-wide uppercase transition-all ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-base-content/60 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-4">
                <a href="tel:+61460309333" className="flex-1">
                  <Button variant="outline" className="btn btn-outline btn-primary w-full rounded-full">
                    <Phone className="w-4 h-4 mr-1" /> Call
                  </Button>
                </a>
                {user ? (
                  <Link to="/dashboard" className="flex-1" onClick={() => setOpen(false)}>
                    <Button className="btn btn-primary w-full rounded-full border-none">Dashboard</Button>
                  </Link>
                ) : (
                  <Link to="/login" className="flex-1" onClick={() => setOpen(false)}>
                    <Button className="btn btn-primary w-full rounded-full border-none">Sign In</Button>
                  </Link>
                )}
              </div>
              {user && (
                <Button variant="ghost" onClick={() => { signOut(); setOpen(false); }} className="btn btn-ghost mt-2 text-error w-full">
                  <LogOut className="w-4 h-4 mr-1" /> Sign Out
                </Button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;

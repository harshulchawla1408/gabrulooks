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
  const navBg = scrolled || !isHome
    ? "bg-base-100/80 backdrop-blur-2xl border-b border-primary/10 shadow-sm"
    : "bg-transparent border-b border-transparent";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="container mx-auto flex items-center justify-between h-20 px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Gabru Looks" className="h-14 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-primary ${
                location.pathname === link.to
                  ? "text-primary"
                  : scrolled || !isHome ? "text-foreground/70" : "text-foreground/80"
              }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 gold-gradient rounded-full"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/book">
            <Button size="sm" className="btn btn-primary btn-sm rounded-full text-primary-content hover:scale-105 transition-transform shadow-md border-none">
              Book Now
            </Button>
          </Link>
          <a href="tel:+61460309333">
            <Button variant="outline" size="sm" className="btn btn-outline btn-primary btn-sm rounded-full">
              <Phone className="w-4 h-4 mr-1" /> Call
            </Button>
          </a>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button size="sm" variant="outline" className="btn btn-outline btn-primary btn-sm rounded-full">
                  <User className="w-4 h-4 mr-1" /> Dashboard
                </Button>
              </Link>
              <Button size="sm" variant="ghost" onClick={signOut} className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-error">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" variant="outline" className="btn btn-outline btn-primary btn-sm rounded-full">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden btn btn-ghost btn-circle" onClick={() => setOpen(!open)}>
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
    </header>
  );
};

export default Navbar;

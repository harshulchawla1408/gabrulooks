import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Scissors, Star, MapPin, Phone, ChevronRight, Quote, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { services, barbers, reviews } from "@/data/salonData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import StatsCounter from "@/components/StatsCounter";

import logo from "@/assets/gabru-logo.png";
import qrCode from "@/assets/gabru-qr.png";
import tiktokQr from "@/assets/gabru-tiktok-qr.png";
import heroImage from "@/assets/hero-barbershop.jpg";
import barberCutting from "@/assets/barber-cutting.jpg";
import beardTrim from "@/assets/beard-trim.jpg";
import salonInterior from "@/assets/salon-interior.jpg";
import barberPortrait1 from "@/assets/barber-portrait-1.jpg";
import barberPortrait2 from "@/assets/barber-portrait-2.jpg";
import barberPortrait3 from "@/assets/barber-portrait-3.jpg";

const barberImages = [barberPortrait1, barberPortrait2, barberPortrait3];

const letterReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.5 + i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const HeroTitle = ({ text, className = "" }: { text: string; className?: string }) => (
  <span className={`inline-block ${className}`}>
    {text.split("").map((char, i) => (
      <motion.span key={i} custom={i} variants={letterReveal} initial="hidden" animate="visible" className="inline-block">
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </span>
);

const Index = () => {
  const featuredServices = services.filter((s) => s.category === "men").slice(0, 6);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="overflow-hidden">
      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img src={heroImage} alt="Gabru Looks Salon" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-secondary/30 to-background/80" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, y: textY }} className="relative z-10 container mx-auto px-4 text-center pt-20">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <img src={logo} alt="Gabru Looks" className="w-36 md:w-52 mx-auto mb-8 drop-shadow-2xl" />
          </motion.div>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }} className="w-20 h-px mx-auto mb-8 bg-primary/60 origin-center" />

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-secondary-foreground mb-4 leading-tight">
            <HeroTitle text="Crafted Precision." />
            <br />
            <span className="gold-text-gradient">
              <HeroTitle text="Styled Perfection." />
            </span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.4 }} className="text-secondary-foreground/60 text-lg md:text-xl mb-12 max-w-lg mx-auto font-heading italic">
            Where Hair Meets The Artist
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.7, ease: "easeOut" }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="gold-gradient text-background font-semibold text-base px-10 py-7 hover:shadow-xl transition-shadow duration-500">
                Book Appointment
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/5 text-base px-10 py-7 transition-all duration-500">
                View Services <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
          <span className="text-secondary-foreground/40 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="w-5 h-5 text-primary/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Gold Divider ─── */}
      <div className="flex items-center justify-center py-4">
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/30" />
        <Scissors className="w-4 h-4 text-primary/40 mx-3" />
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/30" />
      </div>

      {/* ─── Services ─── */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">Our Expertise</p>
              <h2 className="font-heading text-3xl md:text-5xl text-foreground">
                Premium <span className="gold-text-gradient">Services</span>
              </h2>
            </div>
          </ScrollReveal>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-14"
          >
            {featuredServices.map((service) => (
              <SwiperSlide key={service.name}>
                <div className="premium-card p-7 text-center group cursor-pointer">
                  <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-500">
                    <Scissors className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg text-foreground mb-3 group-hover:text-primary transition-colors duration-500">{service.name}</h3>
                  <div className="flex items-center justify-center gap-3 mb-5">
                    <span className="text-primary font-bold text-xl">{service.cashPrice}</span>
                    <span className="text-muted-foreground text-xs">Cash</span>
                  </div>
                  <Link to="/book">
                    <Button size="sm" className="w-full gold-gradient text-background font-semibold text-xs opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <ScrollReveal delay={200}>
            <div className="text-center mt-10">
              <Link to="/services">
                <Button variant="outline" size="lg" className="border-primary/20 text-primary hover:bg-accent transition-all duration-500">
                  View All Services <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Cinematic Image Break ─── */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <ScrollReveal className="h-full" direction="none">
          <div className="h-full relative">
            <img src={salonInterior} alt="Salon Interior" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-secondary/30 to-transparent" />
          </div>
        </ScrollReveal>
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <ScrollReveal>
            <div className="text-center">
              <p className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4">Est. 2025</p>
              <h2 className="font-heading text-3xl md:text-5xl text-secondary-foreground leading-tight">
                Where Hair Meets <span className="gold-text-gradient">The Artist</span>
              </h2>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Barbers ─── */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">Meet The Team</p>
              <h2 className="font-heading text-3xl md:text-5xl text-foreground">
                Our Expert <span className="gold-text-gradient">Barbers</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {barbers.map((barber, i) => (
              <ScrollReveal key={barber.name} delay={i * 100}>
                <div className="premium-card overflow-hidden group">
                  <div className="h-80 relative overflow-hidden">
                    <img
                      src={barberImages[i]}
                      alt={barber.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      <Link to="/book">
                        <Button size="sm" className="w-full gold-gradient text-background font-semibold">
                          Book with Me
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-heading text-xl text-foreground mb-1">{barber.name}</h3>
                    <p className="text-primary text-sm font-medium mb-1">{barber.specialty}</p>
                    <p className="text-muted-foreground text-xs">{barber.experience} experience</p>
                    <div className="flex justify-center gap-0.5 mt-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <StatsCounter />

      {/* ─── Testimonials ─── */}
      <section className="py-28 bg-accent/20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">Testimonials</p>
              <h2 className="font-heading text-3xl md:text-5xl text-foreground">
                What Our <span className="gold-text-gradient">Clients Say</span>
              </h2>
            </div>
          </ScrollReveal>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-14 max-w-5xl mx-auto"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.name}>
                <div className="glass-testimonial p-8 h-full">
                  <Quote className="w-7 h-7 text-primary/25 mb-4" />
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 italic leading-relaxed">"{review.text}"</p>
                  <p className="text-foreground font-medium text-sm">{review.name}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ─── Service Showcase ─── */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[50vh]">
          <ScrollReveal direction="left" className="h-full">
            <div className="relative h-full overflow-hidden">
              <img src={barberCutting} alt="Precision Haircut" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-secondary/20" />
              <div className="absolute bottom-6 left-6">
                <span className="bg-background/90 backdrop-blur-sm text-foreground text-xs px-4 py-2 rounded-full font-medium">Precision Cuts</span>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" className="h-full">
            <div className="relative h-full overflow-hidden">
              <img src={beardTrim} alt="Beard Sculpting" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-secondary/20" />
              <div className="absolute bottom-6 left-6">
                <span className="bg-background/90 backdrop-blur-sm text-foreground text-xs px-4 py-2 rounded-full font-medium">Beard Sculpting</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Location ─── */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">Find Us</p>
              <h2 className="font-heading text-3xl md:text-5xl text-foreground">
                Visit Our <span className="gold-text-gradient">Salon</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ScrollReveal direction="left">
              <div className="rounded-2xl overflow-hidden h-80 lg:h-full min-h-[320px] shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3145.8!2d144.6561!3d-37.8887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDUzJzE5LjMiUyAxNDTCsDM5JzIxLjgiRQ!5e0!3m2!1sen!2sau!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Gabru Looks Location"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={100}>
              <div className="premium-card p-8 flex flex-col justify-center gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg text-foreground mb-1">Address</h4>
                    <p className="text-muted-foreground text-sm">263 Heaths Rd, Werribee VIC 3030, Australia</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg text-foreground mb-1">Phone</h4>
                    <a href="tel:+61460309333" className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300">+61 460 309 333</a>
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <a href="tel:+61460309333">
                    <Button className="gold-gradient text-background font-semibold shadow-md transition-shadow duration-500 hover:shadow-xl">
                      <Phone className="w-4 h-4 mr-1" /> Call Now
                    </Button>
                  </a>
                  <a href="https://maps.google.com/?q=263+Heaths+Rd+Werribee+VIC+3030" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-primary/20 text-primary hover:bg-accent transition-all duration-500">
                      <MapPin className="w-4 h-4 mr-1" /> Directions
                    </Button>
                  </a>
                </div>
                <div className="mt-4 flex gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs mb-2">Instagram</p>
                    <img src={qrCode} alt="Instagram QR" className="w-20 h-20 rounded-xl border border-border" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-2">TikTok</p>
                    <img src={tiktokQr} alt="TikTok QR" className="w-20 h-20 rounded-xl border border-border" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

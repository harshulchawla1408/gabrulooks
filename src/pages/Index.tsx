import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Scissors, Star, MapPin, Phone, ChevronRight, Quote, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { services as staticServices, reviews as staticReviews } from "@/data/salonData";
import { useBarbers } from "@/hooks/useBarbers";
import { useServices, formatPrice } from "@/hooks/useServices";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import StatsCounter from "@/components/StatsCounter";

import qrCode from "@/assets/gabru-qr.png";
import tiktokQr from "@/assets/gabru-tiktok-qr.png";
import heroImage from "@/assets/hero-image.png";
import barberCutting from "@/assets/barber-cutting.jpg";
import beardTrim from "@/assets/beard-trim.jpg";
import salonInterior from "@/assets/salon-interior.jpg";

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
  const { data: dbBarbers } = useBarbers(true);
  const { data: dbServices } = useServices(true);
  
  const { data: dbReviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews" as any).select("*");
      if (error) return null;
      return data;
    }
  });

  const activeServices = dbServices?.length ? dbServices : staticServices.map((s, i) => ({ ...s, id: String(i), cash_price: parseInt(s.cashPrice.replace(/\D/g, '')) * 100 }));
  const featuredServices = activeServices.filter((s: any) => s.category === "men").slice(0, 6);
  
  const activeBarbers = dbBarbers || [];
  const activeReviews = dbReviews?.length ? dbReviews : staticReviews;
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div className="overflow-hidden -mt-24">
      {/* ─── Hero ─── */}
      <section ref={heroRef} className="relative min-h-screen w-full flex items-center justify-start overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0 w-full h-full will-change-transform">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <motion.img
              src={heroImage}
              alt="Luxury Salon Background"
              className="w-full h-full object-cover object-center"
              loading="eager"
              animate={{ scale: [1, 1.1, 1], x: [0, 10, -10, 0], y: [0, -10, 10, 0] }}
              transition={{ duration: 30, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
          </motion.div>
          {/* Gradient Overlay for Left-to-Right Fade */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.05) 85%, transparent 100%)"
            }}
          />
          {/* Subtle Film Grain Noise */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />
          {/* Vignette Effect */}
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.6)] pointer-events-none" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, y: textY }} className="relative z-10 w-full container mx-auto px-6 md:px-8 lg:px-10 xl:px-12 pt-32 flex flex-col items-center md:items-start text-center md:text-left">
          
          <div className="md:max-w-3xl flex flex-col items-center md:items-start">
            <h1 className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] text-white mb-2 leading-[1.1] font-bold tracking-tight">
              <HeroTitle text="Crafted Precision." className="tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
              <br />
              <motion.span 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                 className="inline-block mt-3 text-[#C9A14A] text-[2.5rem] md:text-6xl lg:text-[4.5rem] relative drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] [text-shadow:0_0_20px_rgba(201,161,74,0.4)]"
              >
                <span className="relative inline-block overflow-hidden pb-1 px-1 -mx-1">
                  Styled Perfection.
                  <motion.div 
                    className="absolute top-0 bottom-0 w-[50%] bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none"
                    initial={{ left: "-100%" }}
                    animate={{ left: "200%" }}
                    transition={{ duration: 2, delay: 2.5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                  />
                </span>
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 1, delay: 1.8 }} 
              className="text-white/60 text-xs md:text-sm mt-8 mb-12 tracking-[0.4em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium"
            >
              Where Hair Meets The Artist
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.7, delay: 2.1, ease: "easeOut" }} 
              className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
            >
              <Link to="/book" className="w-full sm:w-auto group">
                <Button size="lg" className="h-auto w-full rounded-full px-10 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold bg-[#C9A14A] hover:bg-[#D4AF37] text-black border-none transition-all duration-300 shadow-[0_4px_15px_rgba(201,161,74,0.3)] group-hover:shadow-[0_0_35px_rgba(201,161,74,0.8)] group-hover:-translate-y-1 group-hover:scale-105">
                  Book Appointment
                </Button>
              </Link>
              <Link to="/services" className="w-full sm:w-auto group">
                <Button size="lg" variant="outline" className="h-auto w-full rounded-full px-10 md:px-12 py-4 md:py-5 text-base md:text-lg font-bold text-white border border-white/40 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/80 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] group-hover:-translate-y-1 group-hover:scale-105">
                  View Services
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

      </section>

      {/* ─── Gold Divider ─── */}
      <div className="flex items-center justify-center py-4">
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/30" />
        <Scissors className="w-4 h-4 text-primary/40 mx-3" />
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/30" />
      </div>

    {/* ─── Services ─── */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-base-300/30 -z-10" />
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
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-16"
          >
            {featuredServices.map((service: any, index: number) => (
              <SwiperSlide key={service.id || service.name}>
                <div className="relative premium-card group cursor-pointer overflow-hidden h-full min-h-[300px]">
                  {index < 2 && (
                    <div className="absolute top-4 right-4 z-10 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[10px] uppercase font-bold px-3 py-1 rounded-full drop-shadow-md">
                      Most Popular
                    </div>
                  )}
                  <div className="card-body items-center text-center p-8 z-10 relative bg-base-100/40 backdrop-blur-[2px]">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-500 shadow-md">
                      <Scissors className="w-7 h-7 text-primary group-hover:text-black group-hover:rotate-[15deg] transition-all duration-500" />
                    </div>
                    <h3 className="card-title font-heading text-xl text-foreground mb-3 tracking-wide">{service.name}</h3>
                    <div className="flex items-baseline justify-center gap-2 mb-8">
                      <span className="text-primary font-bold text-3xl">{service.cash_price ? formatPrice(service.cash_price) : service.cashPrice}</span>
                    </div>
                    <Link to="/book" className="w-full mt-auto">
                      <Button className="btn btn-primary w-full rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 border-none shadow-[0_4px_15px_rgba(201,161,74,0.3)] hover:shadow-[0_0_20px_rgba(201,161,74,0.6)] text-black">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <ScrollReveal delay={200}>
            <div className="text-center mt-8">
              <Link to="/services">
                <Button variant="outline" size="lg" className="btn btn-outline btn-primary rounded-full px-10 hover:-translate-y-1 transition-transform border-primary/50 text-foreground hover:bg-primary hover:text-black">
                  View All Services <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Cinematic Image Break ─── */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src={salonInterior} 
            alt="Salon Interior Break" 
            className="w-full h-full object-cover transition-transform group-hover:scale-110 filter brightness-[0.4]" 
            style={{ transitionDuration: "20s" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-transparent to-[#111] opacity-90" />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <ScrollReveal>
            <div className="text-center px-4 transition-transform group-hover:-translate-y-4" style={{ transitionDuration: "10s" }}>
              <p className="text-primary/80 text-xs md:text-sm uppercase tracking-[0.5em] mb-6 font-bold drop-shadow-md relative inline-block">
                Est. 2025
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-px bg-primary/50" />
              </p>
              <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl text-white leading-tight drop-shadow-2xl font-bold mt-4">
                Where Hair Meets <span className="text-primary drop-shadow-[0_0_15px_rgba(201,161,74,0.4)]">The Artist</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {activeBarbers.map((barber, i) => (
              <ScrollReveal key={barber.id} delay={i * 100}>
                <div className="group relative bg-[#111] overflow-hidden rounded-2xl border border-white/5 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(201,161,74,0.15)] flex flex-col items-center pt-10 pb-8 px-6 text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-white/10 group-hover:border-primary transition-colors duration-500 shadow-xl relative">
                    <img
                      src={barber.photo_url || `/placeholder.svg`}
                      alt={barber.display_name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] pointer-events-none" />
                  </div>
                  <h3 className="font-heading text-2xl text-foreground mb-1 group-hover:text-primary transition-colors duration-300 drop-shadow-md">{barber.display_name}</h3>
                  <p className="text-primary font-medium tracking-wide text-xs uppercase">{barber.specialty || "Master Barber"}</p>
                  
                  <div className="flex gap-1 mt-4 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-primary fill-primary drop-shadow-[0_0_5px_rgba(201,161,74,0.5)]" />
                    ))}
                  </div>
                  
                  <p className="text-white/60 text-sm mb-6 flex-grow">{barber.experience || "5+"} years experience</p>
                  
                  <Link to={`/book?barber=${barber.id}`} className="w-full">
                    <Button className="w-full rounded-full border border-primary/50 bg-transparent hover:bg-primary text-primary hover:text-black transition-all duration-300">
                      Book {barber.display_name.split(' ')[0]}
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
            {activeBarbers.length === 0 && (
              <div className="col-span-3 text-center text-white/50 italic py-10">
                No active barbers available at the moment.
              </div>
            )}
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
            spaceBetween={32}
            slidesPerView={1.2}
            centeredSlides={true}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 2.5 } }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-16 max-w-7xl mx-auto testimonial-swiper"
          >
            {activeReviews.map((review: any, index: number) => (
              <SwiperSlide key={index}>
                {({ isActive }) => (
                  <div className={`card transition-all duration-700 h-full ${isActive ? 'scale-100 opacity-100 shadow-[0_0_40px_rgba(201,161,74,0.15)] bg-base-100/80 border-primary/30 z-10' : 'scale-95 opacity-50 bg-base-100/40 border-primary/5 blur-[2px]'} backdrop-blur-2xl border`}>
                    <div className="card-body p-8 sm:p-10">
                      {index === 0 && isActive && (
                        <div className="absolute top-0 right-8 -translate-y-1/2 bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30 flex items-center gap-1 backdrop-blur-md">
                          <Star className="w-3 h-3 fill-yellow-500" /> Google Review
                        </div>
                      )}
                      <Quote className={`w-12 h-12 mb-6 transition-colors duration-500 ${isActive ? 'text-primary' : 'text-primary/20'}`} />
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: review.rating || 5 }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 text-primary fill-primary drop-shadow-[0_0_8px_rgba(201,161,74,0.6)]" />
                        ))}
                      </div>
                      <p className={`text-base mb-8 italic leading-relaxed flex-grow transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/60'}`}>"{review.text || review.comment}"</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg border border-primary/30 shadow-inner">
                          {review.name?.charAt(0) || 'U'}
                        </div>
                        <p className={`font-semibold transition-colors duration-500 ${isActive ? 'text-primary' : 'text-white/70'}`}>{review.name || 'Anonymous'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ─── Service Showcase ─── */}
      <section className="relative overflow-hidden bg-black py-1">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[50vh] xl:h-[60vh]">
          <ScrollReveal direction="left" className="h-full z-10 relative">
            <div className="group relative h-full overflow-hidden cursor-pointer">
              <img src={barberCutting} alt="Precision Haircut" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.08] filter brightness-75 group-hover:brightness-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute inset-0 border border-white/0 group-hover:border-primary/50 transition-colors duration-700 m-4 sm:m-8 rounded-xl pointer-events-none" />
              <div className="absolute bottom-10 left-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-heading text-3xl text-white mb-2 drop-shadow-xl font-bold">Precision Cuts</h3>
                <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-700 delay-100" />
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" className="h-full relative z-10">
            <div className="group relative h-full overflow-hidden cursor-pointer">
              <img src={beardTrim} alt="Beard Sculpting" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.08] filter brightness-75 group-hover:brightness-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute inset-0 border border-white/0 group-hover:border-primary/50 transition-colors duration-700 m-4 sm:m-8 rounded-xl pointer-events-none" />
              <div className="absolute bottom-10 left-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-heading text-3xl text-white mb-2 drop-shadow-xl font-bold">Beard Sculpting</h3>
                <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-700 delay-100" />
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
              <div className="bg-[#111]/80 backdrop-blur-xl shadow-2xl border border-white/10 p-8 sm:p-10 flex flex-col justify-center gap-8 h-full rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
                
                <div className="flex items-start gap-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(201,161,74,0.15)] group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl text-foreground mb-2 drop-shadow-sm">Address</h4>
                    <p className="text-white/70 text-base leading-relaxed">263 Heaths Rd, Werribee VIC 3030, Australia</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(201,161,74,0.15)] group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl text-foreground mb-2 drop-shadow-sm">Phone</h4>
                    <a href="tel:+61460309333" className="text-white/70 text-base hover:text-primary transition-colors duration-300">+61 460 309 333</a>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-6 relative z-10">
                  <a href="tel:+61460309333" className="w-full sm:w-auto">
                    <Button className="w-full rounded-full bg-primary hover:bg-[#D4AF37] text-black shadow-[0_4px_15px_rgba(201,161,74,0.3)] hover:shadow-[0_0_20px_rgba(201,161,74,0.6)] border-none hover:-translate-y-1 transition-all">
                      <Phone className="w-5 h-5 mr-2" /> Call Now
                    </Button>
                  </a>
                  <a href="https://maps.google.com/?q=263+Heaths+Rd+Werribee+VIC+3030" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full rounded-full border border-primary/40 bg-transparent text-white hover:bg-primary hover:text-black hover:-translate-y-1 transition-all h-[40px]">
                      <MapPin className="w-5 h-5 mr-2" /> Directions
                    </Button>
                  </a>
                </div>
                <div className="mt-6 flex gap-6">
                  <div className="group">
                    <p className="text-base-content/50 text-sm mb-3 group-hover:text-primary transition-colors">Instagram</p>
                    <div className="p-2 bg-base-100 rounded-2xl shadow-sm border border-base-300 transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/30">
                      <img src={qrCode} alt="Instagram QR" className="w-24 h-24 rounded-xl" />
                    </div>
                  </div>
                  <div className="group">
                    <p className="text-base-content/50 text-sm mb-3 group-hover:text-primary transition-colors">TikTok</p>
                    <div className="p-2 bg-base-100 rounded-2xl shadow-sm border border-base-300 transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/30">
                      <img src={tiktokQr} alt="TikTok QR" className="w-24 h-24 rounded-xl" />
                    </div>
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

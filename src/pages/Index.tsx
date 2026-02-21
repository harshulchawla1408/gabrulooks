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
import heroVideo from "@/assets/hero-video.mp4";
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
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-base-300/60 via-base-300/40 to-base-100/90" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, y: textY }} className="relative z-10 container mx-auto px-4 text-center pt-20">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
            <img src={logo} alt="Gabru Looks" className="w-36 md:w-52 mx-auto mb-8 drop-shadow-2xl" />
          </motion.div>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: "easeInOut" }} className="w-20 h-px mx-auto mb-8 bg-primary/60 origin-center" />

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-primary-content mb-4 leading-tight drop-shadow-xl font-bold">
            <HeroTitle text="Crafted Precision." className="tracking-tight" />
            <br />
            <span className="text-primary drop-shadow-lg">
              <HeroTitle text="Styled Perfection." className="tracking-tight" />
            </span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.4 }} className="text-primary-content/80 text-lg md:text-xl mb-12 max-w-lg mx-auto font-heading italic tracking-wide">
            Where Hair Meets The Artist
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.7, ease: "easeOut" }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="btn btn-primary rounded-full px-10 py-4 h-14 text-lg border-none shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all duration-300">
                Book Appointment
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="btn btn-outline btn-primary rounded-full px-10 py-4 h-14 text-lg hover:-translate-y-1 transition-all duration-300 bg-base-100/20 backdrop-blur-sm border-2">
                View Services <ChevronRight className="w-5 h-5 ml-2" />
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
                <div className="card bg-base-100 shadow-xl hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] transition-all duration-500 hover:-translate-y-2 border border-primary/10 group cursor-pointer overflow-hidden h-full">
                  <div className="card-body items-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary transition-all duration-500">
                      <Scissors className="w-7 h-7 text-primary group-hover:text-primary-content transition-colors duration-500" />
                    </div>
                    <h3 className="card-title font-heading text-xl text-base-content mb-2">{service.name}</h3>
                    <div className="flex items-baseline justify-center gap-2 mb-6">
                      <span className="text-primary font-bold text-2xl">{service.cashPrice}</span>
                      <span className="text-base-content/50 text-sm">Cash</span>
                    </div>
                    <Link to="/book" className="w-full mt-auto">
                      <Button className="btn btn-primary w-full rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 border-none shadow-md hover:shadow-lg">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <ScrollReveal delay={200}>
            <div className="text-center mt-12">
              <Link to="/services">
                <Button variant="outline" size="lg" className="btn btn-outline btn-primary rounded-full px-8 hover:-translate-y-1 transition-transform">
                  View All Services <ChevronRight className="w-5 h-5 ml-2" />
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
            <div className="text-center px-4">
              <p className="text-primary-content/80 text-sm uppercase tracking-[0.4em] mb-6 font-medium drop-shadow-md">Est. 2025</p>
              <h2 className="font-heading text-4xl md:text-6xl text-primary-content leading-tight drop-shadow-xl font-bold">
                Where Hair Meets <span className="text-primary drop-shadow-md">The Artist</span>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {barbers.map((barber, i) => (
              <ScrollReveal key={barber.name} delay={i * 100}>
                <div className="card bg-base-100 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.2)] transition-all duration-500 group overflow-hidden border border-primary/5">
                  <figure className="h-80 relative overflow-hidden">
                    <img
                      src={barberImages[i]}
                      alt={barber.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-base-300/90 via-base-300/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-center">
                        <Link to="/book" className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                          <Button className="btn btn-primary w-full rounded-full border-none shadow-lg hover:shadow-xl">
                            Book with Me
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </figure>
                  <div className="card-body items-center text-center pt-6 pb-8 bg-base-100 relative z-10">
                    <h3 className="card-title font-heading text-2xl text-base-content mb-1 group-hover:text-primary transition-colors duration-300">{barber.name}</h3>
                    <p className="text-primary font-medium tracking-wide text-sm">{barber.specialty}</p>
                    <p className="text-base-content/60 text-sm mt-2">{barber.experience} experience</p>
                    <div className="flex gap-1 mt-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-primary fill-primary drop-shadow-sm" />
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
                <div className="card bg-base-100/60 backdrop-blur-xl border border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="card-body p-8">
                    <Quote className="w-10 h-10 text-primary/20 mb-6" />
                    <div className="flex gap-1 mb-6">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-primary fill-primary" />
                      ))}
                    </div>
                    <p className="text-base-content/80 text-base mb-8 italic leading-relaxed flex-grow">"{review.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <p className="text-base-content font-semibold">{review.name}</p>
                    </div>
                  </div>
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
              <div className="card bg-base-100 shadow-xl border border-primary/10 p-8 flex flex-col justify-center gap-8 h-full">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl text-base-content mb-2">Address</h4>
                    <p className="text-base-content/70 text-base">263 Heaths Rd, Werribee VIC 3030, Australia</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl text-base-content mb-2">Phone</h4>
                    <a href="tel:+61460309333" className="text-base-content/70 text-base hover:text-primary transition-colors duration-300">+61 460 309 333</a>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <a href="tel:+61460309333" className="w-full sm:w-auto">
                    <Button className="btn btn-primary w-full rounded-full shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all">
                      <Phone className="w-5 h-5 mr-2" /> Call Now
                    </Button>
                  </a>
                  <a href="https://maps.google.com/?q=263+Heaths+Rd+Werribee+VIC+3030" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button variant="outline" className="btn btn-outline btn-primary w-full rounded-full hover:-translate-y-1 transition-all">
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

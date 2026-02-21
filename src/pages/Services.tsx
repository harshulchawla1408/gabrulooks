import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Scissors, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { services } from "@/data/salonData";

const pageEnter = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const Services = () => {
  const [tab, setTab] = useState<"men" | "women">("men");
  const filtered = services.filter((s) => s.category === tab);

  return (
    <div className="overflow-hidden">
      <motion.section variants={pageEnter} initial="hidden" animate="visible" className="py-28 md:py-36 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.1),transparent_70%)] opacity-50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeUp} className="w-20 h-1 mx-auto mb-8 bg-primary/40 rounded-full" />
          <motion.p variants={fadeUp} className="text-secondary-content/80 text-sm uppercase tracking-[0.4em] mb-4 font-body font-medium">
            What We Offer
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading text-5xl md:text-7xl text-base-content mb-6 font-bold tracking-tight">
            Our <span className="text-primary drop-shadow-md">Services</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base-content/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Premium grooming services for men and women. Every service includes a dedicated session with our expert stylists to ensure you leave looking your best.
          </motion.p>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/30" />
        <Scissors className="w-4 h-4 text-primary/40 mx-3" />
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/30" />
      </div>

      {/* Tabs + Services */}
      <section className="pb-28 pt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            {[
              { key: "men" as const, label: "Men's Services", icon: Scissors },
              { key: "women" as const, label: "Women's Services", icon: Sparkles },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center justify-center gap-3 px-10 py-4 rounded-full text-base font-semibold tracking-wide uppercase transition-all duration-300 w-full sm:w-auto ${
                  tab === key
                    ? "bg-primary text-primary-content shadow-[0_8px_30px_rgba(212,175,55,0.4)] scale-105"
                    : "bg-base-100/50 backdrop-blur-md border border-base-300 text-base-content/70 hover:text-primary hover:border-primary/50 hover:bg-base-100"
                }`}
              >
                <Icon className={`w-5 h-5 ${tab === key ? "animate-pulse" : ""}`} /> {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {filtered.map((service, i) => (
                <ScrollReveal key={service.name} delay={i * 40}>
                  <div className="card bg-base-100/80 backdrop-blur-xl border border-primary/10 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] transition-all duration-500 group overflow-hidden h-full">
                    <div className="card-body p-8">
                      <div className="flex items-start justify-between mb-6">
                        <h3 className="card-title font-heading text-2xl text-base-content group-hover:text-primary transition-colors duration-300">{service.name}</h3>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-content transition-colors duration-500">
                          {tab === "men" ? (
                            <Scissors className="w-6 h-6 text-primary group-hover:text-primary-content transition-colors" />
                          ) : (
                            <Sparkles className="w-6 h-6 text-primary group-hover:text-primary-content transition-colors" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mb-8 mt-auto">
                        <div>
                          <p className="text-primary font-bold text-3xl">{service.cashPrice}</p>
                          <p className="text-base-content/50 text-sm font-medium mt-1 uppercase tracking-wider">Cash</p>
                        </div>
                        <div className="h-10 w-px bg-base-300"></div>
                        <div>
                          <p className="text-base-content/80 font-bold text-2xl">{service.cardPrice}</p>
                          <p className="text-base-content/50 text-sm font-medium mt-1 uppercase tracking-wider">Card</p>
                        </div>
                      </div>
                      <Link to="/book" className="w-full mt-auto">
                        <Button className="btn btn-primary w-full rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 border-none shadow-md hover:shadow-lg">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Services;

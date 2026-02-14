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
      {/* Hero */}
      <motion.section variants={pageEnter} initial="hidden" animate="visible" className="py-28 md:py-36 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--gold)/0.06),transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeUp} className="w-16 h-px mx-auto mb-6 bg-primary/40" />
          <motion.p variants={fadeUp} className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">
            What We Offer
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading text-4xl md:text-6xl text-foreground mb-6">
            Our <span className="gold-text-gradient">Services</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
            Premium grooming services for men and women. Every service includes a dedicated session with our expert stylists.
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
          <div className="flex justify-center gap-4 mb-14">
            {[
              { key: "men" as const, label: "Men's Services", icon: Scissors },
              { key: "women" as const, label: "Women's Services", icon: Sparkles },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-500 ${
                  tab === key
                    ? "gold-gradient text-background shadow-lg"
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
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
                  <div className="premium-card p-6 group">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-heading text-lg text-foreground group-hover:text-primary transition-colors duration-500">{service.name}</h3>
                      {tab === "men" ? (
                        <Scissors className="w-5 h-5 text-primary/30 shrink-0" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-primary/30 shrink-0" />
                      )}
                    </div>
                    <div className="flex gap-4 mb-5">
                      <div>
                        <p className="text-primary font-bold text-xl">{service.cashPrice}</p>
                        <p className="text-muted-foreground text-xs">Cash</p>
                      </div>
                      <div className="border-l border-border pl-4">
                        <p className="text-foreground font-bold text-xl">{service.cardPrice}</p>
                        <p className="text-muted-foreground text-xs">Card</p>
                      </div>
                    </div>
                    <Link to="/book">
                      <Button size="sm" className="w-full gold-gradient text-background font-semibold text-xs opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        Book Now
                      </Button>
                    </Link>
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

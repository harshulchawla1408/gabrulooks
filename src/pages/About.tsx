import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Users, Award, Heart, Clock, Scissors } from "lucide-react";
import salonInterior from "@/assets/salon-interior.jpg";
import barberCutting from "@/assets/barber-cutting.jpg";
import beardTrim from "@/assets/beard-trim.jpg";

const pageEnter = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const milestones = [
  { year: "2025", title: "Grand Opening", desc: "Gabru Looks opens at 263 Heaths Rd, Werribee — bringing premium grooming to Melbourne's west." },
  { year: "2025", title: "Growing Team", desc: "Expanded our roster with skilled barbers and stylists passionate about the craft." },
  { year: "2025", title: "Community Favourite", desc: "Rapidly became Werribee's most trusted destination for precision cuts and styling." },
];

const values = [
  { icon: Award, title: "Excellence", desc: "Every cut, every style — perfection is our standard." },
  { icon: Heart, title: "Passion", desc: "We live and breathe grooming. Our passion shows in every detail." },
  { icon: Users, title: "Community", desc: "More than a salon — we're building a Werribee family." },
  { icon: Clock, title: "Precision", desc: "Your time matters. Exceptional results, every single time." },
];

const About = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <motion.section variants={pageEnter} initial="hidden" animate="visible" className="py-28 md:py-36 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--gold)/0.06),transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeUp} className="w-16 h-px mx-auto mb-6 bg-primary/40" />
          <motion.p variants={fadeUp} className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">
            Our Story
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading text-4xl md:text-6xl text-foreground mb-6">
            About <span className="gold-text-gradient">Gabru Looks</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Born from a deep passion for precision grooming and the art of barbering, Gabru Looks delivers a premium salon experience to the heart of Werribee, Victoria.
          </motion.p>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/30" />
        <Scissors className="w-4 h-4 text-primary/40 mx-3" />
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/30" />
      </div>

      {/* Story */}
      <section className="py-28 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center max-w-5xl mx-auto">
            <ScrollReveal direction="left">
              <div className="h-80 lg:h-96 rounded-2xl overflow-hidden">
                <img src={salonInterior} alt="Gabru Looks Interior" className="w-full h-full object-cover" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={150}>
              <div>
                <h2 className="font-heading text-3xl text-foreground mb-5">Our Philosophy</h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  At Gabru Looks, grooming isn't just a haircut — it's a complete experience. From the moment you step through our doors, you're treated to a premium atmosphere crafted to make you feel confident and refreshed.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Our team of expert barbers and stylists bring years of experience and genuine artistry to every service. Whether you're after a classic gentleman's cut, a sharp modern fade, or expert beard sculpting, we deliver precision with every stroke.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We proudly serve men, women, and children — offering everything from threading and tinting to advanced treatments like keratin smoothing and nanoplastia restoration.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">What Drives Us</p>
              <h2 className="font-heading text-3xl md:text-5xl text-foreground">Our Values</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 80}>
                <div className="premium-card p-7 text-center group">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-500">
                    <v.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg text-foreground mb-2">{v.title}</h3>
                  <p className="text-muted-foreground text-sm">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-28 bg-card/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">Our Journey</p>
              <h2 className="font-heading text-3xl md:text-5xl text-foreground">The Gabru Story</h2>
            </div>
          </ScrollReveal>
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/15 md:-translate-x-px" />
            {milestones.map((m, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className={`relative flex items-center gap-6 mb-14 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1.5 md:-translate-x-1.5" />
                  <div className="ml-12 md:ml-0 md:w-1/2 premium-card p-6">
                    <span className="text-primary text-xs font-bold tracking-wider">{m.year}</span>
                    <h3 className="font-heading text-lg text-foreground mt-1">{m.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{m.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Salon Images */}
      <section className="py-28">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">Our Space</p>
              <h2 className="font-heading text-3xl md:text-5xl text-foreground">The Salon</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[salonInterior, barberCutting, beardTrim].map((img, n) => (
              <ScrollReveal key={n} delay={n * 100}>
                <div className="h-64 rounded-2xl overflow-hidden group">
                  <img src={img} alt={`Salon view ${n + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

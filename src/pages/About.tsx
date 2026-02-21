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
      <motion.section variants={pageEnter} initial="hidden" animate="visible" className="py-28 md:py-36 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.1),transparent_70%)] opacity-50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeUp} className="w-20 h-1 mx-auto mb-8 bg-primary/40 rounded-full" />
          <motion.p variants={fadeUp} className="text-secondary-content/80 text-sm uppercase tracking-[0.4em] mb-4 font-body font-medium">
            Our Story
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading text-5xl md:text-7xl text-base-content mb-6 font-bold tracking-tight">
            About <span className="text-primary drop-shadow-md">Gabru Looks</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base-content/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
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
      <section className="py-28 bg-base-200/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center max-w-6xl mx-auto">
            <ScrollReveal direction="left">
              <div className="h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                <img src={salonInterior} alt="Gabru Looks Interior" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={150}>
              <div className="space-y-6">
                <h2 className="font-heading text-4xl text-base-content mb-6">Our Philosophy</h2>
                <div className="prose prose-lg text-base-content/70">
                  <p className="leading-relaxed">
                    At Gabru Looks, grooming isn't just a haircut — it's a complete experience. From the moment you step through our doors, you're treated to a premium atmosphere crafted to make you feel confident and refreshed.
                  </p>
                  <p className="leading-relaxed">
                    Our team of expert barbers and stylists bring years of experience and genuine artistry to every service. Whether you're after a classic gentleman's cut, a sharp modern fade, or expert beard sculpting, we deliver precision with every stroke.
                  </p>
                  <p className="leading-relaxed">
                    We proudly serve men, women, and children — offering everything from threading and tinting to advanced treatments like keratin smoothing and nanoplastia restoration.
                  </p>
                </div>
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
                <div className="card bg-base-100 shadow-lg hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] transition-all duration-500 hover:-translate-y-2 border border-primary/10 group h-full">
                  <div className="card-body items-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500">
                      <v.icon className="w-8 h-8 text-primary group-hover:text-primary-content transition-colors duration-500" />
                    </div>
                    <h3 className="card-title font-heading text-xl text-base-content mb-3">{v.title}</h3>
                    <p className="text-base-content/70 text-base">{v.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-28 bg-base-200/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-primary/80 text-sm uppercase tracking-[0.4em] mb-4 font-body font-medium">Our Journey</p>
              <h2 className="font-heading text-4xl md:text-5xl text-base-content">The Gabru Story</h2>
            </div>
          </ScrollReveal>
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-primary/20 md:-translate-x-1/2 rounded-full" />
            {milestones.map((m, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className={`relative flex items-center gap-8 mb-16 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-base-100 shadow-md md:-translate-x-1/2 -ml-1.5 md:ml-0 z-10" />
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                    <div className="card bg-base-100 shadow-xl border border-primary/10 p-8 hover:-translate-y-1 transition-transform duration-300">
                      <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider mb-4">{m.year}</span>
                      <h3 className="font-heading text-2xl text-base-content mb-3">{m.title}</h3>
                      <p className="text-base-content/70 text-base leading-relaxed">{m.desc}</p>
                    </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[salonInterior, barberCutting, beardTrim].map((img, n) => (
              <ScrollReveal key={n} delay={n * 100}>
                <div className="h-80 rounded-3xl overflow-hidden group shadow-lg">
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img src={img} alt={`Salon view ${n + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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

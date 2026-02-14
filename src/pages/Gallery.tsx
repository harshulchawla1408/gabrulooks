import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Image as ImageIcon, Scissors } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import barberCutting from "@/assets/barber-cutting.jpg";
import beardTrim from "@/assets/beard-trim.jpg";
import salonInterior from "@/assets/salon-interior.jpg";
import heroImage from "@/assets/hero-barbershop.jpg";
import barberPortrait1 from "@/assets/barber-portrait-1.jpg";
import barberPortrait2 from "@/assets/barber-portrait-2.jpg";
import barberPortrait3 from "@/assets/barber-portrait-3.jpg";

const pageEnter = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const galleryImages = [
  { id: 1, src: barberCutting, label: "Classic Fade" },
  { id: 2, src: beardTrim, label: "Beard Sculpt" },
  { id: 3, src: salonInterior, label: "Salon Interior" },
  { id: 4, src: heroImage, label: "Modern Pompadour" },
  { id: 5, src: barberPortrait1, label: "Our Team" },
  { id: 6, src: barberPortrait2, label: "Precision Work" },
  { id: 7, src: barberPortrait3, label: "Styling Expert" },
  { id: 8, src: barberCutting, label: "Hair Color" },
  { id: 9, src: beardTrim, label: "Before & After" },
];

const Gallery = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const heights = ["h-64", "h-80", "h-56", "h-72", "h-64", "h-80"];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <motion.section variants={pageEnter} initial="hidden" animate="visible" className="py-28 md:py-36 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--gold)/0.06),transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeUp} className="w-16 h-px mx-auto mb-6 bg-primary/40" />
          <motion.p variants={fadeUp} className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">
            Our Work
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading text-4xl md:text-6xl text-foreground mb-6">
            <span className="gold-text-gradient">Gallery</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
            A showcase of our finest work — precision cuts, bold styles, and stunning transformations.
          </motion.p>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/30" />
        <Scissors className="w-4 h-4 text-primary/40 mx-3" />
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/30" />
      </div>

      {/* Masonry Grid */}
      <section className="pb-28 pt-8">
        <div className="container mx-auto px-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 max-w-6xl mx-auto">
            {galleryImages.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 50}>
                <div
                  className={`mb-4 break-inside-avoid ${heights[i % heights.length]} rounded-2xl overflow-hidden relative group cursor-pointer`}
                  onClick={() => setSelected(item.id)}
                >
                  <img src={item.src} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-4 left-4">
                      <p className="text-secondary-foreground text-sm font-medium">{item.label}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-secondary/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button className="absolute top-6 right-6 text-secondary-foreground hover:text-primary transition-colors z-10" onClick={() => setSelected(null)}>
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-3xl max-h-[80vh] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages.find((g) => g.id === selected)?.src}
                alt={galleryImages.find((g) => g.id === selected)?.label}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

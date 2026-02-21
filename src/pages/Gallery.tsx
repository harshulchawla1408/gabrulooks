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
      <motion.section variants={pageEnter} initial="hidden" animate="visible" className="py-28 md:py-36 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.1),transparent_70%)] opacity-50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeUp} className="w-20 h-1 mx-auto mb-8 bg-primary/40 rounded-full" />
          <motion.p variants={fadeUp} className="text-secondary-content/80 text-sm uppercase tracking-[0.4em] mb-4 font-body font-medium">
            Our Work
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading text-5xl md:text-7xl text-base-content mb-6 font-bold tracking-tight">
            Our <span className="text-primary drop-shadow-md">Gallery</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base-content/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A showcase of our finest work — precision cuts, bold styles, and stunning transformations.
          </motion.p>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/30" />
        <Scissors className="w-5 h-5 text-primary/40 mx-4" />
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/30" />
      </div>

      {/* Masonry Grid */}
      <section className="pb-28 pt-8 bg-base-200/50">
        <div className="container mx-auto px-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-7xl mx-auto">
            {galleryImages.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 50}>
                <div
                  className={`mb-6 break-inside-avoid ${heights[i % heights.length]} rounded-3xl overflow-hidden relative group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500`}
                  onClick={() => setSelected(item.id)}
                >
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img src={item.src} alt={item.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-300/90 via-base-300/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-6">
                    <p className="text-primary-content text-lg font-heading font-semibold tracking-wide drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.label}</p>
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
            className="fixed inset-0 z-50 bg-base-300/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelected(null)}
          >
            <button className="absolute top-6 right-6 text-base-content/70 hover:text-primary hover:rotate-90 transition-all duration-300 z-[60] bg-base-100/50 hover:bg-base-100 p-2 rounded-full backdrop-blur-md" onClick={() => setSelected(null)}>
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-5xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl pointer-events-none z-10"></div>
              <img
                src={galleryImages.find((g) => g.id === selected)?.src}
                alt={galleryImages.find((g) => g.id === selected)?.label}
                className="w-full h-full object-contain bg-base-100/50"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-base-300/90 to-transparent pointer-events-none">
                <p className="text-primary-content text-2xl font-heading text-center drop-shadow-md">
                  {galleryImages.find((g) => g.id === selected)?.label}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;

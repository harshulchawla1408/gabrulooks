import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Image as ImageIcon, Scissors, Instagram, Eye, Heart } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import barberCutting from "@/assets/barber-cutting.jpg";
import beardTrim from "@/assets/beard-trim.jpg";
import salonInterior from "@/assets/salon-interior.jpg";
import heroImage from "@/assets/hero-barbershop.jpg";

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
  { id: 5, src: barberCutting, label: "Our Team" },
  { id: 6, src: beardTrim, label: "Precision Work" },
  { id: 7, src: salonInterior, label: "Styling Expert" },
  { id: 8, src: barberCutting, label: "Hair Color" },
  { id: 9, src: beardTrim, label: "Before & After" },
];

const MOCK_REELS = [
  { id: '1', thumbnail: barberCutting, url: 'https://www.instagram.com/reel/DQxfxFrEwLv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', views: '24K', likes: '1.2K' },
  { id: '2', thumbnail: beardTrim, url: 'https://www.instagram.com/reel/DQ1XmhDE30P/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', views: '18K', likes: '890' },
  { id: '3', thumbnail: salonInterior, url: 'https://www.instagram.com/reel/DQ36ZQpE_UD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', views: '32K', likes: '2.4K' },
  { id: '4', thumbnail: heroImage, url: 'https://www.instagram.com/reel/DQ_PIK8E4dp/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', views: '15K', likes: '650' },
  { id: '5', thumbnail: barberCutting, url: 'https://www.instagram.com/reel/DQ76QnGky8K/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', views: '45K', likes: '3.1K' },
  { id: '6', thumbnail: beardTrim, url: 'https://www.instagram.com/reel/DQ3L36LE7Gj/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', views: '12K', likes: '540' },
  { id: '7', thumbnail: salonInterior, url: 'https://www.instagram.com/reel/DRvq_bYk9Xg/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', views: '28K', likes: '1.8K' },
  { id: '8', thumbnail: heroImage, url: 'https://www.instagram.com/reel/DSbkskhzHsG/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', views: '19K', likes: '920' },
  { id: '9', thumbnail: barberCutting, url: 'https://www.instagram.com/reel/DT1iG-9k6SE/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', views: '36K', likes: '2.7K' },
  { id: '10', thumbnail: beardTrim, url: 'https://www.instagram.com/reel/DUOwBxUk0hX/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', views: '21K', likes: '1.1K' },
  { id: '11', thumbnail: salonInterior, url: 'https://www.instagram.com/reel/DXDM746k8Ev/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==', views: '41K', likes: '3.5K' },
];

const ReelsGallery = () => {
  const [reels, setReels] = useState(MOCK_REELS);

  useEffect(() => {
    const fetchReels = async () => {
      const token = import.meta.env.VITE_INSTAGRAM_TOKEN;
      if (!token) return;
      try {
        const res = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}`);
        const data = await res.json();
        if (data.data) {
          const videoReels = data.data.filter((m: any) => m.media_type === "VIDEO").slice(0, 10);
          if (videoReels.length > 0) {
            setReels(videoReels.map((v: any) => ({
              id: v.id,
              thumbnail: v.thumbnail_url || v.media_url,
              url: v.permalink,
              views: '—',
              likes: '—'
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch IG Reels", err);
      }
    };
    fetchReels();
  }, []);

  return (
    <section className="py-28 relative bg-[#0a0a0a] border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />
      
      {/* Decorative Gold Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A14A]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C9A14A]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-[#C9A14A] text-xs uppercase tracking-[0.3em] mb-4 font-bold drop-shadow-md">
              Reels From The Studio
            </p>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-bold tracking-tight drop-shadow-lg">
              Latest <span className="text-[#C9A14A] drop-shadow-[0_0_15px_rgba(201,161,74,0.3)]">Transformations</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Real cuts. Real confidence. Real style.
            </p>
          </div>
        </ScrollReveal>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1.5}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            640: { slidesPerView: 3.2 },
            850: { slidesPerView: 4.2 },
            1100: { slidesPerView: 5.2 },
          }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          className="pb-12"
        >
          {reels.map((reel, i) => (
            <SwiperSlide key={reel.id}>
              <ScrollReveal delay={i * 50}>
                <a href={reel.url} target="_blank" rel="noopener noreferrer" className="block group relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(201,161,74,0.3)] transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                  <img src={reel.thumbnail} alt="Instagram Reel" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-75 group-hover:brightness-100" loading="lazy" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                    <div className="w-14 h-14 rounded-full bg-[#C9A14A]/90 flex items-center justify-center shadow-[0_0_20px_rgba(201,161,74,0.6)]">
                      <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white text-sm font-medium transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-[#C9A14A]" /> {reel.views}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-[#C9A14A]" /> {reel.likes}
                      </div>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-12 text-center">
          <ScrollReveal delay={200}>
            <a href="https://www.instagram.com/gabru_looks/" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full bg-transparent border border-[#C9A14A] text-[#C9A14A] hover:bg-[#C9A14A] hover:text-black transition-all duration-300 px-8 shadow-[0_0_15px_rgba(201,161,74,0.15)] hover:shadow-[0_0_25px_rgba(201,161,74,0.5)]">
                <Instagram className="w-5 h-5 mr-2" /> View More on Instagram
              </Button>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

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

      {/* Instagram Reels Gallery */}
      <ReelsGallery />

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

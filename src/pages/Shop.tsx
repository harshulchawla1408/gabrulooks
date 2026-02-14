import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Filter, Star, Plus, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { calcPointsFromPrice } from "@/hooks/useLoyaltyPoints";
import { toast } from "sonner";
import CartDrawer from "@/components/shop/CartDrawer";

const pageEnter = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

const Shop = () => {
  const [active, setActive] = useState("All");
  const { data: products, isLoading } = useProducts();
  const { addItem } = useCart();

  const activeProducts = products?.filter(p => p.is_active) ?? [];
  const categories = ["All", ...Array.from(new Set(activeProducts.map(p => p.category)))];
  const filtered = active === "All" ? activeProducts : activeProducts.filter(p => p.category === active);

  const handleAddToCart = (product: typeof activeProducts[0]) => {
    if (product.stock <= 0) return;
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <motion.section variants={pageEnter} initial="hidden" animate="visible" className="py-28 md:py-36 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--gold)/0.06),transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeUp} className="w-16 h-px mx-auto mb-6 bg-primary/40" />
          <motion.p variants={fadeUp} className="text-primary/70 text-xs uppercase tracking-[0.3em] mb-4 font-body font-medium">
            Grooming Essentials
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading text-4xl md:text-6xl text-foreground mb-6">
            Our <span className="gold-text-gradient">Products</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
            Premium grooming products handpicked by our expert barbers. Earn loyalty points with every order!
          </motion.p>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="flex items-center justify-center py-4">
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary/30" />
        <Scissors className="w-4 h-4 text-primary/40 mx-3" />
        <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary/30" />
      </div>

      <section className="pb-28 pt-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading products…</p>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-wrap justify-center mb-8">
                <Filter className="w-4 h-4 text-muted-foreground" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-500 ${
                      active === cat ? "gold-gradient text-background shadow-md" : "glass-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex justify-center mb-10">
                <CartDrawer />
              </div>

              <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {filtered.map((product, i) => (
                  <ScrollReveal key={product.id} delay={i * 60}>
                    <div className="premium-card overflow-hidden group">
                      <div className="h-52 bg-gradient-to-br from-charcoal-lighter to-charcoal flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <ShoppingBag className="w-14 h-14 text-primary/20" />
                        )}
                      </div>
                      <div className="p-5">
                        <span className="text-primary/50 text-xs uppercase tracking-wider">{product.category}</span>
                        <h3 className="font-heading text-lg text-foreground mt-1 mb-1">{product.name}</h3>
                        <p className="text-muted-foreground text-xs mb-2">{product.description}</p>
                        <div className="flex items-center gap-1 text-xs text-primary/70 mb-3">
                          <Star className="w-3 h-3" />
                          <span>Earn {calcPointsFromPrice(product.price_cents)} points</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-bold text-xl">${(product.price_cents / 100).toFixed(2)}</span>
                          <Button size="sm" className="gold-gradient text-background text-xs font-semibold" onClick={() => handleAddToCart(product)} disabled={product.stock <= 0}>
                            {product.stock <= 0 ? "Out of Stock" : <><Plus className="w-3 h-3 mr-1" /> Add</>}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">No products available in this category.</div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;

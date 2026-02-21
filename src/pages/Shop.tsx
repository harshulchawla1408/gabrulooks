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
      <motion.section variants={pageEnter} initial="hidden" animate="visible" className="py-28 md:py-36 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.1),transparent_70%)] opacity-50" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div variants={fadeUp} className="w-20 h-1 mx-auto mb-8 bg-primary/40 rounded-full" />
          <motion.p variants={fadeUp} className="text-secondary-content/80 text-sm uppercase tracking-[0.4em] mb-4 font-body font-medium">
            Grooming Essentials
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-heading text-5xl md:text-7xl text-base-content mb-6 font-bold tracking-tight">
            Our <span className="text-primary drop-shadow-md">Products</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base-content/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
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
                <div className="bg-base-200/50 p-2 rounded-full flex items-center gap-2 border border-base-300 backdrop-blur-md mr-2">
                  <Filter className="w-4 h-4 text-base-content/50 ml-2" />
                  <span className="text-sm font-medium text-base-content/70 mr-2 pr-2 border-r border-base-300">Filter</span>
                </div>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                      active === cat
                        ? "bg-primary text-primary-content shadow-[0_4px_15px_rgba(212,175,55,0.4)] scale-105"
                        : "bg-base-100/50 border border-base-300 text-base-content/70 hover:text-primary hover:border-primary/50 hover:bg-base-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex justify-center mb-10">
                <CartDrawer />
              </div>

              <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {filtered.map((product, i) => (
                  <ScrollReveal key={product.id} delay={i * 60}>
                    <div className="card bg-base-100 shadow-xl hover:shadow-[0_20px_50px_rgba(212,175,55,0.15)] transition-all duration-500 hover:-translate-y-2 border border-primary/10 group overflow-hidden h-full flex flex-col">
                      <figure className="h-64 bg-base-200/50 relative overflow-hidden group">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-base-300/30 group-hover:bg-primary/5 transition-colors duration-500">
                            <ShoppingBag className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-colors duration-500" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-base-300/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </figure>
                      <div className="card-body p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <span className="badge badge-primary badge-outline text-[10px] uppercase font-bold tracking-wider">{product.category}</span>
                          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                            <span className="text-xs font-bold text-primary">{calcPointsFromPrice(product.price_cents)} pts</span>
                          </div>
                        </div>
                        <h3 className="card-title font-heading text-xl text-base-content mt-1 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                        <p className="text-base-content/70 text-sm mb-6 flex-grow line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-base-200">
                          <span className="text-primary font-bold text-2xl">${(product.price_cents / 100).toFixed(2)}</span>
                          <Button 
                            className="btn btn-primary rounded-full px-6 shadow-md hover:shadow-lg border-none transition-all hover:-translate-y-0.5" 
                            onClick={() => handleAddToCart(product)} 
                            disabled={product.stock <= 0}
                          >
                            {product.stock <= 0 ? "Out of Stock" : <><Plus className="w-4 h-4 mr-1" /> Add to Cart</>}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingBag className="w-8 h-8 text-base-content/30" />
                    </div>
                    <h3 className="font-heading text-2xl text-base-content mb-2">No Products Found</h3>
                    <p className="text-base-content/60">We couldn't find any products in this category.</p>
                  </div>
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

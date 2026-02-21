import { motion } from "framer-motion";
import { Gift, Star, Zap, ShoppingBag, Scissors, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLoyaltyBalance, POINTS_PER_DOLLAR, POINTS_VALUE_CENTS } from "@/hooks/useLoyaltyPoints";
import { ScrollReveal } from "@/components/ScrollReveal";

const LoyaltyPoints = () => {
  const { user } = useAuth();
  const { balance, thisMonth, totalEarned, totalUsed } = useLoyaltyBalance(user?.id);

  const rules = [
    { icon: Scissors, title: "Earn on Bookings", desc: `Get ${POINTS_PER_DOLLAR} point for every $1 spent on salon services.` },
    { icon: ShoppingBag, title: "Earn on Products", desc: `Get ${POINTS_PER_DOLLAR} point for every $1 spent on products.` },
    { icon: Star, title: "Point Value", desc: `Each point is worth $${(POINTS_VALUE_CENTS / 100).toFixed(2)} discount.` },
    { icon: Gift, title: "Redeem Anytime", desc: "Apply your points during booking checkout for instant discounts." },
    { icon: Zap, title: "No Expiry", desc: "Your loyalty points never expire. Earn and save as long as you want." },
  ];

  return (
    <div className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.05),transparent_70%)] opacity-50 z-0" />
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <p className="text-primary tracking-[0.2em] text-xs uppercase font-bold mb-2">Rewards</p>
            <h1 className="font-heading text-4xl md:text-5xl text-base-content font-bold mb-4">
              Loyalty Program
            </h1>
            <p className="text-base-content/70 max-w-xl mx-auto text-lg">
              Every visit earns you points. Redeem them for discounts on services and products.
            </p>
          </div>

          {/* Balance Card */}
          {user && (
            <ScrollReveal>
              <div className="card bg-gradient-to-br from-primary to-primary/80 shadow-2xl p-8 md:p-12 mb-16 text-center text-primary-content relative overflow-hidden border border-primary/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6 backdrop-blur-sm shadow-inner group">
                    <Gift className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-90 mb-2">Your Balance</p>
                  <p className="text-6xl md:text-7xl font-heading font-bold mb-1 drop-shadow-md">{balance}</p>
                  <p className="text-sm opacity-90 font-medium mb-8">loyalty points available</p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-12 mt-4 text-sm bg-black/10 p-5 rounded-2xl backdrop-blur-sm mx-auto max-w-xl border border-white/10">
                    <div className="flex-1">
                      <p className="font-bold text-2xl mb-1">{totalEarned}</p>
                      <p className="opacity-80 text-xs uppercase tracking-wider font-semibold">Total Earned</p>
                    </div>
                    <div className="hidden sm:block w-px bg-white/20" />
                    <div className="flex-1">
                      <p className="font-bold text-2xl mb-1">{totalUsed}</p>
                      <p className="opacity-80 text-xs uppercase tracking-wider font-semibold">Total Used</p>
                    </div>
                    <div className="hidden sm:block w-px bg-white/20" />
                    <div className="flex-1">
                      <p className="font-bold text-2xl mb-1">{thisMonth}</p>
                      <p className="opacity-80 text-xs uppercase tracking-wider font-semibold">This Month</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Rules */}
          <div className="mb-16">
            <h2 className="font-heading text-3xl text-center text-base-content mb-8">How It Works</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rules.map((r, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="card bg-base-100/80 backdrop-blur-xl shadow-lg border border-primary/10 p-6 h-full flex flex-col hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary shrink-0">
                      <r.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-xl text-base-content font-bold mb-2">{r.title}</h3>
                    <p className="text-sm text-base-content/70 flex-grow leading-relaxed">{r.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pb-8">
            <Link to={user ? "/book" : "/login"}>
              <Button className="btn btn-primary btn-lg rounded-full px-10 shadow-lg hover:shadow-xl border-none hover:-translate-y-1 transition-all text-lg group">
                {user ? "Book & Earn Points" : "Sign In to Start Earning"} 
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoyaltyPoints;

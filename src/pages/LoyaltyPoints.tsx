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
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <h1 className="font-heading text-4xl text-foreground mb-3">
              <span className="gold-text-gradient">Loyalty Rewards</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every visit earns you points. Redeem them for discounts on services and products.
            </p>
          </div>

          {/* Balance Card */}
          {user && (
            <ScrollReveal>
              <div className="gold-gradient rounded-2xl p-6 mb-10 text-center text-background">
                <p className="text-sm font-semibold uppercase tracking-wider opacity-80">Your Balance</p>
                <p className="text-5xl font-heading font-bold my-2">{balance}</p>
                <p className="text-sm opacity-80">loyalty points</p>
                <div className="flex justify-center gap-8 mt-4 text-xs">
                  <div>
                    <p className="font-bold text-lg">{totalEarned}</p>
                    <p className="opacity-70">Total Earned</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{totalUsed}</p>
                    <p className="opacity-70">Total Used</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{thisMonth}</p>
                    <p className="opacity-70">This Month</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* Rules */}
          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            {rules.map((r, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="border border-border bg-card rounded-xl p-5 flex gap-4 items-start hover-gold-glow transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <r.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-foreground">{r.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to={user ? "/book" : "/login"}>
              <Button className="gold-gradient text-background font-semibold px-8">
                {user ? "Book & Earn Points" : "Sign In to Start Earning"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoyaltyPoints;

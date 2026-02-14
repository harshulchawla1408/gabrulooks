import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Users, Scissors, Calendar, BarChart3, ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import ManageServices from "@/components/admin/ManageServices";
import ManageBarbers from "@/components/admin/ManageBarbers";
import ManageProducts from "@/components/admin/ManageProducts";
import ManageOrders from "@/components/admin/ManageOrders";
import AllBookings from "@/components/admin/AllBookings";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

type AdminTab = "analytics" | "bookings" | "services" | "barbers" | "products" | "orders";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<AdminTab>("analytics");

  const tabs: { key: AdminTab; label: string; icon: typeof Calendar }[] = [
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "bookings", label: "Bookings", icon: Calendar },
    { key: "services", label: "Services", icon: Scissors },
    { key: "barbers", label: "Barbers", icon: Users },
    { key: "products", label: "Products", icon: ShoppingBag },
    { key: "orders", label: "Orders", icon: Package },
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-heading text-3xl text-foreground">Admin Dashboard</h1>
                <span className="text-xs gold-gradient text-background px-2 py-0.5 rounded-full font-semibold">ADMIN</span>
              </div>
              <p className="text-muted-foreground text-sm">Welcome, {user?.user_metadata?.full_name || user?.email || "Admin"}</p>
            </div>
            <Button variant="outline" onClick={signOut} className="border-primary/30 text-primary hover:bg-primary/10">
              Sign Out
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {tabs.map(t => (
              <Button
                key={t.key}
                variant={tab === t.key ? "default" : "outline"}
                size="sm"
                onClick={() => setTab(t.key)}
                className={tab === t.key ? "gold-gradient text-background" : "border-primary/30"}
              >
                <t.icon className="w-4 h-4 mr-1" /> {t.label}
              </Button>
            ))}
          </div>

          {tab === "analytics" && <AdminAnalytics />}
          {tab === "bookings" && <AllBookings />}
          {tab === "services" && <ManageServices />}
          {tab === "barbers" && <ManageBarbers />}
          {tab === "products" && <ManageProducts />}
          {tab === "orders" && <ManageOrders />}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

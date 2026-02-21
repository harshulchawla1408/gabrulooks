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
    <div className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.05),transparent_70%)] opacity-50 z-0" />
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-base-100/80 backdrop-blur-xl p-6 rounded-2xl border border-primary/10 shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <p className="text-primary tracking-[0.2em] text-xs uppercase font-bold">Management</p>
                <div className="badge badge-primary badge-sm uppercase font-bold tracking-wider">Admin</div>
              </div>
              <h1 className="font-heading text-4xl text-base-content font-bold">Admin Dashboard</h1>
              <p className="text-base-content/60 text-sm mt-1">Welcome back, {user?.user_metadata?.full_name || user?.email || "Admin"}</p>
            </div>
            <Button variant="outline" onClick={signOut} className="btn btn-outline btn-error rounded-full hover:bg-error hover:text-error-content hover:border-error transition-all px-6">
              Sign Out
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar scroll-smooth">
            <div className="flex gap-3 px-1">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`btn rounded-full px-6 transition-all border-none ${
                    tab === t.key 
                      ? "btn-primary shadow-md shadow-primary/20 hover:-translate-y-0.5" 
                      : "bg-base-200/50 hover:bg-base-200 text-base-content/70 hover:text-base-content"
                  }`}
                >
                  <t.icon className={`w-4 h-4 mr-2 ${tab === t.key ? "text-primary-content" : "text-primary"}`} /> 
                  <span className="whitespace-nowrap">{t.label}</span>
                </button>
              ))}
            </div>
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

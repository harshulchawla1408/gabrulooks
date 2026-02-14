import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, User, Clock, ShoppingBag, Scissors, Check, X, Gift, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyBookings, useUpdateBooking } from "@/hooks/useBookings";
import { useServices, formatPrice } from "@/hooks/useServices";
import { useBarbers } from "@/hooks/useBarbers";
import { useLoyaltyBalance } from "@/hooks/useLoyaltyPoints";
import { useMyOrders, useOrderItems, statusColor } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const formatSlotTime = (time: string) => {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
};

const Dashboard = () => {
  const { user, role, signOut } = useAuth();
  const { data: bookings, isLoading: loadingBookings } = useMyBookings(user?.id);
  const { data: services } = useServices(false);
  const { data: barbers } = useBarbers(false);
  const { balance, thisMonth } = useLoyaltyBalance(user?.id);
  const { data: orders, isLoading: loadingOrders } = useMyOrders(user?.id);
  const { data: allProducts } = useProducts();
  const updateBooking = useUpdateBooking();

  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "barber") return <Navigate to="/barber" replace />;
  if (role === "receptionist") return <Navigate to="/receptionist" replace />;

  const getService = (id: string) => services?.find(s => s.id === id);
  const getBarber = (id: string) => barbers?.find(b => b.id === id);

  const upcoming = bookings?.filter(b => b.status === "confirmed") ?? [];
  const past = bookings?.filter(b => b.status !== "confirmed") ?? [];

  const handleCancel = async (id: string) => {
    try {
      await updateBooking.mutateAsync({ id, status: "cancelled" });
      toast({ title: "Booking cancelled" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading text-3xl text-foreground">My Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-1">Welcome, {user?.user_metadata?.full_name || user?.email || user?.phone || "Guest"}</p>
            </div>
            <Button variant="outline" onClick={signOut} className="border-primary/30 text-primary hover:bg-primary/10">
              Sign Out
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Link to="/book">
              <div className="glass-card rounded-xl p-6 hover-gold-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <Calendar className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading text-lg text-foreground">Book Appointment</h3>
                <p className="text-muted-foreground text-sm mt-1">Schedule your next session</p>
              </div>
            </Link>
            <Link to="/services">
              <div className="glass-card rounded-xl p-6 hover-gold-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <Scissors className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading text-lg text-foreground">Browse Services</h3>
                <p className="text-muted-foreground text-sm mt-1">View all services & pricing</p>
              </div>
            </Link>
            <Link to="/loyalty">
              <div className="glass-card rounded-xl p-6 hover-gold-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <Gift className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-heading text-lg text-foreground">Loyalty Points</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  <span className="font-bold text-primary">{balance}</span> pts · {thisMonth} this month
                </p>
              </div>
            </Link>
          </div>

          {/* Upcoming Bookings */}
          <h2 className="font-heading text-xl text-foreground mb-3">Upcoming Bookings</h2>
          {loadingBookings ? (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !upcoming.length ? (
            <div className="text-center py-8 bg-card border border-border rounded-xl">
              <Clock className="w-8 h-8 text-primary/40 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No upcoming bookings</p>
              <Link to="/book">
                <Button size="sm" className="mt-3 gold-gradient text-background font-semibold">
                  Book Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {upcoming.map(b => {
                const service = getService(b.service_id);
                const barber = getBarber(b.barber_id);
                return (
                  <div key={b.id} className="p-4 rounded-xl border border-border bg-card flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground text-sm">{service?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        with {barber?.display_name} · {format(new Date(b.booking_date + "T00:00:00"), "EEEE, MMM d")} · {formatSlotTime(b.start_time)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(b.id)}
                      className="text-xs h-7 text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <X className="w-3 h-3 mr-1" /> Cancel
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Past Bookings */}
          {past.length > 0 && (
            <>
              <h2 className="font-heading text-xl text-foreground mb-3 mt-6">Past Bookings</h2>
              <div className="space-y-2">
                {past.slice(0, 10).map(b => {
                  const service = getService(b.service_id);
                  const barber = getBarber(b.barber_id);
                  return (
                    <div key={b.id} className="p-3 rounded-lg border border-border/50 bg-card/50 opacity-70">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground text-sm">{service?.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          b.status === "completed" ? "bg-green-500/10 text-green-600"
                            : b.status === "cancelled" ? "bg-destructive/10 text-destructive"
                              : "bg-muted text-muted-foreground"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {barber?.display_name} · {format(new Date(b.booking_date + "T00:00:00"), "MMM d, yyyy")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* My Orders */}
          <h2 className="font-heading text-xl text-foreground mb-3 mt-8">My Orders</h2>
          {loadingOrders ? (
            <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : !orders?.length ? (
            <div className="text-center py-8 bg-card border border-border rounded-xl">
              <Package className="w-8 h-8 text-primary/40 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No orders yet</p>
              <Link to="/shop"><Button size="sm" className="mt-3 gold-gradient text-background font-semibold">Shop Now</Button></Link>
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {orders.map(order => (
                <OrderCard key={order.id} order={order} products={allProducts} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, products }: { order: any; products?: any[] }) => {
  const [expanded, setExpanded] = useState(false);
  const { data: items } = useOrderItems(expanded ? order.id : undefined);

  return (
    <div className="rounded-xl border border-border bg-card">
      <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setExpanded(!expanded)}>
        <div>
          <p className="font-medium text-foreground text-sm">{order.order_number}</p>
          <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), "MMM d, yyyy")}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-primary font-bold text-sm">${(order.total_cents / 100).toFixed(2)}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(order.status)}`}>{order.status}</span>
        </div>
      </button>
      {expanded && items && (
        <div className="px-4 pb-4 border-t border-border pt-3 space-y-1">
          {items.map((item: any) => {
            const product = products?.find((p: any) => p.id === item.product_id);
            return (
              <div key={item.id} className="flex justify-between text-xs">
                <span className="text-foreground">{product?.name ?? "Unknown"} × {item.quantity}</span>
                <span className="text-muted-foreground">${((item.price_cents * item.quantity) / 100).toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

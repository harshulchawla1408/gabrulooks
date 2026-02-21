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
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <p className="text-primary tracking-[0.2em] text-xs uppercase font-bold mb-1">Account</p>
              <h1 className="font-heading text-4xl text-base-content font-bold">My Dashboard</h1>
              <p className="text-base-content/60 text-sm mt-1">Welcome back, {user?.user_metadata?.full_name || user?.email || user?.phone || "Guest"}</p>
            </div>
            <Button variant="outline" onClick={signOut} className="btn btn-outline btn-error rounded-full hover:bg-error hover:text-error-content hover:border-error transition-all px-6">
              Sign Out
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link to="/book" className="group">
              <div className="card bg-base-100/80 backdrop-blur-xl shadow-lg border border-primary/10 p-6 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Calendar className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl text-base-content font-semibold mb-1 group-hover:text-primary transition-colors">Book Appointment</h3>
                <p className="text-base-content/60 text-sm">Schedule your next session</p>
              </div>
            </Link>
            <Link to="/services" className="group">
              <div className="card bg-base-100/80 backdrop-blur-xl shadow-lg border border-primary/10 p-6 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Scissors className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl text-base-content font-semibold mb-1 group-hover:text-primary transition-colors">Browse Services</h3>
                <p className="text-base-content/60 text-sm">View all services & pricing</p>
              </div>
            </Link>
            <Link to="/loyalty" className="group">
              <div className="card bg-base-100/80 backdrop-blur-xl shadow-lg border border-primary/10 p-6 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] transition-all duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 relative">
                  <Gift className="w-7 h-7 text-primary" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent animate-pulse" />
                </div>
                <h3 className="font-heading text-xl text-base-content font-semibold mb-1 group-hover:text-primary transition-colors">Loyalty Points</h3>
                <p className="text-base-content/60 text-sm">
                  <span className="font-bold text-primary text-lg">{balance}</span> pts <span className="text-xs ml-1">({thisMonth} this month)</span>
                </p>
              </div>
            </Link>
          </div>

          {/* Upcoming Bookings */}
          <h2 className="font-heading text-2xl text-base-content mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
             <Calendar className="w-5 h-5 text-primary" /> Upcoming Bookings
          </h2>
          {loadingBookings ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
          ) : !upcoming.length ? (
            <div className="text-center py-12 bg-base-200/50 border border-base-300 rounded-2xl mb-10">
              <div className="w-16 h-16 bg-base-100 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <Clock className="w-8 h-8 text-base-content/40" />
              </div>
              <p className="text-base-content/60 text-lg mb-4">No upcoming bookings</p>
              <Link to="/book">
                <Button className="btn btn-primary rounded-full px-8 shadow-md">Book Now</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4 mb-12">
              {upcoming.map(b => {
                const service = getService(b.service_id);
                const barber = getBarber(b.barber_id);
                return (
                  <div key={b.id} className="p-5 rounded-2xl border border-primary/10 bg-base-100/80 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary font-bold">
                        {format(new Date(b.booking_date + "T00:00:00"), "dd")}
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-base-content text-lg">{service?.name}</p>
                        <p className="text-sm text-base-content/70 flex items-center gap-1.5 whitespace-nowrap">
                          <User className="w-3.5 h-3.5" /> {barber?.display_name} <span className="text-base-300 mx-1">|</span>
                          <Calendar className="w-3.5 h-3.5" /> {format(new Date(b.booking_date + "T00:00:00"), "MMM d")} <span className="text-base-300 mx-1">|</span>
                          <Clock className="w-3.5 h-3.5" /> {formatSlotTime(b.start_time)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleCancel(b.id)}
                      className="btn btn-outline btn-error btn-sm rounded-full px-6 w-full sm:w-auto"
                    >
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Past Bookings */}
          {past.length > 0 && (
            <div className="mb-12">
              <h2 className="font-heading text-2xl text-base-content mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
                <Clock className="w-5 h-5 text-base-content/50" /> Past Bookings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {past.slice(0, 4).map(b => {
                  const service = getService(b.service_id);
                  const barber = getBarber(b.barber_id);
                  return (
                    <div key={b.id} className="p-4 rounded-2xl border border-base-300 bg-base-200/50 opacity-80 hover:opacity-100 transition-opacity flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-base-content">{service?.name}</p>
                        <p className="text-xs text-base-content/60 mt-1 flex items-center gap-1">
                          <User className="w-3 h-3" /> {barber?.display_name} · {format(new Date(b.booking_date + "T00:00:00"), "MMM d, yyyy")}
                        </p>
                      </div>
                      <span className={`badge badge-sm uppercase font-bold tracking-wider ${
                        b.status === "completed" ? "badge-success badge-outline"
                          : b.status === "cancelled" ? "badge-error badge-outline"
                            : "badge-ghost"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* My Orders */}
          <h2 className="font-heading text-2xl text-base-content mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
            <Package className="w-5 h-5 text-primary" /> My Orders
          </h2>
          {loadingOrders ? (
            <div className="flex justify-center py-10"><span className="loading loading-spinner text-primary loading-lg"></span></div>
          ) : !orders?.length ? (
            <div className="text-center py-12 bg-base-200/50 border border-base-300 rounded-2xl mb-10">
              <div className="w-16 h-16 bg-base-100 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <ShoppingBag className="w-8 h-8 text-base-content/40" />
              </div>
              <p className="text-base-content/60 text-lg mb-4">No orders yet</p>
              <Link to="/shop"><Button className="btn btn-primary rounded-full px-8 shadow-md">Shop Now</Button></Link>
            </div>
          ) : (
            <div className="space-y-4 mb-12">
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
    <div className="rounded-2xl border border-primary/10 bg-base-100/80 shadow-sm overflow-hidden transition-all duration-300">
      <button className="w-full flex items-center justify-between p-5 text-left hover:bg-base-200/30 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
             <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-base-content text-base">Order #{order.order_number}</p>
            <p className="text-xs text-base-content/60 mt-0.5">{format(new Date(order.created_at), "MMM d, yyyy")}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-primary font-bold text-lg">${(order.total_cents / 100).toFixed(2)}</span>
          <span className={`badge badge-sm uppercase font-bold tracking-wider ${
            order.status === "completed" || order.status === "delivered" ? "badge-success badge-outline" :
            order.status === "cancelled" ? "badge-error badge-outline" :
            "badge-primary badge-outline"
          }`}>{order.status}</span>
        </div>
      </button>
      {expanded && items && (
        <div className="px-5 pb-5 border-t border-base-200 mt-2 pt-4 bg-base-200/20 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2">Order Items</p>
          {items.map((item: any) => {
            const product = products?.find((p: any) => p.id === item.product_id);
            return (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded bg-base-300 overflow-hidden flex-shrink-0">
                     {product?.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : <Package className="w-4 h-4 m-2 text-base-content/30" />}
                   </div>
                   <span className="text-base-content font-medium">{product?.name ?? "Unknown"} <span className="text-base-content/50 ml-1">× {item.quantity}</span></span>
                </div>
                <span className="text-base-content font-bold">${((item.price_cents * item.quantity) / 100).toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

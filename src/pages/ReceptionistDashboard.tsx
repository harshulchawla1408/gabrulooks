import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { UserPlus, Calendar, Users, Scissors, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAllBookings, useCreateBooking, useAvailableSlots } from "@/hooks/useBookings";
import { useServices, formatPrice } from "@/hooks/useServices";
import { useBarbers, useBarbersForService } from "@/hooks/useBarbers";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import type { DbService, DbBarber } from "@/types/booking";

const formatSlotTime = (time: string) => {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
};

const statusColors: Record<string, string> = {
  confirmed: "bg-primary/10 text-primary",
  completed: "bg-green-500/10 text-green-600",
  cancelled: "bg-destructive/10 text-destructive",
  no_show: "bg-muted text-muted-foreground",
};

const ReceptionistDashboard = () => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<"today" | "walkin">("today");

  return (
    <div className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.05),transparent_70%)] opacity-50 z-0" />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-base-100/80 backdrop-blur-xl p-6 rounded-2xl border border-primary/10 shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <p className="text-primary tracking-[0.2em] text-xs uppercase font-bold">Front Desk</p>
                <div className="badge badge-primary badge-sm uppercase font-bold tracking-wider">Receptionist</div>
              </div>
              <h1 className="font-heading text-4xl text-base-content font-bold">Reception Dashboard</h1>
              <p className="text-base-content/60 text-sm mt-1">Welcome back, {user?.user_metadata?.full_name || user?.email || "Receptionist"}</p>
            </div>
            <Button variant="outline" onClick={signOut} className="btn btn-outline btn-error rounded-full hover:bg-error hover:text-error-content hover:border-error transition-all px-6">
              Sign Out
            </Button>
          </div>

          <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar scroll-smooth">
            <div className="flex gap-3 px-1">
              <button
                onClick={() => setTab("today")}
                className={`btn rounded-full px-6 transition-all border-none ${
                  tab === "today" ? "btn-primary shadow-md shadow-primary/20 hover:-translate-y-0.5" : "bg-base-200/50 hover:bg-base-200 text-base-content/70 hover:text-base-content"
                }`}
              >
                <Calendar className={`w-4 h-4 mr-2 ${tab === "today" ? "text-primary-content" : "text-primary"}`} /> <span className="whitespace-nowrap">Today's Schedule</span>
              </button>
              <button
                onClick={() => setTab("walkin")}
                className={`btn rounded-full px-6 transition-all border-none ${
                  tab === "walkin" ? "btn-primary shadow-md shadow-primary/20 hover:-translate-y-0.5" : "bg-base-200/50 hover:bg-base-200 text-base-content/70 hover:text-base-content"
                }`}
              >
                <UserPlus className={`w-4 h-4 mr-2 ${tab === "walkin" ? "text-primary-content" : "text-primary"}`} /> <span className="whitespace-nowrap">Walk-In Booking</span>
              </button>
            </div>
          </div>

          {tab === "today" && <TodaySchedule />}
          {tab === "walkin" && <WalkInBooking userId={user?.id} />}
        </motion.div>
      </div>
    </div>
  );
};

const TodaySchedule = () => {
  const today = format(new Date(), "yyyy-MM-dd");
  const { data: bookings, isLoading } = useAllBookings(today);
  const { data: services } = useServices(false);
  const { data: barbers } = useBarbers(false);

  const getService = (id: string) => services?.find(s => s.id === id);
  const getBarber = (id: string) => barbers?.find(b => b.id === id);

  if (isLoading) {
    return <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
            <div className="space-y-6">
              <h3 className="font-heading text-2xl text-base-content flex items-center gap-2 border-b border-base-300 pb-2">
                <Calendar className="w-6 h-6 text-primary" /> Today — {format(new Date(), "EEEE, MMMM d")}
              </h3>
              {!bookings?.length ? (
                <div className="text-center py-16 bg-base-200/50 border border-base-300 rounded-3xl">
                  <div className="w-20 h-20 bg-base-100 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
                    <Calendar className="w-10 h-10 text-base-content/40" />
                  </div>
                  <h4 className="font-heading text-2xl text-base-content mb-2">Clear Schedule</h4>
                  <p className="text-base-content/60 text-lg">No bookings for today yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {bookings.map(b => {
                    const service = getService(b.service_id);
                    const barber = getBarber(b.barber_id);
                    return (
                      <div key={b.id} className="p-5 rounded-2xl border border-primary/10 bg-base-100/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${
                          b.status === 'confirmed' ? 'bg-primary' : 
                          b.status === 'completed' ? 'bg-success' : 
                          b.status === 'cancelled' ? 'bg-error' : 'bg-base-300'
                        }`} />
                        <div className="pl-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-base-content text-lg">{service?.name}</span>
                              <span className={`badge badge-sm uppercase font-bold tracking-wider ${
                                b.status === "completed" ? "badge-success badge-outline"
                                  : b.status === "cancelled" ? "badge-error badge-outline"
                                  : b.status === "confirmed" ? "badge-primary badge-outline"
                                    : "badge-ghost"
                              }`}>
                                {b.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70">
                              <span className="flex items-center gap-1.5 font-medium"><User className="w-4 h-4 text-primary" /> {barber?.display_name}</span>
                              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" /> {formatSlotTime(b.start_time)} – {formatSlotTime(b.end_time)}</span>
                            </div>
                          </div>
                          
                          {b.status === 'confirmed' && (
                            <div className="text-right sm:text-left self-end sm:self-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <p className="text-xs text-base-content/50 uppercase tracking-wider font-semibold">Ready</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
};

const WalkInBooking = ({ userId }: { userId?: string }) => {
  const { data: services } = useServices();
  const { data: allBarbers } = useBarbers();
  const createBooking = useCreateBooking();
  const [selectedService, setSelectedService] = useState<DbService | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<DbBarber | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);

  const { data: barbersForService } = useBarbersForService(selectedService?.id);
  const { data: slots } = useAvailableSlots(selectedBarber?.id, selectedDate);

  const barbersList = selectedService ? (barbersForService ?? []) : (allBarbers ?? []);

  const handleBook = async () => {
    if (!userId || !selectedService || !selectedBarber || !selectedSlot) return;
    try {
      await createBooking.mutateAsync({
        customer_id: userId,
        barber_id: selectedBarber.id,
        service_id: selectedService.id,
        booking_date: selectedDate,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        created_by: userId,
        notes: customerName ? `Walk-in: ${customerName}` : "Walk-in booking",
      });
      toast({ title: "Walk-in booking created!" });
      setSelectedService(null);
      setSelectedBarber(null);
      setSelectedSlot(null);
      setCustomerName("");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="card bg-base-100/80 backdrop-blur-xl shadow-xl border border-primary/10 p-6 sm:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8 border-b border-base-300 pb-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><UserPlus className="w-6 h-6 text-primary" /></div>
        <div>
          <h3 className="font-heading text-2xl text-base-content">Walk-In Booking</h3>
          <p className="text-sm text-base-content/60">Fast-track booking for in-store customers</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="label">
            <span className="label-text font-semibold uppercase tracking-wider text-xs">Customer Name (Optional)</span>
          </label>
          <input 
            type="text" 
            value={customerName} 
            onChange={e => setCustomerName(e.target.value)} 
            placeholder="John Doe" 
            className="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
          />
        </div>

        <div>
           <label className="label">
            <span className="label-text font-semibold uppercase tracking-wider text-xs">Select Service</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {services?.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedService(s); setSelectedBarber(null); setSelectedSlot(null); }}
                className={`text-left p-3 rounded-xl border transition-all duration-200 group ${
                  selectedService?.id === s.id
                    ? "border-primary bg-primary/10 shadow-sm shadow-primary/5"
                    : "border-base-300 bg-base-200/50 hover:border-primary/40 hover:bg-base-200"
                }`}
              >
                <div className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{s.name}</div>
                <div className={`text-xs font-bold ${selectedService?.id === s.id ? "text-primary" : "text-base-content/60"}`}>
                  {formatPrice(s.cash_price)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedService && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <label className="label">
              <span className="label-text font-semibold uppercase tracking-wider text-xs">Available Barbers</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {barbersList.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBarber(b); setSelectedSlot(null); }}
                  className={`flex flex-col items-center p-4 rounded-xl border transition-all duration-200 ${
                    selectedBarber?.id === b.id
                       ? "border-primary bg-primary/10 shadow-sm shadow-primary/5 scale-[1.02]"
                      : "border-base-300 bg-base-200/50 hover:border-primary/40 hover:bg-base-200"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${selectedBarber?.id === b.id ? "bg-primary text-primary-content" : "bg-base-300 text-base-content/60"}`}>
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-center">{b.display_name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {selectedBarber && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
               <label className="label">
                <span className="label-text font-semibold uppercase tracking-wider text-xs">Date</span>
              </label>
              <input 
                type="date" 
                value={selectedDate} 
                onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null); }} 
                className="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary rounded-xl"
              />
            </div>
            
            {selectedDate && (
               <div className="flex-[2]">
                 <label className="label">
                  <span className="label-text font-semibold uppercase tracking-wider text-xs">Available Slots</span>
                </label>
                {!slots?.length ? (
                  <div className="p-4 rounded-xl border border-base-300 bg-base-200/50 text-center text-sm text-base-content/60">
                    No available slots for this date
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {slots.map(s => (
                      <button
                        key={s.slot_start}
                        onClick={() => setSelectedSlot({ start: s.slot_start, end: s.slot_end })}
                        className={`text-sm py-2 px-1 rounded-xl border transition-all font-medium ${
                          selectedSlot?.start === s.slot_start
                            ? "border-primary bg-primary text-primary-content shadow-md shadow-primary/20"
                            : "border-base-300 bg-base-200/50 hover:border-primary/40 hover:bg-base-200 text-base-content/70 hover:text-base-content"
                        }`}
                      >
                        {formatSlotTime(s.slot_start)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="pt-6 mt-6 border-t border-base-300">
        <Button
          onClick={handleBook}
          disabled={!selectedService || !selectedBarber || !selectedSlot || createBooking.isPending}
          className="btn btn-primary btn-lg w-full rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-lg border-none"
        >
          {createBooking.isPending ? "Creating Booking..." : "Book Appointment"}
        </Button>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;

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
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-heading text-3xl text-foreground">Reception</h1>
                <span className="text-xs gold-gradient text-background px-2 py-0.5 rounded-full font-semibold">RECEPTIONIST</span>
              </div>
              <p className="text-muted-foreground text-sm">Welcome, {user?.user_metadata?.full_name || user?.email || "Receptionist"}</p>
            </div>
            <Button variant="outline" onClick={signOut} className="border-primary/30 text-primary hover:bg-primary/10">Sign Out</Button>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              variant={tab === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("today")}
              className={tab === "today" ? "gold-gradient text-background" : "border-primary/30"}
            >
              <Calendar className="w-4 h-4 mr-1" /> Today's Schedule
            </Button>
            <Button
              variant={tab === "walkin" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("walkin")}
              className={tab === "walkin" ? "gold-gradient text-background" : "border-primary/30"}
            >
              <UserPlus className="w-4 h-4 mr-1" /> Walk-In Booking
            </Button>
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
    <div className="space-y-3">
      <h3 className="font-heading text-lg text-foreground">Today — {format(new Date(), "EEEE, MMMM d")}</h3>
      {!bookings?.length ? (
        <p className="text-center text-muted-foreground py-8">No bookings for today</p>
      ) : (
        bookings.map(b => {
          const service = getService(b.service_id);
          const barber = getBarber(b.barber_id);
          return (
            <div key={b.id} className="p-4 rounded-xl border border-border bg-card flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm">{service?.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[b.status]}`}>{b.status}</span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-3">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {barber?.display_name}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatSlotTime(b.start_time)} – {formatSlotTime(b.end_time)}</span>
                </p>
              </div>
            </div>
          );
        })
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
    <div className="space-y-5">
      <h3 className="font-heading text-lg text-foreground">Create Walk-In Booking</h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Customer Name (optional)</label>
          <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Walk-in customer name" />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Service</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {services?.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedService(s); setSelectedBarber(null); setSelectedSlot(null); }}
                className={`text-left text-xs p-2 rounded-lg border transition-all ${
                  selectedService?.id === s.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {s.name} — {formatPrice(s.cash_price)}
              </button>
            ))}
          </div>
        </div>

        {selectedService && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Barber</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {barbersList.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBarber(b); setSelectedSlot(null); }}
                  className={`text-left text-xs p-2 rounded-lg border transition-all ${
                    selectedBarber?.id === b.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {b.display_name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedBarber && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
            <Input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null); }} />
          </div>
        )}

        {selectedBarber && selectedDate && (
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Available Slots</label>
            {!slots?.length ? (
              <p className="text-xs text-muted-foreground py-2">No available slots</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {slots.map(s => (
                  <button
                    key={s.slot_start}
                    onClick={() => setSelectedSlot({ start: s.slot_start, end: s.slot_end })}
                    className={`text-xs p-2 rounded-lg border transition-all ${
                      selectedSlot?.start === s.slot_start
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    {formatSlotTime(s.slot_start)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Button
        onClick={handleBook}
        disabled={!selectedService || !selectedBarber || !selectedSlot || createBooking.isPending}
        className="gold-gradient text-background font-semibold w-full"
      >
        {createBooking.isPending ? "Creating..." : "Create Walk-In Booking"}
      </Button>
    </div>
  );
};

export default ReceptionistDashboard;

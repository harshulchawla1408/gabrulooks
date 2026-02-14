import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBarbers, useBarberAvailability, useUpsertAvailability } from "@/hooks/useBarbers";
import { useBarberBookings, useUpdateBooking } from "@/hooks/useBookings";
import { useServices, formatPrice } from "@/hooks/useServices";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Calendar, Clock, DollarSign, Settings, User, Check, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import BarberEarnings from "@/components/barber/BarberEarnings";
import BarberProfile from "@/components/barber/BarberProfile";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const formatSlotTime = (time: string) => {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
};

const BarberDashboard = () => {
  const { user, signOut } = useAuth();
  const { data: barbers } = useBarbers(false);
  const barber = barbers?.find(b => b.user_id === user?.id);
  const { data: availability } = useBarberAvailability(barber?.id);
  const { data: bookings } = useBarberBookings(barber?.id);
  const { data: services } = useServices(false);
  const upsertAvailability = useUpsertAvailability();
  const updateBooking = useUpdateBooking();

  const [tab, setTab] = useState<"bookings" | "availability" | "earnings" | "profile">("bookings");
  const [schedule, setSchedule] = useState<Record<number, { start: string; end: string; active: boolean }>>({});

  useEffect(() => {
    if (availability) {
      const map: Record<number, { start: string; end: string; active: boolean }> = {};
      availability.forEach(a => {
        map[a.day_of_week] = { start: a.start_time.slice(0, 5), end: a.end_time.slice(0, 5), active: a.is_active };
      });
      setSchedule(map);
    }
  }, [availability]);

  const getService = (id: string) => services?.find(s => s.id === id);

  const saveDay = async (day: number) => {
    if (!barber || !schedule[day]) return;
    try {
      await upsertAvailability.mutateAsync({
        barber_id: barber.id,
        day_of_week: day,
        start_time: schedule[day].start + ":00",
        end_time: schedule[day].end + ":00",
        is_active: schedule[day].active,
      });
      toast({ title: `${DAYS[day]} availability saved` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await updateBooking.mutateAsync({ id, status: "completed" });
      toast({ title: "Booking completed" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (!barber) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <User className="w-12 h-12 text-primary mx-auto mb-4 opacity-40" />
          <h2 className="font-heading text-2xl text-foreground mb-2">Barber Profile Not Found</h2>
          <p className="text-muted-foreground text-sm">Ask an admin to add you as a barber to access this dashboard.</p>
          <Button variant="outline" onClick={signOut} className="mt-4 border-primary/30 text-primary">Sign Out</Button>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings?.filter(b => b.status === "confirmed") ?? [];
  const pastBookings = bookings?.filter(b => b.status !== "confirmed") ?? [];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-heading text-3xl text-foreground">Barber Dashboard</h1>
                <span className="text-xs gold-gradient text-background px-2 py-0.5 rounded-full font-semibold">BARBER</span>
              </div>
              <p className="text-muted-foreground text-sm">Welcome, {barber.display_name}</p>
            </div>
            <Button variant="outline" onClick={signOut} className="border-primary/30 text-primary hover:bg-primary/10">Sign Out</Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button
              variant={tab === "bookings" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("bookings")}
              className={tab === "bookings" ? "gold-gradient text-background" : "border-primary/30"}
            >
              <Calendar className="w-4 h-4 mr-1" /> My Bookings
            </Button>
            <Button
              variant={tab === "availability" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("availability")}
              className={tab === "availability" ? "gold-gradient text-background" : "border-primary/30"}
            >
              <Clock className="w-4 h-4 mr-1" /> Availability
            </Button>
            <Button
              variant={tab === "earnings" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("earnings")}
              className={tab === "earnings" ? "gold-gradient text-background" : "border-primary/30"}
            >
              <BarChart3 className="w-4 h-4 mr-1" /> Earnings
            </Button>
            <Button
              variant={tab === "profile" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("profile")}
              className={tab === "profile" ? "gold-gradient text-background" : "border-primary/30"}
            >
              <User className="w-4 h-4 mr-1" /> Profile
            </Button>
          </div>

          {tab === "bookings" && (
            <div className="space-y-4">
              <h3 className="font-heading text-lg text-foreground">Upcoming ({upcomingBookings.length})</h3>
              {!upcomingBookings.length ? (
                <p className="text-muted-foreground text-sm py-4">No upcoming bookings</p>
              ) : (
                upcomingBookings.map(b => {
                  const service = getService(b.service_id);
                  return (
                    <div key={b.id} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">{service?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(b.booking_date + "T00:00:00"), "MMM d, yyyy")} · {formatSlotTime(b.start_time)} – {formatSlotTime(b.end_time)}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => handleComplete(b.id)} className="text-xs h-7">
                        <Check className="w-3 h-3 mr-1" /> Complete
                      </Button>
                    </div>
                  );
                })
              )}

              {pastBookings.length > 0 && (
                <>
                  <h3 className="font-heading text-lg text-foreground mt-6">Past Bookings</h3>
                  {pastBookings.slice(0, 10).map(b => {
                    const service = getService(b.service_id);
                    return (
                      <div key={b.id} className="p-3 rounded-lg border border-border/50 bg-card/50 opacity-70">
                        <p className="font-medium text-foreground text-sm">{service?.name} — <span className="text-xs capitalize">{b.status}</span></p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(b.booking_date + "T00:00:00"), "MMM d")} · {formatSlotTime(b.start_time)}
                        </p>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {tab === "availability" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">Set your working hours for each day. Customers can only book during these times.</p>
              {DAYS.map((day, i) => {
                const dayData = schedule[i] ?? { start: "09:00", end: "17:00", active: false };
                return (
                  <div key={day} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                    <label className="flex items-center gap-2 min-w-[100px]">
                      <input
                        type="checkbox"
                        checked={dayData.active}
                        onChange={e => setSchedule({ ...schedule, [i]: { ...dayData, active: e.target.checked } })}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-foreground">{day}</span>
                    </label>
                    <input
                      type="time"
                      value={dayData.start}
                      onChange={e => setSchedule({ ...schedule, [i]: { ...dayData, start: e.target.value } })}
                      disabled={!dayData.active}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs disabled:opacity-40"
                    />
                    <span className="text-xs text-muted-foreground">to</span>
                    <input
                      type="time"
                      value={dayData.end}
                      onChange={e => setSchedule({ ...schedule, [i]: { ...dayData, end: e.target.value } })}
                      disabled={!dayData.active}
                      className="rounded-md border border-border bg-background px-2 py-1 text-xs disabled:opacity-40"
                    />
                    <Button size="sm" onClick={() => saveDay(i)} className="text-xs h-7 ml-auto" disabled={!schedule[i]}>
                      Save
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "earnings" && barber && <BarberEarnings barberId={barber.id} />}
          {tab === "profile" && barber && <BarberProfile barber={barber} />}
        </motion.div>
      </div>
    </div>
  );
};

export default BarberDashboard;

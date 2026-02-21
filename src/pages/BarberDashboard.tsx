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
    <div className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.05),transparent_70%)] opacity-50 z-0" />
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-base-100/80 backdrop-blur-xl p-6 rounded-2xl border border-primary/10 shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <p className="text-primary tracking-[0.2em] text-xs uppercase font-bold">Workspace</p>
                <div className="badge badge-primary badge-sm uppercase font-bold tracking-wider">Barber</div>
              </div>
              <h1 className="font-heading text-4xl text-base-content font-bold">Barber Dashboard</h1>
              <p className="text-base-content/60 text-sm mt-1">Welcome back, {barber.display_name}</p>
            </div>
            <Button variant="outline" onClick={signOut} className="btn btn-outline btn-error rounded-full hover:bg-error hover:text-error-content hover:border-error transition-all px-6">
              Sign Out
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar scroll-smooth">
            <div className="flex gap-3 px-1">
              <button
                onClick={() => setTab("bookings")}
                className={`btn rounded-full px-6 transition-all border-none ${
                  tab === "bookings" ? "btn-primary shadow-md shadow-primary/20 hover:-translate-y-0.5" : "bg-base-200/50 hover:bg-base-200 text-base-content/70 hover:text-base-content"
                }`}
              >
                <Calendar className={`w-4 h-4 mr-2 ${tab === "bookings" ? "text-primary-content" : "text-primary"}`} /> <span className="whitespace-nowrap">My Bookings</span>
              </button>
              <button
                onClick={() => setTab("availability")}
                className={`btn rounded-full px-6 transition-all border-none ${
                  tab === "availability" ? "btn-primary shadow-md shadow-primary/20 hover:-translate-y-0.5" : "bg-base-200/50 hover:bg-base-200 text-base-content/70 hover:text-base-content"
                }`}
              >
                <Clock className={`w-4 h-4 mr-2 ${tab === "availability" ? "text-primary-content" : "text-primary"}`} /> <span className="whitespace-nowrap">Availability</span>
              </button>
              <button
                onClick={() => setTab("earnings")}
                className={`btn rounded-full px-6 transition-all border-none ${
                  tab === "earnings" ? "btn-primary shadow-md shadow-primary/20 hover:-translate-y-0.5" : "bg-base-200/50 hover:bg-base-200 text-base-content/70 hover:text-base-content"
                }`}
              >
                <BarChart3 className={`w-4 h-4 mr-2 ${tab === "earnings" ? "text-primary-content" : "text-primary"}`} /> <span className="whitespace-nowrap">Earnings</span>
              </button>
              <button
                onClick={() => setTab("profile")}
                className={`btn rounded-full px-6 transition-all border-none ${
                  tab === "profile" ? "btn-primary shadow-md shadow-primary/20 hover:-translate-y-0.5" : "bg-base-200/50 hover:bg-base-200 text-base-content/70 hover:text-base-content"
                }`}
              >
                <User className={`w-4 h-4 mr-2 ${tab === "profile" ? "text-primary-content" : "text-primary"}`} /> <span className="whitespace-nowrap">Profile</span>
              </button>
            </div>
          </div>

          {tab === "bookings" && (
            <div className="space-y-8">
              <div>
                <h3 className="font-heading text-2xl text-base-content mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
                  <Calendar className="w-5 h-5 text-primary" /> Upcoming ({upcomingBookings.length})
                </h3>
                {!upcomingBookings.length ? (
                  <div className="text-center py-12 bg-base-200/50 border border-base-300 rounded-2xl">
                    <div className="w-16 h-16 bg-base-100 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                      <Clock className="w-8 h-8 text-base-content/40" />
                    </div>
                    <p className="text-base-content/60 text-lg">No upcoming bookings</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map(b => {
                      const service = getService(b.service_id);
                      return (
                        <div key={b.id} className="p-5 rounded-2xl border border-primary/10 bg-base-100/80 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary font-bold">
                              {format(new Date(b.booking_date + "T00:00:00"), "dd")}
                            </div>
                            <div className="space-y-1">
                              <p className="font-bold text-base-content text-lg">{service?.name}</p>
                              <p className="text-sm text-base-content/70 flex items-center gap-1.5 whitespace-nowrap">
                                <Calendar className="w-3.5 h-3.5" /> {format(new Date(b.booking_date + "T00:00:00"), "MMM d, yyyy")} <span className="text-base-300 mx-1">|</span>
                                <Clock className="w-3.5 h-3.5" /> {formatSlotTime(b.start_time)} – {formatSlotTime(b.end_time)}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" onClick={() => handleComplete(b.id)} className="btn btn-primary btn-sm rounded-full px-6 w-full sm:w-auto">
                            <Check className="w-4 h-4 mr-1" /> Complete
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {pastBookings.length > 0 && (
                <div>
                  <h3 className="font-heading text-2xl text-base-content mb-4 flex items-center gap-2 border-b border-base-300 pb-2">
                    <Clock className="w-5 h-5 text-base-content/50" /> Past Bookings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pastBookings.slice(0, 10).map(b => {
                      const service = getService(b.service_id);
                      return (
                        <div key={b.id} className="p-4 rounded-2xl border border-base-300 bg-base-200/50 opacity-80 hover:opacity-100 transition-opacity flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-base-content">{service?.name}</p>
                            <p className="text-xs text-base-content/60 mt-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {format(new Date(b.booking_date + "T00:00:00"), "MMM d")} · {formatSlotTime(b.start_time)}
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
            </div>
          )}

          {tab === "availability" && (
            <div className="card bg-base-100/80 backdrop-blur-xl shadow-xl border border-primary/10 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-base-300 pb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Clock className="w-5 h-5 text-primary" /></div>
                <div>
                  <h3 className="font-heading text-2xl text-base-content">Weekly Schedule</h3>
                  <p className="text-sm text-base-content/60">Set your working hours for each day. Customers can only book during these times.</p>
                </div>
              </div>
              <div className="space-y-4">
                {DAYS.map((day, i) => {
                  const dayData = schedule[i] ?? { start: "09:00", end: "17:00", active: false };
                  return (
                    <div key={day} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-colors ${dayData.active ? 'border-primary/30 bg-primary/5' : 'border-base-300 bg-base-200/30'}`}>
                      <label className="flex items-center gap-3 min-w-[140px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={dayData.active}
                          onChange={e => setSchedule({ ...schedule, [i]: { ...dayData, active: e.target.checked } })}
                          className="checkbox checkbox-primary checkbox-sm rounded-md"
                        />
                        <span className={`text-base font-medium ${dayData.active ? 'text-base-content' : 'text-base-content/60'}`}>{day}</span>
                      </label>
                      <div className="flex items-center gap-2 flex-grow">
                        <input
                          type="time"
                          value={dayData.start}
                          onChange={e => setSchedule({ ...schedule, [i]: { ...dayData, start: e.target.value } })}
                          disabled={!dayData.active}
                          className="input input-bordered input-sm w-full max-w-[120px] bg-base-100/50 disabled:opacity-50"
                        />
                        <span className="text-sm text-base-content/50 px-2 font-medium">to</span>
                        <input
                          type="time"
                          value={dayData.end}
                          onChange={e => setSchedule({ ...schedule, [i]: { ...dayData, end: e.target.value } })}
                          disabled={!dayData.active}
                          className="input input-bordered input-sm w-full max-w-[120px] bg-base-100/50 disabled:opacity-50"
                        />
                      </div>
                      <Button size="sm" onClick={() => saveDay(i)} className="btn btn-primary btn-sm rounded-full px-6 sm:ml-auto w-full sm:w-auto" disabled={!schedule[i]}>
                        Save Day
                      </Button>
                    </div>
                  );
                })}
              </div>
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

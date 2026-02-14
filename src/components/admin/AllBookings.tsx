import { useState } from "react";
import { format } from "date-fns";
import { useAllBookings, useUpdateBooking } from "@/hooks/useBookings";
import { useServices } from "@/hooks/useServices";
import { useBarbers } from "@/hooks/useBarbers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Scissors } from "lucide-react";
import { formatPrice } from "@/hooks/useServices";
import { toast } from "@/hooks/use-toast";

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

const AllBookings = () => {
  const [dateFilter, setDateFilter] = useState<string>("");
  const { data: bookings, isLoading } = useAllBookings(dateFilter || undefined);
  const { data: services } = useServices(false);
  const { data: barbers } = useBarbers(false);
  const updateBooking = useUpdateBooking();

  const getService = (id: string) => services?.find(s => s.id === id);
  const getBarber = (id: string) => barbers?.find(b => b.id === id);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateBooking.mutateAsync({ id, status: status as any });
      toast({ title: `Booking marked as ${status}` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-xl text-foreground">All Bookings</h3>
        <Input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="w-auto"
          placeholder="Filter by date"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !bookings?.length ? (
        <p className="text-center text-muted-foreground py-8">No bookings found</p>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => {
            const service = getService(b.service_id);
            const barber = getBarber(b.barber_id);
            return (
              <div key={b.id} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground text-sm">{service?.name ?? "Unknown"}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {barber?.display_name ?? "Unknown"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {format(new Date(b.booking_date + "T00:00:00"), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatSlotTime(b.start_time)} – {formatSlotTime(b.end_time)}
                      </span>
                    </div>
                    {service && (
                      <p className="text-xs text-muted-foreground">
                        Cash: {formatPrice(service.cash_price)} | Card: {formatPrice(service.card_price)}
                      </p>
                    )}
                  </div>
                  {b.status === "confirmed" && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleStatusChange(b.id, "completed")}>
                        Complete
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleStatusChange(b.id, "cancelled")}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleStatusChange(b.id, "no_show")}>
                        No Show
                      </Button>
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

export default AllBookings;

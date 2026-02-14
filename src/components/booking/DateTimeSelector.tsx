import { format, addDays, startOfDay } from "date-fns";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAvailableSlots } from "@/hooks/useBookings";
import { motion } from "framer-motion";

interface DateTimeSelectorProps {
  barberId: string;
  selectedDate?: string;
  selectedSlot?: { start: string; end: string };
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: { start: string; end: string }) => void;
}

const DateTimeSelector = ({ barberId, selectedDate, selectedSlot, onSelectDate, onSelectSlot }: DateTimeSelectorProps) => {
  const today = startOfDay(new Date());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i);
    return {
      date: format(d, "yyyy-MM-dd"),
      label: format(d, "EEE"),
      day: format(d, "d"),
      month: format(d, "MMM"),
    };
  });

  const { data: slots, isLoading } = useAvailableSlots(barberId, selectedDate);

  const formatSlotTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Date selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-lg text-foreground">Select Date</h3>
          <span className="text-xs text-muted-foreground">Next 7 days</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map(d => (
            <button
              key={d.date}
              onClick={() => onSelectDate(d.date)}
              className={`flex flex-col items-center p-2 rounded-lg text-xs transition-all ${
                selectedDate === d.date
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card border border-border hover:border-primary/40"
              }`}
            >
              <span className="font-medium">{d.label}</span>
              <span className="text-lg font-heading">{d.day}</span>
              <span className="opacity-70">{d.month}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <h3 className="font-heading text-lg text-foreground mb-3">Available Slots</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !slots?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No available slots on this date</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map(slot => {
                const isSelected = selectedSlot?.start === slot.slot_start;
                return (
                  <motion.button
                    key={slot.slot_start}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectSlot({ start: slot.slot_start, end: slot.slot_end })}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-card border border-border hover:border-primary/40"
                    }`}
                  >
                    {formatSlotTime(slot.slot_start)}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;

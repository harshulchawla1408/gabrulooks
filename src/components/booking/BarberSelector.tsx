import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { DbBarber } from "@/types/booking";

interface BarberSelectorProps {
  barbers: DbBarber[];
  selectedId?: string;
  onSelect: (barber: DbBarber) => void;
  loading?: boolean;
}

const BarberSelector = ({ barbers, selectedId, onSelect, loading }: BarberSelectorProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!barbers.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <User className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p>No barbers available for this service yet.</p>
        <p className="text-xs mt-1">Please contact the salon to book.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {barbers.map(barber => (
        <motion.button
          key={barber.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(barber)}
          className={`text-left p-5 rounded-xl border transition-all duration-200 ${
            selectedId === barber.id
              ? "border-primary bg-primary/10 shadow-md"
              : "border-border bg-card hover:border-primary/40"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <User className="w-6 h-6 text-primary" />
          </div>
          <h4 className="font-heading text-foreground">{barber.display_name}</h4>
          {barber.specialty && (
            <p className="text-xs text-muted-foreground mt-1">{barber.specialty}</p>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default BarberSelector;

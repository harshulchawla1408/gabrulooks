import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import type { DbService } from "@/types/booking";
import { formatPrice } from "@/hooks/useServices";

interface ServiceSelectorProps {
  services: DbService[];
  selectedId?: string;
  onSelect: (service: DbService) => void;
}

const ServiceSelector = ({ services, selectedId, onSelect }: ServiceSelectorProps) => {
  const menServices = services.filter(s => s.category === "men");
  const womenServices = services.filter(s => s.category === "women");

  const renderCard = (service: DbService) => (
    <motion.button
      key={service.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(service)}
      className={`text-left p-4 rounded-xl border transition-all duration-200 ${
        selectedId === service.id
          ? "border-primary bg-primary/10 shadow-md"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <h4 className="font-medium text-foreground text-sm">{service.name}</h4>
        <Scissors className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      </div>
      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
        <span>Cash: {formatPrice(service.cash_price)}</span>
        <span>Card: {formatPrice(service.card_price)}</span>
      </div>
    </motion.button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-lg text-foreground mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" /> Men's Services
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menServices.map(renderCard)}
        </div>
      </div>
      <div>
        <h3 className="font-heading text-lg text-foreground mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" /> Women's Services
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {womenServices.map(renderCard)}
        </div>
      </div>
    </div>
  );
};

export default ServiceSelector;

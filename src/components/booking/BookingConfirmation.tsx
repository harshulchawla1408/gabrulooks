import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Check, Calendar, User, Scissors, Clock, Gift, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/hooks/useServices";
import { useLoyaltyBalance, calcDiscountFromPoints, POINTS_VALUE_CENTS } from "@/hooks/useLoyaltyPoints";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/hooks/useProfile";
import PhonePromptDialog from "@/components/shop/PhonePromptDialog";
import type { DbService, DbBarber } from "@/types/booking";
import { motion } from "framer-motion";

interface BookingConfirmationProps {
  service: DbService;
  barber: DbBarber;
  date: string;
  slot: { start: string; end: string };
  onConfirm: (pointsUsed: number, paymentMethod: string) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const formatSlotTime = (time: string) => {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
};

const BookingConfirmation = ({ service, barber, date, slot, onConfirm, onBack, isSubmitting }: BookingConfirmationProps) => {
  const { user } = useAuth();
  const { balance } = useLoyaltyBalance(user?.id);
  const { data: profile, refetch: refetchProfile } = useMyProfile(user?.id);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"pay_at_salon" | "stripe">("pay_at_salon");
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);

  const maxPointsUsable = Math.min(balance, Math.floor(service.cash_price / POINTS_VALUE_CENTS));
  const discount = calcDiscountFromPoints(pointsToUse);

  useEffect(() => {
    if (profile && !phoneChecked) {
      if (!profile.phone || profile.phone.trim() === "") {
        setShowPhonePrompt(true);
      } else {
        setPhoneChecked(true);
      }
    }
  }, [profile, phoneChecked]);

  const handlePointsChange = (val: string) => {
    const num = Math.max(0, Math.min(maxPointsUsable, parseInt(val) || 0));
    setPointsToUse(num);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {user && (
        <PhonePromptDialog
          open={showPhonePrompt}
          userId={user.id}
          onSaved={() => {
            setShowPhonePrompt(false);
            setPhoneChecked(true);
            refetchProfile();
          }}
          onCancel={() => {
            setShowPhonePrompt(false);
            onBack();
          }}
        />
      )}

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-heading text-xl text-foreground mb-4">Booking Summary</h3>

        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Service</p>
            <p className="font-medium text-foreground">{service.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Barber</p>
            <p className="font-medium text-foreground">{barber.display_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium text-foreground">{format(new Date(date + "T00:00:00"), "EEEE, MMMM d, yyyy")}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p className="font-medium text-foreground">{formatSlotTime(slot.start)} – {formatSlotTime(slot.end)}</p>
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Cash Price</span>
            <span className="font-semibold text-foreground">{formatPrice(service.cash_price)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-muted-foreground">Card Price</span>
            <span className="font-semibold text-foreground">{formatPrice(service.card_price)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm mt-1 text-primary font-semibold">
              <span>Loyalty Discount</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div className="border-t border-border pt-4 mt-2">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" /> Payment Method
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod("pay_at_salon")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${paymentMethod === "pay_at_salon" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
            >
              <Banknote className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">Pay at Salon</p>
                <p className="text-xs text-muted-foreground">Pay cash or card when you visit</p>
              </div>
            </button>
            <button
              onClick={() => setPaymentMethod("stripe")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${paymentMethod === "stripe" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
            >
              <CreditCard className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">Pay Online (Stripe)</p>
                <p className="text-xs text-muted-foreground">Secure card payment in AUD</p>
              </div>
            </button>
          </div>
        </div>

        {/* Loyalty Points Redemption */}
        {balance > 0 && (
          <div className="border-t border-border pt-4 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Use Loyalty Points</span>
              <span className="text-xs text-muted-foreground ml-auto">{balance} pts available</span>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={0}
                max={maxPointsUsable}
                value={pointsToUse}
                onChange={e => handlePointsChange(e.target.value)}
                className="w-24 h-8 text-sm"
              />
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8 border-primary/30"
                onClick={() => setPointsToUse(maxPointsUsable)}
              >
                Use Max ({maxPointsUsable})
              </Button>
              {pointsToUse > 0 && (
                <span className="text-xs text-primary font-medium">
                  Save {formatPrice(discount)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 border-primary/30" disabled={isSubmitting}>
          Go Back
        </Button>
        <Button
          onClick={() => onConfirm(pointsToUse, paymentMethod)}
          disabled={isSubmitting}
          className="flex-1 gold-gradient text-background font-semibold"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Check className="w-4 h-4 mr-1" /> Confirm Booking</>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;

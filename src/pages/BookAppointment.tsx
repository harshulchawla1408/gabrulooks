import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useServices } from "@/hooks/useServices";
import { useBarbersForService } from "@/hooks/useBarbers";
import { useCreateBooking } from "@/hooks/useBookings";
import { useAddLoyaltyPoints, calcPointsFromPrice } from "@/hooks/useLoyaltyPoints";
import { toast } from "@/hooks/use-toast";
import ServiceSelector from "@/components/booking/ServiceSelector";
import BarberSelector from "@/components/booking/BarberSelector";
import DateTimeSelector from "@/components/booking/DateTimeSelector";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import type { DbService, DbBarber } from "@/types/booking";

const steps = ["Service", "Barber", "Date & Time", "Confirm"];

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<DbService | undefined>();
  const [selectedBarber, setSelectedBarber] = useState<DbBarber | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | undefined>();
  const [booked, setBooked] = useState(false);

  const { data: services, isLoading: loadingServices } = useServices();
  const { data: barbers, isLoading: loadingBarbers } = useBarbersForService(selectedService?.id);
  const createBooking = useCreateBooking();
  const addPoints = useAddLoyaltyPoints();

  const handleConfirm = async (pointsUsed: number, paymentMethod: string) => {
    if (!user || !selectedService || !selectedBarber || !selectedDate || !selectedSlot) return;

    try {
      const booking = await createBooking.mutateAsync({
        customer_id: user.id,
        barber_id: selectedBarber.id,
        service_id: selectedService.id,
        booking_date: selectedDate,
        start_time: selectedSlot.start,
        end_time: selectedSlot.end,
        created_by: user.id,
        payment_method: paymentMethod as "cash" | "card" | "online",
      });

      // Award loyalty points for the booking
      const earnedPoints = calcPointsFromPrice(selectedService.cash_price);
      if (earnedPoints > 0) {
        await addPoints.mutateAsync({
          user_id: user.id,
          points: earnedPoints,
          description: `Earned from booking: ${selectedService.name}`,
          booking_id: booking.id,
        });
      }

      // Deduct used points
      if (pointsUsed > 0) {
        await addPoints.mutateAsync({
          user_id: user.id,
          points: -pointsUsed,
          description: `Redeemed on booking: ${selectedService.name}`,
          booking_id: booking.id,
        });
      }

      setBooked(true);
      toast({
        title: "Booking confirmed!",
        description: earnedPoints > 0 ? `You earned ${earnedPoints} loyalty points!` : "Your appointment has been scheduled.",
      });
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (booked) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-3xl text-foreground mb-2">Booking Confirmed!</h2>
            <p className="text-muted-foreground mb-8">Your appointment has been scheduled. We look forward to seeing you!</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/dashboard")} className="border-primary/30">View My Bookings</Button>
              <Button onClick={() => { setBooked(false); setStep(0); setSelectedService(undefined); setSelectedBarber(undefined); setSelectedDate(undefined); setSelectedSlot(undefined); }} className="gold-gradient text-background font-semibold">Book Another</Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-3xl text-foreground">Book Appointment</h1>
          </div>

          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                <span className={`text-xs hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                {i < steps.length - 1 && <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {step === 0 && (
                <>
                  {loadingServices ? (
                    <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                  ) : (
                    <>
                      <ServiceSelector services={services ?? []} selectedId={selectedService?.id} onSelect={(s) => { setSelectedService(s); setSelectedBarber(undefined); setSelectedDate(undefined); setSelectedSlot(undefined); }} />
                      <div className="mt-6 flex justify-end">
                        <Button disabled={!selectedService} onClick={() => setStep(1)} className="gold-gradient text-background font-semibold">Continue</Button>
                      </div>
                    </>
                  )}
                </>
              )}

              {step === 1 && (
                <>
                  <BarberSelector barbers={barbers ?? []} selectedId={selectedBarber?.id} onSelect={(b) => { setSelectedBarber(b); setSelectedDate(undefined); setSelectedSlot(undefined); }} loading={loadingBarbers} />
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(0)} className="border-primary/30">Back</Button>
                    <Button disabled={!selectedBarber} onClick={() => setStep(2)} className="gold-gradient text-background font-semibold">Continue</Button>
                  </div>
                </>
              )}

              {step === 2 && selectedBarber && (
                <>
                  <DateTimeSelector barberId={selectedBarber.id} selectedDate={selectedDate} selectedSlot={selectedSlot} onSelectDate={d => { setSelectedDate(d); setSelectedSlot(undefined); }} onSelectSlot={setSelectedSlot} />
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)} className="border-primary/30">Back</Button>
                    <Button disabled={!selectedSlot} onClick={() => setStep(3)} className="gold-gradient text-background font-semibold">Continue</Button>
                  </div>
                </>
              )}

              {step === 3 && selectedService && selectedBarber && selectedDate && selectedSlot && (
                <BookingConfirmation
                  service={selectedService}
                  barber={selectedBarber}
                  date={selectedDate}
                  slot={selectedSlot}
                  onConfirm={handleConfirm}
                  onBack={() => setStep(2)}
                  isSubmitting={createBooking.isPending}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default BookAppointment;

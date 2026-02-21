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

  const handleConfirm = async (pointsUsed: number) => {
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
        payment_method: "cash",
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
      <div className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.1),transparent_70%)] opacity-50 z-0" />
        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card bg-base-100/90 backdrop-blur-xl shadow-2xl border border-primary/20 text-center py-16 px-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
            </div>
            <h2 className="font-heading text-4xl text-base-content mb-4 font-bold">Booking Confirmed!</h2>
            <p className="text-base-content/70 text-lg mb-10">Your appointment has been scheduled. We look forward to seeing you!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/dashboard")} className="btn btn-outline btn-primary rounded-full px-8 hover:-translate-y-1 transition-transform">View My Bookings</Button>
              <Button onClick={() => { setBooked(false); setStep(0); setSelectedService(undefined); setSelectedBarber(undefined); setSelectedDate(undefined); setSelectedSlot(undefined); }} className="btn btn-primary rounded-full px-8 shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all">Book Another</Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.05),transparent_70%)] opacity-50 z-0" />
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-10">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-10 w-10 rounded-full bg-base-200/50 hover:bg-base-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-primary tracking-[0.2em] text-xs uppercase font-bold mb-1">Reservation</p>
              <h1 className="font-heading text-4xl text-base-content font-bold">Book Appointment</h1>
            </div>
          </div>

          <div className="mb-12">
            <ul className="steps steps-horizontal w-full font-heading text-sm overflow-hidden">
              {steps.map((s, i) => (
                <li key={s} data-content={i < step ? "✓" : i + 1} className={`step ${i <= step ? "step-primary text-primary" : "text-base-content/40"}`}>
                  <span className="mt-2 hidden sm:block font-sans text-xs uppercase tracking-wider font-semibold">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="card bg-base-100/80 backdrop-blur-xl shadow-xl border border-primary/10 p-6 sm:p-10">
              {step === 0 && (
                <>
                  {loadingServices ? (
                    <div className="flex justify-center py-20"><span className="loading loading-spinner text-primary loading-lg"></span></div>
                  ) : (
                    <>
                      <h2 className="font-heading text-2xl mb-6">Select a Service</h2>
                      <ServiceSelector services={services ?? []} selectedId={selectedService?.id} onSelect={(s) => { setSelectedService(s); setSelectedBarber(undefined); setSelectedDate(undefined); setSelectedSlot(undefined); }} />
                      <div className="mt-10 flex justify-end">
                        <Button disabled={!selectedService} onClick={() => setStep(1)} className="btn btn-primary rounded-full px-8 shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all">Continue</Button>
                      </div>
                    </>
                  )}
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="font-heading text-2xl mb-6">Select a Barber</h2>
                  <BarberSelector barbers={barbers ?? []} selectedId={selectedBarber?.id} onSelect={(b) => { setSelectedBarber(b); setSelectedDate(undefined); setSelectedSlot(undefined); }} loading={loadingBarbers} />
                  <div className="mt-10 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(0)} className="btn btn-ghost rounded-full px-8">Back</Button>
                    <Button disabled={!selectedBarber} onClick={() => setStep(2)} className="btn btn-primary rounded-full px-8 shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all">Continue</Button>
                  </div>
                </>
              )}

              {step === 2 && selectedBarber && (
                <>
                  <h2 className="font-heading text-2xl mb-6">Select Date & Time</h2>
                  <DateTimeSelector barberId={selectedBarber.id} selectedDate={selectedDate} selectedSlot={selectedSlot} onSelectDate={d => { setSelectedDate(d); setSelectedSlot(undefined); }} onSelectSlot={setSelectedSlot} />
                  <div className="mt-10 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)} className="btn btn-ghost rounded-full px-8">Back</Button>
                    <Button disabled={!selectedSlot} onClick={() => setStep(3)} className="btn btn-primary rounded-full px-8 shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all">Continue</Button>
                  </div>
                </>
              )}

              {step === 3 && selectedService && selectedBarber && selectedDate && selectedSlot && (
                <BookingConfirmation
                  service={selectedService}
                  barber={selectedBarber}
                  date={selectedDate}
                  slot={selectedSlot}
                  onConfirm={(pointsUsed) => handleConfirm(pointsUsed)}
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, CreditCard, CheckCircle2, Truck, Banknote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { usePlaceOrder } from "@/hooks/useOrders";
import { useMyProfile } from "@/hooks/useProfile";
import PhonePromptDialog from "@/components/shop/PhonePromptDialog";
import { toast } from "sonner";

const AU_STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"];

const steps = ["Address", "Payment", "Confirm"];

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, totalCents, clearCart, totalItems } = useCart();
  const placeOrder = usePlaceOrder();
  const { data: profile, refetch: refetchProfile } = useMyProfile(user?.id);

  const [step, setStep] = useState(0);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [phoneChecked, setPhoneChecked] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Address
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("NSW");
  const [postcode, setPostcode] = useState("");

  // Payment
  // Only 'cash' payment method remains
  const paymentMethod = "cash";

  // Phone check on mount
  useEffect(() => {
    if (profile && !phoneChecked) {
      if (!profile.phone || profile.phone.trim() === "") {
        setShowPhonePrompt(true);
      } else {
        setPhoneChecked(true);
      }
    }
  }, [profile, phoneChecked]);

  if (!user) {
    navigate("/login");
    return null;
  }

  if (totalItems === 0 && !ordered) {
    navigate("/shop");
    return null;
  }

  const addressValid = street.trim().length > 3 && city.trim().length > 1 && postcode.trim().length === 4;

  const handlePlaceOrder = async () => {
    try {
      const order = await placeOrder.mutateAsync({
        user_id: user.id,
        total_cents: totalCents,
        items: items.map(i => ({
          product_id: i.product.id,
          quantity: i.quantity,
          price_cents: i.product.price_cents,
        })),
        shipping_street: street.trim(),
        shipping_city: city.trim(),
        shipping_state: state,
        shipping_postcode: postcode.trim(),
        payment_method: "cash",
      });
      clearCart();
      setOrderNumber(order.order_number);
      setOrdered(true);
      toast.success(`Order placed! #${order.order_number}`);
    } catch {
      toast.error("Failed to place order");
    }
  };

  if (ordered) {
    return (
      <div className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--p)/0.1),transparent_70%)] opacity-50 z-0" />
        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card bg-base-100/90 backdrop-blur-xl shadow-2xl border border-primary/20 text-center py-16 px-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
            </div>
            <h2 className="font-heading text-4xl text-base-content mb-4 font-bold">Order Placed!</h2>
            <p className="text-base-content/70 text-lg mb-2">Your order <span className="font-bold text-primary">{orderNumber}</span> has been received.</p>
            <p className="text-base-content/60 text-sm mb-10">Payment: Pay at Salon</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate("/dashboard")} className="btn btn-outline btn-primary rounded-full px-8 hover:-translate-y-1 transition-transform">View Orders</Button>
              <Button onClick={() => navigate("/shop")} className="btn btn-primary rounded-full px-8 shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all">Continue Shopping</Button>
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
            navigate("/shop");
            toast.error("Mobile number is required to checkout");
          }}
        />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-10">
            <Button variant="ghost" size="icon" onClick={() => navigate("/shop")} className="h-10 w-10 rounded-full bg-base-200/50 hover:bg-base-200 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-primary tracking-[0.2em] text-xs uppercase font-bold mb-1">Secure</p>
              <h1 className="font-heading text-4xl text-base-content font-bold">Checkout</h1>
            </div>
          </div>

          {/* Steps indicator */}
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
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="card bg-base-100/80 backdrop-blur-xl shadow-xl border border-primary/10 p-6 sm:p-10 max-w-3xl mx-auto">
              {/* Step 0: Address */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="bg-base-200/50 border border-base-300 rounded-2xl p-6 sm:p-8">
                    <h3 className="font-heading text-2xl text-base-content mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div> Shipping Address
                    </h3>
                    <div className="space-y-5 form-control">
                      <div>
                        <Label htmlFor="street" className="label text-sm text-base-content/70 font-medium">Street Address</Label>
                        <Input id="street" placeholder="123 Main Street, Unit 4" value={street} onChange={e => setStreet(e.target.value)} className="input input-bordered input-primary w-full bg-base-100/50" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="city" className="label text-sm text-base-content/70 font-medium">City / Suburb</Label>
                          <Input id="city" placeholder="Sydney" value={city} onChange={e => setCity(e.target.value)} className="input input-bordered input-primary w-full bg-base-100/50" />
                        </div>
                        <div>
                          <Label htmlFor="state" className="label text-sm text-base-content/70 font-medium">State</Label>
                          <select
                            id="state"
                            value={state}
                            onChange={e => setState(e.target.value)}
                            className="select select-bordered select-primary w-full bg-base-100/50"
                          >
                            {AU_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="w-full sm:w-1/2">
                        <Label htmlFor="postcode" className="label text-sm text-base-content/70 font-medium">Postcode</Label>
                        <Input id="postcode" placeholder="2000" maxLength={4} value={postcode} onChange={e => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))} className="input input-bordered input-primary w-full bg-base-100/50" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button disabled={!addressValid} onClick={() => setStep(1)} className="btn btn-primary rounded-full px-8 shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all">
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 1: Payment Method */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="bg-base-200/50 border border-base-300 rounded-2xl p-6 sm:p-8">
                    <h3 className="font-heading text-2xl text-base-content mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><CreditCard className="w-5 h-5 text-primary" /></div> Payment Method
                    </h3>
                    <div className="space-y-4">
                      <div className="w-full flex items-center gap-5 p-5 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer relative overflow-hidden group hover:border-primary/80 transition-colors">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center z-10 text-primary">
                          <Banknote className="w-6 h-6" />
                        </div>
                        <div className="text-left z-10 flex-1">
                          <p className="font-bold text-base-content text-lg">Pay at Salon</p>
                          <p className="text-sm text-base-content/60 mt-1">Payment will be made in person at the salon counter.</p>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center z-10 bg-primary"><CheckCircle2 className="w-4 h-4 text-primary-content" /></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(0)} className="btn btn-ghost rounded-full px-8">Back</Button>
                    <Button onClick={() => setStep(2)} className="btn btn-primary rounded-full px-8 shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all">Review Order</Button>
                  </div>
                </div>
              )}

              {/* Step 2: Review & Confirm */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-base-200/50 border border-base-300 rounded-2xl p-6 sm:p-8 space-y-6">
                    <h3 className="font-heading text-2xl text-base-content flex items-center gap-3 border-b border-base-300 pb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-primary" /></div> Order Summary
                    </h3>
                    <div className="space-y-3">
                      {items.map(item => (
                        <div key={item.product.id} className="flex justify-between text-base items-center p-3 hover:bg-base-100 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-base-300 rounded-md overflow-hidden flex-shrink-0">
                                {item.product.image_url ? <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-primary/10 flex items-center justify-center"><Banknote className="w-4 h-4 text-primary/40" /></div>}
                            </div>
                            <span className="text-base-content font-medium">{item.product.name} <span className="text-base-content/50 text-sm ml-1">× {item.quantity}</span></span>
                          </div>
                          <span className="text-base-content font-semibold">${((item.product.price_cents * item.quantity) / 100).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-base-300 pt-4 pb-2 flex justify-between items-center bg-base-100 px-4 rounded-xl shadow-sm">
                      <span className="font-bold text-base-content text-lg">Total Amount</span>
                      <span className="font-bold text-primary text-2xl">${(totalCents / 100).toFixed(2)} <span className="text-sm text-base-content/50 font-normal">AUD</span></span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-base-300">
                      <div className="bg-base-100 p-4 rounded-xl border border-base-200">
                        <p className="text-xs uppercase tracking-wider text-base-content/50 font-bold mb-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> Shipping to</p>
                        <p className="text-base text-base-content font-medium leading-relaxed">{street}<br/>{city}, {state} {postcode}</p>
                      </div>

                      <div className="bg-base-100 p-4 rounded-xl border border-base-200">
                        <p className="text-xs uppercase tracking-wider text-base-content/50 font-bold mb-2 flex items-center gap-1"><CreditCard className="w-3 h-3" /> Payment Method</p>
                        <p className="text-base text-base-content font-medium flex items-center gap-2">
                          <Banknote className="w-5 h-5 text-primary" /> Pay at Salon
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)} className="btn btn-ghost rounded-full px-8">Back</Button>
                    <Button onClick={handlePlaceOrder} disabled={placeOrder.isPending} className="btn btn-primary rounded-full px-8 shadow-md hover:shadow-lg border-none hover:-translate-y-1 transition-all text-lg h-12">
                      {placeOrder.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      Place Order
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;

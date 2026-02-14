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
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");

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
        payment_method: paymentMethod,
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
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-3xl text-foreground mb-2">Order Placed!</h2>
            <p className="text-muted-foreground mb-2">Your order <span className="font-bold text-primary">{orderNumber}</span> has been received.</p>
            <p className="text-muted-foreground text-sm mb-8">
              {paymentMethod === "cod" ? "You chose Cash on Delivery. Pay when your order arrives." : "Payment will be processed via Stripe."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/dashboard")} className="border-primary/30">View Orders</Button>
              <Button onClick={() => navigate("/shop")} className="gold-gradient text-background font-semibold">Continue Shopping</Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-2xl">
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
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate("/shop")} className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="font-heading text-3xl text-foreground">Checkout</h1>
          </div>

          {/* Steps indicator */}
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
              {/* Step 0: Address */}
              {step === 0 && (
                <div className="space-y-5">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-heading text-xl text-foreground mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" /> Shipping Address
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input id="street" placeholder="123 Main Street, Unit 4" value={street} onChange={e => setStreet(e.target.value)} className="mt-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City / Suburb</Label>
                          <Input id="city" placeholder="Sydney" value={city} onChange={e => setCity(e.target.value)} className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <select
                            id="state"
                            value={state}
                            onChange={e => setState(e.target.value)}
                            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {AU_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="w-1/2">
                        <Label htmlFor="postcode">Postcode</Label>
                        <Input id="postcode" placeholder="2000" maxLength={4} value={postcode} onChange={e => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))} className="mt-1" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button disabled={!addressValid} onClick={() => setStep(1)} className="gold-gradient text-background font-semibold">
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 1: Payment Method */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-heading text-xl text-foreground mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => setPaymentMethod("cod")}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                      >
                        <Banknote className="w-6 h-6 text-primary" />
                        <div className="text-left">
                          <p className="font-medium text-foreground">Cash on Delivery</p>
                          <p className="text-xs text-muted-foreground">Pay with cash when your order arrives</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setPaymentMethod("stripe")}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${paymentMethod === "stripe" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                      >
                        <CreditCard className="w-6 h-6 text-primary" />
                        <div className="text-left">
                          <p className="font-medium text-foreground">Pay with Card (Stripe)</p>
                          <p className="text-xs text-muted-foreground">Secure payment via Stripe (AUD)</p>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(0)} className="border-primary/30">Back</Button>
                    <Button onClick={() => setStep(2)} className="gold-gradient text-background font-semibold">Review Order</Button>
                  </div>
                </div>
              )}

              {/* Step 2: Review & Confirm */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                    <h3 className="font-heading text-xl text-foreground mb-2">Order Summary</h3>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="text-foreground">{item.product.name} × {item.quantity}</span>
                          <span className="text-muted-foreground">${((item.product.price_cents * item.quantity) / 100).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-primary text-xl">${(totalCents / 100).toFixed(2)} AUD</span>
                    </div>

                    <div className="border-t border-border pt-3 space-y-1">
                      <p className="text-xs text-muted-foreground">Shipping to:</p>
                      <p className="text-sm text-foreground">{street}, {city}, {state} {postcode}</p>
                    </div>

                    <div className="border-t border-border pt-3">
                      <p className="text-xs text-muted-foreground">Payment:</p>
                      <p className="text-sm text-foreground flex items-center gap-1">
                        {paymentMethod === "cod" ? <><Banknote className="w-4 h-4 text-primary" /> Cash on Delivery</> : <><CreditCard className="w-4 h-4 text-primary" /> Stripe (Card)</>}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)} className="border-primary/30">Back</Button>
                    <Button onClick={handlePlaceOrder} disabled={placeOrder.isPending} className="gold-gradient text-background font-semibold">
                      {placeOrder.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
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

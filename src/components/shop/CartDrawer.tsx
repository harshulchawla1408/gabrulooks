import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, updateQuantity, removeItem, totalItems, totalCents } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/login");
      setOpen(false);
      return;
    }
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 relative">
          <ShoppingBag className="w-4 h-4 mr-1" /> Cart
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full gold-gradient text-background text-[10px] font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-background border-border">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Your Cart</SheetTitle>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                  <div className="w-14 h-14 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{item.product.name}</p>
                    <p className="text-primary font-bold text-sm">${(item.product.price_cents / 100).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, Math.min(item.quantity + 1, item.product.stock))} disabled={item.quantity >= item.product.stock}>
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeItem(item.product.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Total</span>
                <span className="text-primary font-heading text-2xl font-bold">${(totalCents / 100).toFixed(2)}</span>
              </div>
              <Button className="w-full gold-gradient text-background font-semibold" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;

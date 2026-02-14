import { useState } from "react";
import { useAllOrders, useOrderItems, useUpdateOrderStatus, ORDER_STATUSES, statusColor } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { useAddLoyaltyPoints, calcPointsFromPrice } from "@/hooks/useLoyaltyPoints";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const ManageOrders = () => {
  const { data: orders, isLoading } = useAllOrders();
  const updateStatus = useUpdateOrderStatus();
  const addPoints = useAddLoyaltyPoints();
  const { data: products } = useProducts();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusChange = async (order: NonNullable<typeof orders>[0], newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: order.id, status: newStatus });
      // Award loyalty points when delivered
      if (newStatus === "delivered") {
        const points = calcPointsFromPrice(order.total_cents);
        await addPoints.mutateAsync({
          user_id: order.user_id,
          points,
          description: `Order ${order.order_number} delivered`,
        });
        toast.success(`Order delivered! ${points} loyalty points awarded.`);
      } else {
        toast.success(`Order updated to ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update order");
    }
  };

  if (isLoading) return <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-3">
      <h2 className="font-heading text-xl text-foreground mb-4">All Orders ({orders?.length ?? 0})</h2>
      {!orders?.length ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>No orders yet</p>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="rounded-xl border border-border bg-card">
            <button
              className="w-full flex items-center justify-between p-4 text-left"
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
            >
              <div>
                <p className="font-heading text-sm text-foreground">{order.order_number}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary font-bold text-sm">${(order.total_cents / 100).toFixed(2)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(order.status)}`}>{order.status}</span>
                {expandedId === order.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>
            {expandedId === order.id && (
              <div className="px-4 pb-4 border-t border-border pt-3">
                <OrderItemsList orderId={order.id} products={products} />
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-xs text-muted-foreground">Update status:</span>
                  <Select value={order.status} onValueChange={(v) => handleStatusChange(order, v)}>
                    <SelectTrigger className="w-40 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map(s => (
                        <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const OrderItemsList = ({ orderId, products }: { orderId: string; products?: { id: string; name: string }[] }) => {
  const { data: items, isLoading } = useOrderItems(orderId);
  if (isLoading) return <p className="text-xs text-muted-foreground">Loading items…</p>;
  return (
    <div className="space-y-1">
      {items?.map(item => {
        const product = products?.find(p => p.id === item.product_id);
        return (
          <div key={item.id} className="flex justify-between text-xs">
            <span className="text-foreground">{product?.name ?? "Unknown"} × {item.quantity}</span>
            <span className="text-muted-foreground">${((item.price_cents * item.quantity) / 100).toFixed(2)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ManageOrders;

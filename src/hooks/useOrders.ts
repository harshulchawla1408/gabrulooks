import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  total_cents: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_cents: number;
  created_at: string;
}

export const useMyOrders = (userId?: string) =>
  useQuery({
    queryKey: ["orders", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
  });

export const useAllOrders = () =>
  useQuery({
    queryKey: ["orders", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
  });

export const useOrderItems = (orderId?: string) =>
  useQuery({
    queryKey: ["order_items", orderId],
    enabled: !!orderId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId!);
      if (error) throw error;
      return data as OrderItem[];
    },
  });

export const usePlaceOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      user_id: string;
      total_cents: number;
      items: { product_id: string; quantity: number; price_cents: number }[];
      shipping_street?: string;
      shipping_city?: string;
      shipping_state?: string;
      shipping_postcode?: string;
      payment_method?: string;
    }) => {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: params.user_id,
          total_cents: params.total_cents,
          shipping_street: params.shipping_street,
          shipping_city: params.shipping_city,
          shipping_state: params.shipping_state,
          shipping_postcode: params.shipping_postcode,
          payment_method: params.payment_method ?? "cod",
        } as any)
        .select()
        .single();
      if (orderErr) throw orderErr;

      const orderItems = params.items.map(i => ({ ...i, order_id: order.id }));
      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      return order as Order;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
};

export const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

export const statusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-yellow-500/10 text-yellow-600";
    case "confirmed": return "bg-blue-500/10 text-blue-600";
    case "processing": return "bg-purple-500/10 text-purple-600";
    case "shipped": return "bg-indigo-500/10 text-indigo-600";
    case "delivered": return "bg-green-500/10 text-green-600";
    case "cancelled": return "bg-destructive/10 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
};

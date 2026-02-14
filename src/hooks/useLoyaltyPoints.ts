import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LoyaltyPoint {
  id: string;
  user_id: string;
  points: number;
  description: string;
  booking_id: string | null;
  created_at: string;
}

export const POINTS_PER_DOLLAR = 1; // 1 point per $1 spent
export const POINTS_VALUE_CENTS = 10; // Each point = $0.10 discount

export const useLoyaltyPoints = (userId?: string) => {
  return useQuery({
    queryKey: ["loyalty_points", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loyalty_points")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as LoyaltyPoint[];
    },
  });
};

export const useLoyaltyBalance = (userId?: string) => {
  const { data: points, ...rest } = useLoyaltyPoints(userId);
  const balance = points?.reduce((sum, p) => sum + p.points, 0) ?? 0;
  const thisMonth = points
    ?.filter(p => {
      const d = new Date(p.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, p) => sum + p.points, 0) ?? 0;
  const totalEarned = points?.filter(p => p.points > 0).reduce((sum, p) => sum + p.points, 0) ?? 0;
  const totalUsed = Math.abs(points?.filter(p => p.points < 0).reduce((sum, p) => sum + p.points, 0) ?? 0);
  return { balance, thisMonth, totalEarned, totalUsed, points, ...rest };
};

export const useAddLoyaltyPoints = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { user_id: string; points: number; description: string; booking_id?: string }) => {
      const { error } = await supabase.from("loyalty_points").insert(row);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["loyalty_points"] }),
  });
};

export const calcPointsFromPrice = (priceInCents: number): number => {
  return Math.floor(priceInCents / 100) * POINTS_PER_DOLLAR;
};

export const calcDiscountFromPoints = (points: number): number => {
  return points * POINTS_VALUE_CENTS; // in cents
};

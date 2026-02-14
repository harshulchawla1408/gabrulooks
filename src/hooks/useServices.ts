import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DbService } from "@/types/booking";

export const useServices = (activeOnly = true) => {
  return useQuery({
    queryKey: ["services", activeOnly],
    queryFn: async () => {
      let query = supabase.from("services").select("*").order("category").order("name");
      if (activeOnly) query = query.eq("is_active", true);
      const { data, error } = await query;
      if (error) throw error;
      return data as DbService[];
    },
  });
};

export const useUpdateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbService> & { id: string }) => {
      const { error } = await supabase.from("services").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
};

export const useCreateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (service: Omit<DbService, "id" | "created_at">) => {
      const { error } = await supabase.from("services").insert(service);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
};

export const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`;

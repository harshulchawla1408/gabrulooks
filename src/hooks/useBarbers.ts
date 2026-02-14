import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DbBarber, DbBarberService, DbBarberAvailability } from "@/types/booking";

export const useBarbers = (activeOnly = true) => {
  return useQuery({
    queryKey: ["barbers", activeOnly],
    queryFn: async () => {
      let query = supabase.from("barbers").select("*").order("display_name");
      if (activeOnly) query = query.eq("is_active", true);
      const { data, error } = await query;
      if (error) throw error;
      return data as DbBarber[];
    },
  });
};

export const useCreateBarber = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (barber: { user_id: string; display_name: string; specialty?: string }) => {
      const { error } = await supabase.from("barbers").insert(barber);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barbers"] }),
  });
};

export const useUpdateBarber = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbBarber> & { id: string }) => {
      const { error } = await supabase.from("barbers").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barbers"] }),
  });
};

export const useBarberServices = (barberId?: string) => {
  return useQuery({
    queryKey: ["barber_services", barberId],
    enabled: !!barberId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("barber_services")
        .select("*")
        .eq("barber_id", barberId!);
      if (error) throw error;
      return data as DbBarberService[];
    },
  });
};

export const useBarbersForService = (serviceId?: string) => {
  return useQuery({
    queryKey: ["barbers_for_service", serviceId],
    enabled: !!serviceId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("barber_services")
        .select("barber_id")
        .eq("service_id", serviceId!);
      if (error) throw error;
      
      if (!data.length) return [] as DbBarber[];
      
      const barberIds = data.map(bs => bs.barber_id);
      const { data: barbers, error: bErr } = await supabase
        .from("barbers")
        .select("*")
        .in("id", barberIds)
        .eq("is_active", true);
      if (bErr) throw bErr;
      return barbers as DbBarber[];
    },
  });
};

export const useAssignBarberServices = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ barberId, serviceIds }: { barberId: string; serviceIds: string[] }) => {
      // Delete existing
      await supabase.from("barber_services").delete().eq("barber_id", barberId);
      // Insert new
      if (serviceIds.length) {
        const rows = serviceIds.map(sid => ({ barber_id: barberId, service_id: sid }));
        const { error } = await supabase.from("barber_services").insert(rows);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barber_services"] }),
  });
};

export const useBarberAvailability = (barberId?: string) => {
  return useQuery({
    queryKey: ["barber_availability", barberId],
    enabled: !!barberId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("barber_availability")
        .select("*")
        .eq("barber_id", barberId!)
        .order("day_of_week");
      if (error) throw error;
      return data as DbBarberAvailability[];
    },
  });
};

export const useUpsertAvailability = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Omit<DbBarberAvailability, "id" | "created_at">) => {
      const { error } = await supabase
        .from("barber_availability")
        .upsert(row, { onConflict: "barber_id,day_of_week" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barber_availability"] }),
  });
};

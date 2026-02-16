import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DbBooking, AvailableSlot } from "@/types/booking";

export const useAvailableSlots = (barberId?: string, date?: string) => {
  return useQuery({
    queryKey: ["available_slots", barberId, date],
    enabled: !!barberId && !!date,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_available_slots", {
        _barber_id: barberId!,
        _date: date!,
      });
      if (error) throw error;
      return (data ?? []) as AvailableSlot[];
    },
  });
};

export const useCreateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (booking: {
      customer_id: string;
      barber_id: string;
      service_id: string;
      booking_date: string;
      start_time: string;
      end_time: string;
      created_by: string;
      notes?: string;
      payment_method?: "cash";
    }) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert({ ...booking, payment_method: "cash" })
        .select()
        .single();
      if (error) throw error;
      return data as DbBooking;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["available_slots"] });
    },
  });
};

export const useMyBookings = (userId?: string) => {
  return useQuery({
    queryKey: ["bookings", "my", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", userId!)
        .order("booking_date", { ascending: false })
        .order("start_time", { ascending: false });
      if (error) throw error;
      return data as DbBooking[];
    },
  });
};

export const useBarberBookings = (barberId?: string) => {
  return useQuery({
    queryKey: ["bookings", "barber", barberId],
    enabled: !!barberId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("barber_id", barberId!)
        .order("booking_date", { ascending: true })
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data as DbBooking[];
    },
  });
};

export const useAllBookings = (dateFilter?: string) => {
  return useQuery({
    queryKey: ["bookings", "all", dateFilter],
    queryFn: async () => {
      let query = supabase
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: false })
        .order("start_time", { ascending: true });
      
      if (dateFilter) {
        query = query.eq("booking_date", dateFilter);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as DbBooking[];
    },
  });
};

export const useUpdateBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbBooking> & { id: string }) => {
      const { error } = await supabase.from("bookings").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({ queryKey: ["available_slots"] });
    },
  });
};

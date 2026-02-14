import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export const useAllProfiles = () => {
  return useQuery({
    queryKey: ["profiles", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("full_name");
      if (error) throw error;
      return data as DbProfile[];
    },
  });
};

export const useAllUserRoles = () => {
  return useQuery({
    queryKey: ["user_roles", "all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data as { id: string; user_id: string; role: string; created_at: string }[];
    },
  });
};

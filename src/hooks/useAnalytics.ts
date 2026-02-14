import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DbBooking, DbService, DbBarber } from "@/types/booking";

export interface MonthlyRevenue {
  month: string; // "2026-01"
  label: string; // "Jan 2026"
  total: number; // cents
}

export interface BarberRevenue {
  barberId: string;
  barberName: string;
  total: number;
}

export interface ServiceRevenue {
  serviceId: string;
  serviceName: string;
  category: string;
  total: number;
}

export interface DailyRevenue {
  date: string;
  label: string;
  total: number;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthLabel(ym: string) {
  const [y, m] = ym.split("-");
  return `${MONTH_NAMES[parseInt(m) - 1]} ${y}`;
}

export const useAnalyticsBookings = (filters?: {
  month?: string; // "2026-02"
  barberId?: string;
  serviceId?: string;
}) => {
  return useQuery({
    queryKey: ["analytics", "bookings", filters],
    queryFn: async () => {
      let query = supabase
        .from("bookings")
        .select("*")
        .eq("status", "completed")
        .order("booking_date", { ascending: true });

      if (filters?.month) {
        const [y, m] = filters.month.split("-");
        const start = `${y}-${m}-01`;
        const lastDay = new Date(parseInt(y), parseInt(m), 0).getDate();
        const end = `${y}-${m}-${String(lastDay).padStart(2, "0")}`;
        query = query.gte("booking_date", start).lte("booking_date", end);
      }

      if (filters?.barberId) {
        query = query.eq("barber_id", filters.barberId);
      }

      if (filters?.serviceId) {
        query = query.eq("service_id", filters.serviceId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DbBooking[];
    },
  });
};

export function computeMonthlyRevenue(
  bookings: DbBooking[],
  services: DbService[]
): MonthlyRevenue[] {
  const serviceMap = new Map(services.map(s => [s.id, s]));
  const monthMap = new Map<string, number>();

  for (const b of bookings) {
    const ym = b.booking_date.slice(0, 7);
    const service = serviceMap.get(b.service_id);
    const price = service
      ? b.payment_method === "cash" ? service.cash_price : service.card_price
      : 0;
    monthMap.set(ym, (monthMap.get(ym) ?? 0) + price);
  }

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, label: getMonthLabel(month), total }));
}

export function computeBarberRevenue(
  bookings: DbBooking[],
  services: DbService[],
  barbers: DbBarber[]
): BarberRevenue[] {
  const serviceMap = new Map(services.map(s => [s.id, s]));
  const barberMap = new Map(barbers.map(b => [b.id, b]));
  const revenueMap = new Map<string, number>();

  for (const b of bookings) {
    const service = serviceMap.get(b.service_id);
    const price = service
      ? b.payment_method === "cash" ? service.cash_price : service.card_price
      : 0;
    revenueMap.set(b.barber_id, (revenueMap.get(b.barber_id) ?? 0) + price);
  }

  return Array.from(revenueMap.entries())
    .map(([barberId, total]) => ({
      barberId,
      barberName: barberMap.get(barberId)?.display_name ?? "Unknown",
      total,
    }))
    .sort((a, b) => b.total - a.total);
}

export function computeServiceRevenue(
  bookings: DbBooking[],
  services: DbService[]
): ServiceRevenue[] {
  const serviceMap = new Map(services.map(s => [s.id, s]));
  const revenueMap = new Map<string, number>();

  for (const b of bookings) {
    const service = serviceMap.get(b.service_id);
    const price = service
      ? b.payment_method === "cash" ? service.cash_price : service.card_price
      : 0;
    revenueMap.set(b.service_id, (revenueMap.get(b.service_id) ?? 0) + price);
  }

  return Array.from(revenueMap.entries())
    .map(([serviceId, total]) => ({
      serviceId,
      serviceName: serviceMap.get(serviceId)?.name ?? "Unknown",
      category: serviceMap.get(serviceId)?.category ?? "Other",
      total,
    }))
    .sort((a, b) => b.total - a.total);
}

export function computeCategoryRevenue(serviceRevenues: ServiceRevenue[]) {
  const catMap = new Map<string, number>();
  for (const sr of serviceRevenues) {
    catMap.set(sr.category, (catMap.get(sr.category) ?? 0) + sr.total);
  }
  return Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));
}

export function computeDailyRevenue(
  bookings: DbBooking[],
  services: DbService[]
): DailyRevenue[] {
  const serviceMap = new Map(services.map(s => [s.id, s]));
  const dayMap = new Map<string, number>();

  for (const b of bookings) {
    const service = serviceMap.get(b.service_id);
    const price = service
      ? b.payment_method === "cash" ? service.cash_price : service.card_price
      : 0;
    dayMap.set(b.booking_date, (dayMap.get(b.booking_date) ?? 0) + price);
  }

  return Array.from(dayMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({
      date,
      label: new Date(date + "T00:00:00").getDate().toString(),
      total,
    }));
}

export function formatRevenue(cents: number) {
  return `$${(cents / 100).toLocaleString("en-AU", { minimumFractionDigits: 0 })}`;
}

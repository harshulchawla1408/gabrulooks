export interface DbService {
  id: string;
  name: string;
  category: "men" | "women";
  cash_price: number;
  card_price: number;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface DbBarber {
  id: string;
  user_id: string;
  display_name: string;
  specialty: string | null;
  bio: string | null;
  experience: string | null;
  photo_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DbBarberService {
  id: string;
  barber_id: string;
  service_id: string;
  created_at: string;
}

export interface DbBarberAvailability {
  id: string;
  barber_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

export interface DbBooking {
  id: string;
  customer_id: string;
  barber_id: string;
  service_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: "confirmed" | "completed" | "cancelled" | "no_show";
  payment_status: "pending" | "paid" | "refunded";
  payment_method: "cash";
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AvailableSlot {
  slot_start: string;
  slot_end: string;
}

export interface BookingWithDetails extends DbBooking {
  service?: DbService;
  barber?: DbBarber;
  customer_profile?: {
    full_name: string;
    email: string | null;
    phone: string | null;
  };
}

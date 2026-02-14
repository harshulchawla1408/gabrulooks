
-- =============================================
-- PHASE 2B: BOOKING SYSTEM SCHEMA
-- =============================================

-- 1. Services table (replaces static salonData)
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('men', 'women')),
  cash_price INTEGER NOT NULL, -- in cents
  card_price INTEGER NOT NULL, -- in cents
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Everyone can view active services
CREATE POLICY "Anyone can view services"
  ON public.services FOR SELECT
  USING (true);

-- Admins can manage services
CREATE POLICY "Admins can insert services"
  ON public.services FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services"
  ON public.services FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services"
  ON public.services FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. Barbers table
CREATE TABLE public.barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  specialty TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;

-- Everyone can view active barbers
CREATE POLICY "Anyone can view barbers"
  ON public.barbers FOR SELECT
  USING (true);

-- Admins can manage barbers
CREATE POLICY "Admins can insert barbers"
  ON public.barbers FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update barbers"
  ON public.barbers FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete barbers"
  ON public.barbers FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Barbers can update own record
CREATE POLICY "Barbers can update own record"
  ON public.barbers FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. Barber-Service assignments
CREATE TABLE public.barber_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES public.barbers(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(barber_id, service_id)
);

ALTER TABLE public.barber_services ENABLE ROW LEVEL SECURITY;

-- Everyone can view barber-service assignments
CREATE POLICY "Anyone can view barber_services"
  ON public.barber_services FOR SELECT
  USING (true);

-- Admins can manage
CREATE POLICY "Admins can insert barber_services"
  ON public.barber_services FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete barber_services"
  ON public.barber_services FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Barber availability (weekly schedule)
CREATE TABLE public.barber_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES public.barbers(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(barber_id, day_of_week)
);

ALTER TABLE public.barber_availability ENABLE ROW LEVEL SECURITY;

-- Everyone can view availability (needed for booking)
CREATE POLICY "Anyone can view availability"
  ON public.barber_availability FOR SELECT
  USING (true);

-- Barbers can manage own availability
CREATE POLICY "Barbers can insert own availability"
  ON public.barber_availability FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.barbers WHERE id = barber_id AND user_id = auth.uid())
  );

CREATE POLICY "Barbers can update own availability"
  ON public.barber_availability FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.barbers WHERE id = barber_id AND user_id = auth.uid())
  );

-- Admins can manage all availability
CREATE POLICY "Admins can insert availability"
  ON public.barber_availability FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update availability"
  ON public.barber_availability FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete availability"
  ON public.barber_availability FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Bookings table (1-hour slots)
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  barber_id UUID REFERENCES public.barbers(id) NOT NULL,
  service_id UUID REFERENCES public.services(id) NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'online')),
  notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Customers can view own bookings
CREATE POLICY "Customers can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = customer_id);

-- Customers can insert own bookings
CREATE POLICY "Customers can insert own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id AND auth.uid() = created_by);

-- Customers can cancel own bookings (update status only)
CREATE POLICY "Customers can update own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = customer_id);

-- Barbers can view their assigned bookings
CREATE POLICY "Barbers can view assigned bookings"
  ON public.bookings FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.barbers WHERE id = barber_id AND user_id = auth.uid())
  );

-- Barbers can update their assigned bookings (mark complete etc)
CREATE POLICY "Barbers can update assigned bookings"
  ON public.bookings FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.barbers WHERE id = barber_id AND user_id = auth.uid())
  );

-- Receptionists can view all bookings
CREATE POLICY "Receptionists can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.has_role(auth.uid(), 'receptionist'));

-- Receptionists can create bookings for walk-ins
CREATE POLICY "Receptionists can insert bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'receptionist'));

-- Receptionists can update bookings
CREATE POLICY "Receptionists can update bookings"
  ON public.bookings FOR UPDATE
  USING (public.has_role(auth.uid(), 'receptionist'));

-- Admins can do everything with bookings
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bookings"
  ON public.bookings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bookings"
  ON public.bookings FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Seed services data from existing salonData
INSERT INTO public.services (name, category, cash_price, card_price, duration_minutes) VALUES
  -- Men's Services
  ('Haircut', 'men', 3000, 3500, 60),
  ('Zero/Skin Fade', 'men', 3500, 4000, 60),
  ('Haircut + Beard', 'men', 5000, 6000, 60),
  ('Beard Trim', 'men', 2500, 3000, 60),
  ('Beard Shape Up', 'men', 2000, 2500, 60),
  ('Hair Color (Men)', 'men', 4000, 4500, 60),
  ('Hair + Beard Color', 'men', 6000, 7000, 60),
  ('Head Shave', 'men', 2000, 2500, 60),
  ('Kids Haircut (Under 12)', 'men', 2500, 3000, 60),
  ('Eyebrow Threading (Men)', 'men', 1000, 1200, 60),
  ('Hair Wash + Style', 'men', 2000, 2500, 60),
  ('Hair Straightening (Men)', 'men', 8000, 9000, 60),
  -- Women's Services
  ('Eyebrow Threading', 'women', 1000, 1200, 60),
  ('Full Face Threading', 'women', 3500, 4000, 60),
  ('Upper Lip Threading', 'women', 800, 1000, 60),
  ('Eyebrow Tinting', 'women', 2000, 2500, 60),
  ('Eyelash Tinting', 'women', 2500, 3000, 60),
  ('Brow Tint + Threading', 'women', 2500, 3000, 60),
  ('Women''s Haircut', 'women', 5000, 6000, 60),
  ('Women''s Hair Color', 'women', 8000, 9000, 60),
  ('Highlights (Half Head)', 'women', 18000, 20000, 60),
  ('Highlights (Full Head)', 'women', 25000, 28000, 60),
  ('Balayage', 'women', 20000, 23000, 60),
  ('Keratin Treatment', 'women', 22000, 25000, 60),
  ('Nanoplastia', 'women', 30000, 40000, 60),
  ('Blow Dry & Style', 'women', 4000, 5000, 60);

-- 7. Function to get available slots for a barber on a given date
CREATE OR REPLACE FUNCTION public.get_available_slots(
  _barber_id UUID,
  _date DATE
)
RETURNS TABLE(slot_start TIME, slot_end TIME)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH availability AS (
    SELECT start_time, end_time
    FROM public.barber_availability
    WHERE barber_id = _barber_id
      AND day_of_week = EXTRACT(DOW FROM _date)::INTEGER
      AND is_active = true
  ),
  all_slots AS (
    SELECT 
      gs::TIME AS slot_start,
      (gs + INTERVAL '1 hour')::TIME AS slot_end
    FROM availability a,
    LATERAL generate_series(
      _date + a.start_time,
      _date + a.end_time - INTERVAL '1 hour',
      INTERVAL '1 hour'
    ) AS gs
  ),
  booked AS (
    SELECT start_time, end_time
    FROM public.bookings
    WHERE barber_id = _barber_id
      AND booking_date = _date
      AND status IN ('confirmed')
  )
  SELECT s.slot_start, s.slot_end
  FROM all_slots s
  WHERE NOT EXISTS (
    SELECT 1 FROM booked b
    WHERE s.slot_start < b.end_time AND s.slot_end > b.start_time
  )
  ORDER BY s.slot_start;
$$;

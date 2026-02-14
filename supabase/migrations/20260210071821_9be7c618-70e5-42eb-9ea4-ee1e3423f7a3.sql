
-- Loyalty Points table
CREATE TABLE public.loyalty_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  booking_id UUID REFERENCES public.bookings(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own points" ON public.loyalty_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert points" ON public.loyalty_points FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all points" ON public.loyalty_points FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert points" ON public.loyalty_points FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Index for fast lookups
CREATE INDEX idx_loyalty_points_user ON public.loyalty_points(user_id);

-- Add barber profile fields
ALTER TABLE public.barbers
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS experience TEXT,
  ADD COLUMN IF NOT EXISTS photo_url TEXT;


-- Add shipping address and payment_method columns to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_street TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_city TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_state TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_postcode TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'cod';

-- Add payment_method to bookings (pay_at_salon or stripe)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_amount_cents INTEGER DEFAULT 0;

-- ============================================
-- DriveUAE — Long-Term Car Rental Platform
-- Supabase Database Migration
-- Version: 1.0.0
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE car_status AS ENUM ('available', 'rented', 'maintenance', 'inactive');
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'active', 'completed', 'cancelled', 'rejected');
CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE document_type AS ENUM ('emirates_id', 'passport', 'driving_license', 'other');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'interested', 'documents_pending', 'approved', 'booked', 'lost', 'completed');
CREATE TYPE transmission_type AS ENUM ('automatic', 'manual');
CREATE TYPE fuel_type AS ENUM ('petrol', 'diesel', 'hybrid', 'electric');
CREATE TYPE car_category AS ENUM ('sedan', 'suv', 'hatchback', 'coupe', 'van', 'truck');

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- CARS
-- ============================================
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 2000 AND year <= 2030),
  seats INTEGER NOT NULL CHECK (seats >= 2 AND seats <= 14),
  doors INTEGER NOT NULL DEFAULT 4 CHECK (doors >= 2 AND doors <= 6),
  transmission transmission_type NOT NULL DEFAULT 'automatic',
  fuel_type fuel_type NOT NULL DEFAULT 'petrol',
  color TEXT,
  category car_category NOT NULL DEFAULT 'sedan',
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  daily_price INTEGER NOT NULL CHECK (daily_price > 0),
  weekly_price INTEGER NOT NULL CHECK (weekly_price > 0),
  monthly_price INTEGER NOT NULL CHECK (monthly_price > 0),
  three_month_price INTEGER NOT NULL CHECK (three_month_price > 0),
  six_month_price INTEGER NOT NULL CHECK (six_month_price > 0),
  twelve_month_price INTEGER NOT NULL CHECK (twelve_month_price > 0),
  security_deposit INTEGER NOT NULL DEFAULT 0 CHECK (security_deposit >= 0),
  status car_status NOT NULL DEFAULT 'available',
  location TEXT NOT NULL DEFAULT 'Dubai',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- CAR AVAILABILITY
-- ============================================
CREATE TABLE car_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status car_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_months INTEGER NOT NULL CHECK (duration_months IN (1, 3, 6, 12)),
  monthly_rent INTEGER NOT NULL CHECK (monthly_rent > 0),
  total_amount INTEGER NOT NULL CHECK (total_amount > 0),
  status booking_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_booking_dates CHECK (end_date > start_date)
);

-- ============================================
-- BOOKING STATUS HISTORY
-- ============================================
CREATE TABLE booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  old_status booking_status,
  new_status booking_status NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'AED',
  provider TEXT,
  provider_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- DOCUMENTS
-- ============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  document_type document_type NOT NULL,
  storage_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  status document_status NOT NULL DEFAULT 'pending',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  rejection_reason TEXT
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- LEADS
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  duration_months INTEGER,
  start_date DATE,
  source TEXT NOT NULL DEFAULT 'website',
  status lead_status NOT NULL DEFAULT 'new',
  notes TEXT,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_published ON cars(published);
CREATE INDEX idx_cars_featured ON cars(featured);
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_model ON cars(model);
CREATE INDEX idx_cars_monthly_price ON cars(monthly_price);
CREATE INDEX idx_cars_category ON cars(category);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_car_id ON bookings(car_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_start_date ON bookings(start_date);
CREATE INDEX idx_bookings_end_date ON bookings(end_date);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_booking_id ON documents(booking_id);
CREATE INDEX idx_documents_status ON documents(status);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

CREATE INDEX idx_car_availability_car_id ON car_availability(car_id);
CREATE INDEX idx_car_availability_dates ON car_availability(start_date, end_date);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- ============================================
-- CARS POLICIES
-- ============================================
CREATE POLICY "Anyone can view published cars"
  ON cars FOR SELECT
  USING (published = true OR is_admin());

CREATE POLICY "Admins can manage cars"
  ON cars FOR ALL
  USING (is_admin());

-- ============================================
-- BOOKINGS POLICIES
-- ============================================
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all bookings"
  ON bookings FOR ALL
  USING (is_admin());

-- ============================================
-- BOOKING STATUS HISTORY POLICIES
-- ============================================
CREATE POLICY "Users can view own booking history"
  ON booking_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_status_history.booking_id
      AND bookings.user_id = auth.uid()
    )
    OR is_admin()
  );

CREATE POLICY "Admins can manage booking history"
  ON booking_status_history FOR ALL
  USING (is_admin());

-- ============================================
-- PAYMENTS POLICIES
-- ============================================
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  USING (is_admin());

-- ============================================
-- DOCUMENTS POLICIES
-- ============================================
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can upload own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all documents"
  ON documents FOR ALL
  USING (is_admin());

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- ============================================
-- LEADS POLICIES
-- ============================================
CREATE POLICY "Admins can manage leads"
  ON leads FOR ALL
  USING (is_admin());

-- ============================================
-- AUDIT LOGS POLICIES
-- ============================================
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (is_admin());

CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.booking_reference := 'DRV-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('booking_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE SEQUENCE booking_seq START 1;

CREATE TRIGGER set_booking_reference
  BEFORE INSERT ON bookings
  FOR EACH ROW
  WHEN (NEW.booking_reference IS NULL)
  EXECUTE FUNCTION generate_booking_reference();

-- ============================================
-- STORAGE BUCKETS (run in Supabase dashboard or via API)
-- ============================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('customer-documents', 'customer-documents', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', false);

-- Storage policies for customer-documents
-- CREATE POLICY "Users can upload own documents"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'customer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view own documents"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'customer-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Admins can access all documents"
--   ON storage.objects FOR ALL
--   USING (bucket_id = 'customer-documents' AND is_admin());

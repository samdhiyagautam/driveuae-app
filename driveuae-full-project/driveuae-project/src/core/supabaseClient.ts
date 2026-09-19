import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Don't throw at import time (that would white-screen the whole app) —
  // log loudly instead so it's obvious in the console why auth/data calls fail.
  // eslint-disable-next-line no-console
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill these in from your Supabase project (Settings → API).'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Row shapes as they actually exist in the `driveuae` Supabase project today
// (see supabase/migrations/001_initial_schema.sql). Kept separate from the
// camelCase types in data/mockData.ts — mappers.ts converts between the two
// so the rest of the app (built against the mock shapes) doesn't need to change.
export interface ProfileRow {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  role: 'customer' | 'admin';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CarRow {
  id: string;
  title: string;
  description: string | null;
  brand: string;
  model: string;
  year: number;
  seats: number;
  doors: number;
  transmission: 'automatic' | 'manual';
  fuel_type: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  color: string | null;
  category: 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'van' | 'truck';
  images: string[];
  features: string[];
  daily_price: number;
  weekly_price: number;
  monthly_price: number;
  three_month_price: number;
  six_month_price: number;
  twelve_month_price: number;
  security_deposit: number;
  status: 'available' | 'rented' | 'maintenance' | 'inactive';
  location: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingRow {
  id: string;
  booking_reference: string;
  user_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  monthly_rent: number;
  total_amount: number;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled' | 'rejected';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

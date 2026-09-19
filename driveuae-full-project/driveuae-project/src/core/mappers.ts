import { Car, Booking } from '../data/mockData';
import { CarRow, BookingRow } from './supabaseClient';

// The rest of the app (CarCard, Cars, CarDetail, Booking, MyBookings) was
// built against the camelCase `Car` / `Booking` shapes in data/mockData.ts.
// Rather than touch every consumer, we map real Supabase rows into those
// same shapes at the point they're fetched.

export function mapCarRow(row: CarRow): Car {
  return {
    id: row.id,
    title: row.title,
    brand: row.brand,
    model: row.model,
    year: row.year,
    seats: row.seats,
    doors: row.doors,
    transmission: row.transmission,
    fuelType: row.fuel_type,
    color: row.color || '',
    // mockData's Car type only models 4 categories; the DB also allows
    // van/truck. Cast so newly added vans/trucks don't break the type,
    // filters/labels for those two just won't be localized yet.
    category: row.category as Car['category'],
    images: row.images && row.images.length > 0 ? row.images : ['/placeholder-car.jpg'],
    features: row.features || [],
    dailyPrice: row.daily_price,
    weeklyPrice: row.weekly_price,
    monthlyPrice: row.monthly_price,
    threeMonthPrice: row.three_month_price,
    sixMonthPrice: row.six_month_price,
    twelveMonthPrice: row.twelve_month_price,
    securityDeposit: row.security_deposit,
    status: row.status,
    location: row.location,
    featured: row.featured,
    published: row.published,
    description: row.description || '',
  };
}

export function mapBookingRow(row: BookingRow): Booking {
  return {
    id: row.id,
    bookingReference: row.booking_reference,
    userId: row.user_id,
    carId: row.car_id,
    startDate: row.start_date,
    endDate: row.end_date,
    durationMonths: row.duration_months,
    monthlyRent: row.monthly_rent,
    totalAmount: row.total_amount,
    status: row.status,
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

-- ============================================
-- DriveUAE — Seed Data for Development
-- ============================================

-- Insert sample cars
INSERT INTO cars (title, description, brand, model, year, seats, doors, transmission, fuel_type, color, category, images, features, daily_price, weekly_price, monthly_price, three_month_price, six_month_price, twelve_month_price, security_deposit, status, location, featured, published) VALUES
('Toyota Corolla 2024', 'Reliable and fuel-efficient sedan perfect for long-term rental.', 'Toyota', 'Corolla', 2024, 5, 4, 'automatic', 'petrol', 'White', 'sedan',
  ARRAY['https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=600&h=400&fit=crop'],
  ARRAY['Air Conditioning', 'Bluetooth', 'USB', 'Cruise Control', 'Backup Camera', 'Lane Assist'],
  150, 900, 2800, 7800, 14400, 26400, 2000, 'available', 'Dubai', true, true),

('Toyota Camry 2024', 'Premium hybrid sedan with excellent comfort and fuel economy.', 'Toyota', 'Camry', 2024, 5, 4, 'automatic', 'hybrid', 'Silver', 'sedan',
  ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e9fb?w=600&h=400&fit=crop'],
  ARRAY['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Sunroof', 'Premium Sound'],
  200, 1200, 3500, 9800, 18000, 33000, 3000, 'available', 'Dubai', true, true),

('Nissan Sunny 2024', 'Economical choice for budget-conscious renters.', 'Nissan', 'Sunny', 2024, 5, 4, 'automatic', 'petrol', 'White', 'sedan',
  ARRAY['https://images.unsplash.com/photo-1609521263047-f8f205293d24?w=600&h=400&fit=crop'],
  ARRAY['Air Conditioning', 'Bluetooth', 'USB', 'Power Windows', 'Central Locking'],
  120, 720, 2200, 6000, 11000, 20000, 1500, 'available', 'Dubai', false, true),

('Nissan Altima 2024', 'Stylish mid-size sedan combining performance with comfort.', 'Nissan', 'Altima', 2024, 5, 4, 'automatic', 'petrol', 'Black', 'sedan',
  ARRAY['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop'],
  ARRAY['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Backup Camera', 'Apple CarPlay'],
  180, 1080, 3200, 8900, 16500, 30000, 2500, 'available', 'Dubai', true, true),

('Kia K5 2024', 'Bold design and modern technology at a competitive price.', 'Kia', 'K5', 2024, 5, 4, 'automatic', 'petrol', 'Red', 'sedan',
  ARRAY['https://images.unsplash.com/photo-1619976215249-0a76ca1332b3?w=600&h=400&fit=crop'],
  ARRAY['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Sunroof', 'Wireless Charging'],
  170, 1020, 3000, 8400, 15500, 28000, 2500, 'available', 'Dubai', false, true),

('Kia Sportage 2024', 'Stylish SUV with ample space and modern features for families.', 'Kia', 'Sportage', 2024, 5, 4, 'automatic', 'petrol', 'Grey', 'suv',
  ARRAY['https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=600&h=400&fit=crop'],
  ARRAY['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Backup Camera', 'Panoramic Roof'],
  220, 1320, 3800, 10600, 19500, 35000, 3500, 'available', 'Dubai', true, true),

('Hyundai Elantra 2024', 'Modern sedan with great value, offering style and reliability.', 'Hyundai', 'Elantra', 2024, 5, 4, 'automatic', 'petrol', 'Blue', 'sedan',
  ARRAY['https://images.unsplash.com/photo-1614200488550-7028e7664c3e?w=600&h=400&fit=crop'],
  ARRAY['Air Conditioning', 'Bluetooth', 'USB', 'Cruise Control', 'Backup Camera', 'Apple CarPlay'],
  140, 840, 2600, 7200, 13200, 24000, 2000, 'available', 'Dubai', false, true),

('Hyundai Tucson 2024', 'SUV practicality combined with hybrid fuel efficiency.', 'Hyundai', 'Tucson', 2024, 5, 4, 'automatic', 'hybrid', 'White', 'suv',
  ARRAY['https://images.unsplash.com/photo-1633854134519-3ever5077a52?w=600&h=400&fit=crop'],
  ARRAY['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Sunroof', '360 Camera'],
  240, 1440, 4200, 11700, 21500, 39000, 4000, 'rented', 'Dubai', true, true),

('Honda Civic 2024', 'Known for reliability and driving dynamics. Solid long-term choice.', 'Honda', 'Civic', 2024, 5, 4, 'automatic', 'petrol', 'Grey', 'sedan',
  ARRAY['https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&h=400&fit=crop'],
  ARRAY['Air Conditioning', 'Bluetooth', 'Navigation', 'Cruise Control', 'Backup Camera', 'Honda Sensing'],
  160, 960, 2900, 8100, 14900, 27000, 2000, 'available', 'Dubai', false, true),

('Mitsubishi Outlander 2024', 'Spacious 7-seater SUV ideal for larger families.', 'Mitsubishi', 'Outlander', 2024, 7, 4, 'automatic', 'hybrid', 'Black', 'suv',
  ARRAY['https://images.unsplash.com/photo-1609521263047-f8f205293d24?w=600&h=400&fit=crop'],
  ARRAY['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Third Row Seats', 'Power Tailgate'],
  260, 1560, 4500, 12600, 23000, 42000, 4500, 'available', 'Dubai', true, true);

-- Insert sample leads
INSERT INTO leads (customer_name, phone, email, car_id, duration_months, start_date, source, status, notes) VALUES
('Ahmed Al Maktoum', '+971501234567', 'ahmed@example.com', (SELECT id FROM cars WHERE brand = 'Toyota' AND model = 'Camry'), 12, '2024-04-01', 'website', 'new', 'Interested in long-term corporate rental'),
('Sarah Johnson', '+971559876543', 'sarah@example.com', (SELECT id FROM cars WHERE brand = 'Kia' AND model = 'Sportage'), 6, '2024-05-01', 'whatsapp', 'contacted', 'Family moving to Dubai, needs SUV'),
('Raj Patel', '+971523456789', 'raj@example.com', (SELECT id FROM cars WHERE brand = 'Hyundai' AND model = 'Elantra'), 3, '2024-04-15', 'instagram', 'interested', 'Short-term assignment in Dubai'),
('Fatima Hassan', '+971567891234', 'fatima@example.com', (SELECT id FROM cars WHERE brand = 'Mitsubishi' AND model = 'Outlander'), 12, '2024-04-01', 'referral', 'documents_pending', 'Large family, needs 7-seater');

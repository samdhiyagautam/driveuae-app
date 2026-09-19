export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  seats: number;
  doors: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric';
  color: string;
  category: 'sedan' | 'suv' | 'hatchback' | 'coupe';
  images: string[];
  features: string[];
  dailyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  threeMonthPrice: number;
  sixMonthPrice: number;
  twelveMonthPrice: number;
  securityDeposit: number;
  status: 'available' | 'rented' | 'maintenance' | 'inactive';
  location: string;
  featured: boolean;
  published: boolean;
  description: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  userId: string;
  carId: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  monthlyRent: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled' | 'rejected';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  carId: string;
  durationMonths: number;
  startDate: string;
  source: string;
  status: 'new' | 'contacted' | 'interested' | 'documents_pending' | 'approved' | 'booked' | 'lost' | 'completed';
  notes: string;
  createdAt: string;
}

// Generate placeholder car images using gradient backgrounds
const carImages = {
  corolla: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=600&h=400&fit=crop',
  camry: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e9fb?w=600&h=400&fit=crop',
  sunny: 'https://images.unsplash.com/photo-1609521263047-f8f205293d24?w=600&h=400&fit=crop',
  altima: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600&h=400&fit=crop',
  k5: 'https://images.unsplash.com/photo-1619976215249-0a76ca1332b3?w=600&h=400&fit=crop',
  sportage: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=600&h=400&fit=crop',
  elantra: 'https://images.unsplash.com/photo-1614200488550-7028e7664c3e?w=600&h=400&fit=crop',
  tucson: 'https://images.unsplash.com/photo-1633854134519-3ever5077a52?w=600&h=400&fit=crop',
  civic: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&h=400&fit=crop',
  outlander: 'https://images.unsplash.com/photo-1609521263047-f8f205293d24?w=600&h=400&fit=crop',
};

export const cars: Car[] = [
  {
    id: '1',
    title: 'Toyota Corolla 2024',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2024,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'White',
    category: 'sedan',
    images: [carImages.corolla],
    features: ['Air Conditioning', 'Bluetooth', 'USB', 'Cruise Control', 'Backup Camera', 'Lane Assist'],
    dailyPrice: 150,
    weeklyPrice: 900,
    monthlyPrice: 2800,
    threeMonthPrice: 7800,
    sixMonthPrice: 14400,
    twelveMonthPrice: 26400,
    securityDeposit: 2000,
    status: 'available',
    location: 'Dubai',
    featured: true,
    published: true,
    description: 'The Toyota Corolla is one of the most reliable and fuel-efficient sedans. Perfect for long-term rental with low running costs.',
  },
  {
    id: '2',
    title: 'Toyota Camry 2024',
    brand: 'Toyota',
    model: 'Camry',
    year: 2024,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'hybrid',
    color: 'Silver',
    category: 'sedan',
    images: [carImages.camry],
    features: ['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Sunroof', 'Premium Sound'],
    dailyPrice: 200,
    weeklyPrice: 1200,
    monthlyPrice: 3500,
    threeMonthPrice: 9800,
    sixMonthPrice: 18000,
    twelveMonthPrice: 33000,
    securityDeposit: 3000,
    status: 'available',
    location: 'Dubai',
    featured: true,
    published: true,
    description: 'The Toyota Camry Hybrid offers premium comfort with excellent fuel economy. Ideal for those who want a spacious sedan.',
  },
  {
    id: '3',
    title: 'Nissan Sunny 2024',
    brand: 'Nissan',
    model: 'Sunny',
    year: 2024,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'White',
    category: 'sedan',
    images: [carImages.sunny],
    features: ['Air Conditioning', 'Bluetooth', 'USB', 'Power Windows', 'Central Locking'],
    dailyPrice: 120,
    weeklyPrice: 720,
    monthlyPrice: 2200,
    threeMonthPrice: 6000,
    sixMonthPrice: 11000,
    twelveMonthPrice: 20000,
    securityDeposit: 1500,
    status: 'available',
    location: 'Dubai',
    featured: false,
    published: true,
    description: 'The Nissan Sunny is an economical choice for budget-conscious renters. Reliable and easy to maintain.',
  },
  {
    id: '4',
    title: 'Nissan Altima 2024',
    brand: 'Nissan',
    model: 'Altima',
    year: 2024,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'Black',
    category: 'sedan',
    images: [carImages.altima],
    features: ['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Backup Camera', 'Apple CarPlay'],
    dailyPrice: 180,
    weeklyPrice: 1080,
    monthlyPrice: 3200,
    threeMonthPrice: 8900,
    sixMonthPrice: 16500,
    twelveMonthPrice: 30000,
    securityDeposit: 2500,
    status: 'available',
    location: 'Dubai',
    featured: true,
    published: true,
    description: 'The Nissan Altima combines style with performance. A great mid-size sedan for comfortable daily driving.',
  },
  {
    id: '5',
    title: 'Kia K5 2024',
    brand: 'Kia',
    model: 'K5',
    year: 2024,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'Red',
    category: 'sedan',
    images: [carImages.k5],
    features: ['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Sunroof', 'Wireless Charging'],
    dailyPrice: 170,
    weeklyPrice: 1020,
    monthlyPrice: 3000,
    threeMonthPrice: 8400,
    sixMonthPrice: 15500,
    twelveMonthPrice: 28000,
    securityDeposit: 2500,
    status: 'available',
    location: 'Dubai',
    featured: false,
    published: true,
    description: 'The Kia K5 offers bold design and modern technology at a competitive price point.',
  },
  {
    id: '6',
    title: 'Kia Sportage 2024',
    brand: 'Kia',
    model: 'Sportage',
    year: 2024,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'Grey',
    category: 'suv',
    images: [carImages.sportage],
    features: ['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Backup Camera', 'Panoramic Roof'],
    dailyPrice: 220,
    weeklyPrice: 1320,
    monthlyPrice: 3800,
    threeMonthPrice: 10600,
    sixMonthPrice: 19500,
    twelveMonthPrice: 35000,
    securityDeposit: 3500,
    status: 'available',
    location: 'Dubai',
    featured: true,
    published: true,
    description: 'The Kia Sportage is a stylish SUV with ample space and modern features for families.',
  },
  {
    id: '7',
    title: 'Hyundai Elantra 2024',
    brand: 'Hyundai',
    model: 'Elantra',
    year: 2024,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'Blue',
    category: 'sedan',
    images: [carImages.elantra],
    features: ['Air Conditioning', 'Bluetooth', 'USB', 'Cruise Control', 'Backup Camera', 'Apple CarPlay'],
    dailyPrice: 140,
    weeklyPrice: 840,
    monthlyPrice: 2600,
    threeMonthPrice: 7200,
    sixMonthPrice: 13200,
    twelveMonthPrice: 24000,
    securityDeposit: 2000,
    status: 'available',
    location: 'Dubai',
    featured: false,
    published: true,
    description: 'The Hyundai Elantra is a modern sedan with great value, offering style and reliability.',
  },
  {
    id: '8',
    title: 'Hyundai Tucson 2024',
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2024,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'hybrid',
    color: 'White',
    category: 'suv',
    images: [carImages.tucson],
    features: ['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Sunroof', '360 Camera'],
    dailyPrice: 240,
    weeklyPrice: 1440,
    monthlyPrice: 4200,
    threeMonthPrice: 11700,
    sixMonthPrice: 21500,
    twelveMonthPrice: 39000,
    securityDeposit: 4000,
    status: 'rented',
    location: 'Dubai',
    featured: true,
    published: true,
    description: 'The Hyundai Tucson Hybrid combines SUV practicality with fuel efficiency. Perfect for families.',
  },
  {
    id: '9',
    title: 'Honda Civic 2024',
    brand: 'Honda',
    model: 'Civic',
    year: 2024,
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    color: 'Grey',
    category: 'sedan',
    images: [carImages.civic],
    features: ['Air Conditioning', 'Bluetooth', 'Navigation', 'Cruise Control', 'Backup Camera', 'Honda Sensing'],
    dailyPrice: 160,
    weeklyPrice: 960,
    monthlyPrice: 2900,
    threeMonthPrice: 8100,
    sixMonthPrice: 14900,
    twelveMonthPrice: 27000,
    securityDeposit: 2000,
    status: 'available',
    location: 'Dubai',
    featured: false,
    published: true,
    description: 'The Honda Civic is known for its reliability and driving dynamics. A solid choice for long-term rental.',
  },
  {
    id: '10',
    title: 'Mitsubishi Outlander 2024',
    brand: 'Mitsubishi',
    model: 'Outlander',
    year: 2024,
    seats: 7,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'hybrid',
    color: 'Black',
    category: 'suv',
    images: [carImages.outlander],
    features: ['Air Conditioning', 'Leather Seats', 'Navigation', 'Bluetooth', 'Third Row Seats', 'Power Tailgate'],
    dailyPrice: 260,
    weeklyPrice: 1560,
    monthlyPrice: 4500,
    threeMonthPrice: 12600,
    sixMonthPrice: 23000,
    twelveMonthPrice: 42000,
    securityDeposit: 4500,
    status: 'available',
    location: 'Dubai',
    featured: true,
    published: true,
    description: 'The Mitsubishi Outlander is a spacious 7-seater SUV, ideal for larger families or groups.',
  },
];

export const bookings: Booking[] = [
  {
    id: 'b1',
    bookingReference: 'DRV-2024-001',
    userId: 'user1',
    carId: '8',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    durationMonths: 6,
    monthlyRent: 4200,
    totalAmount: 21500,
    status: 'active',
    notes: 'Customer requested early delivery',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-14',
  },
  {
    id: 'b2',
    bookingReference: 'DRV-2024-002',
    userId: 'user1',
    carId: '1',
    startDate: '2024-03-01',
    endDate: '2024-06-01',
    durationMonths: 3,
    monthlyRent: 2800,
    totalAmount: 7800,
    status: 'pending',
    notes: '',
    createdAt: '2024-02-25',
    updatedAt: '2024-02-25',
  },
  {
    id: 'b3',
    bookingReference: 'DRV-2024-003',
    userId: 'user2',
    carId: '3',
    startDate: '2023-10-01',
    endDate: '2024-01-01',
    durationMonths: 3,
    monthlyRent: 2200,
    totalAmount: 6000,
    status: 'completed',
    notes: '',
    createdAt: '2023-09-25',
    updatedAt: '2024-01-01',
  },
];

export const leads: Lead[] = [
  {
    id: 'l1',
    customerName: 'Ahmed Al Maktoum',
    phone: '+971501234567',
    email: 'ahmed@example.com',
    carId: '2',
    durationMonths: 12,
    startDate: '2024-04-01',
    source: 'website',
    status: 'new',
    notes: 'Interested in long-term corporate rental',
    createdAt: '2024-03-01',
  },
  {
    id: 'l2',
    customerName: 'Sarah Johnson',
    phone: '+971559876543',
    email: 'sarah@example.com',
    carId: '6',
    durationMonths: 6,
    startDate: '2024-05-01',
    source: 'whatsapp',
    status: 'contacted',
    notes: 'Family moving to Dubai, needs SUV',
    createdAt: '2024-03-05',
  },
  {
    id: 'l3',
    customerName: 'Raj Patel',
    phone: '+971523456789',
    email: 'raj@example.com',
    carId: '7',
    durationMonths: 3,
    startDate: '2024-04-15',
    source: 'instagram',
    status: 'interested',
    notes: 'Short-term assignment in Dubai',
    createdAt: '2024-03-08',
  },
  {
    id: 'l4',
    customerName: 'Fatima Hassan',
    phone: '+971567891234',
    email: 'fatima@example.com',
    carId: '10',
    durationMonths: 12,
    startDate: '2024-04-01',
    source: 'referral',
    status: 'documents_pending',
    notes: 'Large family, needs 7-seater',
    createdAt: '2024-03-10',
  },
];

export const pricingService = {
  calculateTotal: (car: Car, months: number): number => {
    switch (months) {
      case 1: return car.monthlyPrice;
      case 3: return car.threeMonthPrice;
      case 6: return car.sixMonthPrice;
      case 12: return car.twelveMonthPrice;
      default: return car.monthlyPrice * months;
    }
  },
  getMonthlyRate: (car: Car, months: number): number => {
    const total = pricingService.calculateTotal(car, months);
    return Math.round(total / months);
  },
  getSavings: (car: Car, months: number): number => {
    const baseTotal = car.monthlyPrice * months;
    const discountedTotal = pricingService.calculateTotal(car, months);
    return baseTotal - discountedTotal;
  },
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('en-US').format(price);
  },
};

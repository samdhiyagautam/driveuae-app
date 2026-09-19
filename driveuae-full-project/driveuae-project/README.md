# DriveUAE — Long-Term Car Rental Platform

A production-ready web application for long-term car rental in Dubai, UAE. Built with React, TypeScript, and Tailwind CSS.

## 🚗 Overview

DriveUAE is a modern car rental platform designed for the Middle East market. It enables customers to browse vehicles, select rental durations (1-12 months), submit booking requests, and manage their rentals — all through a clean, bilingual (English/Arabic) interface.

## ✨ Features

### Customer Application
- **Home Page** — Hero section, search, featured cars, categories, benefits
- **Car Catalogue** — Browse with filters (brand, category, transmission, fuel, price)
- **Car Details** — Full specs, features, pricing for all durations
- **Booking Flow** — 3-step process: details → documents → confirmation
- **My Bookings** — Track booking status (pending, approved, active, completed)
- **Profile** — Account management, language switching
- **Support** — WhatsApp, phone, email, FAQ, contact form

### Admin Panel
- **Dashboard** — Metrics, charts, fleet utilization
- **Car Management** — Add, edit, publish, archive vehicles
- **Booking Management** — Approve, reject, activate, complete bookings
- **Customer Management** — View customer profiles and history
- **Lead Management** — Track and convert leads
- **Document Management** — Review and verify uploaded documents

### Technical Features
- 🌐 **Bilingual** — Full English & Arabic support with RTL
- 📱 **Responsive** — Mobile-first, works on all screen sizes
- ⚡ **Fast** — Optimized loading with skeleton screens
- 🎨 **Premium Design** — Clean, modern, minimalist UI
- 🔒 **Secure** — RLS policies, role-based access
- 📊 **Analytics** — Charts and business metrics

## 🏗️ Architecture

```
src/
├── core/
│   ├── context.tsx          # App state & context
│   └── localization.ts      # EN/AR translations
├── components/
│   └── ui.tsx               # Shared UI components
├── data/
│   └── mockData.ts          # Mock data & pricing service
├── pages/
│   ├── Home.tsx             # Landing page
│   ├── Cars.tsx             # Car listing + filters
│   ├── CarDetail.tsx        # Vehicle details
│   ├── Booking.tsx          # Booking flow
│   ├── MyBookings.tsx       # Customer bookings
│   ├── Login.tsx            # Authentication
│   ├── Profile.tsx          # User profile
│   ├── Support.tsx          # Help & FAQ
│   └── admin/
│       ├── Dashboard.tsx    # Admin metrics
│       ├── AdminCars.tsx    # Fleet management
│       ├── AdminBookings.tsx # Booking management
│       ├── AdminCustomers.tsx # Customer list
│       ├── AdminLeads.tsx   # Lead pipeline
│       └── AdminDocuments.tsx # Document review
├── App.tsx                  # Router & layouts
├── main.tsx                 # Entry point
└── index.css                # Tailwind + custom styles

supabase/
└── migrations/
    ├── 001_initial_schema.sql  # Database schema
    └── seed.sql                # Development data
```

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0A2540` | Headers, primary actions |
| Accent | `#D4A017` | CTAs, highlights |
| Background | `#FFFFFF` | Page background |
| Surface | `#F8F9FA` | Card backgrounds |
| Text | `#0A2540` | Primary text |
| Text Secondary | `#5A6B7F` | Supporting text |
| Success | `#10B981` | Positive states |
| Error | `#EF4444` | Error states |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Database Setup

### Supabase Configuration

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/001_initial_schema.sql`
3. Run seed data from `supabase/migrations/seed.sql`
4. Create storage buckets: `car-images`, `customer-documents`, `contracts`

### Creating First Admin

1. Sign up through the app with an email containing "admin"
2. Or manually update the profile role in Supabase:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```

## 🔐 Security

- **RLS** enabled on all tables
- Admin authorization enforced server-side
- Private document storage with signed URLs
- No service-role keys in client
- Input validation on all forms

## 🌍 Localization

The app supports:
- **English** (default)
- **Arabic** (العربية) with full RTL support

Language preference is persisted in localStorage.

## 📱 Demo Access

- **Customer**: Use any email to login
- **Admin**: Use email containing "admin" (e.g., admin@test.com)

## 📋 Business Model

This is a **long-term car rental** platform (NOT ride-hailing):
- Monthly rental plans (1, 3, 6, 12 months)
- Fleet catalogue with detailed pricing
- Booking request system
- Document verification
- Lead management

## 🔮 Future Roadmap

- [ ] Multi-city support (Abu Dhabi, Sharjah, etc.)
- [ ] Online payments (Stripe integration)
- [ ] Push notifications (FCM)
- [ ] Advanced analytics
- [ ] Corporate accounts
- [ ] Digital contracts
- [ ] Mobile apps (React Native)
- [ ] Supplier/fleet management

## 📄 License

Proprietary — All rights reserved.

---

Built with ❤️ for the UAE market.

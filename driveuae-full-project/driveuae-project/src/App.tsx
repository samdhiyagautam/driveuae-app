import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AppProvider, useApp } from './core/context';
import { CustomerHeader, CustomerFooter, AdminSidebar, Button } from './components/ui';
import { Car, ArrowRight } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Support from './pages/Support';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminLeads from './pages/admin/AdminLeads';
import AdminDocuments from './pages/admin/AdminDocuments';

// Splash Screen
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const { t } = useApp();

  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Car className="w-10 h-10 text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{t('appName')}</h1>
        <p className="text-white/70">{t('tagline')}</p>
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}

// Onboarding
function OnboardingScreen() {
  const { t, completeOnboarding } = useApp();
  const [slide, setSlide] = useState(0);

  const slides = [
    { title: t('onboarding1Title'), desc: t('onboarding1Desc'), emoji: '🚗' },
    { title: t('onboarding2Title'), desc: t('onboarding2Desc'), emoji: '📅' },
    { title: t('onboarding3Title'), desc: t('onboarding3Desc'), emoji: '✅' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-8xl mb-8 animate-slide-up">{slides[slide].emoji}</div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-4 animate-fade-in">
          {slides[slide].title}
        </h2>
        <p className="text-text-secondary text-center max-w-sm animate-fade-in">
          {slides[slide].desc}
        </p>

        {/* Dots */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === slide ? 'bg-primary w-8' : 'bg-border'
            }`} />
          ))}
        </div>
      </div>

      <div className="px-6 pb-12 space-y-3">
        <Button variant="primary" size="lg" fullWidth onClick={() => {
          if (slide < 2) setSlide(slide + 1);
          else completeOnboarding();
        }}>
          {slide < 2 ? t('next') : t('getStarted')} <ArrowRight className="w-4 h-4 ms-2 flip-rtl" />
        </Button>
        <button onClick={completeOnboarding} className="w-full text-center text-sm text-text-muted hover:text-primary transition-colors">
          {t('skip')}
        </button>
      </div>
    </div>
  );
}

// Customer Layout
function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/booking/:carId" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/support" element={<Support />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <CustomerFooter />
    </div>
  );
}

// Admin Layout
function AdminLayout() {
  const { isAdmin } = useApp();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-surface-secondary">
      <AdminSidebar currentPath={location.pathname} />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/cars" element={<AdminCars />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// Language Selection
function LanguageSelection({ onSelect }: { onSelect: () => void }) {
  const { t, setLanguage } = useApp();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Car className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Select Language</h2>
        <p className="text-text-secondary mb-8">اختر اللغة / Choose your language</p>
        <div className="space-y-3">
          <button onClick={() => { setLanguage('en'); onSelect(); }}
            className="w-full p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-start flex items-center gap-4">
            <span className="text-3xl">🇬🇧</span>
            <div>
              <p className="font-semibold text-primary">English</p>
              <p className="text-sm text-text-muted">Continue in English</p>
            </div>
          </button>
          <button onClick={() => { setLanguage('ar'); onSelect(); }}
            className="w-full p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-start flex items-center gap-4">
            <span className="text-3xl">🇦🇪</span>
            <div>
              <p className="font-semibold text-primary">العربية</p>
              <p className="text-sm text-text-muted">المتابعة بالعربية</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// App Router
function AppRouter() {
  const { onboardingComplete, isAuthenticated, isAdmin, language, authLoading } = useApp();
  const [showSplash, setShowSplash] = useState(true);
  const showLangSelection = !localStorage.getItem('driveuae_lang');

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (showLangSelection) {
    return <LanguageSelection onSelect={() => window.location.reload()} />;
  }

  if (!onboardingComplete) {
    return <OnboardingScreen />;
  }

  // Wait for the real Supabase session check to resolve before deciding
  // between admin/customer routing -- otherwise a signed-in admin briefly
  // flashes the customer layout on every page load/refresh.
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-secondary">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Admin routes
  if (isAuthenticated && isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // Customer routes
  return (
    <Routes>
      <Route path="/*" element={<CustomerLayout />} />
    </Routes>
  );
}

// Main App
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppProvider>
  );
}

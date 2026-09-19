import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/context';
import { Car } from '../data/mockData';
import {
  Car as CarIcon, Calendar, Users, Fuel, Gauge, ChevronLeft, ChevronRight,
  Star, MapPin, Shield, Clock, CheckCircle, XCircle, AlertCircle,
  Menu, X, Globe, User, LogOut, Home, Search, BookOpen, HeadphonesIcon,
  LayoutDashboard, FileText, UserCheck, TrendingUp, Settings
} from 'lucide-react';

// Skeleton Components
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border">
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="flex gap-2">
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-4 w-16" />
        </div>
        <div className="skeleton h-8 w-full mt-4" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Status Badge
export function StatusBadge({ status }: { status: string }) {
  const { t } = useApp();
  const config: Record<string, { bg: string; text: string; label: string }> = {
    available: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: t('available') },
    rented: { bg: 'bg-blue-50', text: 'text-blue-700', label: t('rented') },
    maintenance: { bg: 'bg-amber-50', text: 'text-amber-700', label: t('maintenance') },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-600', label: t('inactive') },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: t('pending') },
    approved: { bg: 'bg-blue-50', text: 'text-blue-700', label: t('approved') },
    active: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: t('active') },
    completed: { bg: 'bg-gray-100', text: 'text-gray-600', label: t('completed') },
    cancelled: { bg: 'bg-red-50', text: 'text-red-700', label: t('cancelled') },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', label: t('rejected') },
    new: { bg: 'bg-blue-50', text: 'text-blue-700', label: t('newLead') },
    contacted: { bg: 'bg-purple-50', text: 'text-purple-700', label: t('contacted') },
    interested: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: t('interested') },
    documents_pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: t('documentsPending') },
    booked: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: t('booked') },
    lost: { bg: 'bg-red-50', text: 'text-red-700', label: t('lost') },
  };
  const c = config[status] || config.inactive;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

// Car Card
export function CarCard({ car }: { car: Car }) {
  const { t } = useApp();
  return (
    <Link
      to={`/cars/${car.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 animate-fade-in"
    >
      <div className="relative overflow-hidden">
        <img
          src={car.images[0]}
          alt={car.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {car.featured && (
          <div className="absolute top-3 left-3 bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" fill="currentColor" /> Featured
          </div>
        )}
        <StatusBadge status={car.status} />
        <div className="absolute top-3 right-3">
          <StatusBadge status={car.status} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-primary text-lg line-clamp-1">{car.title}</h3>
        <p className="text-text-secondary text-sm mt-1">{car.year} • {car.transmission === 'automatic' ? t('automatic') : t('manual')}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-text-secondary">
          <span className="flex items-center gap-1"><Users className="w-4 h-4" />{car.seats}</span>
          <span className="flex items-center gap-1"><Fuel className="w-4 h-4" />{t(car.fuelType)}</span>
          <span className="flex items-center gap-1"><Gauge className="w-4 h-4" />{car.category}</span>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div>
            <span className="text-2xl font-bold text-primary">{t('aed')} {car.monthlyPrice.toLocaleString()}</span>
            <span className="text-text-muted text-sm">{t('perMonth')}</span>
          </div>
          <span className="text-accent font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            {t('viewDetails')} <ChevronRight className="w-4 h-4 flip-rtl" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Empty State
export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-surface-tertiary rounded-full flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p className="text-text-secondary max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// Error State
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { t } = useApp();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-error" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">{t('somethingWrong')}</h3>
      <p className="text-text-secondary max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-light transition-colors">
          {t('tryAgain')}
        </button>
      )}
    </div>
  );
}

// Button Component
export function Button({
  children, variant = 'primary', size = 'md', fullWidth, disabled, onClick, className = '', type = 'button'
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light focus:ring-primary',
    secondary: 'bg-accent text-white hover:bg-accent-light focus:ring-accent',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-primary hover:bg-surface-tertiary focus:ring-primary',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {children}
    </button>
  );
}

// Input Component
export function Input({
  label, type = 'text', placeholder, value, onChange, icon, error, required
}: {
  label?: string; type?: string; placeholder?: string; value?: string;
  onChange?: (v: string) => void; icon?: React.ReactNode; error?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-text-primary">{label}{required && <span className="text-error">*</span>}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</div>}
        <input
          type={type} placeholder={placeholder} value={value}
          onChange={e => onChange?.(e.target.value)}
          className={`w-full px-4 py-3 ${icon ? 'pl-10' : ''} rounded-xl border border-border bg-white text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
        />
      </div>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
}

// Customer Header
export function CustomerHeader() {
  const { t, language, setLanguage, isAuthenticated, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <CarIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-primary">{t('appName')}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-tertiary transition-colors">{t('home')}</Link>
            <Link to="/cars" className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-tertiary transition-colors">{t('cars')}</Link>
            {isAuthenticated && (
              <Link to="/my-bookings" className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-tertiary transition-colors">{t('myBookings')}</Link>
            )}
            <Link to="/support" className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-primary hover:bg-surface-tertiary transition-colors">{t('support')}</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary transition-colors">
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'عربي' : 'EN'}
            </button>
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary transition-colors">
                  <User className="w-4 h-4" />
                  {t('profile')}
                </Link>
                <button onClick={logout} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button variant="primary" size="sm">{t('login')}</Button>
              </Link>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl hover:bg-surface-tertiary">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary">{t('home')}</Link>
            <Link to="/cars" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary">{t('cars')}</Link>
            {isAuthenticated && <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary">{t('myBookings')}</Link>}
            <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary">{t('support')}</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-tertiary">{t('profile')}</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-start px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-red-50">{t('logout')}</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-primary bg-primary/5">{t('login')}</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// Customer Footer
export function CustomerFooter() {
  const { t } = useApp();
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                <CarIcon className="w-5 h-5 text-accent" />
              </div>
              <span className="font-bold text-xl">{t('appName')}</span>
            </div>
            <p className="text-white/70 text-sm">{t('tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('cars')}</h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>{t('sedan')}</p><p>{t('suv')}</p><p>{t('hatchback')}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('support')}</h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>{t('whatsapp')}: +971 50 123 4567</p>
              <p>{t('email')}: info@driveuae.com</p>
              <p>Dubai, UAE</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('whyChooseUs')}</h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>{t('benefit1Title')}</p><p>{t('benefit2Title')}</p><p>{t('benefit3Title')}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/50">
          © 2024 {t('appName')}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// Admin Sidebar
export function AdminSidebar({ currentPath }: { currentPath: string }) {
  const { t, logout } = useApp();
  const links = [
    { path: '/admin', icon: LayoutDashboard, label: t('dashboard') },
    { path: '/admin/cars', icon: CarIcon, label: t('manageCars') },
    { path: '/admin/bookings', icon: BookOpen, label: t('manageBookings') },
    { path: '/admin/customers', icon: UserCheck, label: t('manageCustomers') },
    { path: '/admin/leads', icon: TrendingUp, label: t('manageLeads') },
    { path: '/admin/documents', icon: FileText, label: t('documents') },
  ];

  return (
    <aside className="w-64 bg-white border-e border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <CarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-primary">{t('appName')}</span>
            <p className="text-xs text-text-muted">{t('admin')}</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <Link key={link.path} to={link.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              currentPath === link.path ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface-tertiary hover:text-primary'
            }`}>
            <link.icon className="w-5 h-5" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-red-50 w-full transition-colors">
          <LogOut className="w-5 h-5" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
}

// Stat Card
export function StatCard({ icon: Icon, label, value, change, color = 'primary' }: {
  icon: React.ElementType; label: string; value: string | number; change?: string; color?: string;
}) {
  const colors: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    info: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="bg-white rounded-2xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && <span className="text-sm font-medium text-success">{change}</span>}
      </div>
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-text-secondary mt-1">{label}</p>
    </div>
  );
}

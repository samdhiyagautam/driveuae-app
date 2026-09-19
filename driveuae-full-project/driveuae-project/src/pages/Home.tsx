import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../core/context';
import { cars, pricingService } from '../data/mockData';
import { CarCard, SkeletonList, Button, Input } from '../components/ui';
import { Search, Shield, Clock, Star, ChevronRight, Calendar, MapPin, Car, Zap, Heart } from 'lucide-react';

export default function Home() {
  const { t } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const featuredCars = cars.filter(c => c.featured && c.published);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    navigate(`/cars?q=${encodeURIComponent(searchQuery)}`);
  };

  const categories = [
    { key: 'sedan', icon: Car, count: cars.filter(c => c.category === 'sedan').length },
    { key: 'suv', icon: Car, count: cars.filter(c => c.category === 'suv').length },
    { key: 'hatchback', icon: Car, count: cars.filter(c => c.category === 'hatchback').length },
    { key: 'coupe', icon: Car, count: cars.filter(c => c.category === 'coupe').length },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-primary-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm mb-6">
              <MapPin className="w-4 h-4" />
              Dubai, UAE
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="flex-1 py-3 text-primary placeholder:text-text-muted focus:outline-none"
                />
              </div>
              <button onClick={handleSearch}
                className="bg-accent hover:bg-accent-light text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                {t('search')}
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mt-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>1-12 {t('duration').toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>{cars.length}+ {t('cars').toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{t('securityDeposit')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('popularCategories')}</h2>
          <Link to="/cars" className="text-accent font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
            {t('viewAll')} <ChevronRight className="w-4 h-4 flip-rtl" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link key={cat.key} to={`/cars?category=${cat.key}`}
              className="bg-white rounded-2xl p-6 border border-border hover:border-accent/30 hover:shadow-lg transition-all group text-center">
              <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/10 transition-colors">
                <cat.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
              </div>
              <h3 className="font-semibold text-primary capitalize">{t(cat.key as any)}</h3>
              <p className="text-sm text-text-muted mt-1">{cat.count} {t('cars').toLowerCase()}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="bg-surface-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">{t('featuredCars')}</h2>
            <Link to="/cars" className="text-accent font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              {t('viewAll')} <ChevronRight className="w-4 h-4 flip-rtl" />
            </Link>
          </div>
          {loading ? (
            <SkeletonList count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.slice(0, 4).map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">{t('whyChooseUs')}</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">{t('heroSubtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Calendar, title: t('benefit1Title'), desc: t('benefit1Desc'), color: 'bg-blue-50 text-blue-600' },
            { icon: Zap, title: t('benefit2Title'), desc: t('benefit2Desc'), color: 'bg-amber-50 text-amber-600' },
            { icon: Heart, title: t('benefit3Title'), desc: t('benefit3Desc'), color: 'bg-emerald-50 text-emerald-600' },
            { icon: Star, title: t('benefit4Title'), desc: t('benefit4Desc'), color: 'bg-purple-50 text-purple-600' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg transition-all animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-primary text-lg mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('appName')}</h2>
          <p className="text-white/80 text-lg mb-8">{t('heroSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cars">
              <Button variant="secondary" size="lg">{t('cars')}</Button>
            </Link>
            <Link to="/support">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">{t('contactUs')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

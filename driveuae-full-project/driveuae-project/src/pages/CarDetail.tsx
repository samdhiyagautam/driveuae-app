import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../core/context';
import { Car as CarType, pricingService } from '../data/mockData';
import { supabase, CarRow } from '../core/supabaseClient';
import { mapCarRow } from '../core/mappers';
import { Button, StatusBadge, ErrorState } from '../components/ui';
import {
  ChevronLeft, ChevronRight, Users, Fuel, Gauge, Calendar, Shield, Check,
  Star, ArrowRight, Clock, MapPin
} from 'lucide-react';

export default function CarDetail() {
  const { id } = useParams();
  const { t } = useApp();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const loadCar = () => {
    if (!id) return;
    setLoading(true);
    setLoadError('');
    supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          setLoadError(error.message);
        } else {
          setCar(data ? mapCarRow(data as CarRow) : null);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="skeleton h-96 rounded-2xl" />
            <div className="space-y-4">
              <div className="skeleton h-8 w-3/4" />
              <div className="skeleton h-6 w-1/2" />
              <div className="skeleton h-24 w-full" />
              <div className="skeleton h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState message={loadError} onRetry={loadCar} />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Car not found</h2>
          <Link to="/cars" className="text-accent font-medium">{t('back')}</Link>
        </div>
      </div>
    );
  }

  const durations = [
    { months: 1, label: t('oneMonth'), price: car.monthlyPrice },
    { months: 3, label: t('threeMonths'), price: car.threeMonthPrice },
    { months: 6, label: t('sixMonths'), price: car.sixMonthPrice },
    { months: 12, label: t('twelveMonths'), price: car.twelveMonthPrice },
  ];

  const selectedDurationData = durations.find(d => d.months === selectedDuration)!;
  const savings = pricingService.getSavings(car, selectedDuration);
  const monthlyRate = Math.round(selectedDurationData.price / selectedDuration);

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
          <Link to="/" className="hover:text-primary">{t('home')}</Link>
          <ChevronRight className="w-4 h-4 flip-rtl" />
          <Link to="/cars" className="hover:text-primary">{t('cars')}</Link>
          <ChevronRight className="w-4 h-4 flip-rtl" />
          <span className="text-primary font-medium">{car.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-white">
              <img
                src={car.images[activeImage]}
                alt={car.title}
                className="w-full h-72 sm:h-96 object-cover"
              />
              {car.featured && (
                <div className="absolute top-4 left-4 bg-accent text-white text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4" fill="currentColor" /> Featured
                </div>
              )}
              <div className="absolute top-4 right-4">
                <StatusBadge status={car.status} />
              </div>
            </div>
            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {car.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImage ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{car.title}</h1>
              <p className="text-text-secondary">{car.year} • {car.color} • {car.location}</p>
            </div>

            {/* Price */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-primary">{t('aed')} {monthlyRate.toLocaleString()}</span>
                <span className="text-text-muted">{t('perMonth')}</span>
              </div>
              {savings > 0 && (
                <p className="text-success text-sm font-medium">{t('youSave')}: {t('aed')} {savings.toLocaleString()}</p>
              )}
            </div>

            {/* Duration Selector */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-primary mb-4">{t('selectDuration')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {durations.map(d => (
                  <button key={d.months} onClick={() => setSelectedDuration(d.months)}
                    className={`p-4 rounded-xl border-2 text-start transition-all ${
                      selectedDuration === d.months
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}>
                    <p className="font-semibold text-primary">{d.label}</p>
                    <p className="text-sm text-text-secondary mt-1">
                      {t('aed')} {d.price.toLocaleString()} {t('totalAmount').toLowerCase()}
                    </p>
                    {d.months > 1 && (
                      <p className="text-xs text-success mt-1">
                        {t('aed')} {Math.round(d.price / d.months).toLocaleString()}{t('perMonth')}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-primary mb-4">{t('specifications')}</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, label: t('seats'), value: car.seats },
                  { icon: Gauge, label: t('doors'), value: car.doors },
                  { icon: Fuel, label: t('fuelType'), value: t(car.fuelType) },
                  { icon: Calendar, label: t('transmission'), value: t(car.transmission) },
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-tertiary rounded-xl flex items-center justify-center">
                      <spec.icon className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">{spec.label}</p>
                      <p className="font-medium text-primary capitalize">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-primary mb-4">{t('features')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {car.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-primary mb-3">{t('carDetails')}</h3>
              <p className="text-text-secondary leading-relaxed">{car.description}</p>
            </div>

            {/* Security Deposit */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-center gap-3">
              <Shield className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-900">{t('securityDeposit')}: {t('aed')} {car.securityDeposit.toLocaleString()}</p>
                <p className="text-sm text-amber-700">Refundable upon vehicle return</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <Button variant="primary" size="lg" fullWidth onClick={() => navigate(`/booking/${car.id}?duration=${selectedDuration}`)}>
                {t('requestBooking')} <ArrowRight className="w-4 h-4 ms-2 flip-rtl" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

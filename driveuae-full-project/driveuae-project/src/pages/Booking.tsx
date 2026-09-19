import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../core/context';
import { Car as CarType, pricingService } from '../data/mockData';
import { supabase, CarRow } from '../core/supabaseClient';
import { mapCarRow } from '../core/mappers';
import { Button, Input, ErrorState } from '../components/ui';
import {
  ChevronLeft, Calendar, Car, FileText, CheckCircle, Upload,
  CreditCard, Shield, AlertCircle
} from 'lucide-react';

export default function Booking() {
  const { carId } = useParams();
  const [searchParams] = useSearchParams();
  const { t, isAuthenticated, user } = useApp();
  const navigate = useNavigate();
  const duration = parseInt(searchParams.get('duration') || '1');

  const [car, setCar] = useState<CarType | null>(null);
  const [loadingCar, setLoadingCar] = useState(true);
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!carId) return;
    supabase.from('cars').select('*').eq('id', carId).maybeSingle().then(({ data }) => {
      setCar(data ? mapCarRow(data as CarRow) : null);
      setLoadingCar(false);
    });
  }, [carId]);

  if (loadingCar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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

  const totalPrice = pricingService.calculateTotal(car, duration);
  const monthlyRate = Math.round(totalPrice / duration);

  const generateReference = () =>
    `DRV-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;

  const handleSubmit = async () => {
    setSubmitError('');
    setSubmitting(true);

    const end = startDate
      ? new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + duration)).toISOString().slice(0, 10)
      : null;
    const reference = generateReference();

    if (isAuthenticated && user) {
      // Signed-in customer: create a real booking row.
      const { error } = await supabase.from('bookings').insert({
        booking_reference: reference,
        user_id: user.id,
        car_id: car.id,
        start_date: startDate || null,
        end_date: end,
        duration_months: duration,
        monthly_rent: monthlyRate,
        total_amount: totalPrice,
        status: 'pending',
        notes: notes || null,
      });
      setSubmitting(false);
      if (error) {
        setSubmitError(error.message);
        return;
      }
      setBookingReference(reference);
      setSubmitted(true);
    } else {
      // Not signed in: capture it as a lead instead -- `bookings` requires
      // a real user_id, and this is exactly what the leads table is for.
      const { error } = await supabase.from('leads').insert({
        customer_name: fullName || 'Guest',
        phone,
        email,
        car_id: car.id,
        duration_months: duration,
        start_date: startDate || null,
        source: 'website',
        status: 'new',
        notes: notes || null,
      });
      setSubmitting(false);
      if (error) {
        setSubmitError(error.message);
        return;
      }
      setBookingReference(reference);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-border text-center animate-slide-up">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-3">{t('bookingSubmitted')}</h2>
          <p className="text-text-secondary mb-6">{t('bookingSubmittedDesc')}</p>
          <div className="bg-surface-secondary rounded-xl p-4 mb-6 text-start">
            <p className="text-sm text-text-muted">{t('bookingReference')}</p>
            <p className="font-bold text-primary text-lg">{bookingReference}</p>
          </div>
          <div className="space-y-3">
            <Link to="/my-bookings">
              <Button variant="primary" fullWidth>{t('myBookings')}</Button>
            </Link>
            <Link to="/cars">
              <Button variant="ghost" fullWidth>{t('back')}</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors">
          <ChevronLeft className="w-5 h-5 flip-rtl" />
          {t('back')}
        </button>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { num: 1, label: t('carDetails'), icon: Car },
            { num: 2, label: t('uploadDocuments'), icon: FileText },
            { num: 3, label: t('confirm'), icon: CheckCircle },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={`flex items-center gap-2 ${step >= s.num ? 'text-primary' : 'text-text-muted'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s.num ? 'bg-primary text-white' : 'bg-surface-tertiary text-text-muted'
                }`}>
                  {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 ${step > s.num ? 'bg-primary' : 'bg-border'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 border border-border animate-fade-in">
                <h2 className="text-xl font-bold text-primary mb-6">{t('bookingRequest')}</h2>

                {/* Car Summary */}
                <div className="flex gap-4 p-4 bg-surface-secondary rounded-xl mb-6">
                  <img src={car.images[0]} alt={car.title} className="w-24 h-16 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold text-primary">{car.title}</p>
                    <p className="text-sm text-text-secondary">{duration} {t('duration').toLowerCase()}</p>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Input
                    label={t('startDate')}
                    type="date"
                    value={startDate}
                    onChange={setStartDate}
                    icon={<Calendar className="w-4 h-4" />}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">{t('endDate')}</label>
                    <div className="px-4 py-3 rounded-xl border border-border bg-surface-secondary text-text-secondary">
                      {startDate ? new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + duration)).toLocaleDateString() : '—'}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                {!isAuthenticated && (
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-primary">{t('fullName')}</h3>
                    <Input label={t('fullName')} value={fullName} onChange={setFullName} required />
                    <Input label={t('email')} type="email" value={email} onChange={setEmail} required />
                    <Input label={t('phone')} type="tel" value={phone} onChange={setPhone} required />
                  </div>
                )}

                <div>
                  <Input label={t('message')} value={notes} onChange={setNotes} />
                </div>

                <div className="mt-6">
                  <Button variant="primary" size="lg" fullWidth onClick={() => setStep(2)}>
                    {t('next')}
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 border border-border animate-fade-in">
                <h2 className="text-xl font-bold text-primary mb-2">{t('uploadDocuments')}</h2>
                <p className="text-text-secondary text-sm mb-6">{t('documentsRequired')}</p>

                <div className="space-y-4">
                  {[
                    { type: t('emiratesId'), icon: '🪪' },
                    { type: t('passport'), icon: '📕' },
                    { type: t('drivingLicense'), icon: '🪪' },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-border rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{doc.icon}</span>
                        <div>
                          <p className="font-medium text-primary">{doc.type}</p>
                          <p className="text-xs text-text-muted">{t('pendingReview')}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => {
                        setUploading(true);
                        setTimeout(() => setUploading(false), 1500);
                      }}>
                        <Upload className="w-4 h-4 me-2" />
                        {uploading ? t('loading') : t('uploadFile')}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)}>{t('back')}</Button>
                  <Button variant="primary" onClick={() => setStep(3)} className="flex-1">{t('next')}</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 border border-border animate-fade-in">
                <h2 className="text-xl font-bold text-primary mb-6">{t('confirm')}</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-text-secondary">{t('carDetails')}</span>
                    <span className="font-medium text-primary">{car.title}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-text-secondary">{t('duration')}</span>
                    <span className="font-medium text-primary">{duration} months</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-text-secondary">{t('monthlyRent')}</span>
                    <span className="font-medium text-primary">{t('aed')} {monthlyRate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-text-secondary">{t('securityDeposit')}</span>
                    <span className="font-medium text-primary">{t('aed')} {car.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="font-semibold text-primary">{t('totalAmount')}</span>
                    <span className="font-bold text-primary text-xl">{t('aed')} {(totalPrice + car.securityDeposit).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Payment Information</p>
                    <p>Payment will be arranged after your booking is approved. Our team will contact you with payment details.</p>
                  </div>
                </div>

                {submitError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{submitError}</div>
                )}
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(2)}>{t('back')}</Button>
                  <Button variant="secondary" size="lg" onClick={handleSubmit} className="flex-1" disabled={submitting}>
                    {submitting ? t('loading') : t('submitRequest')}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-border sticky top-24">
              <img src={car.images[0]} alt={car.title} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h3 className="font-bold text-primary text-lg">{car.title}</h3>
              <p className="text-text-secondary text-sm mb-4">{car.year} • {car.transmission}</p>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">{t('duration')}</span>
                  <span className="font-medium">{duration} months</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">{t('monthlyRent')}</span>
                  <span className="font-medium">{t('aed')} {monthlyRate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-border">
                  <span className="font-semibold text-primary">{t('totalAmount')}</span>
                  <span className="font-bold text-primary">{t('aed')} {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

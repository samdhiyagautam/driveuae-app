import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/context';
import { Booking, Car } from '../data/mockData';
import { supabase, BookingRow, CarRow } from '../core/supabaseClient';
import { mapBookingRow, mapCarRow } from '../core/mappers';
import { StatusBadge, EmptyState, ErrorState, Button } from '../components/ui';
import { Calendar, Car as CarIcon, FileText, Clock, ChevronRight } from 'lucide-react';

export default function MyBookings() {
  const { t, user } = useApp();
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [carsById, setCarsById] = useState<Record<string, Car>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const load = () => {
    if (!user) return;
    setLoading(true);
    setLoadError('');
    supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(async ({ data, error }) => {
        if (error) {
          setLoadError(error.message);
          setLoading(false);
          return;
        }
        const rows = (data || []) as BookingRow[];
        setBookings(rows.map(mapBookingRow));

        const carIds = [...new Set(rows.map(r => r.car_id))];
        if (carIds.length > 0) {
          const { data: carRows } = await supabase.from('cars').select('*').in('id', carIds);
          const map: Record<string, Car> = {};
          (carRows as CarRow[] | null)?.forEach(row => { map[row.id] = mapCarRow(row); });
          setCarsById(map);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, [user]);

  const tabs = [
    { key: 'all', label: t('viewAll') },
    { key: 'active', label: t('active') },
    { key: 'pending', label: t('pending') },
    { key: 'completed', label: t('completed') },
    { key: 'cancelled', label: t('cancelled') },
  ];

  const filteredBookings = activeTab === 'all'
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4">
        <EmptyState
          title={t('myBookings')}
          description={t('loginSubtitle')}
          action={<Link to="/login"><Button variant="primary">{t('login')}</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-primary mb-6">{t('myBookings')}</h1>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key ? 'bg-primary text-white' : 'bg-white text-text-secondary border border-border hover:border-primary/30'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
        ) : loadError ? (
          <ErrorState message={loadError} onRetry={load} />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            title={t('noResults')}
            description="You don't have any bookings in this category."
            action={
              <Link to="/cars">
                <Button variant="primary">{t('cars')}</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => {
              const car = carsById[booking.carId];
              return (
                <div key={booking.id} className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-all animate-fade-in">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img src={car?.images[0]} alt={car?.title} className="w-full sm:w-32 h-24 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-primary">{car?.title}</h3>
                          <p className="text-sm text-text-muted">{booking.bookingReference}</p>
                        </div>
                        <StatusBadge status={booking.status} />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 text-sm">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.startDate} → {booking.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Clock className="w-4 h-4" />
                          <span>{booking.durationMonths} months</span>
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary">
                          <CarIcon className="w-4 h-4" />
                          <span className="font-medium text-primary">{t('aed')} {booking.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

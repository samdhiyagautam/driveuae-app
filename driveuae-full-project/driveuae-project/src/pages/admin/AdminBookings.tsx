import React, { useState, useEffect } from 'react';
import { useApp } from '../../core/context';
import { Booking, Car } from '../../data/mockData';
import { supabase, BookingRow, CarRow } from '../../core/supabaseClient';
import { mapBookingRow, mapCarRow } from '../../core/mappers';
import { StatusBadge, Button, ErrorState } from '../../components/ui';
import { Search, CheckCircle, XCircle, Eye, Clock } from 'lucide-react';

export default function AdminBookings() {
  const { t } = useApp();
  const [statusFilter, setStatusFilter] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [carsById, setCarsById] = useState<Record<string, Car>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setLoadError('');
    supabase
      .from('bookings')
      .select('*')
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
  }, []);

  const updateStatus = async (bookingId: string, status: Booking['status']) => {
    setUpdatingId(bookingId);
    const { error } = await supabase.from('bookings').update({ status }).eq('id', bookingId);
    setUpdatingId(null);
    if (error) {
      setLoadError(error.message);
      return;
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  const filtered = statusFilter
    ? bookings.filter(b => b.status === statusFilter)
    : bookings;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">{t('manageBookings')}</h1>
        <p className="text-text-secondary text-sm">{bookings.length} total bookings</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['', 'pending', 'approved', 'active', 'completed', 'cancelled', 'rejected'].map(status => (
          <button key={status} onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === status ? 'bg-primary text-white' : 'bg-white text-text-secondary border border-border hover:border-primary/30'
            }`}>
            {status ? t(status as any) : t('viewAll')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={load} />
      ) : (
        <div className="space-y-4">
          {filtered.map(booking => {
            const car = carsById[booking.carId];
            const isUpdating = updatingId === booking.id;
            return (
              <div key={booking.id} className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={car?.images[0]} alt="" className="w-16 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-primary">{car?.title || booking.carId}</h3>
                        <StatusBadge status={booking.status} />
                      </div>
                      <p className="text-sm text-text-muted mt-1">
                        {booking.bookingReference} • {booking.durationMonths} months • AED {booking.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {booking.startDate} → {booking.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <Button variant="primary" size="sm" disabled={isUpdating} onClick={() => updateStatus(booking.id, 'approved')}>
                          <CheckCircle className="w-4 h-4 me-1" /> {t('approve')}
                        </Button>
                        <Button variant="danger" size="sm" disabled={isUpdating} onClick={() => updateStatus(booking.id, 'rejected')}>
                          <XCircle className="w-4 h-4 me-1" /> {t('reject')}
                        </Button>
                      </>
                    )}
                    {booking.status === 'approved' && (
                      <Button variant="primary" size="sm" disabled={isUpdating} onClick={() => updateStatus(booking.id, 'active')}>
                        <Clock className="w-4 h-4 me-1" /> {t('activate')}
                      </Button>
                    )}
                    {booking.status === 'active' && (
                      <Button variant="outline" size="sm" disabled={isUpdating} onClick={() => updateStatus(booking.id, 'completed')}>
                        <CheckCircle className="w-4 h-4 me-1" /> {t('complete')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center text-text-muted py-12">No bookings in this category.</div>
          )}
        </div>
      )}
    </div>
  );
}

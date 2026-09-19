import React, { useState, useEffect } from 'react';
import { useApp } from '../../core/context';
import { Car } from '../../data/mockData';
import { supabase, CarRow } from '../../core/supabaseClient';
import { mapCarRow } from '../../core/mappers';
import { StatusBadge, Button, ErrorState } from '../../components/ui';
import { CarFormModal } from '../../components/CarFormModal';
import { Plus, Edit, Archive, ArchiveRestore, Search } from 'lucide-react';

export default function AdminCars() {
  const { t } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editingCar, setEditingCar] = useState<Car | null | undefined>(undefined); // undefined = closed, null = add new
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setLoadError('');
    // Admin sees every car (published or not) thanks to the is_admin() RLS override.
    supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setLoadError(error.message);
        } else {
          setCars((data as CarRow[]).map(mapCarRow));
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const togglePublished = async (car: Car) => {
    setBusyId(car.id);
    const { error } = await supabase.from('cars').update({ published: !car.published }).eq('id', car.id);
    setBusyId(null);
    if (error) {
      setLoadError(error.message);
      return;
    }
    setCars(prev => prev.map(c => c.id === car.id ? { ...c, published: !c.published } : c));
  };

  const filtered = cars.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">{t('manageCars')}</h1>
          <p className="text-text-secondary text-sm">{cars.length} vehicles in fleet</p>
        </div>
        <Button variant="primary" onClick={() => setEditingCar(null)}>
          <Plus className="w-4 h-4 me-2" />
          {t('addCar')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="">All Status</option>
          <option value="available">{t('available')}</option>
          <option value="rented">{t('rented')}</option>
          <option value="maintenance">{t('maintenance')}</option>
          <option value="inactive">{t('inactive')}</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}
        </div>
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={load} />
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-secondary">
                  <th className="text-start p-4 text-xs font-medium text-text-muted uppercase">Vehicle</th>
                  <th className="text-start p-4 text-xs font-medium text-text-muted uppercase">Category</th>
                  <th className="text-start p-4 text-xs font-medium text-text-muted uppercase">Monthly</th>
                  <th className="text-start p-4 text-xs font-medium text-text-muted uppercase">Status</th>
                  <th className="text-start p-4 text-xs font-medium text-text-muted uppercase">{t('published')}</th>
                  <th className="text-end p-4 text-xs font-medium text-text-muted uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(car => (
                  <tr key={car.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={car.images[0]} alt="" className="w-12 h-9 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-primary text-sm">{car.title}</p>
                          <p className="text-xs text-text-muted">{car.year} • {car.transmission}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-text-secondary capitalize">{car.category}</td>
                    <td className="p-4 text-sm font-medium text-primary">AED {car.monthlyPrice.toLocaleString()}</td>
                    <td className="p-4"><StatusBadge status={car.status} /></td>
                    <td className="p-4">
                      <span className={`text-sm ${car.published ? 'text-accent font-medium' : 'text-text-muted'}`}>
                        {car.published ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditingCar(car)}
                          className="p-2 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-primary transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => togglePublished(car)} disabled={busyId === car.id}
                          title={car.published ? 'Unpublish' : 'Publish'}
                          className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-error transition-colors disabled:opacity-50">
                          {car.published ? <Archive className="w-4 h-4" /> : <ArchiveRestore className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center text-text-muted py-12">No vehicles match this filter.</div>
          )}
        </div>
      )}

      {editingCar !== undefined && (
        <CarFormModal
          car={editingCar}
          onClose={() => setEditingCar(undefined)}
          onSaved={() => { setEditingCar(undefined); load(); }}
        />
      )}
    </div>
  );
}

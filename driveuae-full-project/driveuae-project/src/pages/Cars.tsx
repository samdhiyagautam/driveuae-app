import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../core/context';
import { Car } from '../data/mockData';
import { supabase, CarRow } from '../core/supabaseClient';
import { mapCarRow } from '../core/mappers';
import { CarCard, SkeletonList, EmptyState, ErrorState, Button } from '../components/ui';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

export default function Cars() {
  const { t } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Filter states
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [seats, setSeats] = useState('');

  const loadCars = () => {
    setLoading(true);
    setLoadError('');
    supabase
      .from('cars')
      .select('*')
      .eq('published', true)
      .order('featured', { ascending: false })
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
    loadCars();
  }, []);

  const brands = useMemo(() => [...new Set(cars.map(c => c.brand))], [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      if (!car.published) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = car.title.toLowerCase().includes(q) ||
          car.brand.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q) ||
          car.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (category && car.category !== category) return false;
      if (brand && car.brand !== brand) return false;
      if (transmission && car.transmission !== transmission) return false;
      if (fuelType && car.fuelType !== fuelType) return false;
      if (car.monthlyPrice < priceRange[0] || car.monthlyPrice > priceRange[1]) return false;
      if (seats && car.seats !== parseInt(seats)) return false;
      return true;
    });
  }, [cars, searchQuery, category, brand, transmission, fuelType, priceRange, seats]);

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('');
    setBrand('');
    setTransmission('');
    setFuelType('');
    setPriceRange([0, 10000]);
    setSeats('');
    setSearchParams({});
  };

  const hasActiveFilters = category || brand || transmission || fuelType || seats || searchQuery;

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-medium transition-colors ${
                showFilters || hasActiveFilters ? 'bg-primary text-white border-primary' : 'bg-white text-text-secondary border-border hover:border-primary'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('filters')}
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">!</span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-surface-secondary rounded-xl border border-border animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">{t('brand')}</label>
                  <select value={brand} onChange={e => setBrand(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">{t('allCars')}</option>
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">{t('allCars')}</option>
                    <option value="sedan">{t('sedan')}</option>
                    <option value="suv">{t('suv')}</option>
                    <option value="hatchback">{t('hatchback')}</option>
                    <option value="coupe">{t('coupe')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">{t('transmission')}</label>
                  <select value={transmission} onChange={e => setTransmission(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">{t('allCars')}</option>
                    <option value="automatic">{t('automatic')}</option>
                    <option value="manual">{t('manual')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">{t('fuelType')}</label>
                  <select value={fuelType} onChange={e => setFuelType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">{t('allCars')}</option>
                    <option value="petrol">{t('petrol')}</option>
                    <option value="diesel">{t('diesel')}</option>
                    <option value="hybrid">{t('hybrid')}</option>
                    <option value="electric">{t('electric')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">{t('seats')}</label>
                  <select value={seats} onChange={e => setSeats(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">{t('allCars')}</option>
                    <option value="5">5 {t('seats')}</option>
                    <option value="7">7 {t('seats')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">{t('monthlyPrice')} (max)</label>
                  <input type="range" min="1000" max="10000" step="500"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full mt-2 accent-primary"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>{t('aed')} 1,000</span>
                    <span>{t('aed')} {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-3">
                <Button variant="ghost" size="sm" onClick={clearFilters}>{t('clearAll')}</Button>
                <Button variant="primary" size="sm" onClick={() => setShowFilters(false)}>{t('apply')}</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">{t('allCars')}</h1>
          <p className="text-sm text-text-secondary">{filteredCars.length} {t('cars').toLowerCase()}</p>
        </div>

        {loading ? (
          <SkeletonList count={6} />
        ) : loadError ? (
          <ErrorState message={loadError} onRetry={loadCars} />
        ) : filteredCars.length === 0 ? (
          <EmptyState
            title={t('noCarsFound')}
            description={t('noCarsFound')}
            action={<Button variant="primary" onClick={clearFilters}>{t('clearFilters')}</Button>}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

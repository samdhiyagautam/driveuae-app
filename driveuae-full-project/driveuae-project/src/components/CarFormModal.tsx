import React, { useState } from 'react';
import { useApp } from '../core/context';
import { supabase, CarRow } from '../core/supabaseClient';
import { Car } from '../data/mockData';
import { Button, Input } from './ui';
import { X } from 'lucide-react';

interface CarFormModalProps {
  car?: Car | null;
  onClose: () => void;
  onSaved: () => void;
}

const CATEGORIES = ['sedan', 'suv', 'hatchback', 'coupe', 'van', 'truck'];
const TRANSMISSIONS = ['automatic', 'manual'];
const FUEL_TYPES = ['petrol', 'diesel', 'hybrid', 'electric'];
const STATUSES = ['available', 'rented', 'maintenance', 'inactive'];

export function CarFormModal({ car, onClose, onSaved }: CarFormModalProps) {
  const { t } = useApp();
  const isEdit = !!car;

  const [title, setTitle] = useState(car?.title || '');
  const [description, setDescription] = useState(car?.description || '');
  const [brand, setBrand] = useState(car?.brand || '');
  const [model, setModel] = useState(car?.model || '');
  const [year, setYear] = useState(String(car?.year || new Date().getFullYear()));
  const [seats, setSeats] = useState(String(car?.seats || 5));
  const [doors, setDoors] = useState(String(car?.doors || 4));
  const [transmission, setTransmission] = useState<string>(car?.transmission || 'automatic');
  const [fuelType, setFuelType] = useState<string>(car?.fuelType || 'petrol');
  const [color, setColor] = useState(car?.color || '');
  const [category, setCategory] = useState<string>(car?.category || 'sedan');
  const [images, setImages] = useState((car?.images || []).join(', '));
  const [features, setFeatures] = useState((car?.features || []).join(', '));
  const [dailyPrice, setDailyPrice] = useState(String(car?.dailyPrice || ''));
  const [weeklyPrice, setWeeklyPrice] = useState(String(car?.weeklyPrice || ''));
  const [monthlyPrice, setMonthlyPrice] = useState(String(car?.monthlyPrice || ''));
  const [threeMonthPrice, setThreeMonthPrice] = useState(String(car?.threeMonthPrice || ''));
  const [sixMonthPrice, setSixMonthPrice] = useState(String(car?.sixMonthPrice || ''));
  const [twelveMonthPrice, setTwelveMonthPrice] = useState(String(car?.twelveMonthPrice || ''));
  const [securityDeposit, setSecurityDeposit] = useState(String(car?.securityDeposit || ''));
  const [location, setLocation] = useState(car?.location || 'Dubai');
  const [status, setStatus] = useState<string>(car?.status || 'available');
  const [featured, setFeatured] = useState(car?.featured || false);
  const [published, setPublished] = useState(car?.published ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    const payload: Partial<CarRow> = {
      title,
      description: description || null,
      brand,
      model,
      year: parseInt(year, 10),
      seats: parseInt(seats, 10),
      doors: parseInt(doors, 10),
      transmission: transmission as CarRow['transmission'],
      fuel_type: fuelType as CarRow['fuel_type'],
      color: color || null,
      category: category as CarRow['category'],
      images: images.split(',').map(s => s.trim()).filter(Boolean),
      features: features.split(',').map(s => s.trim()).filter(Boolean),
      daily_price: parseInt(dailyPrice, 10),
      weekly_price: parseInt(weeklyPrice, 10),
      monthly_price: parseInt(monthlyPrice, 10),
      three_month_price: parseInt(threeMonthPrice, 10),
      six_month_price: parseInt(sixMonthPrice, 10),
      twelve_month_price: parseInt(twelveMonthPrice, 10),
      security_deposit: parseInt(securityDeposit, 10) || 0,
      status: status as CarRow['status'],
      location,
      featured,
      published,
    };

    setSaving(true);
    const { error: dbError } = isEdit
      ? await supabase.from('cars').update(payload).eq('id', car!.id)
      : await supabase.from('cars').insert(payload);
    setSaving(false);

    if (dbError) {
      setError(dbError.message);
      return;
    }
    onSaved();
  };

  const selectClass = "w-full px-4 py-3 rounded-xl border border-border bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";
  const labelClass = "block text-sm font-medium text-text-primary mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-primary">{isEdit ? t('editCar') : t('addCar')}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-tertiary text-text-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}

          <Input label={t('carTitle')} value={title} onChange={setTitle} required />

          <div>
            <label className={labelClass}>{t('carDescription')}</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className={selectClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label={t('brand')} value={brand} onChange={setBrand} required />
            <Input label={t('model')} value={model} onChange={setModel} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label={t('year')} type="number" value={year} onChange={setYear} required />
            <Input label={t('seats')} type="number" value={seats} onChange={setSeats} required />
            <Input label={t('doors')} type="number" value={doors} onChange={setDoors} required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{t('transmission')}</label>
              <select value={transmission} onChange={e => setTransmission(e.target.value)} className={selectClass}>
                {TRANSMISSIONS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t('fuelType')}</label>
              <select value={fuelType} onChange={e => setFuelType(e.target.value)} className={selectClass}>
                {FUEL_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t('category')}</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={selectClass}>
                {CATEGORIES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label={t('color')} value={color} onChange={setColor} />
            <Input label={t('carLocation')} value={location} onChange={setLocation} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label={t('dailyPrice') + ' (AED)'} type="number" value={dailyPrice} onChange={setDailyPrice} required />
            <Input label={t('weeklyPrice') + ' (AED)'} type="number" value={weeklyPrice} onChange={setWeeklyPrice} required />
            <Input label={t('monthlyPrice') + ' (AED)'} type="number" value={monthlyPrice} onChange={setMonthlyPrice} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label={t('threeMonthPrice') + ' (AED)'} type="number" value={threeMonthPrice} onChange={setThreeMonthPrice} required />
            <Input label={t('sixMonthPrice') + ' (AED)'} type="number" value={sixMonthPrice} onChange={setSixMonthPrice} required />
            <Input label={t('twelveMonthPrice') + ' (AED)'} type="number" value={twelveMonthPrice} onChange={setTwelveMonthPrice} required />
          </div>
          <Input label={t('securityDeposit') + ' (AED)'} type="number" value={securityDeposit} onChange={setSecurityDeposit} />

          <Input label={t('imagesCommaSeparated')} value={images} onChange={setImages} />
          <Input label={t('featuresCommaSeparated')} value={features} onChange={setFeatures} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className={selectClass}>
                {STATUSES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-6 pb-3">
              <label className="flex items-center gap-2 text-sm text-text-primary">
                <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4" />
                {t('featured')}
              </label>
              <label className="flex items-center gap-2 text-sm text-text-primary">
                <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} className="w-4 h-4" />
                {t('published')}
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-border sticky bottom-0 bg-white">
          <Button variant="ghost" onClick={onClose} disabled={saving}>{t('cancel')}</Button>
          <Button variant="primary" className="flex-1" onClick={handleSubmit} disabled={saving}>
            {saving ? t('loading') : t('save')}
          </Button>
        </div>
      </div>
    </div>
  );
}

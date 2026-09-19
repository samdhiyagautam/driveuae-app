import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../core/context';
import { supabase } from '../../core/supabaseClient';
import { ErrorState } from '../../components/ui';
import { Search } from 'lucide-react';

interface LeadRow {
  id: string;
  customer_name: string;
  phone: string | null;
  email: string | null;
  car_id: string | null;
  duration_months: number | null;
  start_date: string | null;
  source: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const STATUSES = ['new', 'contacted', 'interested', 'documents_pending', 'approved', 'booked', 'lost', 'completed'];

export default function AdminLeads() {
  const { t } = useApp();
  const [query, setQuery] = useState('');
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setLoadError('');
    supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setLoadError(error.message);
        } else {
          setLeads((data || []) as LeadRow[]);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    setUpdatingId(null);
    if (error) {
      setLoadError(error.message);
      return;
    }
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(lead =>
      [lead.customer_name, lead.email, lead.phone, lead.status]
        .filter(Boolean)
        .some(v => String(v).toLowerCase().includes(q))
    );
  }, [query, leads]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">{t('leads') || 'Leads'}</h1>
        <p className="text-text-secondary mt-1">Manage incoming rental enquiries.</p>
      </div>
      <div className="bg-white rounded-2xl border border-border p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
        </div>
      ) : loadError ? (
        <ErrorState message={loadError} onRetry={load} />
      ) : (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-5 py-3 bg-surface text-xs font-semibold uppercase text-text-muted">
            <span>Name</span><span>Contact</span><span>Duration</span><span>Status</span><span>Created</span>
          </div>
          {filtered.map((lead) => (
            <div key={lead.id} className="grid grid-cols-5 gap-4 px-5 py-4 border-t border-border text-sm items-center">
              <span className="font-medium text-primary">{lead.customer_name || '—'}</span>
              <span className="text-text-secondary">{lead.email || lead.phone || '—'}</span>
              <span className="text-text-secondary">{lead.duration_months ? `${lead.duration_months} mo` : '—'}</span>
              <select
                value={lead.status}
                disabled={updatingId === lead.id}
                onChange={(e) => updateStatus(lead.id, e.target.value)}
                className="capitalize border border-border rounded-lg px-2 py-1 text-sm bg-white"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
              <span className="text-text-muted">{new Date(lead.created_at).toLocaleDateString()}</span>
            </div>
          ))}
          {!filtered.length && <div className="p-8 text-center text-text-muted">No leads found.</div>}
        </div>
      )}
    </div>
  );
}

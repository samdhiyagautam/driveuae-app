import React, { useState } from 'react';
import { useApp } from '../../core/context';
import { StatusBadge, Button } from '../../components/ui';
import { FileText, CheckCircle, XCircle, Eye, Download, Search } from 'lucide-react';

const mockDocuments = [
  { id: 'd1', customerName: 'Ahmed Al Maktoum', type: 'Emirates ID', status: 'pending', uploadedAt: '2024-03-10', bookingRef: 'DRV-2024-002' },
  { id: 'd2', customerName: 'Ahmed Al Maktoum', type: 'Driving License', status: 'pending', uploadedAt: '2024-03-10', bookingRef: 'DRV-2024-002' },
  { id: 'd3', customerName: 'Sarah Johnson', type: 'Passport', status: 'approved', uploadedAt: '2024-02-20', bookingRef: 'DRV-2024-001' },
  { id: 'd4', customerName: 'Sarah Johnson', type: 'Driving License', status: 'approved', uploadedAt: '2024-02-20', bookingRef: 'DRV-2024-001' },
  { id: 'd5', customerName: 'Raj Patel', type: 'Emirates ID', status: 'rejected', uploadedAt: '2024-03-05', bookingRef: 'DRV-2024-003', reason: 'Image too blurry' },
  { id: 'd6', customerName: 'Fatima Hassan', type: 'Passport', status: 'pending', uploadedAt: '2024-03-12', bookingRef: 'DRV-2024-004' },
];

export default function AdminDocuments() {
  const { t } = useApp();
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = statusFilter
    ? mockDocuments.filter(d => d.status === statusFilter)
    : mockDocuments;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">{t('documents')}</h1>
        <p className="text-text-secondary text-sm">{mockDocuments.length} documents uploaded</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['', 'pending', 'approved', 'rejected'].map(status => (
          <button key={status} onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === status ? 'bg-primary text-white' : 'bg-white text-text-secondary border border-border hover:border-primary/30'
            }`}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : t('viewAll')}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filtered.map(doc => (
          <div key={doc.id} className="bg-white rounded-2xl p-5 border border-border hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-tertiary rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-text-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-primary text-sm">{doc.type}</h3>
                    <StatusBadge status={doc.status} />
                  </div>
                  <p className="text-sm text-text-secondary">{doc.customerName}</p>
                  <p className="text-xs text-text-muted">Booking: {doc.bookingRef} • Uploaded: {doc.uploadedAt}</p>
                  {doc.reason && (
                    <p className="text-xs text-error mt-1">Reason: {doc.reason}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-primary transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-primary transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                {doc.status === 'pending' && (
                  <>
                    <Button variant="primary" size="sm">
                      <CheckCircle className="w-3.5 h-3.5 me-1" /> Approve
                    </Button>
                    <Button variant="danger" size="sm">
                      <XCircle className="w-3.5 h-3.5 me-1" /> Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

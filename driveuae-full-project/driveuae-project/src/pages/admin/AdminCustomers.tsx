import React, { useState } from 'react';
import { useApp } from '../../core/context';
import { bookings, cars } from '../../data/mockData';
import { Search, User, Mail, Phone, Eye } from 'lucide-react';

const mockCustomers = [
  { id: 'user1', fullName: 'Ahmed Al Maktoum', email: 'ahmed@example.com', phone: '+971501234567', bookings: 2, joined: '2024-01-10' },
  { id: 'user2', fullName: 'Sarah Johnson', email: 'sarah@example.com', phone: '+971559876543', bookings: 1, joined: '2023-10-05' },
  { id: 'user3', fullName: 'Raj Patel', email: 'raj@example.com', phone: '+971523456789', bookings: 3, joined: '2023-06-20' },
  { id: 'user4', fullName: 'Fatima Hassan', email: 'fatima@example.com', phone: '+971567891234', bookings: 1, joined: '2024-02-15' },
  { id: 'user5', fullName: 'Mohammed Ali', email: 'mali@example.com', phone: '+971504567890', bookings: 4, joined: '2023-03-12' },
];

export default function AdminCustomers() {
  const { t } = useApp();
  const [search, setSearch] = useState('');

  const filtered = mockCustomers.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">{t('manageCustomers')}</h1>
        <p className="text-text-secondary text-sm">{mockCustomers.length} registered customers</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface-secondary">
                <th className="text-start p-4 text-xs font-medium text-text-muted uppercase">Customer</th>
                <th className="text-start p-4 text-xs font-medium text-text-muted uppercase">Contact</th>
                <th className="text-start p-4 text-xs font-medium text-text-muted uppercase">Bookings</th>
                <th className="text-start p-4 text-xs font-medium text-text-muted uppercase">Joined</th>
                <th className="text-end p-4 text-xs font-medium text-text-muted uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-surface-secondary transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <p className="font-medium text-primary text-sm">{customer.fullName}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-text-secondary">{customer.email}</p>
                    <p className="text-xs text-text-muted">{customer.phone}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-primary">{customer.bookings}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-text-secondary">{customer.joined}</span>
                  </td>
                  <td className="p-4 text-end">
                    <button className="p-2 rounded-lg hover:bg-surface-tertiary text-text-muted hover:text-primary transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

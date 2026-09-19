import React, { useState, useEffect } from 'react';
import { useApp } from '../../core/context';
import { cars, bookings, leads } from '../../data/mockData';
import { StatCard } from '../../components/ui';
import {
  Car as CarIcon, Calendar, CheckCircle, Clock, AlertCircle, Users,
  TrendingUp, DollarSign, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const { t } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const totalCars = cars.length;
  const availableCars = cars.filter(c => c.status === 'available').length;
  const rentedCars = cars.filter(c => c.status === 'rented').length;
  const activeRentals = bookings.filter(b => b.status === 'active').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const totalRevenue = bookings.filter(b => ['active', 'completed'].includes(b.status)).reduce((sum, b) => sum + b.totalAmount, 0);

  // Chart data
  const monthlyData = [
    { month: 'Jan', bookings: 12, revenue: 45000 },
    { month: 'Feb', bookings: 18, revenue: 62000 },
    { month: 'Mar', bookings: 15, revenue: 55000 },
    { month: 'Apr', bookings: 22, revenue: 78000 },
    { month: 'May', bookings: 28, revenue: 95000 },
    { month: 'Jun', bookings: 25, revenue: 88000 },
  ];

  const fleetData = [
    { name: t('available'), value: availableCars, color: '#10B981' },
    { name: t('rented'), value: rentedCars, color: '#3B82F6' },
    { name: t('maintenance'), value: cars.filter(c => c.status === 'maintenance').length, color: '#F59E0B' },
    { name: t('inactive'), value: cars.filter(c => c.status === 'inactive').length, color: '#94A3B8' },
  ];

  const recentBookings = bookings.slice(0, 5);
  const recentLeads = leads.slice(0, 5);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary">{t('adminDashboard')}</h1>
        <p className="text-text-secondary text-sm mt-1">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CarIcon} label={t('totalCars')} value={totalCars} color="primary" />
        <StatCard icon={CheckCircle} label={t('availableCars')} value={availableCars} color="success" />
        <StatCard icon={Calendar} label={t('activeRentals')} value={activeRentals} color="info" />
        <StatCard icon={Clock} label={t('pendingBookings')} value={pendingBookings} color="warning" />
        <StatCard icon={TrendingUp} label={t('newLeads')} value={newLeads} color="accent" />
        <StatCard icon={DollarSign} label={t('revenue')} value={`AED ${totalRevenue.toLocaleString()}`} color="success" change="+12%" />
        <StatCard icon={Users} label={t('rentedCars')} value={rentedCars} color="info" />
        <StatCard icon={Activity} label={t('utilization')} value={`${Math.round((rentedCars / totalCars) * 100)}%`} color="primary" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h3 className="font-semibold text-primary mb-4">Bookings Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#0A2540" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fleet Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h3 className="font-semibold text-primary mb-4">Fleet Status</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={fleetData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {fleetData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-primary">{t('manageBookings')}</h3>
            <span className="text-xs text-text-muted">{bookings.length} total</span>
          </div>
          <div className="divide-y divide-border">
            {recentBookings.map(booking => {
              const car = cars.find(c => c.id === booking.carId);
              return (
                <div key={booking.id} className="p-4 flex items-center justify-between hover:bg-surface-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={car?.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium text-primary">{car?.title}</p>
                      <p className="text-xs text-text-muted">{booking.bookingReference}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === 'active' ? 'bg-emerald-50 text-emerald-700' :
                    booking.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{booking.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-primary">{t('manageLeads')}</h3>
            <span className="text-xs text-text-muted">{leads.length} total</span>
          </div>
          <div className="divide-y divide-border">
            {recentLeads.map(lead => (
              <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-surface-secondary transition-colors">
                <div>
                  <p className="text-sm font-medium text-primary">{lead.customerName}</p>
                  <p className="text-xs text-text-muted">{lead.source} • {lead.durationMonths} months</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  lead.status === 'new' ? 'bg-blue-50 text-blue-700' :
                  lead.status === 'contacted' ? 'bg-purple-50 text-purple-700' :
                  lead.status === 'interested' ? 'bg-indigo-50 text-indigo-700' :
                  'bg-amber-50 text-amber-700'
                }`}>{lead.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

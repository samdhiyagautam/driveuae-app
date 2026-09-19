import React from 'react';
import { useApp } from '../core/context';
import { Button } from '../components/ui';
import { User, Mail, Phone, Globe, LogOut, Shield, ChevronRight } from 'lucide-react';

export default function Profile() {
  const { t, user, language, setLanguage, logout } = useApp();

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-primary mb-6">{t('myProfile')}</h1>

        {/* User Info */}
        <div className="bg-white rounded-2xl p-6 border border-border mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">{user?.fullName || 'Guest User'}</h2>
              <p className="text-text-secondary text-sm">{user?.email || 'guest@driveuae.com'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary">
              <Mail className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">{t('email')}</p>
                <p className="font-medium text-primary">{user?.email || 'guest@driveuae.com'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary">
              <Phone className="w-5 h-5 text-text-muted" />
              <div>
                <p className="text-xs text-text-muted">{t('phone')}</p>
                <p className="font-medium text-primary">{user?.phone || '+971 50 123 4567'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-primary">{t('settings')}</h3>
          </div>

          {/* Language */}
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-text-muted" />
              <div>
                <p className="font-medium text-primary">{t('language')}</p>
                <p className="text-sm text-text-muted">{language === 'en' ? t('english') : t('arabic')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  language === 'en' ? 'bg-primary text-white' : 'bg-surface-tertiary text-text-secondary'
                }`}>EN</button>
              <button onClick={() => setLanguage('ar')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  language === 'ar' ? 'bg-primary text-white' : 'bg-surface-tertiary text-text-secondary'
                }`}>عربي</button>
            </div>
          </div>

          {/* Role */}
          <div className="p-4 flex items-center gap-3">
            <Shield className="w-5 h-5 text-text-muted" />
            <div>
              <p className="font-medium text-primary">Account Type</p>
              <p className="text-sm text-text-muted capitalize">{user?.role || 'customer'}</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button variant="danger" fullWidth onClick={logout}>
          <LogOut className="w-4 h-4 me-2" />
          {t('logout')}
        </Button>
      </div>
    </div>
  );
}

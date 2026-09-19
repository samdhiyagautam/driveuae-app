import React, { useState } from 'react';
import { useApp } from '../core/context';
import { Button, Input } from '../components/ui';
import { MessageCircle, Phone, Mail, HelpCircle, Send, ChevronDown } from 'lucide-react';

export default function Support() {
  const { t } = useApp();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const faqs = [
    { q: 'What documents do I need?', a: 'Emirates ID, valid driving license, and passport copy.' },
    { q: 'What is the minimum rental period?', a: 'The minimum rental period is 1 month.' },
    { q: 'Is insurance included?', a: 'Basic insurance is included. Comprehensive coverage available at additional cost.' },
    { q: 'Can I extend my rental?', a: 'Yes, contact us at least 7 days before your rental ends.' },
    { q: 'What is the security deposit?', a: 'Security deposit varies by vehicle and is fully refundable upon return.' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-primary mb-2">{t('support')}</h1>
        <p className="text-text-secondary mb-8">{t('contactUs')}</p>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <a href="https://wa.me/971501234567" target="_blank" rel="noopener noreferrer"
            className="bg-white rounded-2xl p-6 border border-border hover:border-emerald-200 hover:shadow-md transition-all text-center group">
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-100 transition-colors">
              <MessageCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-primary">{t('whatsapp')}</h3>
            <p className="text-sm text-text-muted mt-1">+971 50 123 4567</p>
          </a>
          <a href="tel:+971501234567"
            className="bg-white rounded-2xl p-6 border border-border hover:border-blue-200 hover:shadow-md transition-all text-center group">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 transition-colors">
              <Phone className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-semibold text-primary">{t('callUs')}</h3>
            <p className="text-sm text-text-muted mt-1">+971 4 123 4567</p>
          </a>
          <a href="mailto:info@driveuae.com"
            className="bg-white rounded-2xl p-6 border border-border hover:border-purple-200 hover:shadow-md transition-all text-center group">
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-100 transition-colors">
              <Mail className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="font-semibold text-primary">{t('emailUs')}</h3>
            <p className="text-sm text-text-muted mt-1">info@driveuae.com</p>
          </a>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-8">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-bold text-primary">{t('faq')}</h2>
          </div>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-start hover:bg-surface-secondary transition-colors">
                  <span className="font-medium text-primary">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-text-muted transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-text-secondary text-sm animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          <h2 className="text-xl font-bold text-primary mb-4">{t('send')} {t('message')}</h2>
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-success" />
              </div>
              <p className="font-semibold text-primary">Message sent successfully!</p>
              <p className="text-text-secondary text-sm mt-2">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Input label={t('fullName')} placeholder="Your name" />
              <Input label={t('email')} type="email" placeholder="name@example.com" />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-text-primary">{t('message')}</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
              <Button variant="primary" size="lg" fullWidth onClick={() => setSent(true)}>
                <Send className="w-4 h-4 me-2" />
                {t('send')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

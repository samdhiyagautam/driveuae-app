import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../core/context';
import { Button, Input } from '../components/ui';
import { Car, Mail, Lock, Phone, ArrowRight } from 'lucide-react';

export default function Login() {
  const { t, signInWithPassword, signUpWithPassword, sendPhoneOtp, verifyPhoneOtp, signInWithGoogle } = useApp();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleEmailLogin = async () => {
    setError('');
    setLoading(true);
    const result = isRegister
      ? await signUpWithPassword(fullName, email, password)
      : await signInWithPassword(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    if (isRegister) {
      // With email confirmation enabled (Supabase default) there's no
      // session yet right after sign-up -- let the person know instead of
      // silently doing nothing.
      setInfo('Account created. Check your email to confirm, then log in.');
      setIsRegister(false);
      return;
    }
    navigate('/');
  };

  const handlePhoneLogin = async () => {
    setError('');
    setLoading(true);
    if (!otpSent) {
      const result = await sendPhoneOtp(phone);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      setOtpSent(true);
    } else {
      const result = await verifyPhoneOtp(phone, otp);
      setLoading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const result = await signInWithGoogle();
    // On success this redirects away immediately, so there's nothing more
    // to do here -- only a synchronous failure (e.g. Google not enabled
    // for this project) surfaces an error before that happens.
    if (result.error) setError(result.error);
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-primary">
            {isRegister ? t('registerTitle') : t('loginTitle')}
          </h1>
          <p className="text-text-secondary mt-2">
            {isRegister ? t('registerSubtitle') : t('loginSubtitle')}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 border border-border">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
          )}
          {info && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">{info}</div>
          )}

          {!isPhoneLogin ? (
            <div className="space-y-4">
              {isRegister && (
                <Input label={t('fullName')} value={fullName} onChange={setFullName} required />
              )}
              <Input
                label={t('email')}
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={setEmail}
                icon={<Mail className="w-4 h-4" />}
                required
              />
              <Input
                label={t('password')}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                icon={<Lock className="w-4 h-4" />}
                required
              />
              {!isRegister && (
                <div className="text-end">
                  <button className="text-sm text-accent font-medium hover:underline">{t('forgotPassword')}</button>
                </div>
              )}
              <Button variant="primary" size="lg" fullWidth onClick={handleEmailLogin} disabled={loading}>
                {loading ? t('loading') : (isRegister ? t('register') : t('login'))} <ArrowRight className="w-4 h-4 ms-2 flip-rtl" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                label={t('phone')}
                type="tel"
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={setPhone}
                icon={<Phone className="w-4 h-4" />}
                required
              />
              {otpSent && (
                <Input
                  label={t('phoneOtp')}
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={setOtp}
                />
              )}
              <Button variant="primary" size="lg" fullWidth onClick={handlePhoneLogin} disabled={loading}>
                {loading ? t('loading') : (otpSent ? t('verifyOtp') : t('sendOtp'))}
              </Button>
            </div>
          )}

          {/* Google */}
          <div className="mt-4">
            <Button variant="outline" size="lg" fullWidth onClick={handleGoogleLogin}>
              Continue with Google
            </Button>
          </div>

          {/* Toggle methods */}
          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <button onClick={() => { setError(''); setIsPhoneLogin(!isPhoneLogin); setOtpSent(false); }}
              className="w-full text-center text-sm text-text-secondary hover:text-primary transition-colors">
              {isPhoneLogin ? `${t('login')} with ${t('email')}` : `${t('login')} with ${t('phone')}`}
            </button>
            <div className="text-center text-sm text-text-secondary">
              {isRegister ? t('alreadyHaveAccount') : t('dontHaveAccount')}{' '}
              <button onClick={() => { setError(''); setIsRegister(!isRegister); }} className="text-accent font-medium hover:underline">
                {isRegister ? t('login') : t('register')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from './localization';
import { supabase } from './supabaseClient';
import type { Session } from '@supabase/supabase-js';

interface AppState {
  language: Language;
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  onboardingComplete: boolean;
  authLoading: boolean;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
}

type AuthResult = { error: string | null };

interface AppContextType extends AppState {
  t: (key: TranslationKey) => string;
  setLanguage: (lang: Language) => void;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  isRTL: boolean;
  // Real Supabase Auth actions (replace the old localStorage-based `login`)
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (fullName: string, email: string, password: string) => Promise<AuthResult>;
  sendPhoneOtp: (phone: string) => Promise<AuthResult>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
}

const AppContext = createContext<AppContextType | null>(null);

// Builds the User the rest of the app expects from a `profiles` row.
// Falls back to whatever Supabase Auth knows if the profile row hasn't
// been created yet (e.g. the auto-create-profile trigger isn't applied).
async function loadUserForSession(session: Session): Promise<User> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || !profile) {
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('Could not load profile row for signed-in user:', error.message);
    }
    return {
      id: session.user.id,
      fullName: (session.user.user_metadata?.full_name as string) || 'Customer',
      email: session.user.email || '',
      phone: session.user.phone || '',
      role: 'customer',
    };
  }

  return {
    id: profile.id,
    fullName: profile.full_name || 'Customer',
    email: profile.email || '',
    phone: profile.phone || '',
    role: profile.role,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const savedLang = (localStorage.getItem('driveuae_lang') as Language) || 'en';
    const onboarded = localStorage.getItem('driveuae_onboarded') === 'true';
    return {
      language: savedLang,
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      onboardingComplete: onboarded,
      authLoading: true,
    };
  });

  const isRTL = state.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = state.language;
  }, [isRTL, state.language]);

  // Real auth session handling: check once on load, then react to sign-in /
  // sign-out / token refresh for as long as the app is open.
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      if (session) {
        const user = await loadUserForSession(session);
        if (!active) return;
        setState(prev => ({ ...prev, isAuthenticated: true, isAdmin: user.role === 'admin', user, authLoading: false }));
      } else {
        setState(prev => ({ ...prev, isAuthenticated: false, isAdmin: false, user: null, authLoading: false }));
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      if (session) {
        const user = await loadUserForSession(session);
        if (!active) return;
        setState(prev => ({ ...prev, isAuthenticated: true, isAdmin: user.role === 'admin', user, authLoading: false }));
      } else {
        setState(prev => ({ ...prev, isAuthenticated: false, isAdmin: false, user: null, authLoading: false }));
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[state.language][key] || key;
  }, [state.language]);

  const setLanguage = useCallback((lang: Language) => {
    localStorage.setItem('driveuae_lang', lang);
    setState(prev => ({ ...prev, language: lang }));
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    // onAuthStateChange handles clearing state
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem('driveuae_onboarded', 'true');
    setState(prev => ({ ...prev, onboardingComplete: true }));
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }, []);

  const signUpWithPassword = useCallback(async (fullName: string, email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error: error ? error.message : null };
  }, []);

  // Phone OTP and Google sign-in need to be enabled for this project in
  // Supabase (Authentication -> Providers) before these will actually
  // succeed -- phone OTP additionally needs an SMS provider (e.g. Twilio)
  // configured there. The calls themselves are real, not mocked.
  const sendPhoneOtp = useCallback(async (phone: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    return { error: error ? error.message : null };
  }, []);

  const verifyPhoneOtp = useCallback(async (phone: string, token: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
    return { error: error ? error.message : null };
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    return { error: error ? error.message : null };
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      t,
      setLanguage,
      logout,
      completeOnboarding,
      isRTL,
      signInWithPassword,
      signUpWithPassword,
      sendPhoneOtp,
      verifyPhoneOtp,
      signInWithGoogle,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

import React, { useState } from 'react';
import { ViewType, UserState } from '../types';
import { Sparkles, Video, Lock, Mail, ArrowRight, Check } from 'lucide-react';
import { t } from '../utils/translator';

interface AuthProps {
  onLoginSuccess: (email: string, tier: 'free' | 'pro') => void;
  setView: (view: ViewType) => void;
  selectedLanguage: string;
}

export default function Auth({ onLoginSuccess, setView, selectedLanguage }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMsg(t('Please fully fill out the form.', selectedLanguage));
      return;
    }

    // Retrieve accounts
    const savedAccountsRaw = localStorage.getItem('viralflow_accounts');
    const accounts = savedAccountsRaw ? JSON.parse(savedAccountsRaw) : {};

    if (isLogin) {
      // Simple Login
      const userObj = accounts[cleanEmail];
      if (!userObj) {
        setErrorMsg(t('Email not observed. Please toggle to Sign Up first.', selectedLanguage));
        return;
      }
      if (userObj.password !== password) {
        setErrorMsg(t('Incorrect authentication secret password.', selectedLanguage));
        return;
      }

      onLoginSuccess(cleanEmail, userObj.tier);
      setView('dashboard');
    } else {
      // Sign Up
      if (accounts[cleanEmail]) {
        setErrorMsg(t('Credential email already registered.', selectedLanguage));
        return;
      }

      // Save user
      accounts[cleanEmail] = {
        email: cleanEmail,
        password,
        tier: selectedPlan
      };
      localStorage.setItem('viralflow_accounts', JSON.stringify(accounts));

      setSuccessMsg(t('Account registered successfully! Redirecting...', selectedLanguage));
      setTimeout(() => {
        onLoginSuccess(cleanEmail, selectedPlan);
        setView('dashboard');
      }, 1000);
    }
  };

  // Pre-fill a sample user on mount or double click to allow easy testing
  const handlePrefillDemo = (demoType: 'free' | 'pro') => {
    const demoEmail = demoType === 'free' ? 'free@viralflow.co' : 'creator@viralflow.co';
    const demoPassword = 'password123';
    
    // Auto register demo if doesn't exist
    const savedAccountsRaw = localStorage.getItem('viralflow_accounts');
    const accounts = savedAccountsRaw ? JSON.parse(savedAccountsRaw) : {};
    
    accounts[demoEmail] = {
      email: demoEmail,
      password: demoPassword,
      tier: demoType
    };
    localStorage.setItem('viralflow_accounts', JSON.stringify(accounts));

    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLogin(true);
    
    // Quick success message cue
    setSuccessMsg(t('Auto-filled demo credentials!', selectedLanguage));
    setTimeout(() => {
      onLoginSuccess(demoEmail, demoType);
      setView('dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-zinc-50/50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-[linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:100%_4rem] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white shadow-sm ring-1 ring-black/10">
            <Video className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-sans text-2xl font-bold tracking-tight text-zinc-950">
            {isLogin ? t('Sign in to ViralFlow', selectedLanguage) : t('Create your studio account', selectedLanguage)}
          </h2>
          <p className="mt-1 font-sans text-xs text-zinc-400">
            {t('Escape creative stagnation. Deploy viral short-form systems.', selectedLanguage)}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs">
          {errorMsg && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-sans text-red-600 ring-1 ring-red-100">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-sans text-emerald-700 ring-1 ring-emerald-100 flex items-center gap-1.5">
              <Check className="h-4 w-4" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block font-sans text-xs font-bold text-zinc-700">{t('Email Address', selectedLanguage)}</label>
              <div className="mt-1.5 relative">
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 pl-9 font-sans text-sm text-zinc-950 shadow-2xs placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
                />
                <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs font-bold text-zinc-700">{t('Password', selectedLanguage)}</label>
              <div className="mt-1.5 relative">
                <input
                  id="auth-pwd-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 pl-9 font-sans text-sm text-zinc-950 shadow-2xs placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
                />
                <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
              </div>
            </div>

            {/* Plan switcher on signup */}
            {!isLogin && (
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                <label className="block font-sans text-xs font-bold text-zinc-700">{t('Subscription Tier', selectedLanguage)}</label>
                <div className="mt-2.5 grid grid-cols-2 gap-3">
                  <button
                    id="plan-f"
                    type="button"
                    onClick={() => setSelectedPlan('free')}
                    className={`rounded-lg border p-3 text-left transition-all cursor-pointer ${
                      selectedPlan === 'free'
                        ? 'border-black bg-white ring-1 ring-black'
                        : 'border-zinc-200 bg-zinc-50'
                    }`}
                  >
                    <span className="block font-sans text-xs font-bold text-black">{t('Free Tier', selectedLanguage)}</span>
                    <span className="mt-1 block font-sans text-[10px] text-zinc-500">{t('5 runs/day, 5 saves', selectedLanguage)}</span>
                  </button>
                  <button
                    id="plan-p"
                    type="button"
                    onClick={() => setSelectedPlan('pro')}
                    className={`rounded-lg border p-3 text-left transition-all relative cursor-pointer ${
                      selectedPlan === 'pro'
                        ? 'border-black bg-white ring-1 ring-black'
                        : 'border-zinc-200 bg-zinc-50'
                    }`}
                  >
                    <span className="block font-sans text-xs font-bold text-black">{t('Pro Tier', selectedLanguage)}</span>
                    <span className="mt-1 block font-sans text-[10px] text-zinc-500">{t('$9/mo, unlimited runs', selectedLanguage)}</span>
                    <span className="absolute top-1 right-1.5 rounded bg-black px-1.5 py-0.2 font-mono text-[8px] font-bold text-white">PRO</span>
                  </button>
                </div>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              className="mt-2 w-full rounded-lg bg-black py-2.5 text-center font-sans text-xs font-bold text-white hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>{isLogin ? t('Sign In', selectedLanguage) : t('Create Account', selectedLanguage)}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-4 text-center space-y-3">
            <button
              id="auth-toggle-btn"
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
              }}
              className="font-sans text-xs text-zinc-500 hover:text-black hover:underline cursor-pointer block mx-auto"
            >
              {isLogin ? t("Don't have an account? Sign Up", selectedLanguage) : t("Already registered? Sign In", selectedLanguage)}
            </button>
            <div className="text-zinc-300 font-sans text-[10px] uppercase tracking-wider select-none">— {t('Or', selectedLanguage)} —</div>
            <button
              id="auth-guest-btn"
              type="button"
              onClick={() => setView('dashboard')}
              className="w-full rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 py-2.5 font-sans text-xs font-bold text-zinc-800 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              🚀 {t('Explore as Guest (No Registration Required)', selectedLanguage)}
            </button>
          </div>
        </div>

        {/* Demo Quickfill Sandbox */}
        <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 text-center">
          <p className="font-mono text-[10.5px] font-bold text-zinc-400 uppercase tracking-widest">
            {t('Sandbox Sandbox Controls', selectedLanguage)}
          </p>
          <p className="mt-1 font-sans text-[11px] text-zinc-500">
            {t('No password check required for sandbox accounts. Double-click below to test instant modes:', selectedLanguage)}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              id="autofill-free-btn"
              onClick={() => handlePrefillDemo('free')}
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 font-sans text-[11px] text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              🔑 {t('Sandbox Free', selectedLanguage)}
            </button>
            <button
              id="autofill-pro-btn"
              onClick={() => handlePrefillDemo('pro')}
              className="flex-1 rounded-lg border border-black/10 bg-black px-2.5 py-1.5 font-sans text-[11px] font-bold text-white transition-opacity hover:opacity-95"
            >
              👑 {t('Sandbox Pro', selectedLanguage)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

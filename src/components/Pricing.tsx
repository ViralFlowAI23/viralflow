import React, { useState } from 'react';
import { ViewType, UserState } from '../types';
import { Check, Crown, ChevronDown, Rocket, CheckCircle } from 'lucide-react';
import { t } from '../utils/translator';

interface PricingProps {
  user: UserState;
  setView: (view: ViewType) => void;
  onUpgradeSuccess: () => void;
  selectedLanguage: string;
}

export default function Pricing({ user, setView, onUpgradeSuccess, selectedLanguage }: PricingProps) {
  const [toastMsg, setToastMsg] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleSandboxUpgrade = () => {
    onUpgradeSuccess();
    triggerToast(t("👑 Premium Upgrade Succeeded! sandbox session elevated to Pro plan.", selectedLanguage));
  };

  const faqItems = [
    {
      q: "Is there a real contract or recurring billing for sandbox test accounts?",
      a: "No. This is a sandbox environment. Selecting the $9 subscription instantly updates your local storage account metadata for trial purposes. There are zero charge integrations."
    },
    {
      q: "What makes the dual-track scripts 'Advanced' on Pro?",
      a: "Pro scripts extend timing formats to a continuous 60 seconds, write detailed scene transition visuals alongside customized hashtags, and unlock highly engaging emotional angles like POV storytelling, suspense, and luxury frameworks."
    },
    {
      q: "Can I transition back to the Free plan?",
      a: "Yes! If you wish to test rate limit boundaries on the Free tier again, simply log out or click to register a separate sandbox Free account."
    }
  ];

  return (
    <div className="space-y-12 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-black px-4 py-3 font-sans text-xs font-semibold text-white shadow-xl flex items-center gap-1.5 ring-1 ring-white/10">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center space-y-4">
        <h1 className="font-sans text-3xl font-black text-zinc-950 sm:text-4xl tracking-tight">
          {t("Flexible Plans for Growing Creators", selectedLanguage)}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
          {t("Start for free to test output styles, then upgrade to escape run limitations and unlock premium storyboards.", selectedLanguage)}
        </p>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-3xl mx-auto">
        
        {/* Card 1: Free Tier */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="font-sans text-sm font-bold text-zinc-500">{t("Free Sandbox", selectedLanguage)}</span>
              <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[9px] font-semibold text-zinc-500 uppercase">{t("Starter", selectedLanguage)}</span>
            </div>

            <div className="mt-4 flex items-baseline">
              <span className="font-sans text-4xl font-extrabold text-black">$0</span>
              <span className="ml-1 text-zinc-400 font-sans text-xs font-medium">/ {t("forever", selectedLanguage)}</span>
            </div>
            <p className="mt-1.5 font-sans text-xs text-zinc-400 leading-normal">
              {t("Ideal for triaging hook structures and exploring primary styles in the workspace.", selectedLanguage)}
            </p>

            <div className="mt-6 space-y-3 border-t border-zinc-100 pt-5">
              {[
                "5 generative runs per day limit",
                "Basic ideas (educational, funny codes)",
                "Up to 5 total items saved in workspace slot",
                "Limit checks active",
                "Basic short 30s scripts only"
              ].map((pill, idx) => (
                <div key={idx} className="flex items-center gap-2 text-zinc-600 text-xs">
                  <Check className="h-4 w-4 text-zinc-400 shrink-0" />
                  <span>{t(pill, selectedLanguage)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {user.tier === 'free' ? (
              <button
                id="free-plan-active-btn"
                disabled
                className="w-full rounded-lg bg-zinc-100 py-2.5 text-center font-sans text-xs font-bold text-zinc-400"
              >
                {t("Current Sandbox Plan", selectedLanguage)}
              </button>
            ) : (
              <button
                id="free-plan-downgrade-btn"
                onClick={() => setView('dashboard')}
                className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 text-center font-sans text-xs font-bold text-black hover:bg-zinc-50 transition-colors"
              >
                {t("Access Dashboard Console", selectedLanguage)}
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Pro Tier */}
        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-sm relative flex flex-col justify-between">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black px-3 py-0.5 font-mono text-[9px] font-bold text-white uppercase tracking-wider">
            {t("Most Selected Choice", selectedLanguage)}
          </span>

          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="font-sans text-sm font-bold text-black flex items-center gap-1">
                <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />
                ViralFlow Pro
              </span>
              <span className="rounded bg-black px-2 py-0.5 font-mono text-[9px] font-bold text-white uppercase">{t("PREMIUM", selectedLanguage)}</span>
            </div>

            <div className="mt-4 flex items-baseline">
              <span className="font-sans text-4xl font-extrabold text-black">$9</span>
              <span className="ml-1 text-zinc-400 font-sans text-xs font-medium">/ {t("month", selectedLanguage)}</span>
            </div>
            <p className="mt-1.5 font-sans text-xs text-zinc-500 leading-normal">
              {t("Designed for high-output digital creators, agencies, and micro-influencers.", selectedLanguage)}
            </p>

            <div className="mt-6 space-y-3 border-t border-zinc-100 pt-5">
              {[
                "Unlimited generative runs daily",
                "Advanced scripts (funny, luxury, suspense, motivation)",
                "Full long-form 60s scripting engines",
                "Unlimited saved workspace items",
                "Advanced emotional hook frameworks",
                "Priority cloud processing speed",
                "Premium customer support indicators"
              ].map((pill, idx) => (
                <div key={idx} className="flex items-center gap-2 text-zinc-950 text-xs font-medium">
                  <Check className="h-4 w-4 text-black shrink-0" />
                  <span>{t(pill, selectedLanguage)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {user.tier === 'pro' ? (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 py-2 text-center font-sans text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>{t("Active Pro Membership", selectedLanguage)}</span>
              </div>
            ) : (
              <button
                id="pricing-upgrade-action-btn"
                onClick={handleSandboxUpgrade}
                className="w-full rounded-lg bg-black py-2.5 text-center font-sans text-xs font-bold text-white hover:opacity-90 shadow-sm transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Rocket className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>{t("Upgrade to Pro now", selectedLanguage)}</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Pricing FAQs Accordion */}
      <div className="mt-16 border-t border-zinc-100 pt-12 max-w-2xl mx-auto">
        <h3 className="font-sans text-xl font-bold text-zinc-950 text-center">{t("Pricing Questions", selectedLanguage)}</h3>
        <div className="mt-8 space-y-3">
          {faqItems.map((item, idx) => {
            const active = activeFaq === idx;
            return (
              <div key={idx} className="rounded-lg border border-zinc-100 bg-white">
                <button
                  id={`pricing-faq-btn-${idx}`}
                  onClick={() => setActiveFaq(active ? null : idx)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left font-sans text-xs sm:text-sm font-semibold text-zinc-900 hover:bg-zinc-50/60"
                >
                  <span>{t(item.q, selectedLanguage)}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-zinc-400 transition-transform ${active ? 'rotate-180 text-black' : ''}`} />
                </button>
                {active && (
                  <div className="px-5 pb-4 text-xs font-sans text-zinc-500 leading-relaxed border-t border-zinc-50/50 pt-2.5">
                    {t(item.a, selectedLanguage)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

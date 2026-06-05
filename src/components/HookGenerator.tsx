import React, { useState, useEffect } from 'react';
import { ViewType, UserState, SavedHook } from '../types';
import { generateHooks } from '../utils/generators';
import { LANGUAGES, translateObject, translateText, t } from '../utils/translator';
import { 
  Sparkles, 
  Search, 
  Copy, 
  Check, 
  Save, 
  BookmarkCheck, 
  RefreshCw, 
  Loader2, 
  CheckCircle,
  HelpCircle,
  Zap
} from 'lucide-react';

interface HookGeneratorProps {
  user: UserState;
  setView: (view: ViewType) => void;
  incrementGeneration: () => boolean;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export default function HookGenerator({ user, setView, incrementGeneration, selectedLanguage, onLanguageChange }: HookGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hooks, setHooks] = useState<{ id: string; topic: string; category: string; hook: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Curiosity Gap' | 'Negative Framework / Danger' | 'Authority / Elite' | 'Immediate Return / Speed' | 'Relatable / Emotional Truth'>('All');
  
  const [savedHookIds, setSavedHookIds] = useState<string[]>([]);
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});
  const [toastMsg, setToastMsg] = useState('');
  const [limitReached, setLimitReached] = useState(false);

  // Load saved hook IDs
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('viralflow_hooks') || '[]');
      const ids = stored.map((x: any) => x.id);
      setSavedHookIds(ids);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCopy = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopyStates({ ...copyStates, [id]: true });
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [id]: false }));
    }, 1500);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLimitReached(false);

    const allowed = incrementGeneration();
    if (!allowed && user.tier === 'free') {
      setLimitReached(true);
      return;
    }

    setIsGenerating(true);
    setHooks([]);

    setTimeout(() => {
      const results = generateHooks(topic);
      const translated = translateObject(results, selectedLanguage);
      setHooks(translated);
      setIsGenerating(false);
      triggerToast(t("Generated 20 professional hooks!", selectedLanguage));
    }, 1100);
  };

  const handleSaveHook = (hk: { id: string; topic: string; category: string; hook: string }) => {
    try {
      const stored = JSON.parse(localStorage.getItem('viralflow_hooks') || '[]');
      
      if (savedHookIds.includes(hk.id)) {
        // Unsave
        const updated = stored.filter((x: any) => x.id !== hk.id);
        localStorage.setItem('viralflow_hooks', JSON.stringify(updated));
        setSavedHookIds(savedHookIds.filter(id => id !== hk.id));
        triggerToast(t("Removed hook from saved workspace.", selectedLanguage));
      } else {
        // Save limit check
        if (user.tier === 'free' && stored.length >= 5) {
          triggerToast(t("⚠️ Free Plan allows max 5 workspace saves. Upgrade to Pro!", selectedLanguage));
          return;
        }

        // Save
        const hookWithDate = { ...hk, savedAt: new Date().toISOString() };
        stored.push(hookWithDate);
        localStorage.setItem('viralflow_hooks', JSON.stringify(stored));
        setSavedHookIds([...savedHookIds, hk.id]);
        triggerToast(t("Hook added to Saved Workspace!", selectedLanguage));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const tabs: Array<'All' | 'Curiosity Gap' | 'Negative Framework / Danger' | 'Authority / Elite' | 'Immediate Return / Speed' | 'Relatable / Emotional Truth'> = [
    'All',
    'Curiosity Gap',
    'Negative Framework / Danger',
    'Authority / Elite',
    'Immediate Return / Speed',
    'Relatable / Emotional Truth'
  ];

  // Filtered hooks list
  const filteredHooks = activeTab === 'All' 
    ? hooks 
    : hooks.filter((h) => 
        h.category.startsWith(activeTab.split(' ')[0]) || 
        h.category === translateText(activeTab, selectedLanguage)
      );

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-black px-4 py-3 font-sans text-xs font-semibold text-white shadow-xl flex items-center gap-1.5 ring-1 ring-white/10 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-black text-zinc-950 sm:text-3xl tracking-tight">
            {t("Hook Blueprint Machine", selectedLanguage)}
          </h1>
          <p className="font-sans text-xs text-zinc-500 mt-1">
            {t("Generate 2 concept hooks utilizing psychological attention hooks.", selectedLanguage).replace("2 ", "20 ")}
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-lg ring-1 ring-zinc-200/50">
          <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>{t("Platform limits:", selectedLanguage)} {user.tier === 'free' ? t('5 daily runs', selectedLanguage) : t('No controls active', selectedLanguage)}</span>
        </div>
      </div>

      {limitReached && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/50 p-6 shadow-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-sans text-sm font-bold text-amber-900">{t("Hook Limit Achieved", selectedLanguage)}</h3>
            <p className="mt-1 font-sans text-xs text-amber-700 leading-normal">
              {t("You have exhausted your daily 5-generation credits. Secure unlimited premium hook frameworks by subscribing to Pro.", selectedLanguage)}
            </p>
          </div>
          <button
            id="hooks-limit-upgrade"
            onClick={() => setView('pricing')}
            className="rounded-lg bg-black px-4 py-2 font-sans text-xs font-semibold text-white hover:opacity-95 shadow-sm"
          >
            {t("Get Pro $9/mo", selectedLanguage)}
          </button>
        </div>
      )}

      {/* Input Form */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block font-sans text-xs font-bold text-zinc-700">{t("Enter Your Video Topic / Keywords", selectedLanguage)}</label>
              <div className="relative mt-1.5">
                <input
                  id="hooks-topic-input"
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={t("e.g. Remote coding tips, Coffee brewing, Buying a house, Notion tricks", selectedLanguage)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 pl-10 font-sans text-sm text-zinc-950 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
                />
                <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-zinc-400" />
              </div>
            </div>

            <div className="w-full md:w-52">
              <label className="block font-sans text-xs font-bold text-zinc-700">{t("Output Language", selectedLanguage)}</label>
              <select
                id="hooks-lang-select"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 font-sans text-xs text-zinc-950 focus:border-zinc-900 focus:outline-none cursor-pointer h-10"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="hooks-submit-btn"
              type="submit"
              disabled={isGenerating}
              className="w-full md:w-auto rounded-lg bg-black px-5 py-2.5 font-sans text-xs font-bold text-white shadow-xs hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 h-10 shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("Brewing...", selectedLanguage)}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{t("Generate 20 Hooks", selectedLanguage)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {hooks.length > 0 && (
        <div className="space-y-6">
          
          {/* Tab Filters */}
          <div className="flex flex-wrap gap-1.5 border-b border-zinc-100 pb-3">
            {tabs.map((tab) => {
              const active = activeTab === tab;
              const shortLabel = tab === 'Negative Framework / Danger' ? t('⚠️ Negatives', selectedLanguage) 
                : tab === 'Curiosity Gap' ? t('🔎 Curiosity', selectedLanguage) 
                : tab === 'Authority / Elite' ? t('👑 Elite Authority', selectedLanguage) 
                : tab === 'Immediate Return / Speed' ? t('⚡ Immediate', selectedLanguage) 
                : tab === 'Relatable / Emotional Truth' ? t('🤝 Relatable', selectedLanguage) 
                : t('All Angle', selectedLanguage);

              return (
                <button
                  id={`hook-tab-btn-${tab.replace(/\s+/g, '')}`}
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-1.5 font-sans text-xs font-medium cursor-pointer transition-colors ${
                    active 
                      ? 'bg-black text-white' 
                      : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>

          {/* List of hooks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHooks.map((hk) => {
              const copyKey = `hookCopy-${hk.id}`;
              const isSaved = savedHookIds.includes(hk.id);
              return (
                <div 
                  key={hk.id} 
                  className="rounded-xl border border-zinc-200/80 bg-white p-4.5 shadow-3xs hover:border-zinc-300 flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="rounded bg-zinc-50 border border-zinc-100 px-2 py-0.5 font-mono text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                      {t(hk.category, selectedLanguage)}
                    </span>
                    <p className="mt-3 font-sans text-sm font-semibold text-zinc-900 leading-relaxed">
                      "{hk.hook}"
                    </p>
                  </div>

                  <div className="border-t border-zinc-100 pt-3 flex justify-between items-center">
                    <span className="font-mono text-[9px] text-zinc-400">{t("Framework metric: High CTR", selectedLanguage)}</span>
                    <div className="flex items-center gap-1.5">
                      {/* Copy individual */}
                      <button
                        id={`copy-single-hook-${hk.id}`}
                        onClick={() => handleCopy(hk.hook, copyKey)}
                        className="rounded-md border border-zinc-200 bg-white px-2 py-1 flex items-center gap-1 font-sans text-[10px] font-medium text-zinc-500 hover:text-black hover:bg-zinc-50 cursor-pointer"
                      >
                        {copyStates[copyKey] ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span className="text-emerald-700">{t("Copied", selectedLanguage)}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>{t("Copy Hook", selectedLanguage)}</span>
                          </>
                        )}
                      </button>

                      {/* Save individual */}
                      <button
                        id={`save-hk-btn-${hk.id}`}
                        onClick={() => handleSaveHook(hk)}
                        className={`rounded-md px-2 py-1 flex items-center gap-1 font-sans text-[10px] font-medium cursor-pointer ${
                          isSaved
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'border border-zinc-200 hover:bg-zinc-50 text-zinc-500 hover:text-black bg-white'
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="h-3 w-3" /> : <Save className="h-3 w-3" />}
                        <span>{isSaved ? t('Saved', selectedLanguage) : t('Save', selectedLanguage)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty visual state */}
      {!isGenerating && hooks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-100 bg-zinc-50/50 p-12 text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-zinc-300" />
          <p className="mt-4 font-sans text-xs text-zinc-400 font-medium">{t("No hooks calculated yet", selectedLanguage)}</p>
          <p className="mt-1 font-sans text-[11px] text-zinc-500 max-w-xs mx-auto">
            {t("Input a customized keyword set and press generate to evaluate 20 strategic angles. Group them by category.", selectedLanguage)}
          </p>
        </div>
      )}
    </div>
  );
}

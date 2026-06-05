import React, { useState, useEffect } from 'react';
import { ViewType, UserState, HashtagSet, Platform } from '../types';
import { generateHashtags } from '../utils/generators';
import { LANGUAGES, translateObject, t } from '../utils/translator';
import { 
  Hash, 
  Sparkles, 
  Copy, 
  Check, 
  Save, 
  BookmarkCheck, 
  Loader2, 
  CheckCircle,
  HelpCircle,
  Zap,
  Tv,
  Instagram,
  Clapperboard
} from 'lucide-react';

interface HashtagGeneratorProps {
  user: UserState;
  setView: (view: ViewType) => void;
  incrementGeneration: () => boolean;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export default function HashtagGenerator({ user, setView, incrementGeneration, selectedLanguage, onLanguageChange }: HashtagGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('TikTok');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hashtagSet, setHashtagSet] = useState<HashtagSet | null>(null);

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});
  const [toastMsg, setToastMsg] = useState('');
  const [limitMsg, setLimitMsg] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('viralflow_hashtags') || '[]');
      setSavedIds(stored.map((x: any) => x.id));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCopy = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopyStates({ ...copyStates, [key]: true });
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [key]: false }));
    }, 1500);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLimitMsg(false);

    const allowed = incrementGeneration();
    if (!allowed && user.tier === 'free') {
      setLimitMsg(true);
      return;
    }

    setIsGenerating(true);
    setHashtagSet(null);

    setTimeout(() => {
      const res = generateHashtags(topic, platform);
      const translated = translateObject(res, selectedLanguage);
      setHashtagSet(translated);
      setIsGenerating(false);
      triggerToast(t("Created 30 strategic cluster hashtags!", selectedLanguage));
    }, 1200);
  };

  const handleSaveHashtags = () => {
    if (!hashtagSet) return;
    try {
      const stored = JSON.parse(localStorage.getItem('viralflow_hashtags') || '[]');
      
      if (savedIds.includes(hashtagSet.id)) {
        // Unsave
        const updated = stored.filter((x: any) => x.id !== hashtagSet.id);
        localStorage.setItem('viralflow_hashtags', JSON.stringify(updated));
        setSavedIds(savedIds.filter(id => id !== hashtagSet.id));
        triggerToast(t("Removed hashtag cluster from saved saves.", selectedLanguage));
      } else {
        // Save limit
        if (user.tier === 'free' && stored.length >= 5) {
          triggerToast(t("⚠️ Free Plan allows max 5 workspace saves. Upgrade to Pro!", selectedLanguage));
          return;
        }

        const tagsWithDate = { ...hashtagSet, savedAt: new Date().toISOString() };
        stored.push(tagsWithDate);
        localStorage.setItem('viralflow_hashtags', JSON.stringify(stored));
        setSavedIds([...savedIds, hashtagSet.id]);
        triggerToast(t("Optimized hashtag pack secured to Workspace!", selectedLanguage));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isSaved = hashtagSet ? savedIds.includes(hashtagSet.id) : false;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-black px-4 py-3 font-sans text-xs font-semibold text-white shadow-xl flex items-center gap-1.5 ring-1 ring-white/10">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-black text-zinc-950 sm:text-3xl tracking-tight">
            {t("Hashtag Optimizer", selectedLanguage)}
          </h1>
          <p className="font-sans text-xs text-zinc-500 mt-1">
            {t("Generate highly relevant, platform-tailored tag packages partitioned into discoverability levels.", selectedLanguage)}
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-lg ring-1 ring-zinc-200/50">
          <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>{t("Hashtag runs: Free (5 per day)", selectedLanguage)}</span>
        </div>
      </div>

      {limitMsg && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div>
            <h3 className="font-sans text-sm font-bold text-amber-900">{t("Limit Checked", selectedLanguage)}</h3>
            <p className="mt-1 font-sans text-xs text-amber-700 leading-normal">
              {t("You are currently limited to 5 actions. Go Pro to gain unlimited hashtag generation features instantly.", selectedLanguage)}
            </p>
          </div>
          <button
            id="hash-limit-upgrade"
            onClick={() => setView('pricing')}
            className="rounded-lg bg-black px-4 py-2 font-sans text-xs font-bold text-white hover:opacity-90"
          >
            {t("Go Pro for $9/mo", selectedLanguage)}
          </button>
        </div>
      )}

      {/* Inputs Form */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block font-sans text-xs font-bold text-zinc-700">{t("Tag Topic keyword", selectedLanguage)}</label>
            <input
              id="hashtag-topic-input"
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t("e.g. Notion, React Developer, Workout, Foodie", selectedLanguage)}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 font-sans text-sm text-zinc-950 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
            />
          </div>

          <div className="md:col-span-1">
            <label className="block font-sans text-xs font-bold text-zinc-700">{t("Goal Platform Format", selectedLanguage)}</label>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {[
                { value: 'TikTok', icon: Tv, label: 'TikTok' },
                { value: 'Instagram Reels', icon: Instagram, label: 'Instagram' },
                { value: 'YouTube Shorts', icon: Clapperboard, label: 'YouTube' }
              ].map((plat) => {
                const Icon = plat.icon;
                const isSel = platform === plat.value;
                return (
                  <button
                    id={`hash-plat-${plat.value.replace(/\s+/g, '')}`}
                    key={plat.value}
                    type="button"
                    onClick={() => setPlatform(plat.value as Platform)}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border py-1.5 px-0.5 font-sans text-[10.5px] font-medium cursor-pointer transition-colors ${
                      isSel
                        ? 'border-black bg-zinc-950 text-white font-bold'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{t(plat.label, selectedLanguage)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-1">
            <label className="block font-sans text-xs font-bold text-zinc-700">{t("Output Language", selectedLanguage)}</label>
            <select
              id="hashtag-lang-select"
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 font-sans text-xs text-zinc-950 focus:border-zinc-900 focus:outline-none cursor-pointer h-10"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.name}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            id="hashtag-submit-btn"
            type="submit"
            disabled={isGenerating}
            className="w-full rounded-lg bg-black py-2 text-center font-sans text-xs font-bold text-white shadow-xs hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer h-10 shrink-0 animate-fade-in"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("Indexing...", selectedLanguage)}</span>
              </>
            ) : (
              <>
                <Hash className="h-4 w-4" />
                <span>{t("Optimize tags", selectedLanguage)}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Outputs */}
      <div className="space-y-6">
        
        {isGenerating && (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center shadow-2xs animate-fade-in">
            <Loader2 className="mx-auto h-10 w-10 text-black animate-spin" />
            <p className="mt-4 font-sans text-sm font-semibold text-black">{t("Tag Optimization Loop", selectedLanguage)}</p>
            <p className="mt-1 font-sans text-xs text-zinc-400">{t("Querying platform hashtag density indexes...", selectedLanguage)}</p>
          </div>
        )}

        {!hashtagSet && !isGenerating && (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center shadow-2xs">
            <Hash className="mx-auto h-12 w-12 text-zinc-300" />
            <p className="mt-4 font-sans text-sm font-semibold text-zinc-800">{t("Your optimized packages will appear here", selectedLanguage)}</p>
            <p className="mt-2 font-sans text-xs text-zinc-500 max-w-sm mx-auto leading-normal">
              {t("Query a focus keyword above. ViralFlow generates exactly 30 platform-optimized hashtags divided into broad, niche, and high-viral segments.", selectedLanguage)}
            </p>
          </div>
        )}

        {hashtagSet && !isGenerating && (
          <div className="space-y-6">
            
            {/* Save bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 border border-zinc-200/50 rounded-xl p-4">
              <div>
                <span className="font-mono text-[9px] text-zinc-400 uppercase">{t("Target Platform & Topic", selectedLanguage)}</span>
                <p className="font-sans text-sm font-bold text-zinc-950 mt-0.5">
                  {hashtagSet.platform} • #{hashtagSet.topic.replace(/\s+/g,'')}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  id="hashtag-copy-all-btn"
                  onClick={() => handleCopy([...hashtagSet.broad, ...hashtagSet.niche, ...hashtagSet.viral].join(' '), 'all-tags')}
                  className="rounded-lg border border-zinc-200 bg-white py-1.5 px-3 font-sans text-xs font-semibold text-zinc-600 hover:text-black flex items-center gap-1.5 cursor-pointer"
                >
                  {copyStates['all-tags'] ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{t("Copy All 30 Tags", selectedLanguage)}</span>
                </button>
                <button
                  id="hashtag-save-btn"
                  onClick={handleSaveHashtags}
                  className={`rounded-lg py-1.5 px-3 font-sans text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                    isSaved
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-black text-white hover:opacity-90'
                  }`}
                >
                  {isSaved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                  <span>{isSaved ? t('Saved to Workspace', selectedLanguage) : t('Save Set', selectedLanguage)}</span>
                </button>
              </div>
            </div>

            {/* Clusters boards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Board 1: Broad Tags */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-4">
                    <span className="font-sans text-xs font-black text-zinc-900 uppercase tracking-wider">🌎 {t("10 Broad Tags", selectedLanguage)}</span>
                    <button
                      id="copy-broad-tags"
                      onClick={() => handleCopy(hashtagSet.broad.join(' '), 'broad-c')}
                      className="text-zinc-400 hover:text-black"
                      title={t("Copy cluster", selectedLanguage)}
                    >
                      {copyStates['broad-c'] ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hashtagSet.broad.map((tag, idx) => (
                      <span key={idx} className="rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-1 font-mono text-[10.5px] text-zinc-700 font-semibold font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-8 font-sans text-[10px] text-zinc-400">{t("Ensures indexing into large industry feeds.", selectedLanguage)}</p>
              </div>

              {/* Board 2: Niche-focused */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-4">
                    <span className="font-sans text-xs font-black text-zinc-900 uppercase tracking-wider">🎯 {t("10 Niche Tags", selectedLanguage)}</span>
                    <button
                      id="copy-niche-tags"
                      onClick={() => handleCopy(hashtagSet.niche.join(' '), 'niche-c')}
                      className="text-zinc-400 hover:text-black"
                    >
                      {copyStates['niche-c'] ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hashtagSet.niche.map((tag, idx) => (
                      <span key={idx} className="rounded-full bg-zinc-50 border border-zinc-100 px-2.5 py-1 font-mono text-[10.5px] text-zinc-700 font-semibold font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-8 font-sans text-[10px] text-zinc-400">{t("Targets active, highly motivated prospects.", selectedLanguage)}</p>
              </div>

              {/* Board 3: Viral Trenders */}
              <div className="rounded-xl border border-zinc-200 bg-white p-4.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-4">
                    <span className="font-sans text-xs font-black text-zinc-900 uppercase tracking-wider">⚡ {t("10 Viral Tags", selectedLanguage)}</span>
                    <button
                      id="copy-viral-tags"
                      onClick={() => handleCopy(hashtagSet.viral.join(' '), 'viral-c')}
                      className="text-zinc-400 hover:text-black"
                    >
                      {copyStates['viral-c'] ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {hashtagSet.viral.map((tag, idx) => (
                      <span key={idx} className="rounded-full bg-zinc-900 text-white px-2.5 py-1 font-mono text-[10.5px] font-bold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-8 font-sans text-[10px] text-zinc-400">{t("Aims to hijack high-velocity global metrics.", selectedLanguage)}</p>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}

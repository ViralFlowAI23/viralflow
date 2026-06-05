import React, { useState, useEffect } from 'react';
import { ViewType, UserState, ScriptItem } from '../types';
import { generateScript } from '../utils/generators';
import { LANGUAGES, translateObject, t } from '../utils/translator';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Save, 
  BookmarkCheck, 
  Loader2, 
  RefreshCw, 
  CheckCircle,
  HelpCircle,
  Crown,
  Tv,
  MessageSquare,
  Volume2,
  Clock,
  FileText
} from 'lucide-react';

interface ScriptGeneratorProps {
  user: UserState;
  setView: (view: ViewType) => void;
  incrementGeneration: () => boolean;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export default function ScriptGenerator({ user, setView, incrementGeneration, selectedLanguage, onLanguageChange }: ScriptGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState<'30s' | '60s'>('30s');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<ScriptItem | null>(null);
  
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});
  const [toastMsg, setToastMsg] = useState('');
  const [limitMsg, setLimitMsg] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('viralflow_scripts') || '[]');
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

    // Free plan restriction on 60s scripts
    if (user.tier === 'free' && duration === '60s') {
      triggerToast(t("⚠️ Long 60s scripting requires Pro tier!", selectedLanguage));
      return;
    }

    const allowed = incrementGeneration();
    if (!allowed && user.tier === 'free') {
      setLimitMsg(true);
      return;
    }

    setIsGenerating(true);
    setScript(null);

    setTimeout(() => {
      const res = generateScript(topic, duration);
      const translated = translateObject(res, selectedLanguage);
      setScript(translated);
      setIsGenerating(false);
      triggerToast(t("Drafted complete seconds content board script!", selectedLanguage).replace("seconds", duration));
    }, 1500);
  };

  const handleSaveScript = () => {
    if (!script) return;
    try {
      const stored = JSON.parse(localStorage.getItem('viralflow_scripts') || '[]');
      
      if (savedIds.includes(script.id)) {
        // Unsave
        const updated = stored.filter((x: any) => x.id !== script.id);
        localStorage.setItem('viralflow_scripts', JSON.stringify(updated));
        setSavedIds(savedIds.filter(id => id !== script.id));
        triggerToast(t("Removed script from workspace saves.", selectedLanguage));
      } else {
        // Save limit
        if (user.tier === 'free' && stored.length >= 5) {
          triggerToast(t("⚠️ Free Plan allows max 5 workspace saves. Upgrade to Pro!", selectedLanguage));
          return;
        }

        const scriptWithDate = { ...script, savedAt: new Date().toISOString() };
        stored.push(scriptWithDate);
        localStorage.setItem('viralflow_scripts', JSON.stringify(stored));
        setSavedIds([...savedIds, script.id]);
        triggerToast(t("Storyboard script saved to Workspace!", selectedLanguage));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isSaved = script ? savedIds.includes(script.id) : false;

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
            {t("Script Architect", selectedLanguage)}
          </h1>
          <p className="font-sans text-xs text-zinc-500 mt-1">
            {t("Build dual-track storyboards featuring synchronous physical visuals and voiceover cues.", selectedLanguage)}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-yellow-200/50 bg-amber-50/20 px-3 py-1.5 font-sans text-xs font-semibold text-amber-800">
          <Crown className="h-4 w-4 text-amber-600 fill-amber-500" />
          <span>{t("Pro Engine Unlocks 60s Length", selectedLanguage)}</span>
        </div>
      </div>

      {limitMsg && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-sans text-sm font-bold text-amber-950">{t("Scripting Limit Hit", selectedLanguage)}</h3>
            <p className="mt-1 font-sans text-xs text-amber-700 leading-normal">
              {t("You are capped at 5 generations. Upgrade today to bypass script limits and write unrestricted storyboards.", selectedLanguage)}
            </p>
          </div>
          <button
            id="script-limit-upgrade"
            onClick={() => setView('pricing')}
            className="rounded-lg bg-black px-4 py-2 font-sans text-xs font-bold text-white hover:opacity-90"
          >
            {t("Upgrade $9/mo", selectedLanguage)}
          </button>
        </div>
      )}

      {/* Input panel */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs h-fit sticky lg:top-24">
          <h3 className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
            {t("Script Settings", selectedLanguage)}
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block font-sans text-xs font-bold text-zinc-700">{t("Script Topic or Hook", selectedLanguage)}</label>
              <textarea
                id="script-topic-area"
                required
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t("e.g. Stop wasting hours formatting Excel spreadsheets. Use this keyboard shortcut instead...", selectedLanguage)}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-sans text-xs text-zinc-950 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none resize-none"
              />
            </div>

            {/* Duration select */}
            <div>
              <label className="block font-sans text-xs font-bold text-zinc-700">{t("Required Length", selectedLanguage)}</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  id="duration-30"
                  type="button"
                  onClick={() => setDuration('30s')}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-2.5 font-sans text-xs font-medium cursor-pointer transition-colors ${
                    duration === '30s'
                      ? 'border-black bg-zinc-950 text-white font-semibold'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>{t("30 Seconds", selectedLanguage)}</span>
                </button>
                <button
                  id="duration-60"
                  type="button"
                  onClick={() => setDuration('60s')}
                  className={`relative flex items-center justify-center gap-1.5 rounded-lg border py-2.5 font-sans text-xs font-medium cursor-pointer transition-colors ${
                    duration === '60s'
                      ? 'border-black bg-zinc-950 text-white font-semibold'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>{t("60 Seconds", selectedLanguage)}</span>
                  {user.tier === 'free' && (
                    <span className="absolute top-1 right-1 rounded-full bg-amber-500 px-1 font-mono text-[7px] font-bold text-white">PRO</span>
                  )}
                </button>
              </div>
              {user.tier === 'free' && duration === '60s' && (
                <p className="mt-2 text-[10px] text-amber-600 leading-normal font-sans">
                  {t("⚠️ You are currently on the Free plan. Generating 60s storyboards is lock-guarded in Pro mode.", selectedLanguage)}
                </p>
              )}
            </div>

            {/* Language dropdown */}
            <div>
              <label className="block font-sans text-xs font-bold text-zinc-700">{t("Output Language", selectedLanguage)}</label>
              <select
                id="script-lang-select"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-sans text-xs text-zinc-950 focus:border-zinc-900 focus:outline-none cursor-pointer h-10"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="script-submit-btn"
              type="submit"
              disabled={isGenerating || (user.tier === 'free' && duration === '60s')}
              className="mt-6 w-full rounded-lg bg-black py-2.5 text-center font-sans text-xs font-bold text-white shadow-xs hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("Writing Guide...", selectedLanguage)}</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>{t("Draft script", selectedLanguage)}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Script Results */}
        <div className="lg:col-span-2 space-y-5">
          {isGenerating && (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center shadow-2xs">
              <Loader2 className="mx-auto h-10 w-10 text-black animate-spin" />
              <p className="mt-4 font-sans text-sm font-semibold text-black">{t("Drafting Scene Outline", selectedLanguage)}</p>
              <p className="mt-1 font-sans text-xs text-zinc-400">{t("Formatting video frames and voiceover timings...", selectedLanguage)}</p>
            </div>
          )}

          {!script && !isGenerating && (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center shadow-2xs">
              <FileText className="mx-auto h-12 w-12 text-zinc-300" />
              <p className="mt-4 font-sans text-sm font-semibold text-zinc-800">{t("Your visual script board awaits", selectedLanguage)}</p>
              <p className="mt-2 font-sans text-xs text-zinc-500 max-w-sm mx-auto leading-normal">
                {t("Enter your desired video topic, select your duration, and click draft. We'll generate full scene-by-scene timing directories.", selectedLanguage)}
              </p>
            </div>
          )}

          {script && !isGenerating && (
            <div className="space-y-5">
              
              {/* Header result row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 border border-zinc-200/50 rounded-xl p-4">
                <div>
                  <span className="font-mono text-[9px] text-zinc-400 uppercase">{t("Target Board Topic", selectedLanguage)}</span>
                  <p className="font-sans text-sm font-bold text-zinc-950 mt-0.5 max-w-md truncate">"{script.topic}"</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    id="save-script-active-btn"
                    onClick={handleSaveScript}
                    className={`rounded-lg py-1.5 px-3 font-sans text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      isSaved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-black text-white hover:opacity-90'
                    }`}
                  >
                    {isSaved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                    <span>{isSaved ? t('Saved to Workspace', selectedLanguage) : t('Save Script', selectedLanguage)}</span>
                  </button>
                </div>
              </div>

              {/* Storyboard Block */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-zinc-400">{t("Storyboard Steps", selectedLanguage)}</h3>
                  <button
                    id="copy-script-entire-btn"
                    onClick={() => handleCopy(script.scenes.map(s => `[${s.time}] Visual: ${s.visual}\nVoiceover: ${s.audio}`).join('\n\n'), 'all-scenes')}
                    className="flex items-center gap-1 font-sans text-[11px] font-semibold text-zinc-500 hover:text-black cursor-pointer"
                  >
                    {copyStates['all-scenes'] ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{t("Copy Full Script", selectedLanguage)}</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {script.scenes.map((scene, idx) => (
                    <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-4.5 flex gap-4 hover:border-zinc-300">
                      
                      {/* Time step badge */}
                      <div className="text-center shrink-0 w-14">
                        <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase">{t("Frame", selectedLanguage)}</span>
                        <p className="font-sans text-sm font-extrabold text-black mt-1">#0{idx+1}</p>
                        <span className="inline-block mt-2 rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500 font-bold">
                          {t(scene.time.split(' ')[0], selectedLanguage)}
                        </span>
                      </div>

                      {/* Info side */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 border-l border-zinc-100 pl-4">
                        <div>
                          <div className="flex items-center gap-1 text-zinc-400">
                            <Tv className="h-3.5 w-3.5" />
                            <span className="font-sans text-[10px] font-bold uppercase">{t("Visual Layout & B-Roll Actions", selectedLanguage)}</span>
                          </div>
                          <p className="mt-1.5 font-sans text-xs text-zinc-600 leading-relaxed">
                            {scene.visual}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-zinc-400">
                            <Volume2 className="h-3.5 w-3.5" />
                            <span className="font-sans text-[10px] font-bold uppercase">{t("Narration Line / Voiceover", selectedLanguage)}</span>
                          </div>
                          <p className="mt-1.5 font-sans text-xs text-zinc-950 font-medium leading-relaxed italic bg-zinc-50/50 p-2.5 rounded-lg border border-zinc-100/50">
                            {scene.audio}
                          </p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Caption metadata */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-4.5 w-4.5 text-zinc-500" />
                    <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-zinc-900">{t("Recommended Social Caption", selectedLanguage)}</h3>
                  </div>
                  <button
                    id="copy-caption-btn"
                    onClick={() => handleCopy(script.caption, 'cap-main')}
                    className="flex items-center gap-1 font-sans text-[11px] font-semibold text-zinc-500 hover:text-black cursor-pointer"
                  >
                    {copyStates['cap-main'] ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{t("Copy Caption", selectedLanguage)}</span>
                  </button>
                </div>

                <div className="bg-zinc-50 rounded-xl p-4 font-sans text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap select-all">
                  {script.caption}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

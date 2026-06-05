import React, { useState, useEffect } from 'react';
import { ViewType, UserState, VideoIdea, Platform, ContentStyle } from '../types';
import { generateVideoIdeas } from '../utils/generators';
import { LANGUAGES, translateObject, t } from '../utils/translator';
import { 
  Lightbulb, 
  Sparkles, 
  Tv, 
  Instagram, 
  Clapperboard, 
  Save, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  Loader2, 
  Crown,
  ChevronDown,
  ChevronUp,
  BookmarkCheck,
  Zap,
  CheckCircle,
  Copy
} from 'lucide-react';

interface IdeasGeneratorProps {
  user: UserState;
  setView: (view: ViewType) => void;
  incrementGeneration: () => boolean; // returns true if allowed, false if limit hit
  initialNiche: string;
  selectedLanguage: string;
}

export default function IdeasGenerator({ user, setView, incrementGeneration, initialNiche, selectedLanguage }: IdeasGeneratorProps) {
  // Inputs
  const [niche, setNiche] = useState(initialNiche || '');
  const [platform, setPlatform] = useState<Platform>('TikTok');
  const [style, setStyle] = useState<ContentStyle>('educational');
  const [language, setLanguage] = useState(selectedLanguage || 'English');
  
  // Status
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusLog, setStatusLog] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState<VideoIdea[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (initialNiche) {
      setNiche(initialNiche);
    }
  }, [initialNiche]);

  useEffect(() => {
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  // Load saved item IDs
  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem('viralflow_ideas') || '[]');
      const ids = items.map((x: any) => x.id);
      setSavedIds(ids);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
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

    // Call limit check
    const allowed = incrementGeneration();
    if (!allowed && user.tier === 'free') {
      setLimitReached(true);
      return;
    }

    setIsGenerating(true);
    setGeneratedIdeas([]);
    
    // Aesthetic loading states feedback logs
    const logs = [
      "Analyzing short-form micro trends in selected niche...",
      "Matching visual hook structures with trending timelines...",
      "Scattering CTAs & evaluating estimated viral potential...",
      "Injecting dynamic platform overlays..."
    ];

    let logIndex = 0;
    setStatusLog(t(logs[0], selectedLanguage));
    
    const interval = setInterval(() => {
      logIndex++;
      if (logIndex < logs.length) {
        setStatusLog(t(logs[logIndex], selectedLanguage));
      }
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      const results = generateVideoIdeas(niche, platform, style, language);
      const translated = translateObject(results, language);
      setGeneratedIdeas(translated);
      setIsGenerating(false);
      triggerToast(t("Successfully generated 5 targeted video concepts!", selectedLanguage));
    }, 1800);
  };

  const handleSaveIdea = (idea: VideoIdea) => {
    try {
      const stored = JSON.parse(localStorage.getItem('viralflow_ideas') || '[]');
      
      if (savedIds.includes(idea.id)) {
        // Unsave
        const updated = stored.filter((x: any) => x.id !== idea.id);
        localStorage.setItem('viralflow_ideas', JSON.stringify(updated));
        setSavedIds(savedIds.filter(id => id !== idea.id));
        triggerToast(t("Removed concept from workspace saves.", selectedLanguage));
      } else {
        // Save limit check
        if (user.tier === 'free' && stored.length >= 5) {
          triggerToast(t("⚠️ Free Plan allows max 5 workspace saves. Clear some or Upgrade!", selectedLanguage));
          return;
        }

        // Save
        const ideaWithDate = { ...idea, savedAt: new Date().toISOString() };
        stored.push(ideaWithDate);
        localStorage.setItem('viralflow_ideas', JSON.stringify(stored));
        setSavedIds([...savedIds, idea.id]);
        triggerToast(t("Concept locked into workspace saves!", selectedLanguage));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Toast notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-black px-4 py-3 font-sans text-xs font-semibold text-white shadow-xl flex items-center gap-1.5 ring-1 ring-white/10 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="border-b border-zinc-100 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-black text-zinc-950 sm:text-3xl tracking-tight">
            {t("Video Idea Generator", selectedLanguage)}
          </h1>
          <p className="font-sans text-xs text-zinc-500 mt-1">
            {t("Produce full structure creative blueprints based on your specific vertical, style, and goal tone.", selectedLanguage)}
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400 bg-zinc-50 px-3 py-1.5 rounded-lg ring-1 ring-zinc-200/50">
          <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>{t("Daily Limit:", selectedLanguage)} {user.tier === 'free' ? t('5 Runs Max (MVP)', selectedLanguage) : t('Infinite Unbounded', selectedLanguage)}</span>
        </div>
      </div>

      {/* Limit reached Interstitial banner */}
      {limitReached && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50/50 p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-800">
              <Crown className="h-6 w-6 text-amber-600 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-bold text-amber-900">{t("Run Limit Exhausted", selectedLanguage)}</h3>
              <p className="mt-1 font-sans text-xs text-amber-700 leading-normal max-w-xl">
                {t("You have deployed 5 algorithmic ideas today. Free sandbox accounts are capped at 5 runs per cycle to preserve API pipelines. Upgrade to our lightweight Pro model for unlimited generations.", selectedLanguage)}
              </p>
            </div>
          </div>
          <button
            id="ideas-lim-upgrade-btn"
            onClick={() => setView('pricing')}
            className="rounded-lg bg-black px-4 py-2 font-sans text-xs font-semibold text-white shadow-xs hover:opacity-90 flex items-center gap-1 shrink-0"
          >
            {t("Go Pro for $9/mo", selectedLanguage)}
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Input panel & Interactive settings */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Form Container */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs h-fit sticky lg:top-24">
          <h3 className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
            {t("Model Parameters", selectedLanguage)}
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4.5">
            
            {/* Niche Field */}
            <div>
              <label className="block font-sans text-xs font-bold text-zinc-700">{t("Content Niche / Vertical", selectedLanguage)}</label>
              <input
                id="ideas-niche-input"
                type="text"
                required
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder={t("e.g. Figma prototyping, AI SaaS, Cooking", selectedLanguage)}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-sans text-sm text-zinc-950 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
              />
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block font-sans text-xs font-bold text-zinc-700">{t("Target Segment", selectedLanguage)}</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { value: 'TikTok', icon: Tv, label: 'TikTok' },
                  { value: 'Instagram Reels', icon: Instagram, label: 'Instagram' },
                  { value: 'YouTube Shorts', icon: Clapperboard, label: 'YouTube' }
                ].map((plat) => {
                  const Icon = plat.icon;
                  const isSel = platform === plat.value;
                  return (
                    <button
                      id={`plat-sel-${plat.value.replace(/\s+/g, '')}`}
                      key={plat.value}
                      type="button"
                      onClick={() => setPlatform(plat.value as Platform)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border py-2.5 px-1 font-sans text-[11px] font-medium transition-all cursor-pointer ${
                        isSel 
                          ? 'border-black bg-zinc-950 text-white ring-1 ring-black' 
                          : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate max-w-full text-[10px]">{t(plat.label, selectedLanguage)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block font-sans text-xs font-bold text-zinc-700">{t("Language Model", selectedLanguage)}</label>
              <select
                id="ideas-lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 font-sans text-xs text-zinc-950 focus:border-zinc-900 focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Style Selector */}
            <div>
              <label className="block font-sans text-xs font-bold text-zinc-700 font-medium text-zinc-700">{t("Aesthetic Tone / Style", selectedLanguage)}</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {[
                  { id: 'educational', label: '🎓 Educational', text: 'Educational' },
                  { id: 'funny', label: '🎭 Funny/Relatable', text: 'Funny/Relatable' },
                  { id: 'luxury', label: '💎 Luxury/Elite', text: 'Luxury/Elite' },
                  { id: 'scary', label: '👻 Suspense/Horror', text: 'Suspense/Horror' },
                  { id: 'motivational', label: '🔥 Motivational', text: 'Motivational' },
                  { id: 'storytime', label: '📖 Storytime/POV', text: 'Storytime/POV' }
                ].map((st) => {
                  const isSel = style === st.id;
                  return (
                    <button
                      id={`style-sel-${st.id}`}
                      key={st.id}
                      type="button"
                      onClick={() => setStyle(st.id as ContentStyle)}
                      className={`text-left rounded-lg border px-2.5 py-1.5 font-sans text-[11px] transition-all cursor-pointer ${
                        isSel
                          ? 'border-black bg-zinc-100 text-black font-semibold'
                          : 'border-zinc-100 bg-zinc-50/50 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      {/* Extract emoji to keep it clean while translating the label */}
                      {st.label.split(' ')[0]} {t(st.text, selectedLanguage)}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              id="ideas-submit-gen-btn"
              type="submit"
              disabled={isGenerating}
              className="mt-6 w-full rounded-lg bg-black py-2.5 text-center font-sans text-xs font-bold text-white shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("Synthesizing...", selectedLanguage)}</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>{t("Generate ideas", selectedLanguage)}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Outputs Grid */}
        <div className="lg:col-span-2 space-y-4">
          
          {isGenerating && (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center shadow-2xs">
              <Loader2 className="mx-auto h-10 w-10 text-black animate-spin" />
              <p className="mt-4 font-sans text-sm font-semibold text-black">{t("Aesthetic Analysis Engine", selectedLanguage)}</p>
              <p className="mt-1 font-mono text-[11px] text-zinc-400 capitalize bg-zinc-50 px-3 py-1 rounded inline-block">
                {t("LOG:", selectedLanguage)} {statusLog}
              </p>
            </div>
          )}

          {!isGenerating && generatedIdeas.length === 0 && (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center shadow-2xs">
              <Lightbulb className="mx-auto h-12 w-12 text-zinc-300" />
              <p className="mt-4 font-sans text-sm font-semibold text-zinc-800">{t("Your brief results will yield here", selectedLanguage)}</p>
              <p className="mt-2 font-sans text-xs text-zinc-500 max-w-sm mx-auto leading-normal">
                {t("Input your content vertical in the creator panel to generate 5 highly optimized video idea storyboards. Completely offline, lighting-fast.", selectedLanguage)}
              </p>
            </div>
          )}

          {!isGenerating && generatedIdeas.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">{t(style, selectedLanguage)} {t("matches found", selectedLanguage)}</span>
                <span className="text-[11px] font-sans text-zinc-400">{t("Showing 5 custom blueprints", selectedLanguage)}</span>
              </div>

              {generatedIdeas.map((idea) => {
                const isSaved = savedIds.includes(idea.id);
                const isExpanded = expandedCardId === idea.id;
                
                // Colors representing viral scores
                const scoreColor = idea.score >= 90 ? 'text-emerald-600 bg-emerald-50 ring-emerald-200' : 'text-amber-600 bg-amber-50 ring-amber-200';
                const difficultyColor = idea.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-800' : idea.difficulty === 'Medium' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800';

                return (
                  <div 
                    key={idea.id} 
                    className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-4"
                  >
                    <div>
                      {/* Badge row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[9px] font-medium text-zinc-600 ring-1 ring-zinc-200">
                            {idea.platform}
                          </span>
                          <span className={`rounded-full px-2 py-0.2 font-sans text-[10px] font-semibold ${difficultyColor}`}>
                            {t(idea.difficulty, selectedLanguage)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="font-sans text-[11px] text-zinc-400">{t("Viral potential:", selectedLanguage)}</span>
                          <span className={`rounded font-mono text-11 font-black px-1.5 py-0.2 text-xs ring-1 ${scoreColor}`}>
                            {idea.score}%
                          </span>
                        </div>
                      </div>

                      <h3 className="mt-3.5 font-sans text-base font-extrabold text-zinc-950 tracking-tight leading-normal">
                        {idea.title}
                      </h3>
                      
                      <div className="mt-2 text-zinc-700 bg-zinc-50/50 rounded-xl border border-zinc-100 p-3.5">
                        <p className="font-mono text-[10.5px] font-bold text-zinc-400 uppercase tracking-wider">{t("The Hook Hook Line", selectedLanguage)}</p>
                        <p className="mt-1 font-sans text-xs italic font-medium text-black">
                          "{idea.hook}"
                        </p>
                      </div>

                      <p className="mt-3.5 font-sans text-xs text-zinc-500 leading-relaxed">
                        {idea.description}
                      </p>

                      {/* Expanded Section outlining video structure */}
                      {isExpanded && (
                        <div className="mt-5 border-t border-zinc-100 pt-4 space-y-3.5 animate-slide-down">
                          <h4 className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{t("Video Structure Plan", selectedLanguage)}</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-100">
                              <p className="font-sans text-[10px] font-bold text-zinc-400">{t("1. Hook Frame", selectedLanguage)}</p>
                              <p className="mt-1 font-sans text-[11px] text-zinc-600 leading-relaxed">{idea.structure.hook}</p>
                            </div>
                            <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-100">
                              <p className="font-sans text-[10px] font-bold text-zinc-400">{t("2. Middle body", selectedLanguage)}</p>
                              <p className="mt-1 font-sans text-[11px] text-zinc-600 leading-relaxed">{idea.structure.body}</p>
                            </div>
                            <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-100">
                              <p className="font-sans text-[10px] font-bold text-zinc-400">{t("3. End CTA", selectedLanguage)}</p>
                              <p className="mt-1 font-sans text-[11px] text-zinc-600 leading-relaxed">{idea.structure.cta}</p>
                            </div>
                          </div>

                          <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 flex items-center justify-between gap-1.5">
                            <div>
                              <p className="font-sans text-[10px] font-bold text-zinc-400">{t("Recommended Call-To-Action", selectedLanguage)}</p>
                              <p className="font-sans text-[11px] font-medium text-zinc-800">{idea.cta}</p>
                            </div>
                            <button
                              id={`copy-cta-${idea.id}`}
                              onClick={() => handleCopy(idea.cta, `cta-${idea.id}`)}
                              className="rounded-md border border-zinc-200 bg-white p-1 hover:bg-zinc-50 cursor-pointer"
                              title={t("Copy CTA", selectedLanguage)}
                            >
                              {copyStates[`cta-${idea.id}`] ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-zinc-400" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Controls */}
                    <div className="border-t border-zinc-100 pt-3.5 flex items-center justify-between">
                      <button
                        id={`expand-btn-${idea.id}`}
                        onClick={() => setExpandedCardId(isExpanded ? null : idea.id)}
                        className="font-sans text-xs font-semibold text-zinc-500 hover:text-black flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            <span>{t("Hide Blueprint", selectedLanguage)}</span>
                            <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span>{t("Show Blueprint Structure", selectedLanguage)}</span>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </button>

                      <div className="flex gap-2">
                        <button
                          id={`copy-idea-all-${idea.id}`}
                          onClick={() => handleCopy(`Title: ${idea.title}\nHook: ${idea.hook}\nDescription: ${idea.description}\nCTA: ${idea.cta}`, `idea-${idea.id}`)}
                          className="rounded-lg border border-zinc-200 px-3 py-1.5 font-sans text-[11px] font-medium text-zinc-600 hover:text-black hover:border-zinc-300 flex items-center gap-1 cursor-pointer bg-white"
                        >
                          {copyStates[`idea-${idea.id}`] ? <Check className="h-3 w-3.5 text-emerald-600" /> : <Copy className="h-3 w-3.5" />}
                          <span>{t("Copy", selectedLanguage)}</span>
                        </button>

                        <button
                          id={`save-idea-btn-${idea.id}`}
                          onClick={() => handleSaveIdea(idea)}
                          className={`rounded-lg py-1.5 px-3 font-sans text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                            isSaved 
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-200/80' 
                              : 'bg-black text-white hover:opacity-90 shadow-sm'
                          }`}
                        >
                          {isSaved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                          <span>{isSaved ? t('Saved to Hub', selectedLanguage) : t('Save to Workspace', selectedLanguage)}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

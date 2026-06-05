import React, { useState } from 'react';
import { UserState, Platform } from '../types';
import { LANGUAGES, translateObject, t } from '../utils/translator';
import { 
  TrendingUp, 
  Search, 
  Sparkles, 
  Users, 
  HelpCircle, 
  AlertCircle, 
  Save, 
  Plus, 
  Globe, 
  ArrowRight,
  Flame,
  CheckCircle,
  FolderOpen
} from 'lucide-react';

interface TrendAnalyzerProps {
  user: UserState;
  setView: (view: any) => void;
  incrementGeneration: () => boolean;
  selectedLanguage: string;
  onLanguageChange: (langName: string) => void;
}

interface TrendResult {
  niche: string;
  timestamp: string;
  trendingTopics: {
    title: string;
    velocity: string; // e.g., "+320%"
    difficulty: 'Low' | 'Medium' | 'High';
    angle: string;
  }[];
  viralOpportunities: {
    opportunity: string;
    whyItWorks: string;
    sampleTitle: string;
  }[];
  contentGaps: {
    gap: string;
    unmetNeed: string;
    strategy: string;
  }[];
  audienceInterests: {
    interest: string;
    coreQuestion: string;
    retentionTrigger: string;
  }[];
}

export default function TrendAnalyzer({ user, setView, incrementGeneration, selectedLanguage, onLanguageChange }: TrendAnalyzerProps) {
  const [niche, setNiche] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<TrendResult | null>(null);
  const [toast, setToast] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('TikTok');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) return;

    if (!incrementGeneration()) {
      triggerToast(t("⚠️ Daily generation limit reached. Upgrade to Pro for unlimited use!", selectedLanguage));
      return;
    }

    setAnalyzing(true);
    setResult(null);

    // Simulate creator analytics engine logic
    setTimeout(() => {
      const formattedNiche = niche.trim();
      
      // Dynamic content generator based on keywords
      const topics = generateTrendingTopics(formattedNiche);
      const opportunities = generateViralOpportunities(formattedNiche);
      const gaps = generateContentGaps(formattedNiche);
      const interests = generateAudienceInterests(formattedNiche);

      const rawResult = {
        niche: formattedNiche,
        timestamp: new Date().toLocaleDateString(),
        trendingTopics: topics,
        viralOpportunities: opportunities,
        contentGaps: gaps,
        audienceInterests: interests,
      };

      const translated = translateObject(rawResult, selectedLanguage);
      setResult(translated);
      setAnalyzing(false);
      triggerToast(t("🎯 Custom Trend Audit compiled successfully!", selectedLanguage));
    }, 1500);
  };

  // Predefined formulas for a highly realistic output
  const generateTrendingTopics = (k: string) => {
    return [
      {
        title: `The "Zero-to-Hero" 30-day challenge in ${k}`,
        velocity: "+412% Volume",
        difficulty: "Low" as const,
        angle: "Create a rapid split-screen documentation of your first day versus your last day. People love transformations because they offer social proof without friction."
      },
      {
        title: `Stop using mainstream tactics for ${k}`,
        velocity: "+280% Volume",
        difficulty: "Medium" as const,
        angle: "Deconstruct a common tool or tip in the niche and explain why it actually drains bandwidth. Position yourself as the contrarian source of truth."
      },
      {
        title: `The hidden cost of ${k} (A visual audit)`,
        velocity: "+195% Volume",
        difficulty: "High" as const,
        angle: "A breakdown of software, tools, or physical accessories required. Keep it fast-paced with concrete numeric overlays on screen."
      }
    ];
  };

  const generateViralOpportunities = (k: string) => {
    return [
      {
        opportunity: "Inverted Tutorial (Mistake-Led)",
        whyItWorks: "Standard tutorials are boring. Introducing an immediate $5,000 failure or mistake builds instant relatable drama within the first 1.5 seconds.",
        sampleTitle: `I made this critical error in ${k} so you don't have to`
      },
      {
        opportunity: "The 'Gatekept' Software Stack Reveal",
        whyItWorks: "Viewers save videos that reveal tools, bookmarks, or templates because of the perceived instant leverage they gain.",
        sampleTitle: `3 free websites cheat codes for ${k} that feel highly illegal`
      }
    ];
  };

  const generateContentGaps = (k: string) => {
    return [
      {
        gap: "High-density micro-breakdowns of complex concepts",
        unmetNeed: "Most creators ramble or upload lengthy explanations. Viewers want 15-second lightning fast bullet points.",
        strategy: "Use neon screen drawings to circle variables while summarizing the core concept in under 20 seconds."
      },
      {
        gap: "Unfiltered 'Behind-the-scenes' failure logs",
        unmetNeed: "The niche is flooded with high-gloss success. There is a deep shortage of raw, realistic documentation showing setbacks.",
        strategy: "Film with natural lighting, no sound effects, speaking directly and quietly to the camera like a secret."
      }
    ];
  };

  const generateAudienceInterests = (k: string) => {
    return [
      {
        interest: "Workflow Automation & Leverage",
        coreQuestion: "How do I speed this up without sacrificing high quality output?",
        retentionTrigger: "Start with: 'This simple macro saves me 3 hours every morning.' Show the automation running in real-time."
      },
      {
        interest: "Cost Reduction / High efficiency",
        coreQuestion: "What is the absolute cheapest way to get high-tier results?",
        retentionTrigger: "Promise a $0 alternative to the industry standard tool by the 5-second mark of your short."
      }
    ];
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-black px-4 py-3 font-sans text-xs font-semibold text-white shadow-xl flex items-center gap-1.5 ring-1 ring-white/10">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Context */}
      <div className="border-b border-zinc-100 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-sans text-2xl font-bold text-zinc-950 sm:text-3xl tracking-tight flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white shadow-xs">
                <TrendingUp className="h-4.5 w-4.5" />
              </span>
              {t("Creator Trend Analyzer", selectedLanguage)}
            </h1>
            <p className="font-sans text-xs text-zinc-500 mt-1">
              {t("Analyze keyword vectors to unlock viral opportunities, content gaps, and search voids.", selectedLanguage)}
            </p>
          </div>
          <span className="rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 text-[10px] font-mono uppercase tracking-wider px-3 py-1 font-semibold self-start sm:self-center">
            🔥 {t("Trend Matrix V2", selectedLanguage)}
          </span>
        </div>
      </div>

      {/* Input query form */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xs">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block font-sans text-[11.5px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
              {t("Creator Niche / Keyword Topic", selectedLanguage)}
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder={t("e.g., retro mechanical keyboards, startup micro-saas, zero-waste meal prep...", selectedLanguage)}
                className="w-full text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 pl-10 pr-4 py-3 font-sans outline-hidden focus:border-zinc-900 focus:bg-white transition-all text-zinc-900 placeholder:text-zinc-455"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            {/* Platform selectivity */}
            <div className="space-y-1.5">
              <span className="block font-sans text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {t("Target Platform Context", selectedLanguage)}
              </span>
              <div className="flex bg-zinc-100 p-1 rounded-lg gap-1 max-w-[280px]">
                {(['TikTok', 'Instagram Reels', 'YouTube Shorts'] as Platform[]).map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setSelectedPlatform(plat)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-bold font-sans transition-all cursor-pointer ${
                      selectedPlatform === plat 
                        ? 'bg-white text-black shadow-2xs' 
                        : 'text-zinc-500 hover:text-black'
                    }`}
                  >
                    {t(plat.split(' ')[0], selectedLanguage)}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-1.5 w-full sm:w-52">
              <span className="block font-sans text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {t("Output Language", selectedLanguage)}
              </span>
              <select
                id="trends-lang-select"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full text-xs rounded-lg border border-zinc-200 bg-white px-3 py-2 font-sans outline-hidden focus:border-zinc-900 cursor-pointer h-9"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="trend-submit-btn"
              type="submit"
              disabled={analyzing}
              className="w-full sm:w-auto rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-3 font-sans text-xs font-black text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <WavesAnimation />
                  <span>{t("Scanning Search Gaps...", selectedLanguage)}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{t("Execute Trend Analysis", selectedLanguage)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Rendering */}
      {result ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-sm font-bold text-zinc-950 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {t("Intelligence Report:", selectedLanguage)} <span className="text-orange-500">"{result.niche}"</span>
            </h2>
            <span className="font-sans text-[11px] text-zinc-400 font-medium">
              {t("Checked on", selectedLanguage)} {result.timestamp}
            </span>
          </div>

          {/* Grid Layout of Audit Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
            {/* Column 1: Trending topics */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                {t("High Velocity Trending Topics", selectedLanguage)}
              </h3>
              <div className="divide-y divide-zinc-100">
                {result.trendingTopics.map((topic, i) => (
                  <div key={i} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-zinc-950 leading-snug">{topic.title}</h4>
                      <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-1.5 rounded">
                        {topic.velocity}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-zinc-500 leading-normal">{topic.angle}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-[9.5px] text-zinc-400">{t("Competition:", selectedLanguage)}</span>
                      <span className={`text-[9.5px] font-bold ${
                        topic.difficulty === 'Low' ? 'text-emerald-600' :
                        topic.difficulty === 'Medium' ? 'text-amber-600' : 'text-red-500'
                      }`}>{t(topic.difficulty, selectedLanguage)} {t("Resistance", selectedLanguage)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Viral Opportunities */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-purple-500" />
                {t("Contrarian Opportunity Voids", selectedLanguage)}
              </h3>
              <div className="space-y-4">
                {result.viralOpportunities.map((opp, i) => (
                  <div key={i} className="rounded-xl bg-purple-50/50 border border-purple-100/60 p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-purple-900 text-white font-mono text-[9px] font-black uppercase px-1.5 py-0.2">
                        {t("Formula", selectedLanguage)} {i+1}
                      </span>
                      <h4 className="text-xs font-bold text-purple-950">{opp.opportunity}</h4>
                    </div>
                    <p className="text-[11px] text-purple-900/80 leading-normal">{opp.whyItWorks}</p>
                    <div className="border-t border-purple-100/50 pt-2 flex items-start gap-1">
                      <ArrowRight className="h-3 w-3 text-purple-500 mt-1 shrink-0" />
                      <p className="text-[11.5px] font-semibold text-zinc-950 italic">"{opp.sampleTitle}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Audience Interests */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-500" />
                {t("Psychographic Audience Interests", selectedLanguage)}
              </h3>
              <div className="space-y-4">
                {result.audienceInterests.map((interest, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <h4 className="text-xs font-bold text-zinc-900">{interest.interest}</h4>
                    </div>
                    <div className="pl-3.5 space-y-1 text-[11px]">
                      <p className="text-zinc-500"><span className="font-semibold text-zinc-700">{t("Viewer Desperate Question:", selectedLanguage)}</span> "{interest.coreQuestion}"</p>
                      <p className="text-zinc-500"><span className="font-semibold text-zinc-700">{t("Immediate Retention Hook:", selectedLanguage)}</span> <span className="bg-blue-50 text-blue-800 px-1 rounded">{interest.retentionTrigger}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4: Content Gaps */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-emerald-500" />
                {t("Supply Gaps & Arbitrages", selectedLanguage)}
              </h3>
              <div className="space-y-4">
                {result.contentGaps.map((gap, i) => (
                  <div key={i} className="border-l-2 border-emerald-500 pl-3.5 space-y-1.5">
                    <h4 className="text-xs font-bold text-zinc-900">{gap.gap}</h4>
                    <p className="text-[11px] text-zinc-500 leading-normal"><span className="font-bold text-zinc-600">{t("The Friction:", selectedLanguage)}</span> {gap.unmetNeed}</p>
                    <p className="text-[11px] text-emerald-800 font-medium bg-emerald-50/50 px-2 py-0.5 rounded inline-block">{t("🎯 Video Blueprint Strategy:", selectedLanguage)} {gap.strategy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action to write a video script */}
          <div className="rounded-2xl bg-zinc-900 text-white p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans border border-zinc-800">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white">{t("Unlock Ideas & Scripts instantly for this niche", selectedLanguage)}</h4>
              <p className="text-[11.5px] text-zinc-400 leading-normal">
                {t("Feed your newly analyzed niche directly into the AI storyboard architect to craft custom templates.", selectedLanguage)}
              </p>
            </div>
            <button
              id="trend-action-seed-ideas"
              onClick={() => {
                localStorage.setItem('viralflow_initial_niche', result.niche);
                setView('ideas');
              }}
              className="rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs px-4.5 py-2.5 transition-all shadow-sm flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>{t("Map to Ideas Generator", selectedLanguage)}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        !analyzing && (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center max-w-lg mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500 mx-auto mb-4">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="font-sans text-sm font-bold text-zinc-950">{t("No search query audited yet", selectedLanguage)}</h3>
            <p className="mt-2 font-sans text-xs text-zinc-500 leading-normal max-w-xs mx-auto">
              {t("Ready to stop guessing? Type any creative category, hobby, or technology above and we will execute a complete search positioning report.", selectedLanguage)}
            </p>
          </div>
        )
      )}
    </div>
  );
}

// Simple styling components
function WavesAnimation() {
  return (
    <div className="flex gap-1 items-center justify-center select-none py-1 h-3 shrink-0">
      <span className="w-0.75 h-full bg-white rounded-xs animate-bounce" style={{ animationDelay: '0.1s' }} />
      <span className="w-0.75 h-full bg-white rounded-xs animate-bounce" style={{ animationDelay: '0.3s' }} />
      <span className="w-0.75 h-full bg-white rounded-xs animate-bounce" style={{ animationDelay: '0.5s' }} />
    </div>
  );
}

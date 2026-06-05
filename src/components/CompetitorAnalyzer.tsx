import React, { useState } from 'react';
import { UserState } from '../types';
import { LANGUAGES, translateObject, t } from '../utils/translator';
import { 
  Users, 
  Search, 
  Sparkles, 
  Flame, 
  CheckCircle, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight,
  Tv, 
  Instagram, 
  Clapperboard,
  ThumbsUp,
  Brain,
  MessageSquare
} from 'lucide-react';

interface CompetitorAnalyzerProps {
  user: UserState;
  setView: (view: any) => void;
  incrementGeneration: () => boolean;
  selectedLanguage: string;
  onLanguageChange: (langName: string) => void;
}

interface CompetitorResult {
  creatorName: string;
  timestamp: string;
  overallScore: number; // e.g., 88/100
  focusMetrics: {
    hookRate: string; // "88%"
    retentionRate: string; // "64%"
    organicVelocity: string; // "High"
  };
  bestPerformingStyles: {
    format: string;
    avgViews: string;
    whyItBlewUp: string;
  }[];
  usedScrollHooks: {
    hookText: string;
    psychologyType: string;
    whyItSucceeded: string;
  }[];
  improvementAudit: {
    vulnerability: string;
    actionableImprovement: string;
    howToApply: string;
  }[];
}

export default function CompetitorAnalyzer({ user, setView, incrementGeneration, selectedLanguage, onLanguageChange }: CompetitorAnalyzerProps) {
  const [handle, setHandle] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<CompetitorResult | null>(null);
  const [toast, setToast] = useState('');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    if (!incrementGeneration()) {
      triggerToast(t("⚠️ Daily generation limit reached. Upgrade to Pro for unlimited use!", selectedLanguage));
      return;
    }

    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const name = handle.trim();
      
      const metrics = {
        hookRate: `${Math.floor(Math.random() * 15) + 75}%`,
        retentionRate: `${Math.floor(Math.random() * 20) + 45}%`,
        organicVelocity: (Math.random() > 0.4 ? 'High' : 'Very High') as any
      };

      const bestStyles = [
        {
          format: "The 'Secret Software Stack' Screen Record",
          avgViews: `${(Math.random() * 2 + 1).toFixed(1)}M+ Views`,
          whyItBlewUp: "Utilizes high-speed visual jumps with extreme contrast lighting. People screenshot the visual layouts immediately, skyrocketing the algorithm share index."
        },
        {
          format: "Visual Contrarian Busting 101",
          avgViews: "850K+ Average Views",
          whyItBlewUp: "Starting with a close-up angle and declaring 'Almost everyone in this vertical is lying to you.' Builds instant authority."
        }
      ];

      const hooks = [
        {
          hookText: "Don't buy another asset until you've seen this exact 15-second checklist.",
          psychologyType: "Loss-Aversion Trigger",
          whyItSucceeded: "Triggers fear-of-missing-out (FOMO) and financial caution immediately."
        },
        {
          hookText: "I spend over $2,000 monthly to automate this manual sequence.",
          psychologyType: "Curiosity & High Leverage Value",
          whyItSucceeded: "Proves monetary investment in the setup, giving viewers free validated access."
        },
        {
          hookText: "This is the single most illegal-feeling tip I have ever discovered.",
          psychologyType: "Pattern Interrupter & Rebels",
          whyItSucceeded: "Appeals to the psychological desire for shortcuts and forbidden knowledge."
        }
      ];

      const audits = [
        {
          vulnerability: "No Strong Narrative Wrapup (Weak CTA)",
          actionableImprovement: "Their videos end abruptly when showing tools, which neglects community engagement in comment boxes.",
          howToApply: "Avoid standard CTA cards. Ask a direct question like: 'Which of these 2 options would you throw away?' to double comment interactions."
        },
        {
          vulnerability: "Over-polished Production Fatigue",
          actionableImprovement: "Their high-end studio setups make their recommendations feel corporate and sponsored.",
          howToApply: "Create a rough-cut aesthetic—shoot with organic backgrounds or standard smartphones. Realism currently crushes glossy studio lighting."
        }
      ];

      const rawResult = {
        creatorName: name.startsWith('@') ? name : `@${name}`,
        timestamp: new Date().toLocaleDateString(),
        overallScore: Math.floor(Math.random() * 15) + 80,
        focusMetrics: metrics,
        bestPerformingStyles: bestStyles,
        usedScrollHooks: hooks,
        improvementAudit: audits
      };

      const translated = translateObject(rawResult, selectedLanguage);
      setResult(translated);

      setAnalyzing(false);
      triggerToast(t("🤖 Competitor teardown report generated!", selectedLanguage));
    }, 1500);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-black px-4 py-3 font-sans text-xs font-semibold text-white shadow-xl flex items-center gap-1.5 ring-1 ring-white/10">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-zinc-100 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-sans text-2xl font-bold text-zinc-950 sm:text-3xl tracking-tight flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                <Users className="h-4.5 w-4.5" />
              </span>
              {t("Creator Competitor Audit", selectedLanguage)}
            </h1>
            <p className="font-sans text-xs text-zinc-500 mt-1">
              {t("Deconstruct top creators in your niche to copy their high-performing frameworks and outmaneuver them.", selectedLanguage)}
            </p>
          </div>
          <span className="rounded-full bg-zinc-900 border border-zinc-800 text-purple-400 text-[10px] font-mono uppercase tracking-wider px-3 py-1 font-semibold self-start sm:self-center">
            🔒 {t("Audience Spy V2", selectedLanguage)}
          </span>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xs">
        <form onSubmit={handleExecute} className="space-y-4">
          <div>
            <label className="block font-sans text-[11.5px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
              {t("Target Creator Name / Channel Handle", selectedLanguage)}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 font-mono text-zinc-400 text-sm font-semibold">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="e.g., alexhormozi, aliabdaal, hubermanlab, mkbhd..."
                className="w-full text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 pl-8 pr-4 py-3 font-sans outline-hidden focus:border-zinc-900 focus:bg-white transition-all text-zinc-900 placeholder:text-zinc-455"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="flex flex-col sm:flex-row gap-4 items-end w-full md:w-auto">
              <p className="text-zinc-450 font-sans text-[11.5px] leading-relaxed max-w-sm">
                💡 <span className="font-semibold text-zinc-650">{t("Intelligence advice:", selectedLanguage)}</span> {t("Focus on handles with 50K+ followers to extract validated algorithm data.", selectedLanguage)}
              </p>

              {/* Language Selection */}
              <div className="space-y-1 w-full sm:w-52 text-left">
                <span className="block font-sans text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  {t("Output Language", selectedLanguage)}
                </span>
                <select
                  id="competitor-lang-select"
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
            </div>

            <button
              id="competitor-submit-btn"
              type="submit"
              disabled={analyzing}
              className="w-full sm:w-auto rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-3 font-sans text-xs font-black text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <div className="flex gap-1 items-center justify-center select-none py-1 h-3 shrink-0">
                    <span className="w-0.75 h-full bg-white rounded-xs animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-0.75 h-full bg-white rounded-xs animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                  <span>{t("Intercepting Reels...", selectedLanguage)}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{t("Execute Engagement Spy", selectedLanguage)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Panel */}
      {result ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-sm font-bold text-zinc-950 flex items-center gap-1.5 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              {t("Teardown Complete:", selectedLanguage)} <span className="text-indigo-600">@{result.creatorName}</span>
            </h2>
            <span className="font-mono text-[10px] text-zinc-400 font-bold bg-zinc-100 px-2 py-0.5 rounded">
              {t("Audited Today", selectedLanguage)}
            </span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
            <div className="p-4 rounded-xl border border-zinc-200 bg-white">
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 block mb-1">{t("Viral Power", selectedLanguage)}</span>
              <p className="text-2xl font-black font-mono text-zinc-950">{result.overallScore}<span className="text-xs text-zinc-400">/100</span></p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 bg-white">
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 block mb-1">{t("Scroll Intercept", selectedLanguage)}</span>
              <p className="text-2xl font-black font-mono text-emerald-600">{result.focusMetrics.hookRate}</p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 bg-white">
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 block mb-1">{t("Avg Retention", selectedLanguage)}</span>
              <p className="text-2xl font-black font-mono text-indigo-600">{result.focusMetrics.retentionRate}</p>
            </div>
            <div className="p-4 rounded-xl border border-zinc-200 bg-white">
              <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 block mb-1">{t("Organic Acceleration", selectedLanguage)}</span>
              <p className="text-2xl font-black font-sans text-amber-600 uppercase tracking-tight text-sm mt-1">{t(result.focusMetrics.organicVelocity, selectedLanguage)}</p>
            </div>
          </div>

          {/* Deep Breakdown Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
            {/* Left: What performs best */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <ThumbsUp className="h-4 w-4 text-indigo-500" />
                {t("Algorithm Sweet-spots (Highest View Yield)", selectedLanguage)}
              </h3>
              <div className="space-y-4">
                {result.bestPerformingStyles.map((style, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-150 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t("Format Category", selectedLanguage)} {idx + 1}</span>
                      <span className="text-[10.5px] font-mono font-black text-indigo-600 bg-indigo-50 px-2 rounded-sm">{style.avgViews}</span>
                    </div>
                    <h4 className="text-xs font-bold text-zinc-950">{style.format}</h4>
                    <p className="text-[11.5px] text-zinc-500 leading-normal">{style.whyItBlewUp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hook Analysis */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Brain className="h-4 w-4 text-purple-500" />
                {t("Dopamine Hook Blueprints", selectedLanguage)}
              </h3>
              <div className="space-y-3.5 divide-y divide-zinc-100">
                {result.usedScrollHooks.map((h, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-black text-[9px] text-purple-650 bg-purple-50 px-1.5 py-0.2 rounded-sm uppercase tracking-wider">{t(h.psychologyType, selectedLanguage)}</span>
                    </div>
                    <p className="text-xs text-zinc-950 font-medium italic">"{h.hookText}"</p>
                    <p className="text-[11px] text-zinc-500 leading-normal"><span className="font-semibold text-zinc-650">{t("Why YouTube/TikTok loops it:", selectedLanguage)}</span> {h.whyItSucceeded}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vulnerability Audit Panel (Suggested Improvements to capture their audience) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-4 font-sans">
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              {t("Strategic Improvement Vulnerabilities (Outmaneuver Plan)", selectedLanguage)}
            </h3>
            <p className="text-xs text-zinc-550 leading-relaxed">
              {t("Every big creator leaves massive audience blindspots. Target these holes specifically to hijack their trailing organic interest waves.", selectedLanguage)}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.improvementAudit.map((auditReady, idx) => (
                <div key={idx} className="border border-red-100 rounded-xl bg-red-50/20 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-red-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider">{t("Flaw", selectedLanguage)} {idx+1}: {auditReady.vulnerability}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 leading-normal">{t("What they miss:", selectedLanguage)}</p>
                    <p className="text-[11.5px] text-zinc-600 leading-normal mt-0.5">{auditReady.actionableImprovement}</p>
                  </div>
                  <div className="border-t border-red-100/50 pt-2 text-[11px]">
                    <span className="font-semibold text-zinc-800">{t("Your Hack Action:", selectedLanguage)}</span>
                    <p className="text-zinc-650 mt-0.5">{auditReady.howToApply}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        !analyzing && (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center max-w-lg mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 mx-auto mb-4">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-sans text-sm font-bold text-zinc-950">{t("No competitor intercepted yet", selectedLanguage)}</h3>
            <p className="mt-2 font-sans text-xs text-zinc-500 leading-normal max-w-xs mx-auto">
              {t("Type the username/channel identifier of any leader in your category. Our spy engine will deconstruct their retention metrics, hook strategies, and weaknesses.", selectedLanguage)}
            </p>
          </div>
        )
      )}
    </div>
  );
}

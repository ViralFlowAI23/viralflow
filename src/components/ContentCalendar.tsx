import React, { useState, useEffect } from 'react';
import { UserState, Platform } from '../types';
import { LANGUAGES, translateObject, t } from '../utils/translator';
import { 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Filter, 
  Trash2, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';

interface ContentCalendarProps {
  user: UserState;
  setView: (view: any) => void;
  incrementGeneration: () => boolean;
  selectedLanguage: string;
  onLanguageChange: (langName: string) => void;
}

interface CalendarDay {
  day: number;
  title: string;
  hook: string;
  visualDirection: string;
  cta: string;
  platform: Platform;
  status: 'Not Started' | 'Scripting' | 'Filming' | 'Scheduled' | 'Done';
}

export default function ContentCalendar({ user, setView, incrementGeneration, selectedLanguage, onLanguageChange }: ContentCalendarProps) {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [toast, setToast] = useState('');

  // Load calendar if it exists in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('viralflow_active_calendar');
      if (saved) {
        setCalendar(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const saveCalendar = (updated: CalendarDay[]) => {
    setCalendar(updated);
    localStorage.setItem('viralflow_active_calendar', JSON.stringify(updated));
  };

  const handleCreateCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (!incrementGeneration()) {
      triggerToast(t("⚠️ Daily limit checked. Upgrade to Pro for unlimited 30-day playbooks!", selectedLanguage));
      return;
    }

    setGenerating(true);

    // Simulate scheduling pipeline
    setTimeout(() => {
      const formatted = topic.trim();
      const generatedDays: CalendarDay[] = [];

      const hooksPool = [
        "If you are still doing this in [Niche], you are throwing away five hours a week.",
        "Here are three free cheat websites that will completely replace your current setup.",
        "The dark psychology of how people actually succeed in [Niche] today.",
        "Stop paying massive bills for designers. Try this ten-dollar alternative.",
        "I tested ten popular [Niche] hacks over five days, and only one actually works.",
        "The absolute fastest strategy to go from a beginner to a high-earning independent in [Niche].",
        "Stop scrolling past if you care about automating your digital workflow."
      ];

      const visualPool = [
        "A fast-paced split-screen screen capture showing manual setups on the left versus automated scripts on the right.",
        "Speak directly and closely to the lens under soft lighting, sketching out a simple curve on raw paper.",
        "A timelapse video of you opening mechanical blueprints, accompanied by energetic slide overlays.",
        "A cinematic, high-contrast flat lay of your device workspace with clean typography overlays popping on sound beats.",
        "Green screen overlay behind your head of a viral tweet or discussion thread, highlighting the controversial points."
      ];

      const ctaPool = [
        "Comment 'FORMULA' below and my automation script is heading to your direct messages.",
        "Save this template so you always have a mental fallback during high-stress weeks.",
        "Click the link in my bio to read my completely free five-page technical layout guide.",
        "Tap the follow icon for your daily technical design and optimization cheat sheet."
      ];

      for (let day = 1; day <= 30; day++) {
        const p: Platform = day % 3 === 0 ? 'TikTok' : day % 3 === 1 ? 'Instagram Reels' : 'YouTube Shorts';
        
        // Formulate day title
        let formattedTitle = '';
        if (day % 5 === 1) formattedTitle = `How I solved my biggest crisis in ${formatted}`;
        else if (day % 5 === 2) formattedTitle = `The trap everyone falls into when studying ${formatted}`;
        else if (day % 5 === 3) formattedTitle = `A $0 checklist that will replace 10 tools in ${formatted}`;
        else if (day % 5 === 4) formattedTitle = `Stop doing mechanical chores in ${formatted}. Do this instead.`;
        else formattedTitle = `My favorite high-leverage hack for ${formatted} developers.`;

        generatedDays.push({
          day,
          title: formattedTitle,
          hook: hooksPool[(day + 2) % hooksPool.length].replace('[Niche]', formatted),
          visualDirection: visualPool[(day+1) % visualPool.length],
          cta: ctaPool[(day + 4) % ctaPool.length],
          platform: p,
          status: 'Not Started'
        });
      }

      const translatedDays = translateObject(generatedDays, selectedLanguage);
      saveCalendar(translatedDays);
      setGenerating(false);
      triggerToast(t("📅 Prepared 30-Day Creator Calendar Matrix!", selectedLanguage));
    }, 1800);
  };

  const handleStatusChange = (dayNum: number, newStatus: any) => {
    const updated = calendar.map(d => {
      if (d.day === dayNum) {
        return { ...d, status: newStatus };
      }
      return d;
    });
    saveCalendar(updated);
    triggerToast(`${t("Day", selectedLanguage)} ${dayNum} ${t("status updated to:", selectedLanguage)} ${t(newStatus, selectedLanguage)}`);
  };

  const deleteCalendar = () => {
    if (window.confirm(t("Are you sure you want to delete and reset your current calendar?", selectedLanguage))) {
      saveCalendar([]);
      localStorage.removeItem('viralflow_active_calendar');
      triggerToast(t("Calendar reset completed.", selectedLanguage));
    }
  };

  // Metrics
  const completedCount = calendar.filter(d => d.status === 'Done').length;
  const progressPercent = calendar.length > 0 ? Math.round((completedCount / calendar.length) * 100) : 0;
  const filteredDays = calendar.filter(d => {
    if (filter === 'All') return true;
    return d.status === filter;
  });

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-black px-4 py-3 font-sans text-xs font-semibold text-white shadow-xl flex items-center gap-1.5 ring-1 ring-white/10">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Context */}
      <div className="border-b border-zinc-100 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-sans text-2xl font-bold text-zinc-950 sm:text-3xl tracking-tight flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                <Calendar className="h-4.5 w-4.5" />
              </span>
              {t("30-Day Content Planner", selectedLanguage)}
            </h1>
            <p className="font-sans text-xs text-zinc-500 mt-1">
              {t("Generate 30 strategic video briefs for your niche. Filter status to streamline your camera recording pipeline.", selectedLanguage)}
            </p>
          </div>
          {calendar.length > 0 && (
            <button
               id="calendar-reset-btn"
               onClick={deleteCalendar}
               className="text-[11.5px] font-sans font-bold text-red-500 hover:text-red-700 border border-red-200 bg-red-50/40 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("Reset Matrix", selectedLanguage)}
            </button>
          )}
        </div>
      </div>

      {calendar.length === 0 ? (
        /* Empty State Form */
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-8 shadow-2xs max-w-2xl mx-auto">
          <div className="text-center space-y-2 mb-6">
            <h3 className="font-sans text-base font-bold text-zinc-950">{t("Draft your 30-Day Master Campaign", selectedLanguage)}</h3>
            <p className="font-sans text-xs text-zinc-500 max-w-md mx-auto">
              {t("Our creator engine designs a balanced calendar (combining Authority-builders, Mistake breakdowns, and high-conversions CTAs) distributed over 4 weeks.", selectedLanguage)}
            </p>
          </div>

          <form onSubmit={handleCreateCalendar} className="space-y-4">
            <div>
              <label className="block font-sans text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                {t("Target Niche Area (e.g. Minimalist design, Solidity dev, Health hacks)", selectedLanguage)}
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t("Type your micro-category to build corresponding templates...", selectedLanguage)}
                className="w-full text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 font-sans outline-hidden focus:border-zinc-950 focus:bg-white transition-all text-zinc-900 placeholder:text-zinc-400"
                required
              />
            </div>

            {/* Language dropdown select */}
            <div>
              <label className="block font-sans text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                {t("Output Language", selectedLanguage)}
              </label>
              <select
                id="calendar-lang-select"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full text-xs rounded-lg border border-zinc-200 bg-white px-3 py-2.5 font-sans outline-hidden focus:border-zinc-950 cursor-pointer h-10"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.name}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="calendar-submit-btn"
              type="submit"
              disabled={generating}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3 font-sans text-xs font-black text-white hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="flex gap-1 items-center justify-center select-none py-1 h-3 shrink-0">
                    <span className="w-0.75 h-full bg-white rounded-xs animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-0.75 h-full bg-white rounded-xs animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                  <span>{t("Configuring Monthly Agenda...", selectedLanguage)}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{t("Construct 30-Day Content Framework", selectedLanguage)}</span>
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Active Calendar Layout */
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 flex flex-col sm:flex-row items-center justify-between gap-5 font-sans">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-2xs">
                <Activity className="h-5 w-5" />
              </span>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-zinc-900">{t("Campaign Execution Index", selectedLanguage)}</h3>
                <p className="text-[11.5px] text-zinc-400">{completedCount} {t("of", selectedLanguage)} 30 {t("items published", selectedLanguage)} ({progressPercent}% {t("Completed", selectedLanguage)})</p>
              </div>
            </div>

            {/* Progress Bar visual */}
            <div className="flex-1 w-full max-w-sm">
              <div className="flex items-center justify-between font-mono text-[10.5px] font-black text-zinc-400 mb-1">
                <span>{t("Production Progress", selectedLanguage)}</span>
                <span className="text-emerald-600">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Filtering Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 font-sans">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Filter className="h-3.5 w-3.5" />
              <span className="text-xs font-bold uppercase tracking-wider text-[10.5px]">{t("Filter Status:", selectedLanguage)}</span>
            </div>

            <div className="flex flex-wrap gap-1 col-span-3">
              {['All', 'Not Started', 'Scripting', 'Filming', 'Scheduled', 'Done'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilter(st)}
                  className={`rounded-md px-2 py-0.5 text-[10px] sm:text-[10.5px] font-bold transition-all cursor-pointer ${
                    filter === st 
                      ? 'bg-zinc-900 text-white' 
                      : 'text-zinc-500 bg-zinc-100 hover:text-black'
                  }`}
                >
                  {t(st, selectedLanguage)}
                </button>
              ))}
            </div>
          </div>

          {/* 30-Day Grid */}
          {filteredDays.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-200 bg-white font-sans">
              <p className="text-zinc-400 font-mono text-xs">{t('No ideas categorized under "{filter}" status currently', selectedLanguage).replace('{filter}', t(filter, selectedLanguage))}</p>
              <button 
                onClick={() => setFilter('All')} 
                className="mt-3.5 rounded-lg border border-zinc-200 px-3 py-1 bg-white text-xs text-zinc-800 hover:bg-zinc-50 font-semibold cursor-pointer"
              >
                {t("Clear Filters", selectedLanguage)}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDays.map((dayItem) => {
                const isOpen = expandedDay === dayItem.day;
                
                const statusColors = {
                  'Not Started': 'bg-zinc-100 text-zinc-650 border-zinc-250',
                  'Scripting': 'bg-blue-50 text-blue-750 border-blue-200',
                  'Filming': 'bg-amber-50 text-amber-700 border-amber-200',
                  'Scheduled': 'bg-purple-50 text-purple-750 border-purple-200',
                  'Done': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                };

                return (
                  <div 
                    key={dayItem.day} 
                    className={`rounded-2xl border bg-white shadow-2xs font-sans transition-all overflow-hidden ${
                      isOpen ? 'ring-1 ring-zinc-900 border-zinc-950 sm:col-span-2 lg:col-span-3' : 'hover:border-zinc-350'
                    }`}
                  >
                    {/* Header bar of card */}
                    <div className="p-4 flex items-center justify-between gap-3 bg-zinc-50/50 border-b border-zinc-100">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white text-[11px] font-black font-mono">
                          {t("d", selectedLanguage)}{dayItem.day}
                        </span>
                        <span className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[9.5px] font-bold ${
                          dayItem.platform === 'TikTok' ? 'bg-black text-white' :
                          dayItem.platform === 'Instagram Reels' ? 'bg-indigo-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {dayItem.platform}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={dayItem.status}
                          aria-label={`${t("Production status for day", selectedLanguage)} ${dayItem.day}`}
                          onChange={(e) => handleStatusChange(dayItem.day, e.target.value as any)}
                          className={`text-[9.5px]/none font-bold rounded-md border px-2 py-1 outline-hidden cursor-pointer ${statusColors[dayItem.status]}`}
                        >
                          <option value="Not Started">{t("Not Started", selectedLanguage)}</option>
                          <option value="Scripting">{t("Scripting", selectedLanguage)}</option>
                          <option value="Filming">{t("Filming", selectedLanguage)}</option>
                          <option value="Scheduled">{t("Scheduled", selectedLanguage)}</option>
                          <option value="Done">{t("Done", selectedLanguage)}</option>
                        </select>

                        <button
                          onClick={() => setExpandedDay(isOpen ? null : dayItem.day)}
                          className="rounded border border-zinc-200 bg-white p-1 text-zinc-455 hover:text-black cursor-pointer bg-white"
                          title={t("Toggle details", selectedLanguage)}
                        >
                          {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Basic content */}
                    <div className="p-4 space-y-2">
                      <h4 className="text-xs font-bold text-zinc-950 leading-snug line-clamp-2">
                        {dayItem.title}
                      </h4>
                      <p className="font-sans text-[11px] text-zinc-500 italic line-clamp-2">
                        "{dayItem.hook}"
                      </p>
                    </div>

                    {/* Expanded complete details */}
                    {isOpen && (
                      <div className="border-t border-zinc-150 p-4 bg-zinc-50/50 space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="rounded-xl border border-zinc-150 bg-white p-3.5 space-y-1">
                            <span className="font-sans text-[10px] font-black uppercase tracking-widest text-zinc-400 block">{t("Day Hook Psychology", selectedLanguage)}</span>
                            <p className="text-zinc-900 font-medium italic">"{dayItem.hook}"</p>
                          </div>

                          <div className="rounded-xl border border-zinc-150 bg-white p-3.5 space-y-1">
                            <span className="font-sans text-[10px] font-black uppercase tracking-widest text-zinc-400 block">{t("AV Scene Shot Blueprint", selectedLanguage)}</span>
                            <p className="text-zinc-650 leading-relaxed">{dayItem.visualDirection}</p>
                          </div>

                          <div className="rounded-xl border border-zinc-150 bg-white p-3.5 space-y-1">
                            <span className="font-sans text-[10px] font-black uppercase tracking-widest text-zinc-400 block">{t("Strategic Conversion Call-To-Action", selectedLanguage)}</span>
                            <p className="text-zinc-900 font-bold leading-relaxed">{dayItem.cta}</p>
                          </div>
                        </div>

                        {/* Viral score explanation in context */}
                        <div className="rounded-xl bg-orange-50/80 border border-orange-100 p-3.5 flex items-start gap-2.5">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white font-black text-[9px]">i</div>
                          <div className="space-y-0.5">
                            <span id={`viral-score-tag-${dayItem.day}`} className="block text-[11px] font-bold text-orange-950">{t("Viral Psychology Factor: 95/100 Velocity Index", selectedLanguage)}</span>
                            <p className="text-[11px] text-orange-900/80 leading-relaxed">
                              {t("This video succeeds because it pairs a contrarian narrative hook with a high-retention split-screen storyboard direction. Setting the visual pacing high in the initial five seconds triggers algorithmic validation loops, driving up organic share indexing.", selectedLanguage)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { ViewType, UserState, VideoIdea, SavedHook, ScriptItem, HashtagSet, CreatorFolder } from '../types';
import LanguageSelector from './LanguageSelector';
import { t } from '../utils/translator';
import { 
  Plus, 
  Lightbulb, 
  Sparkles, 
  FileText, 
  Hash, 
  ExternalLink,
  Cpu, 
  Bookmark, 
  Trash2, 
  Copy, 
  Check, 
  TrendingUp, 
  Flame,
  Tv,
  Instagram,
  Clapperboard,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Award,
  Zap,
  Folder,
  FolderPlus,
  FolderOpen,
  ArrowRight,
  Send,
  BarChart3,
  MousePointerClick
} from 'lucide-react';

const PRELOADED_DEMO_IDEAS: VideoIdea[] = [
  {
    id: 'demo-1',
    title: "Stop using Google Sheets for this",
    hook: "If you are still using Google Sheets to manage your clients, stop right now.",
    description: "Showcases how integrating simple automated workflows with modern CRM setups can recapture up to 10 hours of wasted developer time every single week.",
    structure: {
      hook: "If you are still using Google Sheets to manage clients, stop.",
      body: "Walkthrough a real client migration running automatically from a form submission directly to Airtable via a custom webhook link.",
      cta: "Comment 'AUTOMATE' below and I will send you my exact workflow formula for free!"
    },
    cta: "Comment 'AUTOMATE' below",
    difficulty: "Easy",
    score: 96,
    platform: "TikTok",
    style: "educational",
    niche: "Productivity & Tech"
  },
  {
    id: 'demo-2',
    title: "I built 5 startups in 5 days (Why 4 failed)",
    hook: "I attempted to build, deploy, and launch 5 software startups in exactly 5 days.",
    description: "A brutal breakdown of how API limits, system fatigue, and sloppy marketing killed 4 launch attempt products, leaving only 1 survivor.",
    structure: {
      hook: "I built 5 startups in 5 days. Here is why 4 of them died immediately.",
      body: "High-paced timelapse montage showing lines of code, late night errors, server crashes, and the sole survivor generating $200 on ProductHunt.",
      cta: "Grab the exact technology stack I used by clicking the link in my bio."
    },
    cta: "Click bio stack link",
    difficulty: "Hard",
    score: 94,
    platform: "YouTube Shorts",
    style: "storytime",
    niche: "SaaS Dev & Startups"
  },
  {
    id: 'demo-3',
    title: "The $10 template that replaces designers",
    hook: "This single layout structure makes any raw developer look like a premium UI designer.",
    description: "A deep dive into visual minimalism showing how Space Grotesk headings, generous grid alignment, and clean margins beat heavy design patterns.",
    structure: {
      hook: "Stop paying $5,000 for freelance designer agencies.",
      body: "Reveal a minimalist wireframe package with elegant glassmorphic components and perfect spacing rules.",
      cta: "Tap follow for daily developer styling cheat codes."
    },
    cta: "Tap follow for styling cheat codes",
    difficulty: "Medium",
    score: 98,
    platform: "Instagram Reels",
    style: "luxury",
    niche: "No-Code & Automation"
  }
];

const DEFAULT_FOLDERS: CreatorFolder[] = [
  { id: 'fol-1', name: '🔥 High-Conversion Hooks', color: 'orange', createdAt: new Date().toISOString() },
  { id: 'fol-2', name: '💼 SaaS Launch Playbook', color: 'indigo', createdAt: new Date().toISOString() },
  { id: 'fol-3', name: '🧪 Fast Experiments', color: 'emerald', createdAt: new Date().toISOString() }
];

interface DashboardProps {
  setView: (view: ViewType) => void;
  user: UserState;
  onSetGeneratedNiche: (niche: string) => void;
  selectedLanguage: string;
  onLanguageChange: (langName: string) => void;
}

export default function Dashboard({ 
  setView, 
  user, 
  onSetGeneratedNiche,
  selectedLanguage,
  onLanguageChange
}: DashboardProps) {
  const [copystate, setCopystate] = useState<{ [key: string]: boolean }>({});
  const [expandedIdeaId, setExpandedIdeaId] = useState<string | null>(null);
  const [localToast, setLocalToast] = useState('');
  
  // Saved data states
  const [savedIdeas, setSavedIdeas] = useState<VideoIdea[]>([]);
  const [savedHooks, setSavedHooks] = useState<SavedHook[]>([]);
  const [notableScripts, setNotableScripts] = useState<ScriptItem[]>([]);
  const [notableHashtags, setNotableHashtags] = useState<HashtagSet[]>([]);
  
  // Folder states
  const [folders, setFolders] = useState<CreatorFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('All'); // 'All' | 'Unassigned' | [folderId]
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('indigo');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Modern interactive analytics metrics hover states
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; value: string; desc: string } | null>(null);

  // Load workspace saves & folders from localStorage
  const loadWorkspace = () => {
    try {
      const ideas = JSON.parse(localStorage.getItem('viralflow_ideas') || '[]');
      const hooks = JSON.parse(localStorage.getItem('viralflow_hooks') || '[]');
      const scripts = JSON.parse(localStorage.getItem('viralflow_scripts') || '[]');
      const tags = JSON.parse(localStorage.getItem('viralflow_hashtags') || '[]');
      
      setSavedIdeas(ideas);
      setSavedHooks(hooks);
      setNotableScripts(scripts);
      setNotableHashtags(tags);

      // Load folders
      const storedFolders = localStorage.getItem('viralflow_folders');
      if (storedFolders) {
        setFolders(JSON.parse(storedFolders));
      } else {
        localStorage.setItem('viralflow_folders', JSON.stringify(DEFAULT_FOLDERS));
        setFolders(DEFAULT_FOLDERS);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, []);

  const triggerToastLocal = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(''), 3000);
  };

  const triggerCopy = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopystate({ ...copystate, [key]: true });
    setTimeout(() => {
      setCopystate((prev) => ({ ...prev, [key]: false }));
    }, 1500);
  };

  // Saved Workspace item deletion
  const deleteWorkspaceItem = (listKey: string, id: string) => {
    try {
      const items = JSON.parse(localStorage.getItem(listKey) || '[]');
      const updated = items.filter((x: any) => x.id !== id);
      localStorage.setItem(listKey, JSON.stringify(updated));
      loadWorkspace();
      triggerToastLocal(t("Deleted template from saved workspace.", selectedLanguage));
    } catch (e) {
      console.error(e);
    }
  };

  // Re-allocate item to a folder
  const handleMoveToFolder = (listKey: string, itemId: string, targetFolderId: string) => {
    try {
      const items = JSON.parse(localStorage.getItem(listKey) || '[]');
      const updated = items.map((x: any) => {
        if (x.id === itemId) {
          return { ...x, folderId: targetFolderId === 'Unassigned' ? undefined : targetFolderId };
        }
        return x;
      });
      localStorage.setItem(listKey, JSON.stringify(updated));
      loadWorkspace();
      triggerToastLocal(t("Relocated saved item to folder!", selectedLanguage));
    } catch (e) {
      console.error(e);
    }
  };

  // Create folder
  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    if (folders.length >= 8 && user.tier === 'free') {
      triggerToastLocal(t("⚠️ Folders are limited to 8 allocations on Free plan. Upgrade!", selectedLanguage));
      return;
    }

    const newFolder: CreatorFolder = {
      id: `fol-${Date.now()}`,
      name: newFolderName.trim(),
      color: newFolderColor,
      createdAt: new Date().toISOString()
    };

    const updated = [...folders, newFolder];
    setFolders(updated);
    localStorage.setItem('viralflow_folders', JSON.stringify(updated));
    setNewFolderName('');
    setIsCreatingFolder(false);
    triggerToastLocal(t('Folder "{name}" successfully integrated!', selectedLanguage).replace('{name}', newFolder.name));
  };

  // Remove Folder
  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm(t("Delete folder? Containing works will be safe but return to Unassigned Workspace.", selectedLanguage))) {
      const updatedFolders = folders.filter(f => f.id !== folderId);
      setFolders(updatedFolders);
      localStorage.setItem('viralflow_folders', JSON.stringify(updatedFolders));
      
      // Clean target folders inside local saves
      const unassignItems = (listKey: string) => {
        const items = JSON.parse(localStorage.getItem(listKey) || '[]');
        const updated = items.map((x: any) => {
          if (x.folderId === folderId) {
            const { folderId: _, ...rest } = x;
            return rest;
          }
          return x;
        });
        localStorage.setItem(listKey, JSON.stringify(updated));
      };
      
      unassignItems('viralflow_ideas');
      unassignItems('viralflow_hooks');
      unassignItems('viralflow_scripts');
      unassignItems('viralflow_hashtags');
      
      setSelectedFolderId('All');
      loadWorkspace();
      triggerToastLocal(t("Folder deleted. Assets kept in general workspace.", selectedLanguage));
    }
  };

  const handleNicheLaunch = (nicheName: string) => {
    onSetGeneratedNiche(nicheName);
    setView('ideas');
  };

  const handleSeedIdea = (idea: VideoIdea) => {
    try {
      const stored = JSON.parse(localStorage.getItem('viralflow_ideas') || '[]');
      
      if (stored.some((x: any) => x.id === idea.id)) {
        const filtered = stored.filter((x: any) => x.id !== idea.id);
        localStorage.setItem('viralflow_ideas', JSON.stringify(filtered));
        loadWorkspace();
        triggerToastLocal(t("Removed demo template from saved workspace.", selectedLanguage));
      } else {
        if (user.tier === 'free' && stored.length >= 5) {
          triggerToastLocal(t("⚠️ Free tier limits workspace to 5 saves. Upgrade!", selectedLanguage));
          return;
        }

        const withDate = { ...idea, savedAt: new Date().toISOString() };
        stored.push(withDate);
        localStorage.setItem('viralflow_ideas', JSON.stringify(stored));
        loadWorkspace();
        triggerToastLocal(t("Successfully saved idea to Workspace!", selectedLanguage));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Calculate stats
  const totalSavedCount = savedIdeas.length + savedHooks.length + notableScripts.length + notableHashtags.length;

  // Render combined items inside folder
  const getCompiledFolderItems = () => {
    const items: { type: 'Idea' | 'Hook' | 'Script' | 'Hashtag'; id: string; title: string; subtitle: string; raw: any; listKey: string }[] = [];
    
    savedIdeas.forEach(x => {
      if (selectedFolderId === 'All' || (selectedFolderId === 'Unassigned' && !x.folderId) || x.folderId === selectedFolderId) {
        items.push({ type: 'Idea', id: x.id, title: t(x.title, selectedLanguage), subtitle: `${x.platform} • ${t(x.style || '', selectedLanguage)}`, raw: x, listKey: 'viralflow_ideas' });
      }
    });

    savedHooks.forEach(x => {
      if (selectedFolderId === 'All' || (selectedFolderId === 'Unassigned' && !x.folderId) || x.folderId === selectedFolderId) {
        items.push({ type: 'Hook', id: x.id, title: `"${t(x.hook, selectedLanguage)}"`, subtitle: `${t("Topic", selectedLanguage)}: ${t(x.topic, selectedLanguage)}`, raw: x, listKey: 'viralflow_hooks' });
      }
    });

    notableScripts.forEach(x => {
      if (selectedFolderId === 'All' || (selectedFolderId === 'Unassigned' && !x.folderId) || x.folderId === selectedFolderId) {
        items.push({ type: 'Script', id: x.id, title: t(x.hook, selectedLanguage), subtitle: `${t("Topic", selectedLanguage)}: ${t(x.topic, selectedLanguage)} (${x.duration})`, raw: x, listKey: 'viralflow_scripts' });
      }
    });

    notableHashtags.forEach(x => {
      if (selectedFolderId === 'All' || (selectedFolderId === 'Unassigned' && !x.folderId) || x.folderId === selectedFolderId) {
        const tags = [...x.broad, ...x.niche, ...x.viral].join(' ');
        items.push({ type: 'Hashtag', id: x.id, title: tags, subtitle: `${x.platform} • ${t("Topic", selectedLanguage)}: ${t(x.topic, selectedLanguage)}`, raw: x, listKey: 'viralflow_hashtags' });
      }
    });

    return items;
  };

  const displayedFolderItems = getCompiledFolderItems();

  // Color mapping utilities and values
  const folderColorMap: { [key: string]: { bg: string, text: string, border: string, chip: string } } = {
    indigo: { bg: 'bg-indigo-50/50 hover:bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', chip: 'bg-indigo-100 text-indigo-800' },
    orange: { bg: 'bg-orange-50/50 hover:bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', chip: 'bg-orange-100 text-orange-850' },
    emerald: { bg: 'bg-emerald-50/50 hover:bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', chip: 'bg-emerald-100 text-emerald-800' },
    purple: { bg: 'bg-purple-50/50 hover:bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', chip: 'bg-purple-100 text-purple-800' },
    blue: { bg: 'bg-blue-50/50 hover:bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', chip: 'bg-blue-100 text-blue-800' },
    red: { bg: 'bg-red-50/50 hover:bg-red-50', text: 'text-red-600', border: 'border-red-100', chip: 'bg-red-100 text-red-800' },
    amber: { bg: 'bg-amber-50/50 hover:bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', chip: 'bg-amber-100 text-amber-850' },
  };

  const activeFolder = folders.find(f => f.id === selectedFolderId);

  // Modern interactive SVG Chart Data Points representing retention predictions
  const chartPoints = [
    { x: 30, y: 150, day: t('Day 1', selectedLanguage), engagement: '14.5K', desc: t('Campaign Launch', selectedLanguage) },
    { x: 100, y: 110, day: t('Day 5', selectedLanguage), engagement: '28.2K', desc: t('Hook Optimizations Done', selectedLanguage) },
    { x: 170, y: 125, day: t('Day 10', selectedLanguage), engagement: '22.8K', desc: t('Platform Gaps Filled', selectedLanguage) },
    { x: 240, y: 65, day: t('Day 15', selectedLanguage), engagement: '46.1K', desc: t('First Video Going Viral', selectedLanguage) },
    { x: 310, y: 80, day: t('Day 20', selectedLanguage), engagement: '39.4K', desc: t('Steady Bio-CTR Spikes', selectedLanguage) },
    { x: 380, y: 35, day: t('Day 25', selectedLanguage), engagement: '61.7K', desc: t('Contrarian Matrix Spikes', selectedLanguage) },
    { x: 450, y: 20, day: t('Day 30', selectedLanguage), engagement: '74.2K', desc: t('Campaign Target Reached', selectedLanguage) }
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {localToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-black px-4 py-3 font-sans text-xs font-semibold text-white shadow-xl flex items-center gap-1.5 ring-1 ring-white/10">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{localToast}</span>
        </div>
      )}

      {/* Huge, Spectacular creator hero and High-Impact CTA banner section */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white border border-zinc-850 p-6 sm:p-8 lg:p-10 shadow-xl">
        <div className="absolute inset-0 bg-radial-[at_top_right] from-orange-500/20 via-transparent to-transparent opacity-70 pointer-events-none" />
        
        <div className="relative max-w-2xl space-y-4 font-sans">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-xs text-orange-400 font-bold border border-zinc-700/60 shadow-2xs">
            <Flame className="h-3.5 w-3.5" />
            {t("ViralFlow Creator Engine Active", selectedLanguage)}
          </span>

          <h2 className="text-xl sm:text-2xl lg:text-3.5xl font-black tracking-tight leading-none text-zinc-50">
            {t("Stop guessing what to post.", selectedLanguage)}<br />
            {t("Start creating viral content.", selectedLanguage)}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 leading-normal max-w-lg">
            {t("Say goodbye to creative writer's block. Lock down high-retention video hooks, auto-format strategic 30-day schedules, and organize your assets into visual project directories.", selectedLanguage)}
          </p>

          <div className="pt-3.5 flex flex-wrap gap-3">
            <button
              id="hero-cta-trends"
              onClick={() => setView('trends')}
              className="rounded-xl bg-orange-500 hover:bg-orange-600 px-4.5 py-2.5 text-xs font-extrabold text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>{t("Scan Trends Gaps", selectedLanguage)}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="hero-cta-calendar"
              onClick={() => setView('calendar')}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 font-bold text-xs px-4.5 py-2.5 transition-colors cursor-pointer flex items-center gap-1"
            >
              {t("Configure 30-Day Matrix", selectedLanguage)}
            </button>
          </div>
        </div>
      </div>

      {/* Modern interactive analytics dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* Analytics main chart block */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-zinc-100">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-zinc-950 flex items-center gap-1.5">
                <BarChart3 className="h-4.5 w-4.5 text-orange-500" />
                {t("30-Day Organic Engagement Forecast", selectedLanguage)}
              </h3>
              <p className="text-[11px] text-zinc-500">{t("Predicted algorithmic reach based on targeted style retention", selectedLanguage)}</p>
            </div>
            <span className="rounded bg-orange-50 text-orange-700 text-[10px] font-mono tracking-wider font-extrabold px-2 py-0.5 self-start">
              {t("Model accuracy:", selectedLanguage)} 96.8%
            </span>
          </div>

          {/* Scalable and highly responsive Interactive Custom SVG Plot */}
          <div className="relative pt-4">
            {hoveredPoint && (
              <div 
                className="absolute z-10 rounded-xl bg-slate-900 text-white p-2.5 shadow-md text-[10.5px] font-sans border border-slate-800 pointer-events-none"
                style={{ 
                  left: `${(hoveredPoint.x / 500) * 100}%`, 
                  top: `${hoveredPoint.y - 70}px`, 
                  transform: 'translateX(-50%)' 
                }}
              >
                <p className="font-bold text-orange-400">{hoveredPoint.label}</p>
                <p className="font-semibold text-white mt-0.5">{t("Est. Reach", selectedLanguage)}: {hoveredPoint.value}</p>
                <p className="text-[9.5px] text-zinc-400 font-normal">{hoveredPoint.desc}</p>
              </div>
            )}

            <svg viewBox="0 0 500 170" className="w-full h-44 overflow-visible select-none">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="470" y2="20" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="65" x2="470" y2="65" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="120" x2="470" y2="120" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="150" x2="470" y2="150" stroke="#e4e4e7" strokeWidth="1.5" />

              {/* Area Under Curve */}
              <path 
                d="M 30 150 L 30 150 L 100 110 L 170 125 L 240 65 L 310 80 L 380 35 L 450 20 L 450 150 Z" 
                fill="url(#curveGradient)"
              />

              {/* Curve Line */}
              <path 
                d="M 30 150 L 100 110 L 170 125 L 240 65 L 310 80 L 380 35 L 450 20" 
                fill="none" 
                stroke="#f97316" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dynamic hotspot interactives */}
              {chartPoints.map((pt, i) => (
                <g key={i}>
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r="5" 
                    fill="#ffffff" 
                    stroke="#f97316" 
                    strokeWidth="2" 
                    className="cursor-pointer hover:r-7 transition-all"
                    onMouseEnter={() => setHoveredPoint({ x: pt.x, y: pt.y, label: pt.day, value: pt.engagement, desc: pt.desc })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <text 
                    x={pt.x} 
                    y="166" 
                    textAnchor="middle" 
                    className="font-mono text-[9px] font-bold fill-zinc-400"
                  >
                    {pt.day.replace(/[^0-9]/g, '')}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Dynamic Engagement indicators sidebar */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest font-mono">{t("retention safety indexes", selectedLanguage)}</h3>
          
          <div className="space-y-3.5">
            {[
              { label: "Target Organic CTR", value: "8.4%", desc: "Conversion click ratio", color: "text-orange-500 bg-orange-50" },
              { label: "Fail-safe Hook retention", value: "+12.4%", desc: "First 3-seconds loop velocity", color: "text-indigo-500 bg-indigo-50" },
              { label: "Average Retention score", value: "96.4%", desc: "Interactive algorithm indicator", color: "text-emerald-500 bg-emerald-50" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3 border-b last:border-b-0 border-zinc-100 pb-3 last:pb-0">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold font-mono text-sm ${stat.color}`}>
                  {stat.value.charAt(0) === '+' ? '🚀' : stat.value}
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-[11.5px] font-bold text-zinc-950 leading-none">{t(stat.label, selectedLanguage)}</h4>
                  <p className="text-[11px] text-zinc-400 leading-none">{t(stat.desc, selectedLanguage)} • {stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-dashed border-zinc-200 p-3.5 bg-zinc-50/50 text-[10.5px] leading-relaxed text-zinc-500">
            📊 <span className="font-semibold text-zinc-700">{t("Analytics Tip:", selectedLanguage)}</span> {t("Aim for under 15-second total storyboard pacing in physical storyboards to secure top tier TikTok suggestions.", selectedLanguage)}
          </div>
        </div>
      </div>

      {/* Guest Session warning section if applicable */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-6">
        <div>
          <h1 className="font-sans text-xl font-bold text-zinc-805 tracking-tight">{t("Folders & Workspace Assets", selectedLanguage)}</h1>
          <p className="font-sans text-xs text-zinc-500 mt-1">
            {user.isLoggedIn ? (
              <>{t("Active Session:", selectedLanguage)} <span className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 px-2 rounded">{user.email}</span></>
            ) : (
              <>{t("Guest Workspace Sandbox Mode", selectedLanguage)}</>
            )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="font-sans text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{t("Output Language:", selectedLanguage)}</span>
          <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
        </div>
      </div>

      {!user.isLoggedIn && (
        <div className="rounded-2xl border border-zinc-300 bg-zinc-50 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-sans text-sm font-bold text-black flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-500 animate-pulse" />
              {t("Optional Guest Sandbox Active", selectedLanguage)}
            </h3>
            <p className="font-sans text-xs text-zinc-500 leading-normal">
              {t("You can organize, seed folder assets, and edit content securely. Sign up for a permanent profile whenever you wish to export campaign playbooks to production.", selectedLanguage)}
            </p>
          </div>
          <button
            id="guest-bar-auth-btn"
            onClick={() => setView('auth')}
            className="rounded-lg bg-black text-white px-4 py-2 font-sans text-xs font-bold shadow-xs hover:bg-zinc-900 transition-colors cursor-pointer whitespace-nowrap"
          >
            {t("Create Permanent Account", selectedLanguage)}
          </button>
        </div>
      )}

       {/* Creator directory space Folder Manager */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-xs overflow-hidden">
        {/* Banner header */}
        <div className="bg-zinc-50 border-b border-zinc-250 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-2xs">
              <Folder className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-zinc-950">{t("Modular Project Folders", selectedLanguage)}</h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">{t("Organize saved concepts, scripting guides, topics, and hashtag sets", selectedLanguage)}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              id="folder-creation-trigger"
              onClick={() => setIsCreatingFolder(!isCreatingFolder)}
              className="rounded-lg border border-zinc-250 px-3.5 py-1.5 bg-white text-xs font-bold hover:bg-zinc-100 flex items-center gap-1.5 cursor-pointer"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>{t("Create Folder", selectedLanguage)}</span>
            </button>
          </div>
        </div>

        {/* Embedded Folder Creation Form */}
        {isCreatingFolder && (
          <div className="p-4 bg-zinc-50 border-b border-zinc-200 font-sans">
            <form onSubmit={handleCreateFolderSubmit} className="space-y-3 max-w-md">
              <h4 className="text-xs font-bold text-zinc-700 uppercase">{t("Interactive Folder Customizer", selectedLanguage)}</h4>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder={t("Enter folder name...", selectedLanguage)}
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-300 text-xs px-3 py-1.5 outline-hidden focus:border-black bg-white"
                  required
                />

                <select
                  aria-label="New folder color selection"
                  value={newFolderColor}
                  onChange={(e) => setNewFolderColor(e.target.value)}
                  className="rounded-lg border border-zinc-300 text-xs px-2 py-1 bg-white cursor-pointer"
                >
                  <option value="indigo">{t("Indigo", selectedLanguage)}</option>
                  <option value="orange">{t("Orange", selectedLanguage)}</option>
                  <option value="emerald">{t("Emerald", selectedLanguage)}</option>
                  <option value="purple">{t("Purple", selectedLanguage)}</option>
                  <option value="blue">{t("Blue", selectedLanguage)}</option>
                  <option value="red">{t("Red", selectedLanguage)}</option>
                  <option value="amber">{t("Amber", selectedLanguage)}</option>
                </select>

                <button
                  type="submit"
                  id="folder-submit-create"
                  className="rounded-lg bg-black text-white px-3.5 text-xs font-bold hover:bg-zinc-850 transition-colors cursor-pointer"
                >
                  {t("Add", selectedLanguage)}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Directory Filters / Folder Cards Row */}
        <div className="p-4 bg-zinc-50/50 border-b border-zinc-200/60 flex flex-wrap gap-2.5 font-sans">
          <button
            onClick={() => setSelectedFolderId('All')}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              selectedFolderId === 'All' 
                ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm' 
                : 'bg-white text-zinc-650 border-zinc-250 hover:bg-zinc-100'
            }`}
          >
            <FolderOpen className="h-4 w-4" />
            <span>{t("All Workspace Files", selectedLanguage)} ({totalSavedCount})</span>
          </button>

          <button
            onClick={() => setSelectedFolderId('Unassigned')}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
              selectedFolderId === 'Unassigned' 
                ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm' 
                : 'bg-white text-zinc-650 border-zinc-250 hover:bg-zinc-100'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span>{t("Unassigned / Inbox", selectedLanguage)} ({
              savedIdeas.filter(x => !x.folderId).length + 
              savedHooks.filter(x => !x.folderId).length + 
              notableScripts.filter(x => !x.folderId).length + 
              notableHashtags.filter(x => !x.folderId).length
            })</span>
          </button>

          {/* Dynamic Map Folders */}
          {folders.map(fol => {
            const style = folderColorMap[fol.color] || folderColorMap.indigo;
            const isSelected = selectedFolderId === fol.id;
            
            // Calculate how many items are currently locked inside this folder
            const ideasInFolder = savedIdeas.filter(x => x.folderId === fol.id).length;
            const hooksInFolder = savedHooks.filter(x => x.folderId === fol.id).length;
            const scriptInFolder = notableScripts.filter(x => x.folderId === fol.id).length;
            const tagInFolder = notableHashtags.filter(x => x.folderId === fol.id).length;
            const folderVolume = ideasInFolder + hooksInFolder + scriptInFolder + tagInFolder;

            return (
              <div key={fol.id} className="relative group">
                <button
                  onClick={() => setSelectedFolderId(fol.id)}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer ${
                    isSelected 
                      ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm' 
                      : `bg-white text-zinc-700 border-zinc-250 ${style.bg} hover:border-zinc-300`
                  }`}
                >
                  <Folder className={`h-4 w-4 ${isSelected ? 'text-white' : style.text}`} />
                  <span>{t(fol.name, selectedLanguage)} ({folderVolume})</span>
                </button>
                
                {/* Visual Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteFolder(fol.id); }}
                  className="absolute -top-1.5 -right-1.5 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-red-100 border border-red-300 text-red-650 hover:bg-red-200 cursor-pointer"
                  title={t("Delete Folder", selectedLanguage)}
                >
                  <Trash2 className="h-2 w-2" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Directory Items List Display */}
        <div className="divide-y divide-zinc-200/70 bg-white font-sans">
          {displayedFolderItems.length === 0 ? (
            <div className="py-14 text-center">
              <FolderOpen className="h-10 w-10 text-zinc-300 mx-auto mb-2" />
              <p className="font-mono text-xs text-zinc-400">{t("Empty Directory", selectedLanguage)}</p>
              <p className="mt-2 text-xs text-zinc-555 max-w-xs mx-auto leading-normal px-4">
                {t("No custom creator assets filed under", selectedLanguage)}{" "}
                {selectedFolderId === 'All' 
                  ? t("any workspace folder", selectedLanguage) 
                  : selectedFolderId === 'Unassigned' 
                    ? t("your Inbox", selectedLanguage) 
                    : `"${t(activeFolder?.name || '', selectedLanguage)}"`}
                . {t("Use generators below and select this folder.", selectedLanguage)}
              </p>
            </div>
          ) : (
            displayedFolderItems.map(item => {
              const copyKey = `combo-${item.id}`;
              const itemFolder = folders.find(f => f.id === item.raw.folderId);
              const folderChipStyle = itemFolder ? (folderColorMap[itemFolder.color] || folderColorMap.indigo) : null;

              return (
                <div key={item.id} className="p-4 sm:p-5 hover:bg-zinc-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left info block */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`rounded-sm px-1.5 py-0.2 text-[9px] font-black uppercase text-white shadow-3xs ${
                        item.type === 'Idea' ? 'bg-blue-600' :
                        item.type === 'Hook' ? 'bg-orange-500' :
                        item.type === 'Script' ? 'bg-emerald-600' : 'bg-indigo-600'
                      }`}>
                        {t(item.type, selectedLanguage)}
                      </span>
                      {folderChipStyle && itemFolder ? (
                        <span className={`rounded-sm px-1.5 py-0.2 text-[8.5px] font-bold ${folderChipStyle.chip}`}>
                          📁 {t(itemFolder.name, selectedLanguage)}
                        </span>
                      ) : (
                        <span className="rounded-sm px-1.5 py-0.2 text-[8.5px] font-mono text-zinc-450 font-bold bg-zinc-100">
                          📥 {t("Unassigned Inbox", selectedLanguage)}
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-400 font-medium font-mono">{item.subtitle}</span>
                    </div>

                    <h4 className="text-xs sm:text-xs font-bold text-zinc-950 leading-relaxed max-w-2.5xl break-words">
                      {item.title}
                    </h4>
                  </div>

                  {/* Move/Copy Actions block */}
                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Shift folder selection dropdown */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-sans">{t("Move to:", selectedLanguage)}</span>
                      <select
                        aria-label={`Folder assignment for ${item.type} item`}
                        value={item.raw.folderId || 'Unassigned'}
                        onChange={(e) => handleMoveToFolder(item.listKey, item.id, e.target.value)}
                        className="rounded-lg border border-zinc-250 bg-white px-2 py-1 text-[11px] font-bold text-zinc-700 outline-hidden focus:border-zinc-550 max-w-[125px] cursor-pointer"
                      >
                        <option value="Unassigned">📥 {t("Inbox", selectedLanguage)}</option>
                        {folders.map(f => (
                          <option key={f.id} value={f.id}>📁 {t(f.name, selectedLanguage)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Clipboard action */}
                    <button
                      id={`copy-combo-${item.id}`}
                      onClick={() => {
                        const copyString = item.type === 'Hashtag' ? item.title : `[${item.type}] Title/Hook: ${item.title}\nSubtitle: ${item.subtitle}`;
                        triggerCopy(copyString, copyKey);
                      }}
                      className="rounded-lg border border-zinc-250 bg-white p-1.5 hover:bg-zinc-100 text-zinc-450 hover:text-black cursor-pointer"
                      title={t("Copy contents", selectedLanguage)}
                    >
                      {copystate[copyKey] ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>

                    {/* Delete action */}
                    <button
                      id={`del-combo-${item.id}`}
                      onClick={() => deleteWorkspaceItem(item.listKey, item.id)}
                      className="rounded-lg border border-zinc-250 bg-white p-1.5 hover:bg-red-50 text-zinc-400 hover:text-red-650 cursor-pointer"
                      title={t("Delete saved asset permanently", selectedLanguage)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Public Demo Sandbox Panel */}
      <div className="rounded-2xl border border-zinc-200/85 bg-white shadow-xs overflow-hidden font-sans">
        <div className="bg-zinc-50 border-b border-zinc-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 text-white font-black">
              <TrendingUp className="h-3.5 w-3.5" />
            </span>
            <div>
              <h2 className="font-sans text-sm font-bold text-zinc-900 tracking-tight">{t("Public Demo: Viral Short-Form Idea Templates", selectedLanguage)}</h2>
              <p className="font-sans text-[11px] text-zinc-500 mt-0.5">
                {t("Browse hand-crafted viral video formulas. Click any blueprint to inspect scenes, hook psychology, and test local saves in real-time.", selectedLanguage)}
              </p>
            </div>
          </div>
          <span className="rounded bg-black text-white font-mono text-[9px] font-black uppercase tracking-wider px-2 py-0.5 self-start sm:self-center">
            {t("Demo Sandbox", selectedLanguage)}
          </span>
        </div>

        <div className="divide-y divide-zinc-100">
          {PRELOADED_DEMO_IDEAS.map((idea) => {
            const isExpanded = expandedIdeaId === idea.id;
            const isAlreadySaved = savedIdeas.some((x) => x.id === idea.id);

            return (
              <div key={idea.id} className="p-4 sm:p-5 hover:bg-zinc-50/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Column: Platform, Niche, Title */}
                  <div className="flex-1 space-y-1.5 min-w-0 font-sans">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-bold ${
                        idea.platform === 'TikTok' ? 'bg-black text-white' :
                        idea.platform === 'Instagram Reels' ? 'bg-indigo-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {idea.platform}
                      </span>
                      <span className="rounded bg-zinc-100 text-zinc-650 px-2 py-0.5 text-[9.5px] font-medium font-mono">
                        {t(idea.niche, selectedLanguage)}
                      </span>
                      <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                        idea.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-850' :
                        idea.difficulty === 'Medium' ? 'bg-amber-50 text-amber-750' : 'bg-red-50 text-red-750'
                      }`}>
                        {t(idea.difficulty, selectedLanguage)}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
                      {t(idea.title, selectedLanguage)}
                      <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 text-amber-850 px-1.5 py-0.2 text-[9px] font-bold">
                        <Flame className="h-2.5 w-2.5 fill-amber-500 text-amber-650 animate-pulse" />
                        {idea.score}/100 {t("Viral Power", selectedLanguage)}
                      </span>
                    </h3>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center font-sans">
                    <button
                      id={`demo-seed-${idea.id}`}
                      onClick={() => handleSeedIdea(idea)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isAlreadySaved 
                          ? 'border-emerald-250 bg-emerald-50 text-emerald-850 hover:bg-emerald-100'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-805'
                      }`}
                      title={isAlreadySaved ? t("Remove from my saved ideas", selectedLanguage) : t("Simulate seeding idea to your active workspace", selectedLanguage)}
                    >
                      {isAlreadySaved ? <Check className="h-3.5 w-3.5 text-emerald-600 font-bold" /> : <Plus className="h-3.5 w-3.5 text-zinc-650" />}
                      <span>{isAlreadySaved ? t('Seeded', selectedLanguage) : t('Seed Workspace', selectedLanguage)}</span>
                    </button>
                    <button
                      id={`demo-expand-${idea.id}`}
                      onClick={() => setExpandedIdeaId(isExpanded ? null : idea.id)}
                      className="rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors cursor-pointer"
                      title={isExpanded ? t("Collapse blueprint details", selectedLanguage) : t("Inspect entire video story outline blueprint", selectedLanguage)}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 border-t border-zinc-100 pt-4 space-y-3.5 text-xs text-zinc-655 leading-relaxed font-sans">
                    <div>
                      <p className="font-sans text-[10.5px] font-bold text-zinc-450 uppercase tracking-widest">{t("Niche Conception Description", selectedLanguage)}</p>
                      <p className="mt-1 text-zinc-850 text-[12px]">{t(idea.description, selectedLanguage)}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="border border-zinc-100 rounded-xl bg-zinc-50/50 p-3.5">
                        <div className="flex items-center gap-1 font-sans text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          {t("Hook Scene (0-3s)", selectedLanguage)}
                        </div>
                        <p className="text-zinc-950 font-sans italic text-[11.5px]">"{t(idea.structure.hook, selectedLanguage)}"</p>
                      </div>

                      <div className="border border-zinc-100 rounded-xl bg-zinc-50/50 p-3.5">
                        <div className="flex items-center gap-1 font-sans text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          {t("Body Scene (3-25s)", selectedLanguage)}
                        </div>
                        <p className="text-zinc-750 text-[11px] font-medium">{t(idea.structure.body, selectedLanguage)}</p>
                      </div>

                      <div className="border border-zinc-100 rounded-xl bg-zinc-50/50 p-3.5">
                        <div className="flex items-center gap-1 font-sans text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {t("Action CTA (25-30s)", selectedLanguage)}
                        </div>
                        <p className="text-zinc-750 text-[11px] font-medium">{t(idea.structure.cta, selectedLanguage)}</p>
                      </div>
                    </div>

                    {/* Expanded explanation detailing why it works */}
                    <div className="rounded-xl bg-amber-50/45 border border-amber-100 p-3.5 flex items-start gap-2 max-w-3xl">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-mono text-[9px] font-extrabold font-sans">!</span>
                      <div className="space-y-0.5 text-zinc-750">
                        <span className="block text-[11px] font-bold text-amber-950">
                          {t("Viral Psychology Explanation (Why this scores", selectedLanguage)} {idea.score}/100)
                        </span>
                        <p className="text-[11.5px] text-amber-900/80 leading-normal">
                          {t("This outline leverages a high first 3-second hook rate by questioning user competence (loss-aversion) followed by rapid-fire visual walk-throughs that trigger high engagement shares. The explicit conversion prompt at the 25-second mark converts algorithmic drift directly into cataloged comment interactions.", selectedLanguage)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Action Bento Grid */}
      <div>
        <h2 className="font-sans text-sm font-bold text-zinc-805 tracking-tight">{t("Rapid Generator Engines", selectedLanguage)}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans">
          {[
            {
              id: 'ideas',
              title: "Video Ideas",
              desc: "Deploy custom video outlines containing viral scores and difficulty indices.",
              icon: Lightbulb,
              banner: "Generate ideas"
            },
            {
              id: 'hooks',
              title: "Hook Machine",
              desc: "Instantly create 20 psychology-backed hooks for physical narration lines.",
              icon: Sparkles,
              banner: "Launch hooks"
            },
            {
              id: 'scripts',
              title: "Scriptwriter",
              desc: "Formulate complete AV tables featuring visual directions & voiceovers.",
              icon: FileText,
              banner: "Draft script"
            },
            {
              id: 'hashtags',
              title: "Optimized Tags",
              desc: "Generate triple-cluster platform tags optimized to boost organic discoverability.",
              icon: Hash,
              banner: "Build tags"
            }
          ].map((act) => {
            const Icon = act.icon;
            return (
              <button
                id={`dash-act-${act.id}`}
                key={act.id}
                onClick={() => setView(act.id as ViewType)}
                className="group rounded-xl border border-zinc-200 bg-white p-5 text-left transition-all hover:border-zinc-900 shadow-2xs hover:shadow-xs cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 text-black group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="mt-4 font-sans text-sm font-bold text-zinc-900">{t(act.title, selectedLanguage)}</h3>
                  <p className="mt-1.5 font-sans text-xs text-zinc-400 font-normal leading-normal">{t(act.desc, selectedLanguage)}</p>
                </div>
                <div className="mt-5 flex items-center gap-1 font-mono text-[10.5px] font-bold text-zinc-650 group-hover:text-zinc-950">
                  <span>{t(act.banner, selectedLanguage)}</span>
                  <Plus className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular niches & dynamic shortcuts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 font-sans">
        {/* Niches to explore */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs lg:col-span-1">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-zinc-450">{t("Trending Niches Today", selectedLanguage)}</h3>
          </div>
          <p className="mt-1 font-sans text-xs text-zinc-500 leading-normal">
            {t("These high-volume short-form categories are currently experiencing substantial growth cycles:", selectedLanguage)}
          </p>

          <div className="mt-5 space-y-2">
            {[
              { name: "SaaS Dev & Startups", hot: "Extremely High" },
              { name: "No-Code & Automation", hot: "High Output" },
              { name: "Health & Mindset hacks", hot: "Rising" },
              { name: "Personal Money Rules", hot: "Very High" },
              { name: "Luxury Lifestyle Minimal", hot: "Steady" }
            ].map((nic, idx) => (
              <button
                id={`dash-trend-niche-${idx}`}
                key={idx}
                onClick={() => handleNicheLaunch(nic.name)}
                className="w-full rounded-lg border border-zinc-150 bg-zinc-50 p-2.5 text-left transition-all hover:border-zinc-300 hover:bg-white flex items-center justify-between text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-2 font-medium text-zinc-800 group-hover:text-black">
                  <span className="font-mono text-[10px] text-zinc-400 font-bold">#{idx+1}</span>
                  <span className="font-sans text-xs">{t(nic.name, selectedLanguage)}</span>
                </div>
                <span className="font-mono text-[10px] font-semibold text-zinc-400 group-hover:text-zinc-650 bg-zinc-100 px-1.5 py-0.2 rounded">
                  {t(nic.hot, selectedLanguage)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Rapid Creator Guide */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-2xs lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="font-sans text-sm font-semibold text-zinc-900">{t("Creator Hub Knowledge Guide", selectedLanguage)}</h3>
            </div>
            
            <p className="text-xs text-zinc-500 leading-relaxed">
              {t("Viral content isn't luck—it's engineering. True dynamic leverage comes from stacking your AI analytical tools together:", selectedLanguage)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11.5px]">
              <div className="p-3 border border-zinc-100 rounded-xl bg-zinc-50">
                <p className="font-bold text-zinc-900">{t("1. Isolate the Voids", selectedLanguage)}</p>
                <p className="text-zinc-500 mt-0.5">{t("Use the AI Trend Analyzer to lock onto niche channels experience gaps.", selectedLanguage)}</p>
              </div>
              <div className="p-3 border border-zinc-100 rounded-xl bg-zinc-50">
                <p className="font-bold text-zinc-900">{t("2. Dissect Leaders", selectedLanguage)}</p>
                <p className="text-zinc-500 mt-0.5">{t("Use the Competitor Spy to audit Hook percentages & common visual layouts.", selectedLanguage)}</p>
              </div>
              <div className="p-3 border border-zinc-100 rounded-xl bg-zinc-50">
                <p className="font-bold text-zinc-900">{t("3. Auto-Plan the Week", selectedLanguage)}</p>
                <p className="text-zinc-500 mt-0.5">{t("Map the output into the 30-Day Content Planner to track scripting & filming.", selectedLanguage)}</p>
              </div>
              <div className="p-3 border border-zinc-100 rounded-xl bg-zinc-50">
                <p className="font-bold text-zinc-900">{t("4. Formulate AV Scripts", selectedLanguage)}</p>
                <p className="text-zinc-500 mt-0.5">{t("Draft the voiceover script & visual directions with Script Architect.", selectedLanguage)}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-zinc-100 pt-4 flex justify-between items-center text-xs">
            <span className="text-zinc-400">{t("Need priority server priority access?", selectedLanguage)}</span>
            <button
              id="dash-pricing-view-btn"
              onClick={() => setView('pricing')}
              className="font-sans font-semibold text-black hover:underline cursor-pointer flex items-center gap-1"
            >
              {t("Learn about Pro models", selectedLanguage)}
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

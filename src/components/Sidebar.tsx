import React from 'react';
import { ViewType, UserState } from '../types';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Sparkles, 
  FileText, 
  Hash, 
  BookmarkCheck, 
  CreditCard,
  Crown,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { t } from '../utils/translator';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  user: UserState;
  selectedLanguage: string;
}

export default function Sidebar({ currentView, setView, user, selectedLanguage }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: t('Performance Hub', selectedLanguage) || 'Performance Hub',
      icon: LayoutDashboard,
      description: t('Your metrics & folders', selectedLanguage) || 'Your metrics & folders'
    },
    {
      id: 'trends',
      label: t('AI Trend Analyzer', selectedLanguage) || 'AI Trend Analyzer',
      icon: TrendingUp,
      description: t('Unlock niche keywords & gaps', selectedLanguage) || 'Unlock niche keywords & gaps'
    },
    {
      id: 'competitor',
      label: t('Competitor Analyzer', selectedLanguage) || 'Competitor Analyzer',
      icon: Users,
      description: t('Spy on top creator metrics', selectedLanguage) || 'Spy on top creator metrics'
    },
    {
      id: 'calendar',
      label: t('30-Day Content Planner', selectedLanguage) || '30-Day Content Planner',
      icon: Calendar,
      description: t('Day-by-day video playbook', selectedLanguage) || 'Day-by-day video playbook'
    },
    {
      id: 'ideas',
      label: t('Video Idea Generator', selectedLanguage) || 'Video Idea Generator',
      icon: Lightbulb,
      description: t('Find custom niche briefs', selectedLanguage) || 'Find custom niche briefs'
    },
    {
      id: 'hooks',
      label: t('Hook Machine', selectedLanguage) || 'Hook Machine',
      icon: Sparkles,
      description: t('Generate 20 viral hooks', selectedLanguage) || 'Generate 20 viral hooks'
    },
    {
      id: 'scripts',
      label: t('Script Architect', selectedLanguage) || 'Script Architect',
      icon: FileText,
      description: t('A/V storyboards & voiceover', selectedLanguage) || 'A/V storyboards & voiceover'
    },
    {
      id: 'hashtags',
      label: t('Hashtag Optimizer', selectedLanguage) || 'Hashtag Optimizer',
      icon: Hash,
      description: t('Triple-tier platform tags', selectedLanguage) || 'Triple-tier platform tags'
    }
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-zinc-100 bg-white/50 py-6 md:h-[calc(100vh-3.5rem)] md:sticky md:top-14 overflow-y-auto">
      <div className="px-4">
        <p className="px-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          {t('Studio Tools', selectedLanguage) || 'Studio Tools'}
        </p>
        <nav className="mt-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                id={`sidebar-link-${item.id}`}
                key={item.id}
                onClick={() => setView(item.id as ViewType)}
                className={`group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                  active 
                    ? 'bg-zinc-100 text-black font-semibold shadow-xs' 
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
                }`}
              >
                <Icon className={`mt-0.5 h-4.5 w-4.5 shrink-0 transition-colors ${
                  active ? 'text-black' : 'text-zinc-400 group-hover:text-black'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm">{item.label}</p>
                  <p className="font-sans text-[11px] text-zinc-400 font-normal leading-normal truncate group-hover:text-zinc-500">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Upgrade Banner in the sidebar if the user is Free style */}
        {user.tier === 'free' && (
          <div className="mt-8 rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-800">
              <Crown className="h-4.5 w-4.5 text-amber-600 fill-amber-500" />
              <span className="font-sans text-sm font-bold tracking-tight">{t('Unlock Pro Limit', selectedLanguage) || 'Unlock Pro Limit'}</span>
            </div>
            <p className="mt-1.5 font-sans text-xs text-amber-700 leading-normal">
              {t('Escape the 5-runs-a-day cap. Unlock full length 60s scripting engines & priority tags.', selectedLanguage) || 'Escape the 5-runs-a-day cap. Unlock full length 60s scripting engines & priority tags.'}
            </p>
            <button
              id="sidebar-upgrade-btn"
              onClick={() => setView('pricing')}
              className="mt-3.5 w-full rounded-lg bg-black py-1.5 text-center font-sans text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
            >
              {t('Upgrade For $9 / mo', selectedLanguage) || 'Upgrade For $9 / mo'}
            </button>
          </div>
        )}

        {user.tier === 'pro' && (
          <div className="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center gap-1.5 text-zinc-900">
              <Crown className="h-4 w-4 text-emerald-600 fill-emerald-500" />
              <span className="font-sans text-sm font-bold tracking-tight">{t('ViralFlow Pro Plan', selectedLanguage) || 'ViralFlow Pro Plan'}</span>
            </div>
            <p className="mt-1 font-sans text-xs text-zinc-500 leading-normal">
              {t('You have unrestricted premium access. All models are unlocked.', selectedLanguage) || 'You have unrestricted premium access. All models are unlocked.'}
            </p>
            <div className="mt-3.5 flex items-center justify-between border-t border-zinc-200/60 pt-3">
              <span className="font-mono text-[10px] text-zinc-400">{t('Priority Engine Status', selectedLanguage) || 'Priority Engine Status'}</span>
              <span className="font-mono text-[10px] font-bold text-emerald-600 uppercase">{t('Active', selectedLanguage) || 'Active'}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

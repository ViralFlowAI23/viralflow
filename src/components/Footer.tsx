import React from 'react';
import { ViewType } from '../types';
import { Video, Heart, Globe, Cpu } from 'lucide-react';
import { t } from '../utils/translator';

interface FooterProps {
  setView: (view: ViewType) => void;
  selectedLanguage: string;
}

export default function Footer({ setView, selectedLanguage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-100 bg-white py-12 text-zinc-500 font-sans text-xs mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 border-b border-zinc-100 pb-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
                <Video className="h-3 w-3" />
              </div>
              <span className="font-sans font-bold text-sm text-black tracking-tight">ViralFlow</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {t("Premium generator suite mapping hook psychology matrices into modular shorts checklists since 2026.", selectedLanguage)}
            </p>
          </div>

          {/* Column 2: App Navs */}
          <div>
            <h4 className="font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{t("Platform", selectedLanguage)}</h4>
            <ul className="mt-3.5 space-y-2">
              <li>
                <button 
                  id="foot-nav-ideas"
                  onClick={() => setView('ideas')} 
                  className="hover:text-black transition-colors cursor-pointer text-left"
                >
                  {t("Brief Ideas Generator", selectedLanguage)}
                </button>
              </li>
              <li>
                <button 
                  id="foot-nav-hooks"
                  onClick={() => setView('hooks')} 
                  className="hover:text-black transition-colors cursor-pointer text-left"
                >
                  {t("Hooks Machine", selectedLanguage)}
                </button>
              </li>
              <li>
                <button 
                  id="foot-nav-scripts"
                  onClick={() => setView('scripts')} 
                  className="hover:text-black transition-colors cursor-pointer text-left"
                >
                  {t("Script Architect", selectedLanguage)}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Corporate */}
          <div>
            <h4 className="font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{t("Resources", selectedLanguage)}</h4>
            <ul className="mt-3.5 space-y-2">
              <li>
                <button 
                  id="foot-nav-pricing"
                  onClick={() => setView('pricing')} 
                  className="hover:text-black transition-colors cursor-pointer text-left"
                >
                  {t("Interactive Pricing", selectedLanguage)}
                </button>
              </li>
              <li>
                <button 
                  id="foot-nav-auth"
                  onClick={() => setView('auth')} 
                  className="hover:text-black transition-colors cursor-pointer text-left"
                >
                  {t("Sandbox Portal", selectedLanguage)}
                </button>
              </li>
              <li>
                <button 
                  id="foot-nav-landing"
                  onClick={() => setView('landing')} 
                  className="hover:text-black transition-colors cursor-pointer text-left"
                >
                  {t("Product Landing", selectedLanguage)}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Metadata Disclaimers */}
          <div className="space-y-3.5">
            <h4 className="font-mono text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{t("Technical Disclaimer", selectedLanguage)}</h4>
            <p className="text-[10.5px] text-zinc-400 leading-normal">
              {t("ViralFlow generates contextual templates and trending outlines using pre-analyzed hooks. All trend indexes, difficulty metrics, and potential viral scores are calculated locally.", selectedLanguage)}
            </p>
          </div>

        </div>

        {/* Row 2: Bottom metadata strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10.5px] text-zinc-400">
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span>© {currentYear} ViralFlow. {t("All rights reserved.", selectedLanguage)}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5">
              {t("Made with", selectedLanguage)} <Heart className="h-3 w-3 text-red-500 fill-red-500" /> {t("for Micro-Creators", selectedLanguage)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-zinc-400">
              <Globe className="h-3.5 w-3.5" />
              <span className="font-mono text-[10px] uppercase">{t("REGION", selectedLanguage)}: {t("WORLDWIDE", selectedLanguage)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Cpu className="h-3.5 w-3.5 animate-pulse" />
              <span className="font-mono text-[10px] uppercase">{t("CLIENT-SIDE COMPILER ENABLED", selectedLanguage)}</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

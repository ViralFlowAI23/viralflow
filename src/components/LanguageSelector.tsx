import React, { useState, useRef, useEffect } from 'react';
import { LANGUAGES } from '../utils/translator';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (langName: string) => void;
  align?: 'left' | 'right';
}

export default function LanguageSelector({ selectedLanguage, onLanguageChange, align = 'right' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Match selected language by code or name
  const currentLang = LANGUAGES.find(
    l => l.name === selectedLanguage || l.code === selectedLanguage
  ) || LANGUAGES[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langName: string) => {
    onLanguageChange(langName);
    setIsOpen(false);
  };

  return (
    <div id="lang-selector-container" className="relative inline-block z-50 text-left" ref={containerRef}>
      <button
        id="lang-selector-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 font-sans text-xs font-medium text-zinc-700 transition-all hover:bg-zinc-50 hover:text-black focus:outline-none focus:ring-1 focus:ring-black/5 active:scale-98 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="font-mono text-sm leading-none">{currentLang.flag}</span>
        <span className="max-w-[70px] truncate leading-none sm:max-w-none">{currentLang.name}</span>
        <ChevronDown className={`h-3 w-3 shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-black' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="lang-selector-dropdown"
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className={`absolute mt-1.5 w-48 rounded-xl border border-zinc-100 bg-white p-1 text-zinc-700 shadow-lg ring-1 ring-black/5 focus:outline-none ${
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
            }`}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="px-2.5 py-1.5 border-b border-zinc-100 mb-1">
              <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <Globe className="h-3 w-3" />
                Target Language
              </span>
            </div>
            
            <div className="max-h-60 overflow-y-auto scrollbar-thin">
              {LANGUAGES.map((lang) => {
                const isActive = lang.name === currentLang.name;
                return (
                  <button
                    id={`lang-opt-${lang.code}`}
                    key={lang.code}
                    onClick={() => handleSelect(lang.name)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 font-sans text-xs font-medium text-left transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-zinc-100 text-black font-semibold' 
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                    role="menuitem"
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-sm leading-none">{lang.flag}</span>
                      <span className="leading-none">{lang.name}</span>
                    </span>
                    {isActive && <Check className="h-3.5 w-3.5 text-black shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

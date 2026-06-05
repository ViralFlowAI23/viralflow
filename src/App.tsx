import React, { useState, useEffect } from 'react';
import { ViewType, UserState } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import IdeasGenerator from './components/IdeasGenerator';
import HookGenerator from './components/HookGenerator';
import ScriptGenerator from './components/ScriptGenerator';
import HashtagGenerator from './components/HashtagGenerator';
import TrendAnalyzer from './components/TrendAnalyzer';
import CompetitorAnalyzer from './components/CompetitorAnalyzer';
import ContentCalendar from './components/ContentCalendar';
import Pricing from './components/Pricing';
import Auth from './components/Auth';
import Footer from './components/Footer';
import { Sparkles, X, UserPlus } from 'lucide-react';
import { t } from './utils/translator';

const LOCAL_STORAGE_SESSION_KEY = 'viralflow_session';

const INITIAL_USER: UserState = {
  email: null,
  tier: 'free',
  isLoggedIn: false,
  generationsCount: {}
};

export default function App() {
  const [user, setUser] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error parsing session state:', e);
    }
    return INITIAL_USER;
  });

  const [currentView, setView] = useState<ViewType>('landing');
  const [initialNiche, setInitialNiche] = useState<string>('');
  const [promptDismissed, setPromptDismissed] = useState<boolean>(false);
  
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    return localStorage.getItem('viralflow_language') || 'English';
  });

  const handleLanguageChange = (langName: string) => {
    setSelectedLanguage(langName);
    localStorage.setItem('viralflow_language', langName);
  };

  // Persist session changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving session state:', e);
    }
  }, [user]);

  // Auth Handlers
  const handleLoginSuccess = (email: string, tier: 'free' | 'pro') => {
    setUser(prev => ({
      ...prev,
      email,
      tier,
      isLoggedIn: true
    }));
  };

  const handleLogout = () => {
    setUser(INITIAL_USER);
    setView('landing');
  };

  const handleUpgradeSuccess = () => {
    setUser(prev => ({
      ...prev,
      tier: 'pro'
    }));
  };

  // Generation limit checker (5 runs per day limit for free tier / guest)
  const incrementGeneration = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    const currentCount = user.generationsCount[today] || 0;

    if (user.tier === 'free' && currentCount >= 5) {
      return false; // Limit reached
    }

    // Increment model count
    setUser(prev => {
      const updatedCounts = { ...prev.generationsCount };
      updatedCounts[today] = (updatedCounts[today] || 0) + 1;
      return {
        ...prev,
        generationsCount: updatedCounts
      };
    });

    return true; // Generation allowed
  };

  const handleSetGeneratedNiche = (niche: string) => {
    setInitialNiche(niche);
  };

  // Determine if we need to show the layout with a sidebar
  const isWorkspaceView = ['dashboard', 'ideas', 'hooks', 'scripts', 'hashtags', 'trends', 'competitor', 'calendar'].includes(currentView);

  // Guest Generations Count Today
  const todayKey = new Date().toISOString().split('T')[0];
  const generationsToday = user.generationsCount[todayKey] || 0;
  
  // Decide whether to show signup prompt banner (after 3 generations as guest)
  const shouldShowSignupBanner = !user.isLoggedIn && generationsToday >= 3 && !promptDismissed;

  const isRtl = selectedLanguage === 'Arabic' || selectedLanguage === 'العربية';

  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage setView={setView} user={user} selectedLanguage={selectedLanguage} />;
      
      case 'pricing':
        return <Pricing user={user} setView={setView} onUpgradeSuccess={handleUpgradeSuccess} selectedLanguage={selectedLanguage} />;
      
      case 'auth':
        return <Auth onLoginSuccess={handleLoginSuccess} setView={setView} selectedLanguage={selectedLanguage} />;
      
      case 'dashboard':
        return (
          <Dashboard 
            setView={setView} 
            user={user} 
            onSetGeneratedNiche={handleSetGeneratedNiche}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        );
      
      case 'ideas':
        return (
          <IdeasGenerator 
            user={user} 
            setView={setView} 
            incrementGeneration={incrementGeneration} 
            initialNiche={initialNiche}
            selectedLanguage={selectedLanguage}
          />
        );
      
      case 'hooks':
        return (
          <HookGenerator 
            user={user} 
            setView={setView} 
            incrementGeneration={incrementGeneration}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        );
      
      case 'scripts':
        return (
          <ScriptGenerator 
            user={user} 
            setView={setView} 
            incrementGeneration={incrementGeneration}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        );
      
      case 'hashtags':
        return (
          <HashtagGenerator 
            user={user} 
            setView={setView} 
            incrementGeneration={incrementGeneration}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        );
 
      case 'trends':
        return (
          <TrendAnalyzer 
            user={user} 
            setView={setView} 
            incrementGeneration={incrementGeneration}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        );
 
      case 'competitor':
        return (
          <CompetitorAnalyzer 
            user={user} 
            setView={setView} 
            incrementGeneration={incrementGeneration}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        );
 
      case 'calendar':
        return (
          <ContentCalendar 
            user={user} 
            setView={setView} 
            incrementGeneration={incrementGeneration}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        );
 
      default:
        return <LandingPage setView={setView} user={user} selectedLanguage={selectedLanguage} />;
    }
  };
 
  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-zinc-50 flex flex-col selection:bg-black selection:text-white antialiased">
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        user={user} 
        onLogout={handleLogout}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* Soft Signup Prompt Bar for Guest Users with high engagement */}
      {shouldShowSignupBanner && (
        <div id="guest-signup-banner" className="bg-zinc-900 text-white border-b border-zinc-800 px-4 py-3 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-sans text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-zinc-950">
                <Sparkles className="h-3 w-3 fill-zinc-950" />
              </span>
              <p className="font-medium text-zinc-200">
                {t("You have generated", selectedLanguage)} <span className="text-white font-bold">{generationsToday} {t("packages", selectedLanguage)}</span> {t("as a Guest! Save your progress and gain unlimited tracking by launching a free account.", selectedLanguage)}
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                id="banner-signup-action"
                onClick={() => setView('auth')}
                className="rounded-md bg-white text-black px-3.5 py-1.5 font-bold hover:bg-zinc-150 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>{t("Sign Up Free", selectedLanguage)}</span>
              </button>
              <button
                id="banner-dismiss-action"
                onClick={() => setPromptDismissed(true)}
                className="text-zinc-400 hover:text-white rounded p-1"
                title={t("Dismiss", selectedLanguage)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isWorkspaceView ? (
        <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
          {/* Sidebar */}
          <Sidebar 
            currentView={currentView} 
            setView={setView} 
            user={user} 
            selectedLanguage={selectedLanguage}
          />
          {/* Active Workspace View */}
          <main className="flex-1 bg-white min-h-[calc(100vh-3.5rem)] shadow-2xs border-r border-zinc-100">
            {renderActiveView()}
          </main>
        </div>
      ) : (
        <main className="flex-1">
          {renderActiveView()}
        </main>
      )}

      <Footer setView={setView} selectedLanguage={selectedLanguage} />
    </div>
  );
}

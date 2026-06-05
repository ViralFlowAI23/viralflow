import React, { useState } from 'react';
import { ViewType, UserState } from '../types';
import { Video, LogIn, Sparkles, Menu, X, LayoutDashboard, Compass, LogOut, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import LanguageSelector from './LanguageSelector';
import { t } from '../utils/translator';

interface NavbarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  user: UserState;
  onLogout: () => void;
  selectedLanguage: string;
  onLanguageChange: (langName: string) => void;
}

export default function Navbar({ 
  currentView, 
  setView, 
  user, 
  onLogout,
  selectedLanguage,
  onLanguageChange
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active links
  const isActive = (view: ViewType) => currentView === view;

  const handleNav = (view: ViewType) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <button 
          id="nav-brand-btn"
          onClick={() => handleNav('landing')} 
          className="flex items-center gap-2 text-left focus:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white shadow-sm ring-1 ring-black/10">
            <Video className="h-4 w-4" />
          </div>
          <div>
            <span className="font-sans font-bold text-base tracking-tight text-black">ViralFlow</span>
            <span className="ml-1.5 rounded-full bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-600 ring-1 ring-zinc-200">MVP</span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            id="nav-home-link"
            onClick={() => handleNav('landing')}
            className={`font-sans text-sm font-medium transition-colors cursor-pointer ${
              isActive('landing') ? 'text-black font-semibold' : 'text-zinc-500 hover:text-black'
            }`}
          >
            {t("Home", selectedLanguage) || "Home"}
          </button>
          
          <button
            id="nav-dashboard-link"
            onClick={() => handleNav('dashboard')}
            className={`font-sans text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              isActive('dashboard') ? 'text-black font-semibold' : 'text-zinc-500 hover:text-black'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            {t("Dashboard", selectedLanguage) || "Dashboard"}
          </button>

          <button
            id="nav-pricing-link"
            onClick={() => handleNav('pricing')}
            className={`font-sans text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              isActive('pricing') ? 'text-black font-semibold' : 'text-zinc-500 hover:text-black'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            {t("Pricing", selectedLanguage) || "Pricing"}
          </button>

          {user.isLoggedIn && (
            <div className="flex items-center gap-1 rounded-full bg-zinc-50 px-2 py-0.5 ring-1 ring-zinc-200">
              <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="font-mono text-11 font-semibold text-zinc-700 capitalize text-xs">
                {user.tier}
              </span>
            </div>
          )}
        </nav>

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
          
          {user.isLoggedIn ? (
            <>
              {currentView === 'landing' ? (
                <button
                  id="nav-goto-dashboard-btn"
                  onClick={() => handleNav('dashboard')}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 font-sans text-sm font-medium text-black transition-all hover:bg-zinc-50"
                >
                  <Compass className="h-4 w-4" />
                  {t("Console", selectedLanguage)}
                </button>
              ) : (
                <span className="font-mono text-xs text-zinc-400 max-w-[140px] truncate">
                  {user.email}
                </span>
              )}
              <button
                id="nav-logout-btn"
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-1.5 font-sans text-sm font-medium text-white transition-all hover:bg-zinc-900 shadow-xs cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                {t("Sign Out", selectedLanguage) || "Sign Out"}
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-signin-btn"
                onClick={() => handleNav('auth')}
                className="font-sans text-sm font-medium text-zinc-500 hover:text-black cursor-pointer"
              >
                {t("Sign In", selectedLanguage) || "Sign In"}
              </button>
              <button
                id="nav-getstarted-btn"
                onClick={() => handleNav('auth')}
                className="flex items-center gap-1 rounded-lg bg-black px-3.5 py-1.5 font-sans text-sm font-medium text-white transition-all hover:bg-zinc-900 shadow-xs cursor-pointer"
              >
                {t("Start Free", selectedLanguage) || "Start Free"}
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />

          {user.isLoggedIn && (
            <div className="flex items-center gap-1 rounded-full bg-zinc-50 px-2.5 py-0.5 ring-1 ring-zinc-200">
              <span className="font-mono text-[10px] font-semibold text-zinc-700 capitalize">
                {user.tier}
              </span>
            </div>
          )}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-black"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-zinc-100 bg-white"
          >
            <div className="space-y-1.5 px-4 py-3">
              <button
                id="mobile-nav-home"
                onClick={() => handleNav('landing')}
                className={`flex w-full items-center rounded-lg px-3 py-2 font-sans text-sm font-medium ${
                  isActive('landing') ? 'bg-zinc-100 text-black' : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {t("Home", selectedLanguage) || "Home"}
              </button>
              <button
                id="mobile-nav-dashboard"
                onClick={() => handleNav('dashboard')}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 font-sans text-sm font-medium ${
                  isActive('dashboard') ? 'bg-zinc-100 text-black' : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                {t("Dashboard", selectedLanguage) || "Dashboard"}
              </button>
              <button
                id="mobile-nav-pricing"
                onClick={() => handleNav('pricing')}
                className={`flex w-full items-center rounded-lg px-3 py-2 font-sans text-sm font-medium ${
                  isActive('pricing') ? 'bg-zinc-100 text-black' : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {t("Pricing", selectedLanguage) || "Pricing"}
              </button>
              
              <div className="border-t border-zinc-100 pt-3 mt-3">
                {user.isLoggedIn ? (
                  <div className="space-y-2">
                    <p className="px-3 text-[10px] font-mono text-zinc-400 truncate">{user.email}</p>
                    <button
                      id="mobile-nav-logout"
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg bg-black px-3 py-2 font-sans text-sm font-medium text-white shadow-xs"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("Sign Out", selectedLanguage) || "Sign Out"}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id="mobile-nav-signin"
                      onClick={() => handleNav('auth')}
                      className="flex justify-center items-center rounded-lg border border-zinc-200 py-2 font-sans text-sm font-medium text-zinc-600"
                    >
                      {t("Sign In", selectedLanguage) || "Sign In"}
                    </button>
                    <button
                      id="mobile-nav-signup"
                      onClick={() => handleNav('auth')}
                      className="flex justify-center items-center rounded-lg bg-black py-2 font-sans text-sm font-medium text-white shadow-xs"
                    >
                      {t("Start Free", selectedLanguage) || "Start Free"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

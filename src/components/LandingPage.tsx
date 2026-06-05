import React, { useState } from 'react';
import { ViewType, UserState } from '../types';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Lightbulb, 
  FileText, 
  Hash, 
  ChevronDown, 
  Check, 
  Play, 
  TrendingUp,
  Instagram,
  Clapperboard,
  Tv
} from 'lucide-react';
import { motion } from 'motion/react';
import { t } from '../utils/translator';

interface LandingPageProps {
  setView: (view: ViewType) => void;
  user: UserState;
  selectedLanguage: string;
}

export default function LandingPage({ setView, user, selectedLanguage }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // High fidelity demo trending cards
  const trendSamples = [
    {
      title: "The 'Illegal Tools' Strategy",
      metric: "98.4K Actions",
      score: 97,
      platform: "TikTok",
      niche: "SaaS & AI",
      growth: "+148%"
    },
    {
      title: "Expectation vs Reality: Solopreneur",
      metric: "210.5K Likes",
      score: 93,
      platform: "Instagram Reels",
      niche: "Coding / Startups",
      growth: "+88%"
    },
    {
      title: "Why Cheap Software Costs You Millions",
      metric: "45.1K Shares",
      score: 91,
      platform: "YouTube Shorts",
      niche: "Consulting",
      growth: "+220%"
    }
  ];

  const featuresList = [
    {
      title: "Dynamic Brief Generator",
      desc: "Instant content briefs with title, hook, structural storyboards, and call-to-actions.",
      icon: Lightbulb
    },
    {
      title: "Hook Blueprint Engine",
      desc: "Produce 20 highly engineered hooks based on psychology principles like the curiosity gap.",
      icon: Sparkles
    },
    {
      title: "Audio/Visual Scriptwriter",
      desc: "Dual scene-by-scene script detailing physical visual actions alongside ready voiceover audio.",
      icon: FileText
    },
    {
      title: "Triple-Tier Hash tags",
      desc: "Platform-optimized tags grouped into broad, niche-focused, and high-viral clusters.",
      icon: Hash
    }
  ];

  const faqItems = [
    {
      q: "Does ViralFlow use live TikTok or YouTube APIs?",
      a: "No. ViralFlow uses high-fidelity custom AI-generated algorithms and trending models trained on content hooks. We simulate viral opportunities continuously without storing personal user accounts or scraping privacy-protected databases."
    },
    {
      q: "Is there a limit on generations on the Free tier?",
      a: "Yes. The free plan grants 5 generations per day, basic idea models, and lets you save up to 5 creations in local storage. Upgrading to the Pro tier unlocks infinite high-end models, custom scripts, and unbounded workspace saves."
    },
    {
      q: "Can I cancel my Pro subscription at any time?",
      a: "Absolutely. Standard billing is contract-free and cancellable with a single press from your dashboard profile. You maintain full access to any saved scripts in your workspace."
    },
    {
      q: "Who is ViralFlow designed for?",
      a: "ViralFlow is tailored for digital content creators, marketing consultants, developers looking to launch startups, and general storytellers on TikTok, Reels, and YT Shorts who want to streamline scriptwriting and escape creative block."
    }
  ];

  const handleStart = () => {
    setView('dashboard');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
        {/* Subtle grid background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f4f4f5_1px,transparent_1px),linear-gradient(to_bottom,#f4f4f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Ambient Gradient Glow (Vercel/Linear style) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-zinc-200/50 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="mx-auto max-w-4xl text-center">
          {/* Tagline Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-zinc-850 ring-1 ring-zinc-200"
          >
            <Zap className="h-3.5 w-3.5 text-black" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider">{t("ViralFlow 1.0 is Live", selectedLanguage)}</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 font-sans text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-7.5xl leading-[1.05]"
          >
            {t("Find Viral Video Ideas Before Everyone Else", selectedLanguage)}
          </motion.h1>

          {/* Subheading is generated using our designated description */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2.5xl font-sans text-base text-zinc-500 sm:text-lg lg:text-xl leading-relaxed"
          >
            {t("Generate short-form video ideas, hooks, scripts, hashtags, trend analysis, competitor insights, and 30-day content calendars in multiple languages.", selectedLanguage)}
          </motion.p>

          {/* Action buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 px-4"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <button
                id="hero-start-free-btn"
                onClick={handleStart}
                className="flex items-center gap-2 rounded-lg bg-black px-6 py-3 font-sans text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 cursor-pointer"
              >
                {t("Start Generating Free", selectedLanguage)}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                id="hero-demo-btn"
                onClick={() => {
                  setView('dashboard');
                }}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-6 py-3 font-sans text-sm font-semibold text-black transition-all hover:bg-zinc-50 cursor-pointer"
              >
                <Play className="h-4 w-4 fill-black text-black" />
                {t("View Demo Dashboard", selectedLanguage)}
              </button>
            </div>

            {/* Required Trust note */}
            <p className="text-xs text-zinc-400 font-sans mt-2">
              ⚠️ {t("AI-generated creator guidance. No live platform data required.", selectedLanguage)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Live Sample Trend Cards Slider */}
      <section className="border-t border-b border-zinc-100 bg-zinc-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">{t("Features", selectedLanguage)}</p>
              <p className="font-sans text-xl font-bold text-zinc-900 mt-0.5">{t("Saved Items", selectedLanguage)} — {t("Active Session", selectedLanguage)}</p>
            </div>
            <div className="h-[2px] flex-1 bg-zinc-100 mx-6 hidden md:block" />
            <span className="rounded-full bg-zinc-100 px-3 py-1 font-mono text-[11px] text-zinc-650 border border-zinc-200 shadow-3xs">
              ⚡ {t("AI-generated creator guidance. No live platform data required.", selectedLanguage)}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trendSamples.map((card, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-10 text-zinc-400 font-medium">{t(card.niche, selectedLanguage)}</span>
                    <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 ring-1 ring-emerald-200/60 font-sans text-[11px] font-semibold text-emerald-700">
                      <TrendingUp className="h-3 w-3" />
                      {card.growth}
                    </div>
                  </div>
                  <h3 className="mt-3 font-sans text-base font-bold text-zinc-900 line-clamp-1 group-hover:text-black">
                    {t(card.title, selectedLanguage)}
                  </h3>
                  <p className="mt-1 font-sans text-xs text-zinc-400">{t(card.metric, selectedLanguage)}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4">
                  <div className="flex items-center gap-1.5">
                    {card.platform.includes('TikTok') && <Tv className="h-3.5 w-3.5 text-zinc-600" />}
                    {card.platform.includes('Instagram') && <Instagram className="h-3.5 w-3.5 text-zinc-600" />}
                    {card.platform.includes('YouTube') && <Clapperboard className="h-3.5 w-3.5 text-zinc-600" />}
                    <span className="font-sans text-xs text-zinc-500 font-medium">{card.platform}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-xs font-semibold text-zinc-805">
                    <span>{t("Active Session", selectedLanguage)}:</span>
                    <span className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-white">
                      {card.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Module */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-sans text-3xl font-bold tracking-tight text-black sm:text-4xl">
              {t("Turn a raw concept into a production script in 10 seconds.", selectedLanguage)}
            </h2>
            <p className="mt-4 font-sans text-zinc-500 text-sm sm:text-base">
              {t("No expensive scriptwriters. No scrolling TikTok for 3 hours a day hoping for inspiration.", selectedLanguage)}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Define Niche & Style",
                text: "Pick your category, platform, and content mood. Choose from motivational, educational, luxury, funny, and more."
              },
              {
                step: "02",
                title: "Generate Structural Ideas",
                text: "Unlock 5 highly-targeted video ideas containing a specific dynamic title, difficulty slider, and structural blueprint."
              },
              {
                step: "03",
                title: "Refine Hooks & Action Lines",
                text: "Take your winner to our Script Architect for custom scene visual directions, captions, and copy-paste-ready tags."
              }
            ].map((box, idx) => (
              <div key={idx} className="relative rounded-xl border border-zinc-100 bg-white p-6 shadow-2xs hover:border-zinc-200">
                <span className="font-mono text-sm font-extrabold text-zinc-300 block">{box.step}</span>
                <h3 className="mt-4 font-sans text-base font-bold text-black">{t(box.title, selectedLanguage)}</h3>
                <p className="mt-2 font-sans text-xs text-zinc-500 leading-relaxed">{t(box.text, selectedLanguage)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="border-t border-zinc-100 bg-zinc-50/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">{t("Full Suite", selectedLanguage)}</p>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              {t("Everything you need to conquer short-form video", selectedLanguage)}
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuresList.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="flex flex-col items-start rounded-xl border border-zinc-200/60 bg-white p-6 shadow-2xs">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-sans text-sm font-bold text-zinc-950">{t(f.title, selectedLanguage)}</h3>
                  <p className="mt-2 font-sans text-xs text-zinc-500 leading-normal">{t(f.desc, selectedLanguage)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-sans text-3xl font-bold tracking-tight text-black sm:text-4xl">
              {t("Backed by high-growth micro-creators", selectedLanguage)}
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                quote: "ViralFlow simplified my pipeline completely. I generate a fast storyboard hook in the morning and shoot it in under 10 minutes. My channel gained 12k followers this month.",
                author: "Sarah Jenkins",
                role: "@sarah.tech — 145K TikTok"
              },
              {
                quote: "I was highly skeptical of fake prompt models, but the Hook Machine generates genuinely addictive options based on real curiosity gaps. Absolutely worth the upgrade.",
                author: "Marcus Chen",
                role: "Marketing Architect — Instagram Reels"
              },
              {
                quote: "No code blocks, straight to the point visual directions alongside clear scripts. For $9, this is literally a cheat code for short-form content developers.",
                author: "David Vance",
                role: "DevVlog — YouTube Shorts"
              }
            ].map((quote, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-100 bg-white p-6 shadow-2xs italic relative">
                <p className="font-sans text-xs text-zinc-650 leading-relaxed">"{t(quote.quote, selectedLanguage)}"</p>
                <div className="mt-4 border-t border-zinc-100 pt-3 not-italic">
                  <p className="font-sans text-xs font-bold text-black">{t(quote.author, selectedLanguage)}</p>
                  <p className="font-mono text-[10px] text-zinc-400 mt-0.5">{t(quote.role, selectedLanguage)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Pricing Frame */}
      <section id="pricing" className="border-t border-zinc-100 bg-zinc-50/50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-sans text-3xl font-bold tracking-tight text-black">{t("Transparent Pricing", selectedLanguage)}</h2>
            <p className="mt-2 text-zinc-500 font-sans text-sm">{t("Join the pro tier to bypass daily generation filters.", selectedLanguage)}</p>
          </div>

          <div className="mt-12 mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-sans text-lg font-bold text-zinc-900">ViralFlow Pro</span>
              <span className="rounded bg-black px-2 py-0.5 font-mono text-[9px] font-bold text-white uppercase">{t("Most Selected", selectedLanguage)}</span>
            </div>
            <div className="mt-4 flex items-baseline">
              <span className="font-sans text-4xl font-extrabold text-black">$9</span>
              <span className="ml-1 text-zinc-500 font-sans text-sm">/{t("month", selectedLanguage)}</span>
            </div>
            <p className="mt-2 text-xs font-sans text-zinc-500">{t("Unbounded creative power for serious builders.", selectedLanguage)}</p>
            
            <div className="mt-6 space-y-3.5 border-t border-b border-zinc-100 py-6">
              {[
                "Unlimited generations daily",
                "Unlock full 60s scripting engines",
                "Advanced emotional hook frameworks",
                "Unlimited script & idea workspace saves",
                "Premium hashtag generator",
                "Priority model processing"
              ].map((pill, idx) => (
                <div key={idx} className="flex items-center gap-2 text-zinc-700">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-100 text-black animate-pulse">
                    <Check className="h-3 w-3" />
                  </div>
                  <span className="font-sans text-xs">{t(pill, selectedLanguage)}</span>
                </div>
              ))}
            </div>

            <button
              id="landing-pricing-upgrade-btn"
              onClick={() => setView('pricing')}
              className="mt-6 w-full rounded-lg bg-black py-3 text-center font-sans text-xs font-bold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {t("Unlock Unbounded Access", selectedLanguage)}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 sm:py-24 border-t border-zinc-100">
        <div className="mx-auto max-w-3xl px-4">
          <div className="text-center">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-black sm:text-3xl">
              {t("Frequently Asked Questions", selectedLanguage)}
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqItems.map((item, idx) => {
              const active = activeFaq === idx;
              return (
                <div key={idx} className="rounded-lg border border-zinc-100 bg-white">
                  <button
                    id={`faq-btn-${idx}`}
                    onClick={() => setActiveFaq(active ? null : idx)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left font-sans text-sm font-semibold text-zinc-900 hover:bg-zinc-50/60 cursor-pointer"
                  >
                    <span>{t(item.q, selectedLanguage)}</span>
                    <ChevronDown className={`h-4.5 w-4.5 text-zinc-400 transition-transform duration-200 ${
                      active ? 'rotate-180 text-black' : ''
                    }`} />
                  </button>
                  {active && (
                    <div className="px-5 pb-4 text-xs font-sans text-zinc-500 leading-relaxed border-t border-zinc-50/50 pt-3">
                      {t(item.a, selectedLanguage)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer Hero Banner */}
      <section className="border-t border-zinc-100 bg-black py-20 text-white sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-6">
          <h2 className="font-sans text-3xl font-extrabold sm:text-5xl text-white tracking-tight leading-tight">
            {t("Stop guessing what to post.", selectedLanguage)}<br />
            {t("Start creating viral content.", selectedLanguage)}
          </h2>
          <p className="text-zinc-400 font-sans text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
            {t("Take back control over your content ideas. Draft strategic scripts, identify search voids, and systematize your multi-platform publish matrix today.", selectedLanguage)}
          </p>
          <div className="pt-2">
            <button
              id="footer-start-now-btn"
              onClick={handleStart}
              className="rounded-xl bg-white px-8 py-3.5 font-sans text-xs font-black text-black shadow-lg hover:bg-zinc-100 cursor-pointer transition-colors"
            >
              {t("Get Started (Free Sandbox Active)", selectedLanguage)}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

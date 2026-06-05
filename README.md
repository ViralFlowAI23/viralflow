# ⚡ ViralFlow

**Find viral short-form video ideas, hooks, scripts, and hashtags before everyone else. A premium algorithmic campaign companion designed for TikTok, Instagram Reels, and YouTube Shorts.**

ViralFlow is a modern, single-page creative workspace designed for digital content creators, marketing consultants, starting solopreneurs, and developers. It helps you bypass creative block, generate strategic 30-day calendars, deconstruct high-retention hook psychology, write side-by-scene audio/visual storyboards, and organize your creations into modular workspace directories.

---

## 🎨 Creative Architecture & Key Features

### 1. Unified Workspace Console
A high-contrast Dashboard featuring:
- **Campaign Execution Indicator**: Quick visual progression of completed versus draft campaign entries.
- **Interactive SVG Analytics Forecast**: A custom-designed SVG retention mapping canvas with interactive mouse-hover hotspots representing algorithmic prediction curves.
- **Retention Safety Indicators**: Real-time estimates for Target Organic CTR, Fail-safe Loop Velocity, and Average Retention scores.

### 2. Modular Project Folders Manager
File away generated content cleanly:
- Categorize concepts, script outlines, and hashtag sets into bespoke directories.
- Move items seamlessly between the **Unassigned Inbox** and custom color-coded folders in a single click.
- Persistent local store tracking so you never lose high-performing concepts mid-session.

### 3. Smart Idea Blueprint Engine (`src/utils/generators.ts`)
Creates 5 highly structured briefs containing:
- **Hook Scene (0-3s)**: High psychology attention grabbers designed around loss aversion, curiosity gaps, or authority playbooks.
- **Body Scene (3-25s)**: Multi-platform pacing hints (e.g., fast split-screen overlays for TikTok, loops for Shorts, visual color grades for Reels).
- **Strategic CTAs**: Conversion lines optimized to drive engagement and organic comment spikes.
- **Viral Velocity Indexes**: Deconstructed psychological descriptions explaining precisely *why* each script succeeds within algorithmic feeds.

### 4. Continuous Playbook Elements
- **Hook Machine**: Instantly manufactures 20 tailored hooks cataloged across five unique narrative styles (Curiosity Gap, Danger/Trap, Elite Authority, Velocity, and Empathy).
- **A/V Dual-column Scriptwriter**: Pairs voiceover scripting directly with step-by-step physical camera setups representing real-world filming directions.
- **Triple-tier Hashtag Architect**: Maps broad tags, hyper-niche indicators, and high-viral clusters optimized for discovery.
- **30-Day Master Content Calendar**: Deploys a balanced 30-day sequential calendar grid that keeps your filming process flowing on rails.
- **Multi-language Localizer**: Instant localization framework across English, Spanish, French, German, and Portuguese.

---

## 💻 Tech Stack & Design Standards

ViralFlow is constructed to meet premium visual and structural guidelines:
- **Framework & Build System**: Vite + React 19 + TypeScript.
- **Design System**: Tailwind CSS v4 utilizing strict native configuration.
- **Iconography**: Clean, highly expressive icons loaded exclusively from `lucide-react`.
- **Transitions**: Smooth micro-interactions and route-entrance fades handled via Framer Motion (`motion` imported from `motion/react`).
- **Data Visualizations**: Responsive interactive vectors featuring precise coordinate curves.

---

## 🚀 How to Export to GitHub from Google AI Studio Build

You can export this complete codebase directly to your peronal GitHub repository using AI Studio's native export utility:

1. Look at the top right of the **Google AI Studio Build** console.
2. Click on the **Settings menu** icon (or the export interface).
3. Select **Export to GitHub** (or **Download ZIP** if you wish to upload manually).
4. Authorize your GitHub account if prompted.
5. Choose your target repository name, set it to Public or Private, and confirm the sync!
6. Once synced, your repository will contain every single file, including the customized build commands and Vercel pipeline configuration.

---

## ☁️ Deploying to Vercel (Step-by-Step)

Vercel detects Vite single-page applications automatically and provides zero-config builds. Follow these simple steps:

### Step 1: Link your Repository
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** and choose **Project**.
3. Select your imported `ViralFlow` GitHub repository from the list.

### Step 2: Configure Environment Variables
Before clicking Deploy, click on the **Environment Variables** accordion and add your Gemini API Key if you plan to extend server-side model proxies:
- **Key**: `GEMINI_API_KEY`
- **Value**: `[Your-Google-AI-Studio-or-Gemini-API-Key]`

*(Note: The core application runs entirely on optimized client-side templates, making it safe to run instantly without third-party server setup!)*

### Step 3: Verify Build Directives
Vercel should automatically auto-fill these values:
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build` (produces highly optimized output in the `dist` directory)
- **Output Directory**: `dist`

### Step 4: Deploy!
Click **Deploy**. Within seconds, Vercel will build, bundle, configure rewrites from `vercel.json` for persistent URL refreshes, and issue a secure live `.vercel.app` production link!

---

## 🛠️ Local Development Guide

To run and modify ViralFlow locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/viralflow.git
cd viralflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the Vite Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:3000` (or the port specified in terminal).

### 4. Run Lints and Verify Clean Builds
Ensure everything compiles safely before preparing pull requests:
```bash
# Run typescript typechecking compilation lints
npm run lint

# Compile production bundle
npm run build
```

---

## 📂 Project Directory Breakdown

```text
├── .env.example       # Example variables for API references
├── .gitignore         # Proper git excludes for build and node modules
├── index.html         # SPA Root Entry HTML document
├── package.json       # Project manifest, scripts, and dependencies
├── vercel.json        # Routing overrides for seamless page refreshes on Vercel
├── vite.config.ts     # Vite configuration featuring alias resolution
├── tsconfig.json      # TypeScript compiler parameters
└── src/
    ├── App.tsx        # Central router coordinating view states
    ├── main.tsx       # Standard DOM rendering entry point
    ├── index.css      # Tailwind core CSS overrides and elegant google font declarations
    ├── types.ts       # Typed folder, video, hook, and script model blueprints
    ├── components/    # Modular UI features
    │   ├── Dashboard.tsx          # Master Hub with analytical tracker and Folder Manager
    │   ├── Navbar.tsx             # Responsive layout navigation controls
    │   ├── Sidebar.tsx            # Desktop collateral rail navigation
    │   ├── ContentCalendar.tsx    # 30-Day Content Matrix planner 
    │   ├── HookGenerator.tsx      # High psychology hook engine
    │   ├── ScriptGenerator.tsx    # Double-column scriptwriter scene board
    │   ├── HashtagGenerator.tsx   # Platform metadata architect
    │   ├── TrendAnalyzer.tsx      # Social trends search vacuum
    │   └── CompetitorAnalyzer.tsx # High growth competitor audits
    └── utils/
        ├── generators.ts          # Pure mathematical content formula algorithms
        └── translator.ts          # Instant 5-language localization translations
```

---

*This project was crafted with absolute attention to detail under modern aesthetic principles. Build your content empire cleanly with **ViralFlow**!*

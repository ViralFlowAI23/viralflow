export interface Language {
  code: string;
  name: string;
  flag: string;
  rtl?: boolean;
}

export type Platform = 'TikTok' | 'YouTube Shorts' | 'Instagram Reels';

export type ContentStyle = 'funny' | 'educational' | 'luxury' | 'scary' | 'motivational' | 'storytime';

export interface CreatorFolder {
  id: string;
  name: string;
  color: string; // e.g. "zinc", "blue", "emerald", "amber", "purple", "red"
  createdAt: string;
}

export interface VideoIdea {
  id: string;
  title: string;
  hook: string;
  description: string;
  structure: {
    hook: string;
    body: string;
    cta: string;
  };
  cta: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number; // Viral potential from 1 to 100
  platform: Platform;
  style: ContentStyle;
  niche: string;
  savedAt?: string;
  folderId?: string;
}

export interface ScriptItem {
  id: string;
  topic: string;
  duration: '30s' | '60s';
  hook: string;
  scenes: {
    time: string;
    visual: string;
    audio: string;
  }[];
  caption: string;
  cta: string;
  savedAt?: string;
  folderId?: string;
}

export interface HashtagSet {
  id: string;
  topic: string;
  platform: Platform;
  broad: string[];
  niche: string[];
  viral: string[];
  savedAt?: string;
  folderId?: string;
}

export interface SavedHook {
  id: string;
  topic: string;
  hook: string;
  savedAt?: string;
  folderId?: string;
}

export interface UserState {
  email: string | null;
  tier: 'free' | 'pro';
  isLoggedIn: boolean;
  generationsCount: {
    [key: string]: number; // date key e.g. "2026-06-05" -> count
  };
}

export type ViewType = 
  | 'landing' 
  | 'dashboard' 
  | 'ideas' 
  | 'hooks' 
  | 'scripts' 
  | 'hashtags' 
  | 'trends'
  | 'competitor'
  | 'calendar'
  | 'pricing' 
  | 'auth';

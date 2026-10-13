export interface Hadith {
  id: number;
  arabic?: string;
  urdu: string;
  narratorUrdu: string;
  book: string;
  hadithNumber: string;
  chapter: string;
  category: string;
  grade?: string;
  lesson?: string;
}

export interface HadithComment {
  id: string;
  hadithId: number;
  userName: string;
  text: string;
  type: 'general' | 'correction';
  timestamp: string;
}

export type ThemeMode = 'parchment' | 'light' | 'sepia' | 'dark';
export type FontSize = 'normal' | 'large' | 'xlarge';

import React from 'react';
import { ThemeMode, FontSize } from '../data/types';
import { BannerHeader } from './BannerHeader';
import { Search, BookOpen, Bookmark, Sun, Moon, Type, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'list' | 'book' | 'bookmarks';
  onViewModeChange: (m: 'list' | 'book' | 'bookmarks') => void;
  theme: ThemeMode;
  onThemeToggle: () => void;
  fontSize: FontSize;
  onFontSizeCycle: () => void;
  bookmarkCount: number;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  theme,
  onThemeToggle,
  fontSize,
  onFontSizeCycle,
  bookmarkCount,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-amber-600/20 shadow-xs">
      {/* Official Top Banner uploaded by user: Khateeb Malik Digital Empire */}
      <BannerHeader />

      {/* Main Navbar Controls */}
      <div className="max-w-6xl mx-auto px-4 py-2.5" dir="rtl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Logo and Website Name: Deen e Haq (دینِ حق) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-amber-700 text-white flex items-center justify-center shadow-md shadow-emerald-950/20">
                <BookOpen className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold font-serif tracking-tight text-emerald-950 dark:text-emerald-100">
                    Deen e Haq
                  </h1>
                  <span className="font-urdu font-bold text-amber-700 dark:text-amber-400 text-base md:text-lg">
                    (دینِ حق)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-urdu font-medium border border-emerald-300/40">
                    {totalCount} احادیث
                  </span>
                </div>
                <p className="text-xs font-urdu text-stone-600 dark:text-stone-400">
                  مستند ۵۰۰ احادیث نبویہ ﷺ مع اردو ترجمہ و حوالہ
                </p>
              </div>
            </div>

            {/* Quick Mobile Controls */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={onFontSizeCycle}
                className="p-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
                title="فونٹ کا سائز بدلیں"
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
                title="ڈارک / لائٹ موڈ"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md mx-auto md:mx-4 w-full">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="حدیث میں تلاش کریں (مثلاً: نیت، نماز، والدین، صدقہ، روزہ، اخلاق، سلام)..."
                className="w-full pl-9 pr-10 py-2 text-xs md:text-sm rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 font-urdu shadow-xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="w-5 h-5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center justify-between md:justify-end gap-2">
            {/* View Mode Buttons */}
            <div className="flex items-center p-1 bg-stone-200/80 dark:bg-stone-900 rounded-xl border border-stone-300/50 dark:border-stone-800">
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-urdu font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                فہرست
              </button>
              <button
                onClick={() => onViewModeChange('book')}
                className={`px-3 py-1.5 rounded-lg text-xs font-urdu font-medium transition-all ${
                  viewMode === 'book'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                کتابی موڈ
              </button>
              <button
                onClick={() => onViewModeChange('bookmarks')}
                className={`px-3 py-1.5 rounded-lg text-xs font-urdu font-medium transition-all flex items-center gap-1 ${
                  viewMode === 'bookmarks'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900'
                }`}
              >
                <Bookmark className="w-3 h-3" />
                <span>پسندیدہ</span>
                {bookmarkCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] flex items-center justify-center font-bold">
                    {bookmarkCount}
                  </span>
                )}
              </button>
            </div>

            {/* Desktop Settings */}
            <div className="hidden md:flex items-center gap-1">
              {/* Font Size */}
              <button
                onClick={onFontSizeCycle}
                className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors flex items-center gap-1 text-xs font-urdu"
                title="فونٹ کا سائز بڑا یا چھوٹا کریں"
              >
                <Type className="w-4 h-4" />
                <span>
                  {fontSize === 'normal' ? 'درمیانہ' : fontSize === 'large' ? 'بڑا' : 'بہت بڑا'}
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                title="تھیم تبدیل کریں"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

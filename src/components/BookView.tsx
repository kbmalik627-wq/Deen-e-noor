import React, { useEffect, useState } from 'react';
import { Hadith, HadithComment, FontSize, ThemeMode } from '../data/types';
import { HadithCard } from './HadithCard';
import { ChevronRight, ChevronLeft, BookOpen, Shuffle } from 'lucide-react';

interface BookViewProps {
  ahadith: Hadith[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  fontSize: FontSize;
  theme: ThemeMode;
  bookmarks: number[];
  onToggleBookmark: (id: number) => void;
  onOpenShare: (hadith: Hadith) => void;
  onToast: (msg: string) => void;
  likes: Record<number, number>;
  userLikes: number[];
  onToggleLike: (id: number) => void;
  comments: Record<number, HadithComment[]>;
  onAddComment: (hadithId: number, comment: Omit<HadithComment, 'id' | 'timestamp'>) => void;
}

export const BookView: React.FC<BookViewProps> = ({
  ahadith,
  currentIndex,
  onIndexChange,
  fontSize,
  theme,
  bookmarks,
  onToggleBookmark,
  onOpenShare,
  onToast,
  likes,
  userLikes,
  onToggleLike,
  comments,
  onAddComment,
}) => {
  const [jumpInput, setJumpInput] = useState('');

  const currentHadith = ahadith[currentIndex] || ahadith[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentIndex < ahadith.length - 1) {
          onIndexChange(currentIndex + 1);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentIndex > 0) {
          onIndexChange(currentIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, ahadith.length, onIndexChange]);

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpInput.trim(), 10);
    if (!isNaN(num)) {
      const targetIdx = ahadith.findIndex((h) => h.id === num);
      if (targetIdx !== -1) {
        onIndexChange(targetIdx);
        setJumpInput('');
        onToast(`حدیث نمبر ${num} پر پہنچ گئے`);
      } else if (num >= 1 && num <= ahadith.length) {
        onIndexChange(num - 1);
        setJumpInput('');
        onToast(`صفحہ ${num} پر پہنچ گئے`);
      } else {
        onToast(`براہ کرم ۱ سے ۵۰۰ تک کوئی درست نمبر درج کریں`);
      }
    }
  };

  const handleRandom = () => {
    const rand = Math.floor(Math.random() * ahadith.length);
    onIndexChange(rand);
    onToast(`بے ترتیب حدیث مبارکہ #${ahadith[rand].id}`);
  };

  if (!currentHadith) {
    return (
      <div className="text-center py-12 text-stone-500 font-urdu">
        کوئی حدیث نہیں ملی
      </div>
    );
  }

  const currentLikesCount = likes[currentHadith.id] || 0;
  const isCurrentLiked = userLikes.includes(currentHadith.id);
  const currentComments = comments[currentHadith.id] || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6" dir="rtl">
      {/* Book Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span className="font-urdu text-sm font-semibold text-stone-800 dark:text-stone-200">
            کتابی موڈ: حدیث مبارکہ {currentIndex + 1} از {ahadith.length}
          </span>
        </div>

        {/* Jump Form */}
        <form onSubmit={handleJump} className="flex items-center gap-2">
          <div className="relative">
            <input
              type="number"
              min="1"
              max={ahadith.length}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              placeholder="حدیث نمبر..."
              className="w-28 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:outline-none focus:border-amber-500 text-stone-800 dark:text-stone-200 font-urdu text-center"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-urdu font-medium transition-colors"
          >
            جائیں
          </button>
          <button
            type="button"
            onClick={handleRandom}
            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            title="کوئی بھی حدیث منتخب کریں"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Progress Line */}
      <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-amber-600 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / ahadith.length) * 100}%` }}
        />
      </div>

      {/* The Book Page Card */}
      <div className="relative p-2 md:p-3 rounded-3xl bg-amber-200/30 dark:bg-stone-800/40 border-2 border-dashed border-amber-600/30">
        <HadithCard
          hadith={currentHadith}
          fontSize={fontSize}
          theme={theme}
          isBookmarked={bookmarks.includes(currentHadith.id)}
          onToggleBookmark={onToggleBookmark}
          onOpenShare={onOpenShare}
          onToast={onToast}
          likesCount={currentLikesCount}
          isLiked={isCurrentLiked}
          onToggleLike={onToggleLike}
          comments={currentComments}
          onAddComment={onAddComment}
        />
      </div>

      {/* Bottom Page Flippers */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => onIndexChange(currentIndex - 1)}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-urdu text-sm font-semibold transition-all ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-stone-200 dark:bg-stone-800 text-stone-500'
              : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-amber-700 shadow-md'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
          <span>پچھلی حدیث</span>
        </button>

        <span className="font-urdu text-xs text-stone-500 dark:text-stone-400">
          صفحہ {currentIndex + 1} / {ahadith.length}
        </span>

        <button
          onClick={() => onIndexChange(currentIndex + 1)}
          disabled={currentIndex === ahadith.length - 1}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-urdu text-sm font-semibold transition-all ${
            currentIndex === ahadith.length - 1
              ? 'opacity-40 cursor-not-allowed bg-stone-200 dark:bg-stone-800 text-stone-500'
              : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-amber-700 shadow-md'
          }`}
        >
          <span>اگلی حدیث</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

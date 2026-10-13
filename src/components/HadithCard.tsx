import React, { useState } from 'react';
import { Hadith, HadithComment, FontSize, ThemeMode } from '../data/types';
import { formatHadithText, copyToClipboard } from '../utils/shareUtils';
import { CommentsSection } from './CommentsSection';
import {
  Copy,
  Check,
  Share2,
  Bookmark,
  BookmarkCheck,
  Volume2,
  BookOpen,
  Heart,
  MessageSquare,
  AlertCircle,
  Info
} from 'lucide-react';

interface HadithCardProps {
  hadith: Hadith;
  fontSize: FontSize;
  theme: ThemeMode;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  onOpenShare: (hadith: Hadith) => void;
  onToast: (msg: string) => void;
  highlightQuery?: string;
  likesCount: number;
  isLiked: boolean;
  onToggleLike: (id: number) => void;
  comments: HadithComment[];
  onAddComment: (hadithId: number, comment: Omit<HadithComment, 'id' | 'timestamp'>) => void;
}

export const HadithCard: React.FC<HadithCardProps> = ({
  hadith,
  fontSize,
  theme,
  isBookmarked,
  onToggleBookmark,
  onOpenShare,
  onToast,
  highlightQuery,
  likesCount,
  isLiked,
  onToggleLike,
  comments,
  onAddComment,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleCopy = async () => {
    const text = formatHadithText(hadith);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      onToast(`حدیث مبارکہ #${hadith.id} کاپی ہو گئی ہے`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      onToast('معذرت! آپ کے براؤزر میں آڈیو سپورٹ دستیاب نہیں ہے');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(hadith.urdu);
    utterance.lang = 'ur-PK';
    utterance.rate = 0.85;

    // Check for Urdu voices
    const voices = window.speechSynthesis.getVoices();
    const urduVoice = voices.find((v) => v.lang.startsWith('ur') || v.lang.startsWith('ar'));
    if (urduVoice) {
      utterance.voice = urduVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  // Font size styling
  const urduFontSizeClass =
    fontSize === 'xlarge'
      ? 'text-xl md:text-2xl leading-[2.6]'
      : fontSize === 'large'
      ? 'text-lg md:text-xl leading-[2.4]'
      : 'text-base md:text-lg leading-[2.2]';

  const arabicFontSizeClass =
    fontSize === 'xlarge'
      ? 'text-lg md:text-xl leading-[2.2]'
      : fontSize === 'large'
      ? 'text-base md:text-lg leading-[2.1]'
      : 'text-sm md:text-base leading-[2]';

  return (
    <article
      id={`hadith-${hadith.id}`}
      className={`group relative rounded-2xl transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-stone-900/90 text-stone-100 border border-stone-800 hover:border-amber-500/40'
          : theme === 'sepia'
          ? 'bg-[#f7efe3] text-stone-900 border border-[#dfd2be] hover:border-amber-600/50'
          : theme === 'light'
          ? 'bg-white text-stone-900 border border-stone-200/90 hover:border-amber-400 shadow-sm'
          : 'bg-[#faf6ee] text-stone-900 border border-[#e6dbc8] hover:border-amber-600/60 shadow-[0_4px_20px_-4px_rgba(140,100,40,0.08)]'
      } p-5 md:p-7 overflow-hidden`}
      dir="rtl"
    >
      {/* Decorative Islamic top corner subtle watermark */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-400/10 via-amber-400/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header bar: Hadith number, Book name, Chapter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-200/70 dark:border-stone-800">
        <div className="flex items-center gap-2.5">
          {/* Authentic Book Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-800 text-xs md:text-sm font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{hadith.hadithNumber}</span>
          </div>

          {/* Book reference */}
          <span className="font-urdu text-sm md:text-base font-bold text-amber-800 dark:text-amber-400">
            {hadith.book}
          </span>
        </div>

        {/* Chapter / Topic badge */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-stone-600 dark:text-stone-400 font-urdu">
          <span className="px-2.5 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800 border border-stone-300/40 dark:border-stone-700">
            {hadith.category}
          </span>
          <span className="hidden sm:inline text-stone-400 dark:text-stone-600">•</span>
          <span className="hidden sm:inline text-stone-500 dark:text-stone-400 text-xs">
            {hadith.chapter}
          </span>
        </div>
      </div>

      {/* Arabic text with authentic manuscript look */}
      {hadith.arabic && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-100/40 dark:bg-stone-800/60 border border-amber-200/40 dark:border-stone-800">
          <p
            className={`font-arabic text-emerald-900 dark:text-emerald-300 text-center select-text font-medium ${arabicFontSizeClass}`}
          >
            {hadith.arabic}
          </p>
        </div>
      )}

      {/* Urdu translation in authentic book Nastaliq calligraphy */}
      <div className="my-3">
        <p
          className={`font-urdu font-normal text-stone-900 dark:text-stone-100 select-text ${urduFontSizeClass}`}
        >
          {hadith.urdu}
        </p>
      </div>

      {/* Narrator and lesson footer block */}
      <div className="mt-4 pt-3 space-y-2 border-t border-stone-200/60 dark:border-stone-800/80">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs md:text-sm text-stone-600 dark:text-stone-400">
          <span className="font-urdu font-medium text-stone-700 dark:text-stone-300">
            راوی: <span className="text-amber-800 dark:text-amber-400 font-semibold">{hadith.narratorUrdu}</span>
          </span>
          <span className="text-xs text-stone-400 dark:text-stone-500">
            حوالہ نمبر #{hadith.id}
          </span>
        </div>

        {hadith.lesson && (
          <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/40 dark:border-emerald-900/40 text-xs md:text-sm text-emerald-900 dark:text-emerald-200 font-urdu">
            <span className="font-bold ml-1">درسِ حدیث:</span>
            <span>{hadith.lesson}</span>
          </div>
        )}
      </div>

      {/* REQUIRED NOTE AT END OF EVERY HADITH (قارئین کے لیے خصوصی نوٹ) */}
      <div className="mt-4 p-3 rounded-xl bg-amber-100/60 dark:bg-stone-800/80 border border-amber-300/60 dark:border-stone-700/80 text-xs md:text-sm font-urdu text-stone-800 dark:text-stone-200 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-amber-900 dark:text-amber-300 ml-1">ضروری نوٹ:</strong>
            اگر آپ یہ حدیث پڑھتے ہوئے عربی متن، اردو ترجمہ یا حوالہ میں کوئی غلطی یا کتابت کا سہو پائیں تو برائے مہربانی کمنٹ کر کے مطلع فرما دیں، شکریہ۔
          </p>
        </div>
        <button
          onClick={() => setIsCommentsOpen(true)}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-200/80 dark:bg-amber-950/80 hover:bg-amber-300 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 text-xs font-semibold transition-colors flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3 text-amber-700 dark:text-amber-400" />
          <span>کمنٹ کریں</span>
        </button>
      </div>

      {/* Bottom Action Toolbar: Like, Comment, Copy, Share, Bookmark, Audio */}
      <div className="mt-4 pt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/60 dark:border-stone-800">
        {/* Left side: Like and Comment buttons */}
        <div className="flex items-center gap-1.5">
          {/* Like Button */}
          <button
            onClick={() => onToggleLike(hadith.id)}
            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all font-urdu font-medium ${
              isLiked
                ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-xs scale-102'
                : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600'
            }`}
            title={isLiked ? 'پسند ہٹائیں' : 'پسند کریں'}
            aria-label="پسند کریں"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform ${
                isLiked ? 'fill-rose-600 text-rose-600 scale-110' : ''
              }`}
            />
            <span>{isLiked ? 'پسندیدہ' : 'پسند'}</span>
            <span className="text-[10px] px-1 py-0.2 rounded-full bg-white/70 dark:bg-stone-900/70">
              {likesCount}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all font-urdu font-medium ${
              isCommentsOpen
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/80 dark:hover:bg-stone-700'
            }`}
            title="کمنٹس دیکھیں اور اپنی رائے دیں"
            aria-label="کمنٹس"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>کمنٹ</span>
            <span className="text-[10px] px-1 py-0.2 rounded-full bg-white/70 dark:bg-stone-900/70">
              {comments.length}
            </span>
          </button>
        </div>

        {/* Right side: Audio, Bookmark, Copy, Share */}
        <div className="flex items-center gap-1.5 ms-auto">
          {/* Speech Audio button */}
          <button
            onClick={handleSpeak}
            className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              isPlaying
                ? 'bg-amber-500 text-white'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
            title="حدیث سنیں"
            aria-label="حدیث سنیں"
          >
            <Volume2 className="w-4 h-4" />
            <span className="font-urdu hidden md:inline text-xs">
              {isPlaying ? 'روکیں' : 'سنیں'}
            </span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(hadith.id)}
            className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              isBookmarked
                ? 'text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 font-semibold'
                : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800'
            }`}
            title={isBookmarked ? 'محفوظ شدہ سے ہٹائیں' : 'محفوظ کریں'}
            aria-label="محفوظ کریں"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            <span className="font-urdu hidden md:inline text-xs">
              {isBookmarked ? 'محفوظ' : 'بک مارک'}
            </span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all font-urdu font-medium ${
              copied
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-200/70 dark:bg-stone-800 hover:bg-emerald-600 hover:text-white text-stone-800 dark:text-stone-200'
            }`}
            title="حدیث کاپی کریں"
            aria-label="حدیث کاپی کریں"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>کاپی ہو گئی!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>کاپی کریں</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={() => onOpenShare(hadith)}
            className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white transition-colors font-urdu font-semibold shadow-sm"
            title="شیئر کریں"
            aria-label="شیئر کریں"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>شیئر کریں</span>
          </button>
        </div>
      </div>

      {/* Expandable Comments & Correction Section */}
      <CommentsSection
        hadithId={hadith.id}
        comments={comments}
        onAddComment={onAddComment}
        onToast={onToast}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      />
    </article>
  );
};

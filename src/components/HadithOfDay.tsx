import React from 'react';
import { Hadith } from '../data/types';
import { formatHadithText, copyToClipboard } from '../utils/shareUtils';
import { Sparkles, Share2, Copy, Check, RefreshCw, BookOpen } from 'lucide-react';

interface HadithOfDayProps {
  hadith: Hadith;
  onRefresh: () => void;
  onOpenShare: (hadith: Hadith) => void;
  onToast: (msg: string) => void;
}

export const HadithOfDay: React.FC<HadithOfDayProps> = ({
  hadith,
  onRefresh,
  onOpenShare,
  onToast,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const text = formatHadithText(hadith);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      onToast(`منتخب حدیث مبارکہ کاپی ہو گئی ہے`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="relative rounded-2xl bg-gradient-to-br from-emerald-900 via-stone-900 to-amber-950 text-amber-50 p-6 md:p-8 shadow-xl border border-amber-500/30 overflow-hidden my-6"
      dir="rtl"
    >
      {/* Decorative Islamic Arch Motif in background */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="font-urdu text-base md:text-lg font-bold text-amber-300">
              آج کی منتخب حدیث مبارکہ
            </h2>
            <p className="text-xs text-stone-300">
              {hadith.book} • {hadith.hadithNumber}
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700/80 text-amber-200 border border-amber-500/30 text-xs font-urdu transition-all hover:scale-102"
          title="ایک اور حدیث دکھائیں"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">تبدیل کریں</span>
        </button>
      </div>

      {/* Arabic text */}
      {hadith.arabic && (
        <p className="font-arabic text-base md:text-lg text-emerald-300 text-center mb-4 leading-relaxed">
          {hadith.arabic}
        </p>
      )}

      {/* Urdu text */}
      <p className="font-urdu text-lg md:text-xl leading-[2.4] text-stone-100 text-right mb-4">
        "{hadith.urdu}"
      </p>

      {/* Footer & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-amber-500/20 text-xs">
        <div className="flex items-center gap-3 text-stone-300 font-urdu">
          <span>راوی: <strong className="text-amber-300">{hadith.narratorUrdu}</strong></span>
          <span>•</span>
          <span className="text-amber-400/90">{hadith.category}</span>
        </div>

        <div className="flex items-center gap-2 ms-auto">
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-urdu transition-all ${
              copied
                ? 'bg-emerald-500 text-white'
                : 'bg-stone-800/90 hover:bg-stone-700 text-amber-100 border border-stone-700'
            }`}
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

          <button
            onClick={() => onOpenShare(hadith)}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 font-urdu font-medium shadow-md transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>شیئر کریں</span>
          </button>
        </div>
      </div>
    </div>
  );
};

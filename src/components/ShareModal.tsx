import React, { useState } from 'react';
import { Hadith } from '../data/types';
import { formatHadithText, copyToClipboard, shareViaWhatsApp, shareViaTelegram, shareViaTwitter, shareNative } from '../utils/shareUtils';
import { X, Copy, Check, Share2, Send, MessageCircle, Twitter, Sparkles } from 'lucide-react';

interface ShareModalProps {
  hadith: Hadith;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ hadith, onClose, onToast }) => {
  const [copied, setCopied] = useState(false);

  const formattedText = formatHadithText(hadith);

  const handleCopy = async () => {
    const ok = await copyToClipboard(formattedText);
    if (ok) {
      setCopied(true);
      onToast('حدیث مبارکہ مع حوالہ کامیابی سے کاپی ہو گئی ہے');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    const success = await shareNative(hadith);
    if (!success) {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-stone-50 dark:bg-stone-900 rounded-2xl border border-amber-500/30 p-6 shadow-2xl text-stone-800 dark:text-stone-100 max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-urdu text-lg font-bold">حدیث مبارکہ شیئر کریں</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {hadith.book} • {hadith.hadithNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview box */}
        <div className="my-5 p-4 rounded-xl bg-amber-50/70 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700 text-stone-800 dark:text-stone-200">
          {hadith.arabic && (
            <p className="font-arabic text-base md:text-lg text-emerald-800 dark:text-emerald-300 mb-3 text-center leading-relaxed">
              {hadith.arabic}
            </p>
          )}
          <p className="font-urdu text-sm md:text-base leading-loose text-stone-900 dark:text-stone-100 text-right">
            "{hadith.urdu}"
          </p>
          <div className="mt-3 pt-2 border-t border-amber-200/50 dark:border-stone-700/60 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <span>راوی: {hadith.narratorUrdu}</span>
            <span className="font-semibold text-amber-700 dark:text-amber-400">{hadith.book}</span>
          </div>
        </div>

        {/* Quick Share Buttons */}
        <div className="space-y-3">
          <p className="font-urdu text-xs font-semibold text-stone-500 dark:text-stone-400">
            براہ راست کسی بھی ایپ پر شیئر کریں:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* WhatsApp */}
            <button
              onClick={() => shareViaWhatsApp(hadith)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 transition-all hover:scale-102"
            >
              <MessageCircle className="w-6 h-6 mb-1 text-emerald-600 dark:text-emerald-400" />
              <span className="font-urdu text-xs">واٹس ایپ</span>
            </button>

            {/* Telegram */}
            <button
              onClick={() => shareViaTelegram(hadith)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-300/60 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-800 dark:text-sky-300 transition-all hover:scale-102"
            >
              <Send className="w-6 h-6 mb-1 text-sky-600 dark:text-sky-400" />
              <span className="font-urdu text-xs">ٹیلی گرام</span>
            </button>

            {/* Twitter / X */}
            <button
              onClick={() => shareViaTwitter(hadith)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700/80 text-stone-800 dark:text-stone-200 transition-all hover:scale-102"
            >
              <Twitter className="w-6 h-6 mb-1 text-stone-700 dark:text-stone-300" />
              <span className="font-urdu text-xs">ٹوئٹر / X</span>
            </button>

            {/* Native Device Share */}
            <button
              onClick={handleNativeShare}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 transition-all hover:scale-102"
            >
              <Share2 className="w-6 h-6 mb-1 text-amber-600 dark:text-amber-400" />
              <span className="font-urdu text-xs">دیگر ایپس</span>
            </button>
          </div>

          {/* Copy Full Text Button */}
          <button
            onClick={handleCopy}
            className={`w-full mt-3 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-urdu text-sm font-semibold transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white shadow-md'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>مکمل حدیث کاپی ہو گئی!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>حدیث مبارکہ کا متن کاپی کریں</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Credit Note */}
        <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 text-center">
          <p className="font-urdu text-xs text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Deen e Haq (دینِ حق) | KM Digital Empire #1</span>
          </p>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { BookOpen, ArrowUp, Phone } from 'lucide-react';

interface FooterProps {
  totalAhadith: number;
}

export const Footer: React.FC<FooterProps> = ({ totalAhadith }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-stone-900 text-stone-300 border-t border-emerald-800/40" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-950/40">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold font-serif text-emerald-400">Deen e Haq</h2>
                <span className="font-urdu font-bold text-amber-400 text-lg">(دینِ حق)</span>
              </div>
            </div>
            <p className="font-urdu text-sm text-stone-400 max-w-md leading-relaxed">
              منتخب ۵۰۰ مستند احادیث مبارکہ کا مکمل اردو مجموعہ۔ تمام روایات کتبِ صحیحہ (بخاری، مسلم، ترمذی، وغیرہ) سے ماخوذ ہیں۔
            </p>
          </div>

          <div className="text-center md:text-left flex flex-col items-center md:items-end gap-2">
            <div className="px-4 py-2 rounded-xl bg-stone-800/90 border border-emerald-900/60 text-emerald-300 font-urdu text-sm flex items-center gap-2">
              <span>پیشکش:</span>
              <strong className="text-white">خطیب ملک ڈیجیٹل ایمپائر</strong>
              <span className="px-1.5 py-0.2 rounded bg-emerald-800 text-white text-xs font-mono font-bold">#1</span>
            </div>
            <a
              href="tel:03267976823"
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-mono transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>0326 797 6823</span>
            </a>
            <p className="text-xs text-stone-500">
              Khateeb Malik Digital Empire • All Rights Reserved
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-stone-500">
          <p className="font-urdu text-stone-400">
            اللّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَّعَلَىٰ آلِ مُحَمَّدٍ
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors font-urdu"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>اوپر جائیں</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

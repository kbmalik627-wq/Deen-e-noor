import React from 'react';
import { Phone, Sparkles } from 'lucide-react';

export const BannerHeader: React.FC = () => {
  return (
    <div className="w-full bg-[#070b09] border-b border-emerald-950/60 shadow-lg relative overflow-hidden">
      {/* Decorative ambient subtle green glow in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-28 bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Main Banner Visual Container */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-center">
        <div className="w-full max-w-4xl relative rounded-xl overflow-hidden border border-emerald-900/40 shadow-2xl bg-black">
          {/* Scalable SVG Banner */}
          <img
            src="/khateeb-malik-banner.svg"
            alt="Khateeb Malik Digital Empire - 0326 797 6823"
            className="w-full h-auto block select-none"
            loading="eager"
          />

          {/* Quick interactive phone link overlay on hover / click */}
          <a
            href="tel:03267976823"
            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 sm:bottom-2 px-3 py-0.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-[11px] sm:text-xs flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-all font-mono"
            title="رابطہ کریں: 0326 797 6823"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>0326 797 6823</span>
          </a>
        </div>
      </div>
    </div>
  );
};

import React from 'react';

export const BannerHeader: React.FC = () => {
  return (
    <div className="w-full bg-[#040705] border-b border-emerald-950/80 shadow-md">
      {/* Main Banner Visual Container */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-center">
        <div
          className="w-full max-w-4xl relative rounded-xl overflow-hidden border border-emerald-900/40 shadow-2xl bg-black block"
        >
          {/* Scalable SVG Banner: DIGITAL EMPIRE #1 */}
          <img
            src="/khateeb-malik-banner.svg"
            alt="Digital Empire #1"
            className="w-full h-auto block select-none"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

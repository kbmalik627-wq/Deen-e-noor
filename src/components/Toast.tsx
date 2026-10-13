import React, { useEffect } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-stone-900/95 text-stone-100 shadow-2xl border border-amber-600/30 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <Info className="w-5 h-5 text-amber-400 shrink-0" />
      )}
      <span className="font-urdu text-sm md:text-base leading-relaxed tracking-wide">
        {message}
      </span>
      <button
        onClick={onClose}
        className="text-stone-400 hover:text-stone-200 transition-colors p-1"
        aria-label="بند کریں"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

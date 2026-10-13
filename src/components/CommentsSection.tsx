import React, { useState } from 'react';
import { HadithComment } from '../data/types';
import { Send, MessageSquare, AlertCircle, CheckCircle2, User, Clock } from 'lucide-react';

interface CommentsSectionProps {
  hadithId: number;
  comments: HadithComment[];
  onAddComment: (hadithId: number, comment: Omit<HadithComment, 'id' | 'timestamp'>) => void;
  onToast: (msg: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  hadithId,
  comments,
  onAddComment,
  onToast,
  isOpen,
  onClose,
}) => {
  const [userName, setUserName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentType, setCommentType] = useState<'general' | 'correction'>('general');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      onToast('براہ کرم کمنٹ کا متن درج کریں');
      return;
    }

    onAddComment(hadithId, {
      hadithId,
      userName: userName.trim() || 'محترم قاری',
      text: commentText.trim(),
      type: commentType,
    });

    setCommentText('');
    onToast(
      commentType === 'correction'
        ? 'غلطی کی نشاندہی کے لیے شکریہ! آپ کا کمنٹ درج کر لیا گیا ہے'
        : 'آپ کا تبصرہ کامیابی سے شامل کر دیا گیا ہے، شکریہ!'
    );
  };

  return (
    <div className="mt-4 pt-4 border-t border-stone-200/70 dark:border-stone-800 animate-in fade-in duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h4 className="font-urdu text-sm font-bold text-stone-800 dark:text-stone-200">
            کمنٹس اور قارئین کی آراء ({comments.length})
          </h4>
        </div>
        <button
          onClick={onClose}
          className="text-xs font-urdu text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
        >
          بند کریں ✕
        </button>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-4 p-3.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type selector */}
          <div className="flex items-center gap-1 text-xs font-urdu">
            <button
              type="button"
              onClick={() => setCommentType('general')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                commentType === 'general'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              عام کمنٹ / رائے
            </button>
            <button
              type="button"
              onClick={() => setCommentType('correction')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                commentType === 'correction'
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'bg-stone-200 dark:bg-stone-700 text-rose-700 dark:text-rose-400'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span>غلطی کی نشاندہی</span>
            </button>
          </div>

          {/* User Name input */}
          <div className="flex-1 min-w-[140px]">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="آپ کا نام (اختیاری)..."
              className="w-full px-3 py-1 text-xs rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 placeholder:text-stone-400 font-urdu focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Comment Textarea */}
        <textarea
          rows={2}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={
            commentType === 'correction'
              ? 'اگر اس حدیث کے متن، ترجمہ یا حوالہ میں کوئی غلطی یا شک ہے تو وضاحت فرمائیں...'
              : 'حدیث مبارکہ سے متعلق اپنی رائے یا تاثر تحریر فرمائیں...'
          }
          className="w-full px-3 py-2 text-xs md:text-sm rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 font-urdu focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
        />

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-stone-500 dark:text-stone-400 font-urdu">
            {commentType === 'correction' ? '⚠️ آپ کی نشاندہی کا جائزہ لیا جائے گا۔' : 'ہمیشہ ادب و احترام ملحوظ رکھیں۔'}
          </p>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-urdu font-medium transition-colors shadow-xs"
          >
            <Send className="w-3 h-3" />
            <span>کمنٹ بھیجیں</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-center py-4 text-xs font-urdu text-stone-400 dark:text-stone-500">
            ابھی تک کوئی کمنٹ نہیں۔ آپ پہلے کمنٹ کرنے والے بن سکتے ہیں!
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className={`p-2.5 rounded-xl border text-xs md:text-sm ${
                c.type === 'correction'
                  ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-stone-900 dark:text-stone-100'
                  : 'bg-white/80 dark:bg-stone-800/50 border-stone-200/80 dark:border-stone-700/60 text-stone-900 dark:text-stone-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 font-urdu font-semibold text-stone-800 dark:text-stone-200 text-xs">
                  <User className="w-3 h-3 text-stone-400" />
                  <span>{c.userName}</span>
                  {c.type === 'correction' && (
                    <span className="px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-[10px]">
                      غلطی کی نشاندہی
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-stone-400">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{c.timestamp}</span>
                </div>
              </div>
              <p className="font-urdu leading-relaxed text-stone-700 dark:text-stone-300 text-xs md:text-sm">
                {c.text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

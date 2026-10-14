import React, { useState, useMemo, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { AHADITH_DATA } from './data/ahadith';
import { INITIAL_COMMENTS, INITIAL_LIKES } from './data/seedComments';
import { Hadith, HadithComment, FontSize, ThemeMode } from './data/types';
import { Navbar } from './components/Navbar';
import { HadithCard } from './components/HadithCard';
import { BookView } from './components/BookView';
import { CategoriesBar } from './components/CategoriesBar';
import { HadithOfDay } from './components/HadithOfDay';
import { ShareModal } from './components/ShareModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { BookOpen, Search, Bookmark, ChevronLeft, ChevronRight, Sparkles, FilterX, AlertCircle, RefreshCw, Info } from 'lucide-react';

// Safe localStorage access for sandboxed iframes
const safeStorage = {
  getItem: (key: string, fallback: string): string => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key) || fallback;
      }
    } catch {
      // In restricted iframes localStorage may throw SecurityError
    }
    return fallback;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Ignore in restricted iframes
    }
  },
};

// Error Boundary to prevent any blank screen
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-amber-50 text-stone-900" dir="rtl">
          <div className="max-w-md w-full p-8 rounded-2xl bg-white shadow-xl border border-amber-200 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
            <h2 className="font-urdu text-xl font-bold">معذرت، صفحہ لوڈ کرنے میں مسئلہ ہوا</h2>
            <p className="font-urdu text-sm text-stone-600">براہ کرم صفحہ دوبارہ ریفریش کریں۔</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-urdu text-sm font-semibold hover:bg-amber-700"
            >
              صفحہ ریفریش کریں
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('تمام احادیث');
  const [viewMode, setViewMode] = useState<'list' | 'book' | 'bookmarks'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Book mode index (0-based)
  const [bookIndex, setBookIndex] = useState(0);

  // Appearance State with Safe Storage
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (safeStorage.getItem('sm_theme', 'parchment') as ThemeMode) || 'parchment';
  });
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    return (safeStorage.getItem('sm_fontSize', 'normal') as FontSize) || 'normal';
  });

  // Bookmarks State with Safe Storage
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = safeStorage.getItem('sm_bookmarks', '[]');
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  // Likes State with Safe Storage
  const [likes, setLikes] = useState<Record<number, number>>(() => {
    try {
      const saved = safeStorage.getItem('sm_likes_counts', '');
      return saved ? JSON.parse(saved) : INITIAL_LIKES;
    } catch {
      return INITIAL_LIKES;
    }
  });

  const [userLikes, setUserLikes] = useState<number[]>(() => {
    try {
      const saved = safeStorage.getItem('sm_user_likes', '[]');
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  // Comments State with Safe Storage
  const [comments, setComments] = useState<Record<number, HadithComment[]>>(() => {
    try {
      const saved = safeStorage.getItem('sm_comments', '');
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  // Share Modal State
  const [sharingHadith, setSharingHadith] = useState<Hadith | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Hadith of the Day
  const [hadithOfDayIndex, setHadithOfDayIndex] = useState(() => {
    try {
      const today = new Date();
      const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
      );
      return Math.abs(dayOfYear) % (AHADITH_DATA.length || 1);
    } catch {
      return 0;
    }
  });

  // Save Bookmarks
  useEffect(() => {
    safeStorage.setItem('sm_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Save Likes
  useEffect(() => {
    safeStorage.setItem('sm_likes_counts', JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    safeStorage.setItem('sm_user_likes', JSON.stringify(userLikes));
  }, [userLikes]);

  // Save Comments
  useEffect(() => {
    safeStorage.setItem('sm_comments', JSON.stringify(comments));
  }, [comments]);

  // Save Theme & Apply Classes
  useEffect(() => {
    safeStorage.setItem('sm_theme', theme);
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.style.backgroundColor = '#1c1917';
      } else if (theme === 'sepia') {
        root.classList.remove('dark');
        root.style.backgroundColor = '#f4ede2';
      } else if (theme === 'light') {
        root.classList.remove('dark');
        root.style.backgroundColor = '#ffffff';
      } else {
        root.classList.remove('dark');
        root.style.backgroundColor = '#faf6ee';
      }
    } catch (e) {
      console.warn('Theme update error:', e);
    }
  }, [theme]);

  // Save Font Size
  useEffect(() => {
    safeStorage.setItem('sm_fontSize', fontSize);
  }, [fontSize]);

  // Theme Toggler
  const handleThemeToggle = () => {
    setTheme((prev) => {
      if (prev === 'parchment') return 'light';
      if (prev === 'light') return 'dark';
      return 'parchment';
    });
  };

  // Font Size Cycler
  const handleFontSizeCycle = () => {
    setFontSize((prev) => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'normal';
    });
  };

  // Bookmark Toggle
  const handleToggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        setToastMessage(`حدیث نمبر ${id} کو محفوظ شدہ فہرست سے ہٹا دیا گیا`);
        return prev.filter((bId) => bId !== id);
      } else {
        setToastMessage(`حدیث نمبر ${id} کو محفوظ کر لیا گیا ہے`);
        return [...prev, id];
      }
    });
  };

  // Like Toggle
  const handleToggleLike = (id: number) => {
    const isLiked = userLikes.includes(id);
    if (isLiked) {
      setUserLikes((prev) => prev.filter((hId) => hId !== id));
      setLikes((prev) => ({
        ...prev,
        [id]: Math.max(0, (prev[id] || 1) - 1),
      }));
      setToastMessage('پسند ہٹا دی گئی');
    } else {
      setUserLikes((prev) => [...prev, id]);
      setLikes((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
      setToastMessage('حدیث مبارکہ کو پسندیدہ قرار دیا گیا، جزاکم اللہ');
    }
  };

  // Add Comment
  const handleAddComment = (
    hadithId: number,
    newCommentData: Omit<HadithComment, 'id' | 'timestamp'>
  ) => {
    const newComment: HadithComment = {
      ...newCommentData,
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'ابھی ابھی',
    };

    setComments((prev) => ({
      ...prev,
      [hadithId]: [newComment, ...(prev[hadithId] || [])],
    }));
  };

  // Build Categories List
  const categoriesList = useMemo(() => {
    const counts: Record<string, number> = {};
    AHADITH_DATA.forEach((h) => {
      counts[h.category] = (counts[h.category] || 0) + 1;
    });

    const list = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
    }));

    return [
      { name: 'تمام احادیث', count: AHADITH_DATA.length },
      ...list,
    ];
  }, []);

  // Filtered Ahadith
  const filteredAhadith = useMemo(() => {
    let result = AHADITH_DATA;

    // View mode: bookmarks only
    if (viewMode === 'bookmarks') {
      result = result.filter((h) => bookmarks.includes(h.id));
    }

    // Category filter
    if (selectedCategory !== 'تمام احادیث') {
      result = result.filter((h) => h.category === selectedCategory);
    }

    // Search query filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((h) => {
        if (h.id.toString() === query) return true;
        if (h.hadithNumber && h.hadithNumber.includes(query)) return true;

        const inUrdu = h.urdu ? h.urdu.toLowerCase().includes(query) : false;
        const inArabic = h.arabic ? h.arabic.includes(query) : false;
        const inNarrator = h.narratorUrdu ? h.narratorUrdu.toLowerCase().includes(query) : false;
        const inBook = h.book ? h.book.toLowerCase().includes(query) : false;
        const inChapter = h.chapter ? h.chapter.toLowerCase().includes(query) : false;
        const inLesson = h.lesson ? h.lesson.toLowerCase().includes(query) : false;

        return inUrdu || inArabic || inNarrator || inBook || inChapter || inLesson;
      });
    }

    return result;
  }, [searchQuery, selectedCategory, viewMode, bookmarks]);

  // Reset pagination when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, viewMode]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAhadith.length / pageSize) || 1;
  const paginatedAhadith = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAhadith.slice(start, start + pageSize);
  }, [filteredAhadith, currentPage, pageSize]);

  // Handle refresh Hadith of the day
  const handleRefreshHadithOfDay = () => {
    let next = Math.floor(Math.random() * (AHADITH_DATA.length || 1));
    if (next === hadithOfDayIndex && AHADITH_DATA.length > 1) {
      next = (next + 1) % AHADITH_DATA.length;
    }
    setHadithOfDayIndex(next);
    setToastMessage('نئی منتخب حدیث مبارکہ آ گئی ہے');
  };

  const currentHadithOfDay = AHADITH_DATA[hadithOfDayIndex] || AHADITH_DATA[0];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-stone-950 text-stone-100'
          : theme === 'sepia'
          ? 'bg-[#f4ede2] text-stone-900'
          : theme === 'light'
          ? 'bg-stone-50 text-stone-900'
          : 'bg-[#faf6ee] text-stone-900'
      }`}
      dir="rtl"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      {/* Share Modal */}
      {sharingHadith && (
        <ShareModal
          hadith={sharingHadith}
          onClose={() => setSharingHadith(null)}
          onToast={(msg) => setToastMessage(msg)}
        />
      )}

      {/* Main Sticky Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        fontSize={fontSize}
        onFontSizeCycle={handleFontSizeCycle}
        bookmarkCount={bookmarks.length}
        totalCount={AHADITH_DATA.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full">
        {/* Top Featured Hadith of the Day */}
        {viewMode === 'list' && !searchQuery && selectedCategory === 'تمام احادیث' && currentHadithOfDay && (
          <HadithOfDay
            hadith={currentHadithOfDay}
            onRefresh={handleRefreshHadithOfDay}
            onOpenShare={(h) => setSharingHadith(h)}
            onToast={(msg) => setToastMessage(msg)}
          />
        )}

        {/* Categories Bar */}
        {viewMode !== 'book' && (
          <div className="mb-6">
            <CategoriesBar
              categories={categoriesList}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        )}

        {/* Starting Important Notice for Readers (Only once at the starting as requested) */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-100/70 dark:bg-stone-900 border border-amber-300/80 dark:border-amber-800/60 shadow-xs flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex-1 text-right">
            <h3 className="font-urdu font-bold text-amber-950 dark:text-amber-300 text-sm md:text-base">
              قارئینِ کرام کے لیے ضروری گزارش:
            </h3>
            <p className="font-urdu text-xs md:text-sm text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">
              اگر آپ احادیث مبارکہ پڑھتے ہوئے کسی بھی حدیث کے عربی متن، اردو ترجمہ یا حوالہ میں کوئی غلطی، املا یا کتابت کا سہو پائیں تو برائے مہربانی اس حدیث کے نیچے دیے گئے <strong>"کمنٹ"</strong> کے آپشن کے ذریعے ضرور مطلع فرما دیں تاکہ فوری تصحیح کی جا سکے، جزاکم اللہ خیراً و شکریہ۔
            </p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-stone-200/60 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="font-urdu text-sm md:text-base font-semibold text-stone-800 dark:text-stone-200">
              {viewMode === 'bookmarks'
                ? `محفوظ شدہ احادیث (${filteredAhadith.length})`
                : viewMode === 'book'
                ? `کتابی موڈ - کل احادیث: ${AHADITH_DATA.length}`
                : `${selectedCategory} (${filteredAhadith.length} احادیث)`}
            </span>
            {searchQuery && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-urdu">
                تلاش: "{searchQuery}"
              </span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'تمام احادیث') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('تمام احادیث');
              }}
              className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 hover:underline font-urdu"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>تمام فلٹرز ختم کریں</span>
            </button>
          )}
        </div>

        {/* VIEW MODE 1: BOOK MODE */}
        {viewMode === 'book' ? (
          <BookView
            ahadith={AHADITH_DATA}
            currentIndex={bookIndex}
            onIndexChange={setBookIndex}
            fontSize={fontSize}
            theme={theme}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onOpenShare={(h) => setSharingHadith(h)}
            onToast={(msg) => setToastMessage(msg)}
            likes={likes}
            userLikes={userLikes}
            onToggleLike={handleToggleLike}
            comments={comments}
            onAddComment={handleAddComment}
          />
        ) : (
          /* VIEW MODE 2: LIST / BOOKMARKS VIEW */
          <div className="space-y-6">
            {filteredAhadith.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl bg-stone-100/50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-800">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-stone-800 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-urdu text-lg font-bold text-stone-800 dark:text-stone-200 mb-1">
                  کوئی حدیث مبارکہ نہیں ملی
                </h3>
                <p className="font-urdu text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                  {viewMode === 'bookmarks'
                    ? 'آپ نے ابھی تک کوئی حدیث محفوظ نہیں کی۔ کسی بھی حدیث پر "محفوظ کریں" کا بٹن دبا کر محفوظ کریں۔'
                    : 'براہ کرم کوئی دوسرا لفظ تلاش کریں یا کیٹیگری فلٹر تبدیل کریں۔'}
                </p>
                {(searchQuery || selectedCategory !== 'تمام احادیث') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('تمام احادیث');
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-urdu text-xs font-medium"
                  >
                    تمام احادیث دکھائیں
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {paginatedAhadith.map((hadith) => (
                    <HadithCard
                      key={hadith.id}
                      hadith={hadith}
                      fontSize={fontSize}
                      theme={theme}
                      isBookmarked={bookmarks.includes(hadith.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onOpenShare={(h) => setSharingHadith(h)}
                      onToast={(msg) => setToastMessage(msg)}
                      highlightQuery={searchQuery}
                      likesCount={likes[hadith.id] || 0}
                      isLiked={userLikes.includes(hadith.id)}
                      onToggleLike={handleToggleLike}
                      comments={comments[hadith.id] || []}
                      onAddComment={handleAddComment}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-stone-200/80 dark:border-stone-800">
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-urdu text-xs md:text-sm font-semibold transition-all ${
                        currentPage === 1
                          ? 'opacity-40 cursor-not-allowed bg-stone-200 dark:bg-stone-800 text-stone-500'
                          : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-amber-700 shadow-sm'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>پچھلا صفحہ</span>
                    </button>

                    <span className="font-urdu text-xs md:text-sm text-stone-600 dark:text-stone-400">
                      صفحہ {currentPage} از {totalPages} (کل {filteredAhadith.length} احادیث)
                    </span>

                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-urdu text-xs md:text-sm font-semibold transition-all ${
                        currentPage === totalPages
                          ? 'opacity-40 cursor-not-allowed bg-stone-200 dark:bg-stone-800 text-stone-500'
                          : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-amber-700 shadow-sm'
                      }`}
                    >
                      <span>اگلا صفحہ</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer totalAhadith={AHADITH_DATA.length} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

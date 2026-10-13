import React from 'react';

interface CategoriesBarProps {
  categories: { name: string; count: number }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoriesBar: React.FC<CategoriesBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-thin" dir="rtl">
      <div className="flex items-center gap-2 min-w-max px-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-urdu font-medium transition-all duration-200 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-700/20 scale-102 font-semibold'
                  : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/80 dark:hover:bg-stone-700/80'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-amber-700/80 text-amber-100'
                    : 'bg-stone-300/60 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

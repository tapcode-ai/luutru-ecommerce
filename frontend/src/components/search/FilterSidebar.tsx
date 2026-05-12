"use client";

import { useState } from "react";
import { FilterOptions, SortOption } from "@/types/product";
import { PRICE_RANGES, SORT_OPTIONS } from "@/lib/searchUtils";
import { categories } from "@/lib/mockData";
import { X, SlidersHorizontal, Star, ChevronDown, ChevronUp } from "lucide-react";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClose,
  isMobile = false,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    category: true,
    price: true,
    rating: true,
    sort: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (updates: Partial<FilterOptions>) => {
    onFilterChange({ ...filters, ...updates });
  };

  const clearAllFilters = () => {
    onFilterChange({
      searchQuery: filters.searchQuery,
      categoryId: null,
      minPrice: 0,
      maxPrice: 100000000,
      minRating: 0,
      inStock: false,
      sortBy: "popular" as SortOption,
    });
  };

  const hasActiveFilters =
    filters.categoryId ||
    filters.minPrice > 0 ||
    filters.maxPrice < 100000000 ||
    filters.minRating > 0 ||
    filters.inStock ||
    filters.sortBy !== "popular";

  const SectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: string;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
    >
      {title}
      {expandedSections[section] ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  const content = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Bộ lọc
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-500 hover:text-red-600 font-medium"
            >
              Xóa tất cả
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
        <SectionHeader title="Sắp xếp theo" section="sort" />
        {expandedSections.sort && (
          <div className="mt-1 space-y-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFilter({ sortBy: option.value })}
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filters.sortBy === option.value
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
        <SectionHeader title="Danh mục" section="category" />
        {expandedSections.category && (
          <div className="mt-1 space-y-1">
            <button
              onClick={() => updateFilter({ categoryId: null })}
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                !filters.categoryId
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateFilter({ categoryId: cat.id })}
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filters.categoryId === cat.id
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
        <SectionHeader title="Khoảng giá" section="price" />
        {expandedSections.price && (
          <div className="mt-1 space-y-1">
            <button
              onClick={() =>
                updateFilter({ minPrice: 0, maxPrice: 100000000 })
              }
              className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filters.minPrice === 0 && filters.maxPrice === 100000000
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Tất cả mức giá
            </button>
            {PRICE_RANGES.map((range) => (
              <button
                key={range.label}
                onClick={() =>
                  updateFilter({ minPrice: range.min, maxPrice: range.max })
                }
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filters.minPrice === range.min &&
                  filters.maxPrice === range.max
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
        <SectionHeader title="Đánh giá" section="rating" />
        {expandedSections.rating && (
          <div className="mt-1 space-y-1">
            {[0, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => updateFilter({ minRating: rating })}
                className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  filters.minRating === rating
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {rating === 0 ? (
                  "Tất cả"
                ) : (
                  <span className="flex items-center gap-1">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-gray-400 ml-1">trở lên</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-3 py-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => updateFilter({ inStock: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Chỉ hiện sản phẩm còn hàng
          </span>
        </label>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-40 bg-white dark:bg-gray-900 overflow-y-auto">
        <div className="p-4">{content}</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sticky top-20">
      {content}
    </div>
  );
}
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp, Clock, Loader2 } from "lucide-react";
import { products } from "@/lib/mockData";
import { filterProducts, getDefaultFilters } from "@/lib/searchUtils";
import { Product } from "@/types/product";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch {}
      }
    }
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      const filters = getDefaultFilters();
      filters.searchQuery = query;
      const filtered = filterProducts(products, filters);
      setResults(filtered.slice(0, 8));
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Click outside to close
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  const saveSearch = (searchQuery: string) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    saveSearch(searchQuery);
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-gray-900 shadow-xl">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {/* Search Form */}
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bạn đang tìm gì hôm nay?"
              className="w-full pl-12 pr-12 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-base outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-14 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </form>

          {/* Search Results */}
          {query.trim() && (
            <div className="mt-4">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                  <span className="ml-2 text-gray-500">Đang tìm kiếm...</span>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          saveSearch(query);
                          onClose();
                          router.push(`/product/${product.slug}`);
                        }}
                        className="group text-left"
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.discount && product.discount > 0 && (
                            <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-medium line-clamp-2 text-gray-800 dark:text-gray-200 group-hover:text-red-500 transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-sm font-bold text-red-500 mt-1">
                          {formatPrice(product.price)}
                        </p>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSearch(query)}
                    className="w-full mt-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Xem tất cả {results.length} kết quả cho &ldquo;{query}&rdquo;
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">
                    Không tìm thấy sản phẩm nào cho &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Thử tìm kiếm với từ khóa khác
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recent Searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Tìm kiếm gần đây
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Xóa tất cả
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5"
                  >
                    <button
                      onClick={() => handleSearch(search)}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-500"
                    >
                      {search}
                    </button>
                    <button
                      onClick={() => removeRecentSearch(search)}
                      className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                    >
                      <X className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {!query.trim() && recentSearches.length === 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 mb-3">
                <TrendingUp className="w-4 h-4" />
                Tìm kiếm phổ biến
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Áo sơ mi",
                  "Điện thoại",
                  "Laptop",
                  "Giày thể thao",
                  "Nước hoa",
                  "Sách",
                  "Đồng hồ",
                  "Máy ảnh",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-gray-600 dark:text-gray-400 hover:text-red-500 rounded-full px-3 py-1.5 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
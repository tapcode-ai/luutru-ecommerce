"use client";

import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FilterOptions, SortOption, Product } from "@/types/product";
import { productsApi } from "@/lib/api";
import { getDefaultFilters } from "@/lib/searchUtils";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/search/FilterSidebar";
import {
  Search,
  SlidersHorizontal,
  X,
  Grid3X3,
  List,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { SORT_OPTIONS } from "@/lib/searchUtils";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") || "";

  const [filters, setFilters] = useState<FilterOptions>({
    ...getDefaultFilters(),
    searchQuery: queryParam,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Update search query from URL
  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchQuery: queryParam }));
  }, [queryParam]);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        limit: 20,
      };

      if (filters.searchQuery) params.search = filters.searchQuery;
      if (filters.categoryId) params.category = filters.categoryId;
      if (filters.minPrice > 0) params.minPrice = filters.minPrice;
      if (filters.maxPrice < 100000000) params.maxPrice = filters.maxPrice;
      if (filters.minRating > 0) params.minRating = filters.minRating;
      if (filters.inStock) params.inStock = true;

      // Map sort option to API format
      const sortMap: Record<string, string> = {
        popular: "popular",
        newest: "newest",
        "price-asc": "price_asc",
        "price-desc": "price_desc",
        rating: "rating",
        "best-selling": "best_seller",
      };
      if (filters.sortBy && sortMap[filters.sortBy]) {
        params.sortBy = sortMap[filters.sortBy];
      }

      const response = await productsApi.getAll(params);
      const data = response.data || [];
      if (page === 1) {
        setProducts(data);
      } else {
        setProducts((prev) => [...prev, ...data]);
      }
      if (response.pagination) {
        setTotal(response.pagination.total);
        setHasMore(page < response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    }
    setLoading(false);
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1);
  };

  const clearSearch = () => {
    setFilters({ ...getDefaultFilters(), searchQuery: "" });
    router.push("/search");
  };

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === filters.sortBy)?.label || "Phổ biến";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilters((prev) => ({ ...prev, searchQuery: val }));
                  router.push(`/search?q=${encodeURIComponent(val)}`, {
                    scroll: false,
                  });
                }}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
              />
              {filters.searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Lọc
            </button>
            <button
              onClick={() =>
                setViewMode(viewMode === "grid" ? "list" : "grid")
              }
              className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"
            >
              {viewMode === "grid" ? (
                <List className="w-4 h-4" />
              ) : (
                <Grid3X3 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {filters.searchQuery
                    ? `Kết quả cho "${filters.searchQuery}"`
                    : "Tất cả sản phẩm"}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {total} sản phẩm
                </p>
              </div>

              {/* Sort Dropdown (Desktop) */}
              <div className="hidden sm:relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-gray-300"
                >
                  {currentSortLabel}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showSortDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSortDropdown(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 py-1">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleFilterChange({
                              ...filters,
                              sortBy: option.value,
                            });
                            setShowSortDropdown(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            filters.sortBy === option.value
                              ? "bg-red-50 dark:bg-red-900/20 text-red-600 font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(filters.categoryId ||
              filters.minPrice > 0 ||
              filters.maxPrice < 100000000 ||
              filters.minRating > 0 ||
              filters.inStock) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {filters.categoryId && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-xs font-medium">
                    {filters.categoryId}
                    <button
                      onClick={() =>
                        handleFilterChange({ ...filters, categoryId: null })
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(filters.minPrice > 0 || filters.maxPrice < 100000000) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-xs font-medium">
                    {filters.minPrice > 0
                      ? `Từ ${filters.minPrice.toLocaleString()}₫`
                      : ""}
                    {filters.minPrice > 0 && filters.maxPrice < 100000000
                      ? " - "
                      : ""}
                    {filters.maxPrice < 100000000
                      ? `Đến ${filters.maxPrice.toLocaleString()}₫`
                      : ""}
                    <button
                      onClick={() =>
                        handleFilterChange({
                          ...filters,
                          minPrice: 0,
                          maxPrice: 100000000,
                        })
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.minRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-xs font-medium">
                    {filters.minRating} sao trở lên
                    <button
                      onClick={() =>
                        handleFilterChange({ ...filters, minRating: 0 })
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.inStock && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-xs font-medium">
                    Còn hàng
                    <button
                      onClick={() =>
                        handleFilterChange({ ...filters, inStock: false })
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && page === 1 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : products.length > 0 ? (
              <>
                {/* Products Grid/List */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                      : "space-y-3"
                  }
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={loading}
                      className="px-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                      ) : null}
                      Xem thêm sản phẩm
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-500 mb-6">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <button
                  onClick={() =>
                    setFilters({ ...getDefaultFilters(), searchQuery: "" })
                  }
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-white dark:bg-gray-900 z-50 shadow-xl overflow-y-auto">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowMobileFilters(false)}
              isMobile
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Đang tải...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
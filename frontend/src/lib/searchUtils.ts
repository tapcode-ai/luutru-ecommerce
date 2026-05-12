import { Product, FilterOptions, SortOption, PriceRange } from "@/types/product";

export const PRICE_RANGES: PriceRange[] = [
  { label: "Dưới 100.000₫", min: 0, max: 100000 },
  { label: "100.000₫ - 500.000₫", min: 100000, max: 500000 },
  { label: "500.000₫ - 2.000.000₫", min: 500000, max: 2000000 },
  { label: "2.000.000₫ - 10.000.000₫", min: 2000000, max: 10000000 },
  { label: "Trên 10.000.000₫", min: 10000000, max: 100000000 },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Phổ biến" },
  { value: "newest", label: "Mới nhất" },
  { value: "best-selling", label: "Bán chạy" },
  { value: "price-asc", label: "Giá: Thấp đến Cao" },
  { value: "price-desc", label: "Giá: Cao đến Thấp" },
  { value: "rating", label: "Đánh giá cao" },
];

export function filterProducts(
  products: Product[],
  filters: FilterOptions
): Product[] {
  let result = [...products];

  // Search by name
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
        p.description.toLowerCase().includes(query)
    );
  }

  // Filter by category
  if (filters.categoryId) {
    result = result.filter((p) => p.categoryId === filters.categoryId);
  }

  // Filter by price range
  result = result.filter(
    (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
  );

  // Filter by minimum rating
  if (filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating);
  }

  // Filter by stock
  if (filters.inStock) {
    result = result.filter((p) => p.stock > 0);
  }

  // Sort
  result = sortProducts(result, filters.sortBy);

  return result;
}

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "best-selling":
      sorted.sort((a, b) => b.soldCount - a.soldCount);
      break;
    default: // popular
      sorted.sort((a, b) => {
        // Score based on rating, sold count, and discount
        const scoreA = a.rating * 0.4 + Math.min(a.soldCount / 10000, 5) * 0.3 + (a.discount || 0) * 0.3;
        const scoreB = b.rating * 0.4 + Math.min(b.soldCount / 10000, 5) * 0.3 + (b.discount || 0) * 0.3;
        return scoreB - scoreA;
      });
      break;
  }

  return sorted;
}

export function getDefaultFilters(): FilterOptions {
  return {
    searchQuery: "",
    categoryId: null,
    minPrice: 0,
    maxPrice: 100000000,
    minRating: 0,
    inStock: false,
    sortBy: "popular",
  };
}
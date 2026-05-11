"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { products, categories } from "@/lib/mockData";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [showFilters, setShowFilters] = useState(false);

  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = useMemo(() => {
    let filtered = products.filter((p) => p.categoryId === category?.id);

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        filtered.sort((a, b) => b.soldCount - a.soldCount);
    }

    return filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
  }, [category, sortBy, priceRange]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 py-12 md:py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {category?.name || "Danh mục"}
            </h1>
            <p className="text-red-100 text-lg">
              {categoryProducts.length} sản phẩm
            </p>
          </motion.div>
        </div>
      </div>

      <div className="section-container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "lg:w-64 shrink-0",
              !showFilters && "hidden lg:block"
            )}
          >
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-red-500" />
                  Danh mục
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <a
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className={cn(
                        "block px-3 py-2 rounded-lg text-sm transition-all",
                        cat.slug === slug
                          ? "bg-red-500/10 text-red-400 font-medium"
                          : "text-muted-foreground hover:text-white hover:bg-secondary/50"
                      )}
                    >
                      {cat.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="font-semibold text-white mb-4">Khoảng giá</h3>
                <div className="space-y-3">
                  {[
                    { label: "Dưới 100.000₫", min: 0, max: 100000 },
                    { label: "100.000₫ - 500.000₫", min: 100000, max: 500000 },
                    { label: "500.000₫ - 2.000.000₫", min: 500000, max: 2000000 },
                    { label: "2.000.000₫ - 10.000.000₫", min: 2000000, max: 10000000 },
                    { label: "Trên 10.000.000₫", min: 10000000, max: 100000000 },
                  ].map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setPriceRange([range.min, range.max])}
                      className={cn(
                        "block w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                        priceRange[0] === range.min && priceRange[1] === range.max
                          ? "bg-red-500/10 text-red-400 font-medium"
                          : "text-muted-foreground hover:text-white hover:bg-secondary/50"
                      )}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border p-4 mb-6 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Bộ lọc
                </Button>
                <div className="hidden sm:flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === "grid" ? "bg-red-500 text-white" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === "list" ? "bg-red-500 text-white" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {categoryProducts.length} kết quả
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-secondary/50 border border-border rounded-lg px-3 py-2 pr-8 text-sm text-white focus:outline-none focus:border-red-500/50 cursor-pointer"
                  >
                    <option value="popular">Phổ biến</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="rating">Đánh giá</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            {categoryProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc danh mục khác</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={cn(
                  viewMode === "grid"
                    ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "space-y-4"
                )}
              >
                {categoryProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  Store,
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  EyeOff,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  ChevronDown,
  MoreHorizontal,
  ShoppingBag,
  Users,
  Star,
  Tag,
  Layers,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSellerStore, SellerProduct } from "@/store/sellerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn } from "@/lib/utils";

const CATEGORIES = [
  "Thời trang",
  "Điện tử",
  "Đồ gia dụng",
  "Mỹ phẩm",
  "Thực phẩm",
  "Sách",
  "Thể thao",
  "Phụ kiện",
];

const STATUS_OPTIONS: { label: string; value: SellerProduct["status"] }[] = [
  { label: "Đang bán", value: "active" },
  { label: "Ngừng bán", value: "inactive" },
  { label: "Hết hàng", value: "out_of_stock" },
];

export default function SellerPage() {
  const { products, deleteProduct, getTotalSales, getTotalRevenue, getActiveProducts, getOutOfStockProducts } = useSellerStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SellerProduct["status"] | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price_asc" | "price_desc" | "sales">("newest");

  const totalSales = getTotalSales();
  const totalRevenue = getTotalRevenue();
  const activeProducts = getActiveProducts();
  const outOfStockProducts = getOutOfStockProducts();

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price_asc": return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "sales": return b.sales - a.sales;
        default: return 0;
      }
    });

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setShowDeleteModal(null);
  };

  const getStatusBadge = (status: SellerProduct["status"]) => {
    switch (status) {
      case "active":
        return { label: "Đang bán", color: "text-green-500 bg-green-500/10", icon: CheckCircle };
      case "inactive":
        return { label: "Ngừng bán", color: "text-gray-500 bg-gray-500/10", icon: EyeOff };
      case "out_of_stock":
        return { label: "Hết hàng", color: "text-red-500 bg-red-500/10", icon: AlertTriangle };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 py-6 md:py-10">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3">
                  <Store className="w-8 h-8" />
                  Seller Center
                </h1>
                <p className="text-white/70 mt-1">
                  Quản lý cửa hàng và sản phẩm của bạn
                </p>
              </div>
              <Link href="/seller/add">
                <Button className="bg-white text-red-600 hover:bg-white/90 rounded-xl shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm sản phẩm
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-container py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            {
              label: "Tổng sản phẩm",
              value: products.length,
              icon: Package,
              color: "from-blue-500 to-blue-600",
              bg: "bg-blue-500/10",
            },
            {
              label: "Đang bán",
              value: activeProducts,
              icon: CheckCircle,
              color: "from-green-500 to-green-600",
              bg: "bg-green-500/10",
            },
            {
              label: "Đã bán",
              value: totalSales,
              icon: TrendingUp,
              color: "from-purple-500 to-purple-600",
              bg: "bg-purple-500/10",
            },
            {
              label: "Doanh thu",
              value: formatPrice(totalRevenue),
              icon: DollarSign,
              color: "from-orange-500 to-orange-600",
              bg: "bg-orange-500/10",
            },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card rounded-2xl border border-border p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stat.bg)}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-xl md:text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary/50 border-border pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-red-500/50"
            >
              <option value="all">Tất cả trạng thái</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-red-500/50"
            >
              <option value="all">Tất cả danh mục</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-red-500/50"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price_asc">Giá: Thấp → Cao</option>
              <option value="price_desc">Giá: Cao → Thấp</option>
              <option value="sales">Bán chạy</option>
            </select>
          </div>
        </div>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {products.length === 0 ? "Chưa có sản phẩm nào" : "Không tìm thấy sản phẩm"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {products.length === 0
                ? "Bắt đầu đăng bán sản phẩm đầu tiên"
                : "Thử thay đổi bộ lọc"}
            </p>
            {products.length === 0 && (
              <Link href="/seller/add">
                <Button className="rounded-xl bg-gradient-to-r from-red-600 to-red-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Đăng bán ngay
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product, index) => {
              const statusBadge = getStatusBadge(product.status);
              const StatusIcon = statusBadge.icon;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl border border-border p-4 hover:border-red-500/30 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-secondary shrink-0">
                      {product.images[0] ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-white truncate">{product.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">Mã: {product.id}</p>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0",
                          statusBadge.color
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {statusBadge.label}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <span className="text-sm font-semibold text-red-500">
                          {formatPrice(product.price)}
                        </span>
                        {product.oldPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.oldPrice)}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          <Package className="w-3 h-3 inline mr-1" />
                          Kho: {product.stock}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <Tag className="w-3 h-3 inline mr-1" />
                          {product.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          <TrendingUp className="w-3 h-3 inline mr-1" />
                          Đã bán: {product.sales}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <Link href={`/seller/edit/${product.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-xs h-8"
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Sửa
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg text-xs h-8 text-red-400 hover:text-red-300 border-red-500/30"
                          onClick={() => setShowDeleteModal(product.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full"
          >
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Xóa sản phẩm</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setShowDeleteModal(null)}
              >
                Hủy
              </Button>
              <Button
                className="flex-1 rounded-xl bg-red-500 hover:bg-red-600"
                onClick={() => handleDelete(showDeleteModal)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Share2,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Package,
  Store,
  MessageCircle,
  ThumbsUp,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Zap,
  Sparkles,
} from "lucide-react";
import { useState, useMemo } from "react";
import { products, reviews } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatNumber, cn } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { useSellerStore } from "@/store/sellerStore";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useUserStore();
  const { products: sellerProducts } = useSellerStore();

  const productReviews = useMemo(
    () => reviews.filter((r) => r.productId === product?.id),
    [product]
  );

  const relatedProducts = useMemo(
    () => products.filter((p) => p.categoryId === product?.categoryId && p.id !== product?.id).slice(0, 8),
    [product]
  );

  // Tính phí ship
  const FREE_SHIP_THRESHOLD = 500000;
  const SHIPPING_FEE = 30000;
  const isFreeShip = product ? product.price >= FREE_SHIP_THRESHOLD : false;
  const shippingFeeDisplay = isFreeShip ? 0 : SHIPPING_FEE;

  // Thống kê đánh giá
  const ratingStats = useMemo(() => {
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((r) => {
      const star = Math.floor(r.rating) as keyof typeof stats;
      if (stats[star] !== undefined) stats[star]++;
    });
    return stats;
  }, [productReviews]);

  const averageRating = productReviews.length > 0
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : product?.rating || 0;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Sản phẩm không tồn tại</h2>
          <p className="text-muted-foreground mb-4">Sản phẩm này có thể đã bị xóa hoặc không tồn tại.</p>
          <Button asChild>
            <a href="/">Quay về trang chủ</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const wishlisted = isInWishlist(product.id);

  // Stock status
  const stockPercentage = Math.min((product.stock / 1000) * 100, 100);
  const isLowStock = product.stock <= 50;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="section-container py-4 md:py-6">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-4 md:mb-6 overflow-x-auto whitespace-nowrap pb-2"
        >
          <a href="/" className="hover:text-white transition-colors shrink-0">Trang chủ</a>
          <span className="shrink-0">/</span>
          <a href={`/category/${product.categoryId}`} className="hover:text-white transition-colors shrink-0">
            {product.category?.name || "Danh mục"}
          </a>
          <span className="shrink-0">/</span>
          <span className="text-white truncate">{product.name}</span>
        </motion.nav>

        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3 md:space-y-4"
          >
            <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-card border border-border group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.discount && (
                <Badge className="absolute top-3 md:top-4 left-3 md:left-4 bg-red-500 text-white text-xs md:text-sm px-2 md:px-3 py-1">
                  -{product.discount}%
                </Badge>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-lg font-bold bg-red-500 px-4 py-2 rounded-lg">
                    Hết hàng
                  </span>
                </div>
              )}
              <button className="absolute top-3 md:top-4 right-3 md:right-4 p-2 md:p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-red-500 transition-colors">
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => Math.max(0, prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => Math.min(product.images.length - 1, prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail list */}
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "w-14 h-14 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden border-2 shrink-0 transition-all",
                    selectedImage === idx
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-border hover:border-red-500/50"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6"
          >
            {/* Product Name & Rating */}
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 md:gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5 md:w-4 md:h-4",
                        i < Math.floor(averageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs md:text-sm text-muted-foreground">
                  {formatNumber(product.soldCount)} đã bán
                </span>
                {product.brand && (
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Thương hiệu: <span className="text-white">{product.brand}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="bg-card rounded-xl md:rounded-2xl border border-border p-4 md:p-6">
              <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-500">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-sm md:text-lg text-muted-foreground line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                    <Badge variant="destructive" className="text-xs md:text-sm">
                      -{product.discount}%
                    </Badge>
                  </>
                )}
              </div>

              {/* Tiết kiệm */}
              {product.oldPrice && (
                <p className="text-xs md:text-sm text-green-500 mt-2">
                  Tiết kiệm: {formatPrice(product.oldPrice - product.price)} (
                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%)
                </p>
              )}
            </div>

            {/* Shipping Info */}
            <div className="bg-card rounded-xl md:rounded-2xl border border-border p-4 md:p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-red-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {isFreeShip ? (
                      <span className="text-green-500">Miễn phí vận chuyển</span>
                    ) : (
                      <>Phí vận chuyển: {formatPrice(SHIPPING_FEE)}</>
                    )}
                  </p>
                  {!isFreeShip && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Miễn phí vận chuyển cho đơn hàng từ {formatPrice(FREE_SHIP_THRESHOLD)}
                    </p>
                  )}
                </div>
                {isFreeShip && (
                  <Badge variant="outline" className="text-green-500 border-green-500 text-xs">
                    <Truck className="w-3 h-3 mr-1" />
                    Freeship
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Vận chuyển từ <span className="text-white">Hồ Chí Minh</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-muted-foreground shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Dự kiến giao hàng: <span className="text-white">3-5 ngày làm việc</span>
                </p>
              </div>
            </div>

            {/* Stock Status */}
            <div className="bg-card rounded-xl md:rounded-2xl border border-border p-4 md:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Tình trạng:</span>
                {isOutOfStock ? (
                  <span className="text-sm text-red-500 font-medium">Hết hàng</span>
                ) : isLowStock ? (
                  <span className="text-sm text-orange-500 font-medium">Sắp hết hàng</span>
                ) : (
                  <span className="text-sm text-green-500 font-medium">Còn hàng</span>
                )}
              </div>

              {/* Stock bar */}
              {!isOutOfStock && (
                <>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stockPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full",
                        isLowStock ? "bg-orange-500" : "bg-green-500"
                      )}
                    />
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {isLowStock ? (
                      <span className="text-orange-500 font-medium">
                        ⚠ Chỉ còn {product.stock} sản phẩm
                      </span>
                    ) : (
                      <>Còn {formatNumber(product.stock)} sản phẩm trong kho</>
                    )}
                  </p>
                </>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 md:gap-4">
              <span className="text-sm font-medium text-white">Số lượng:</span>
              <div className="flex items-center gap-1 bg-card border border-border rounded-lg md:rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="p-2 md:p-3 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <span className="w-10 md:w-12 text-center font-medium text-white text-sm md:text-base">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={isOutOfStock || quantity >= product.stock}
                  className="p-2 md:p-3 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
              {!isOutOfStock && (
                <button
                  onClick={() => setQuantity(product.stock)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  (Tối đa {product.stock})
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                disabled={isOutOfStock}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl h-12 md:h-14 text-base md:text-lg font-semibold shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 md:w-5 md:h-5" />
                      Đã thêm
                    </motion.span>
                  ) : (
                    <motion.span
                      key="cart"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                      {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl h-12 md:h-14 w-12 md:w-14"
                onClick={() =>
                  wishlisted
                    ? removeFromWishlist(product.id)
                    : addToWishlist(product)
                }
              >
                <Heart
                  className={cn(
                    "w-4 h-4 md:w-5 md:h-5 transition-colors",
                    wishlisted ? "fill-red-500 text-red-500" : ""
                  )}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
              {[
                { icon: Truck, label: "Miễn phí vận chuyển", desc: "Cho đơn trên 500.000₫" },
                { icon: Shield, label: "Bảo hành chính hãng", desc: "12 tháng bảo hành" },
                { icon: RotateCcw, label: "Đổi trả miễn phí", desc: "Trong vòng 30 ngày" },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-lg md:rounded-xl bg-card border border-border"
                >
                  <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-red-500 shrink-0" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-white">{feature.label}</p>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs: Description & Reviews */}
        <div className="mb-8 md:mb-12">
          {/* Tab buttons */}
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => setActiveTab("description")}
              className={cn(
                "px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-colors relative",
                activeTab === "description"
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              Mô tả sản phẩm
              {activeTab === "description" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={cn(
                "px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-colors relative",
                activeTab === "reviews"
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              Đánh giá ({productReviews.length})
              {activeTab === "reviews" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "description" ? (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-card rounded-xl md:rounded-2xl border border-border p-4 md:p-6"
              >
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                    {showFullDesc
                      ? product.description
                      : product.description.length > 200
                        ? product.description.slice(0, 200) + "..."
                        : product.description}
                  </p>
                  {product.description.length > 200 && (
                    <button
                      onClick={() => setShowFullDesc(!showFullDesc)}
                      className="text-red-500 hover:text-red-400 text-sm mt-2 flex items-center gap-1"
                    >
                      {showFullDesc ? (
                        <>Thu gọn <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>Xem thêm <ChevronDown className="w-3 h-3" /></>
                      )}
                    </button>
                  )}
                </div>

                {/* Product details */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-white">Chi tiết sản phẩm</h3>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-2 text-muted-foreground">Thương hiệu</td>
                          <td className="py-2 text-white text-right">{product.brand || "Đang cập nhật"}</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-2 text-muted-foreground">Danh mục</td>
                          <td className="py-2 text-white text-right">{product.category?.name || "Đang cập nhật"}</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-2 text-muted-foreground">Tình trạng</td>
                          <td className="py-2 text-green-500 text-right">
                            {isOutOfStock ? "Hết hàng" : "Còn hàng"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted-foreground">Đã bán</td>
                          <td className="py-2 text-white text-right">{formatNumber(product.soldCount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-secondary rounded-full text-xs text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Rating Summary */}
                <div className="bg-card rounded-xl md:rounded-2xl border border-border p-4 md:p-6 mb-4 md:mb-6">
                  <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-0.5 mt-1 justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3.5 h-3.5 md:w-4 md:h-4",
                              i < Math.floor(averageRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {productReviews.length} đánh giá
                      </p>
                    </div>
                    <div className="flex-1 w-full space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingStats[star as keyof typeof ratingStats];
                        const percentage = productReviews.length > 0
                          ? (count / productReviews.length) * 100
                          : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground w-8 text-right">{star}</span>
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full bg-yellow-400 rounded-full"
                              />
                            </div>
                            <span className="text-muted-foreground w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                {productReviews.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {productReviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl md:rounded-2xl border border-border p-4 md:p-5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm md:text-base font-bold shrink-0">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium text-white">
                                {review.userName}
                              </span>
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "w-3 h-3",
                                      i < Math.floor(review.rating)
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-muted-foreground"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                              {review.comment}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors">
                                <ThumbsUp className="w-3.5 h-3.5" />
                                Hữu ích
                              </button>
                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors">
                                <MessageCircle className="w-3.5 h-3.5" />
                                Trả lời
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 md:py-16 bg-card rounded-xl md:rounded-2xl border border-border">
                    <MessageCircle className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-3 md:mb-4" />
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                      Chưa có đánh giá
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Hãy là người đầu tiên đánh giá sản phẩm này!
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-2xl font-bold text-white">Sản phẩm liên quan</h2>
              <a
                href={`/category/${product.categoryId}`}
                className="text-sm text-red-500 hover:text-red-400 transition-colors"
              >
                Xem tất cả
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
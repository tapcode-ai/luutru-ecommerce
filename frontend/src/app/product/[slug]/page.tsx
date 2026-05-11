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
} from "lucide-react";
import { useState, useMemo } from "react";
import { products } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatNumber, cn } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products.find((p) => p.slug === slug);
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useUserStore();

  const relatedProducts = useMemo(
    () => products.filter((p) => p.categoryId === product?.categoryId && p.id !== product?.id).slice(0, 8),
    [product]
  );

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

  return (
    <div className="min-h-screen bg-background">
      <div className="section-container py-6">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        >
          <a href="/" className="hover:text-white transition-colors">Trang chủ</a>
          <span>/</span>
          <a href={`/category/${product.categoryId}`} className="hover:text-white transition-colors">
            {product.category?.name || "Danh mục"}
          </a>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </motion.nav>

        {/* Product Main */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.discount && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1">
                  -{product.discount}%
                </Badge>
              )}
              <button className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-red-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all",
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
            className="space-y-6"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Đã bán {formatNumber(product.soldCount)}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-bold text-red-500">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                    <Badge variant="destructive" className="text-sm">
                      -{product.discount}%
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-white">Số lượng:</span>
              <div className="flex items-center gap-1 bg-card border border-border rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:text-red-400 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:text-red-400 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock} sản phẩm có sẵn
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl h-14 text-lg font-semibold shadow-lg shadow-red-500/25"
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
                      <Check className="w-5 h-5" />
                      Đã thêm
                    </motion.span>
                  ) : (
                    <motion.span
                      key="cart"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Thêm vào giỏ
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-xl h-14 w-14"
                onClick={() =>
                  wishlisted
                    ? removeFromWishlist(product.id)
                    : addToWishlist(product)
                }
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-colors",
                    wishlisted ? "fill-red-500 text-red-500" : ""
                  )}
                />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Miễn phí vận chuyển", desc: "Cho đơn trên 500.000₫" },
                { icon: Shield, label: "Bảo hành chính hãng", desc: "12 tháng bảo hành" },
                { icon: RotateCcw, label: "Đổi trả miễn phí", desc: "Trong vòng 30 ngày" },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                >
                  <feature.icon className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

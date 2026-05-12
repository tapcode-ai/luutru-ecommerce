"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/userStore";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "compact" | "flash-sale";
}

export default function ProductCard({
  product,
  index = 0,
  variant = "default",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { isInWishlist, toggleWishlist } = useUserStore();
  const { addItem } = useCartStore();
  const { addToast } = useToast();

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    setIsAddingToCart(true);
    addItem(product, 1);
    addToast({
      type: "success",
      title: "Đã thêm vào giỏ hàng",
      message: `${product.name} - ${product.price.toLocaleString()}₫`,
    });
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    addToast({
      type: isWishlisted ? "info" : "success",
      title: isWishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
      message: product.name,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-3 h-3",
              i < Math.floor(rating)
                ? "text-yellow-400 fill-yellow-400"
                : i < rating
                ? "text-yellow-400 fill-yellow-400/50"
                : "text-gray-600"
            )}
          />
        ))}
      </div>
    );
  };

  if (variant === "compact") {
    return (
      <Link
        href={`/product/${product.slug}`}
        className="group flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800/50 transition-colors"
      >
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-800 shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm text-white truncate group-hover:text-red-400 transition-colors">
            {product.name}
          </h4>
          <p className="text-sm font-bold text-red-400 mt-0.5">
            {product.price.toLocaleString()}₫
          </p>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/product/${product.slug}`}
        className={cn(
          "group block bg-gray-900/80 rounded-xl border border-gray-800/50 overflow-hidden",
          "hover:border-gray-700/50 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5",
          "transition-all duration-300",
          isOutOfStock && "opacity-75"
        )}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-800">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isHovered ? "scale-110" : "scale-100",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Overlay on hover */}
          <div
            className={cn(
              "absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={cn(
                "p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-900 transition-colors",
                isAddingToCart && "scale-110"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleWishlist}
              className={cn(
                "p-2.5 rounded-full transition-colors",
                isWishlisted
                  ? "bg-red-500/90 text-white"
                  : "bg-white/90 hover:bg-white text-gray-900"
              )}
            >
              <Heart
                className={cn("w-4 h-4", isWishlisted && "fill-current")}
              />
            </motion.button>
            <Link
              href={`/product/${product.slug}`}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-900 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <Badge variant="flash" className="text-xs font-bold px-2 py-0.5">
                -{discount}%
              </Badge>
            )}
            {product.isFlashSale && (
              <Badge
                variant="flash"
                className="text-xs font-bold px-2 py-0.5 animate-pulse"
              >
                ⚡ Flash Sale
              </Badge>
            )}
            {product.featured && !product.isFlashSale && (
              <Badge
                variant="default"
                className="text-xs font-bold px-2 py-0.5 bg-blue-500/90 text-white border-0"
              >
                🔥 Bán chạy
              </Badge>
            )}
          </div>

          {/* Stock badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-gray-900/80 px-4 py-1.5 rounded-full">
                Hết hàng
              </span>
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="absolute bottom-2 left-2">
              <span className="text-[10px] font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
                Chỉ còn {product.stock} sản phẩm
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 space-y-1.5">
          {/* Product Name */}
          <h3 className="text-sm font-medium text-white line-clamp-2 min-h-[2.5rem] leading-5 group-hover:text-red-400 transition-colors">
            {product.name}
          </h3>

          {/* Brand */}
          {product.brand && (
            <p className="text-[11px] text-gray-500">{product.brand}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-red-400">
              {product.price.toLocaleString()}₫
            </span>
            {product.oldPrice && (
              <span className="text-xs text-gray-500 line-through">
                {product.oldPrice.toLocaleString()}₫
              </span>
            )}
          </div>

          {/* Rating & Sold */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {renderStars(product.rating)}
              <span className="text-[11px] text-gray-500 ml-0.5">
                {product.rating}
              </span>
            </div>
            <span className="text-[11px] text-gray-500">
              Đã bán {product.soldCount}
            </span>
          </div>

          {/* Shipping badge */}
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Truck className="w-3 h-3" />
            <span>Miễn phí vận chuyển</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
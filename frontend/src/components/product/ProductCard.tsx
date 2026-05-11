"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { Product } from "@/types/product";
import { formatPrice, formatSoldCount, cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleWishlist } = useUserStore();

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1 hover:border-red-500/20"
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          {!isImageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-110",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsImageLoaded(true)}
          />

          {/* Overlay on hover */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.discount && product.discount > 0 && (
              <Badge variant="discount" className="text-xs font-bold">
                -{product.discount}%
              </Badge>
            )}
            {product.isFlashSale && (
              <Badge variant="flash" className="text-xs">
                Flash Sale
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={cn(
              "absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
              inWishlist
                ? "bg-red-500 text-white"
                : "bg-black/50 text-white hover:bg-red-500"
            )}
          >
            <Heart
              className={cn(
                "w-4 h-4",
                inWishlist && "fill-current"
              )}
            />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          {/* Product Name */}
          <h3 className="text-sm md:text-base font-medium text-white line-clamp-2 min-h-[2.5rem] leading-tight">
            {product.name}
          </h3>

          {/* Rating & Sold */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-xs text-yellow-500 font-medium">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Đã bán {formatSoldCount(product.soldCount)}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold text-red-400">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
}

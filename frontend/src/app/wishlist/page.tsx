"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { products } from "@/lib/mockData";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useUserStore();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 py-12 md:py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8 text-pink-200" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Sản phẩm yêu thích
              </h1>
            </div>
            <p className="text-red-100 text-lg">
              {wishlistProducts.length} sản phẩm
            </p>
          </motion.div>
        </div>
      </div>

      <div className="section-container py-8">
        {wishlistProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Danh sách yêu thích trống
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Bạn chưa có sản phẩm yêu thích nào. Hãy khám phá và thêm sản phẩm bạn thích vào danh sách này.
            </p>
            <Button asChild className="rounded-xl">
              <a href="/">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Khám phá ngay
              </a>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Actions */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {wishlistProducts.length} sản phẩm đang được yêu thích
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
                onClick={() => {
                  wishlistProducts.forEach((p) => removeFromWishlist(p.id));
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa tất cả
              </Button>
            </div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {wishlistProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

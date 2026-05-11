"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { flashSaleProducts, flashSaleEndTime } from "@/lib/mockData";
import ProductCard from "@/components/product/ProductCard";
import CountdownTimer from "@/components/shared/CountdownTimer";

export default function FlashSalePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 py-16 md:py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                Flash Sale
              </h1>
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
            </motion.div>
            <p className="text-red-100 text-lg mb-6">
              Sản phẩm giảm giá sốc - Kết thúc trong
            </p>
            <div className="flex justify-center">
              <CountdownTimer targetDate={flashSaleEndTime} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Products */}
      <div className="section-container py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {flashSaleProducts.map((product, index) => (
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

        {flashSaleProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              Không có sản phẩm flash sale
            </h3>
            <p className="text-muted-foreground">
              Hiện tại chưa có chương trình flash sale nào.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ChevronRight, Clock, Flame } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/product";
import { FlashSaleSkeleton } from "@/components/ui/skeleton";
import { getFlashSales } from "@/lib/mockDataHelper";

export default function FlashSaleSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    try {
      const result = getFlashSales();
      setProducts(result.data.slice(0, 6));
    } catch (err) {
      console.error("Failed to fetch flash sale products:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <FlashSaleSkeleton />;
  if (products.length === 0) return null;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white">
              Flash Sale
            </h2>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            <div className="flex items-center gap-1">
              <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded min-w-[22px] text-center">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-red-400 text-xs font-bold">:</span>
              <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded min-w-[22px] text-center">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-red-400 text-xs font-bold">:</span>
              <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded min-w-[22px] text-center">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/flash-sale"
          className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors font-medium"
        >
          Xem tất cả
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            variant="flash-sale"
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-red-600/10 to-red-800/10 border border-red-500/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-xs text-red-400 font-medium">
              Đang bán chạy
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Đã bán {products.reduce((sum, p) => sum + p.soldCount, 0)} sản phẩm
          </span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "70%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-red-600 to-red-800 rounded-full"
          />
        </div>
      </div>
    </section>
  );
}
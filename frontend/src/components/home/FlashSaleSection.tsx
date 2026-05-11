"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, ChevronRight } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import CountdownTimer from "@/components/shared/CountdownTimer";
import { Product } from "@/types/product";

interface FlashSaleSectionProps {
  products: Product[];
  endTime: string;
}

export default function FlashSaleSection({
  products,
  endTime,
}: FlashSaleSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="section-padding"
    >
      <div className="section-container">
        <div className="relative rounded-2xl bg-gradient-to-br from-red-950/50 via-red-900/20 to-background border border-red-500/20 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      Flash Sale
                    </h2>
                    <CountdownTimer
                      targetDate={endTime}
                      className="hidden sm:flex"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Kết thúc trong
                  </p>
                </div>
              </div>
              <Link
                href="/flash-sale"
                className="hidden sm:flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Timer */}
            <div className="sm:hidden mb-4">
              <CountdownTimer targetDate={endTime} />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Mobile View All */}
            <div className="mt-4 text-center sm:hidden">
              <Link
                href="/flash-sale"
                className="inline-flex items-center gap-1 text-sm text-red-400 font-medium"
              >
                Xem tất cả Flash Sale
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

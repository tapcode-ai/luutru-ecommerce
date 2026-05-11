"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  link?: string;
  timer?: React.ReactNode;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  link,
  timer,
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="section-padding"
    >
      <div className="section-container">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-end gap-4">
            <div>
              <h2 className="section-title">{title}</h2>
              {subtitle && (
                <p className="section-subtitle">{subtitle}</p>
              )}
            </div>
            {timer && <div className="hidden sm:block">{timer}</div>}
          </div>
          <div className="flex items-center gap-2">
            {link && (
              <Link
                href={link}
                className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-red-400 transition-colors"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
            <div className="flex gap-1">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white hover:bg-red-500 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white hover:bg-red-500 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar pb-2"
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex-none w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        {link && (
          <div className="mt-4 text-center sm:hidden">
            <Link
              href={link}
              className="inline-flex items-center gap-1 text-sm text-red-400 font-medium"
            >
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </motion.section>
  );
}

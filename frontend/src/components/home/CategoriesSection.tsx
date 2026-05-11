"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Shirt,
  Monitor,
  Smartphone,
  Home,
  BookOpen,
  Trophy,
  Sparkles,
  Grid3X3,
} from "lucide-react";
import { categories } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  Shirt: <Shirt className="w-6 h-6" />,
  Monitor: <Monitor className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
  Home: <Home className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Trophy: <Trophy className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
};

export default function CategoriesSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      className="section-padding"
    >
      <div className="section-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Danh mục sản phẩm</h2>
            <p className="section-subtitle">Khám phá hàng ngàn sản phẩm</p>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={`/category/${category.slug}`}
                className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl bg-card border border-border hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-200 group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-secondary flex items-center justify-center text-white group-hover:bg-red-500/20 group-hover:text-red-400 transition-all duration-200">
                  {iconMap[category.icon ?? ""] || (
                    <Grid3X3 className="w-6 h-6" />
                  )}
                </div>
                <span className="text-xs md:text-sm text-center text-muted-foreground group-hover:text-white transition-colors line-clamp-1">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

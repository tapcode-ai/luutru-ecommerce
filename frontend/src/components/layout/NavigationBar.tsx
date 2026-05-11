"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Grid3X3,
  ChevronDown,
  Shirt,
  Monitor,
  Smartphone,
  Home,
  BookOpen,
  Trophy,
  Sparkles,
  Zap,
} from "lucide-react";
import { NAVIGATION_ITEMS, CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  Shirt: <Shirt className="w-4 h-4" />,
  Monitor: <Monitor className="w-4 h-4" />,
  Smartphone: <Smartphone className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Trophy: <Trophy className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
};

export default function NavigationBar() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  return (
    <nav className="hidden lg:block bg-card border-b border-border">
      <div className="section-container">
        <div className="flex items-center h-12 gap-1">
          {/* All Categories Button */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <button
              className={cn(
                "flex items-center gap-2 px-4 h-12 rounded-t-xl transition-all duration-200",
                isCategoryOpen
                  ? "bg-secondary text-red-400"
                  : "text-muted-foreground hover:text-white hover:bg-secondary/50"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="text-sm font-medium">Danh mục</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  isCategoryOpen && "rotate-180"
                )}
              />
            </button>

            {/* Categories Dropdown */}
            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: 8, scaleY: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 w-72 bg-card border border-border rounded-2xl shadow-2xl shadow-black/30 overflow-hidden origin-top z-50"
                >
                  <div className="py-2">
                    {CATEGORIES.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                          {iconMap[category.icon] || (
                            <Grid3X3 className="w-4 h-4" />
                          )}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">
                            {category.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {category.children?.join(" • ")}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border mx-2" />

          {/* Navigation Items */}
          <div className="flex items-center gap-1">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-white hover:bg-secondary/50 transition-all duration-200"
              >
                {iconMap[item.icon]}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Hot Deal */}
          <Link
            href="/flash-sale"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all duration-200 animate-pulse-glow"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Hot Deal</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

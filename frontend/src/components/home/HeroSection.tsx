"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Shield,
  Truck,
  HeadphonesIcon,
  Gift,
  Sparkles,
  Package,
  GraduationCap,
  Bot,
  Recycle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_SLOGAN } from "@/lib/constants";

const slides = [
  {
    id: 1,
    title: "Local Brand Việt Nam",
    subtitle: "Áo thun, hoodie, phụ kiện từ các thương hiệu Việt",
    description:
      "Hàng trăm local brand chính hãng - Thiết kế độc đáo - Chất lượng cao",
    cta: "Khám phá Local Brand",
    link: "/category/local-brand",
    gradient: "from-red-600 via-red-700 to-rose-900",
    image: "https://picsum.photos/seed/localbrand/1200/500",
    badge: "🇻🇳 Local Brand",
  },
  {
    id: 2,
    title: "Secondhand Nhập Khẩu",
    subtitle: "Đồ Nhật Bản, Hàn Quốc chất lượng cao",
    description: "Giá chỉ từ 50K - Hàng vintage độc lạ - Có kiểm định chất lượng",
    cta: "Săn đồ Secondhand",
    link: "/category/secondhand",
    gradient: "from-purple-600 via-purple-700 to-indigo-900",
    image: "https://picsum.photos/seed/secondhand/1200/500",
    badge: "♻️ Secondhand",
  },
  {
    id: 3,
    title: "Sinh Viên Mua Sắm",
    subtitle: "Hàng ngàn sản phẩm giá rẻ từ 20K - 500K",
    description:
      "Phù hợp túi tiền sinh viên - Nhiều ưu đãi hấp dẫn mỗi ngày",
    cta: "Mua ngay",
    link: "/flash-sale",
    gradient: "from-blue-600 via-blue-700 to-cyan-900",
    image: "https://picsum.photos/seed/sinhvien/1200/500",
    badge: "🎓 Giá Sinh Viên",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "Local Brand Chuẩn",
    description: "Thương hiệu Việt chính hãng",
  },
  {
    icon: Package,
    title: "Secondhand Nhập Khẩu",
    description: "Nhật, Hàn, Âu - Giá từ 50K",
  },
  {
    icon: GraduationCap,
    title: "Giá Sinh Viên",
    description: "Từ 20K - 500K",
  },
  {
    icon: Bot,
    title: "AI Gợi Ý",
    description: "Gợi ý đồ phù hợp bạn",
  },
  {
    icon: Zap,
    title: "Giao Nhanh 2H",
    description: "Nội thành TP.HCM, HN",
  },
  {
    icon: Recycle,
    title: "Thời Trang Bền Vững",
    description: "Bảo vệ môi trường",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="relative">
      {/* Slogan Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-3 py-2 px-4 rounded-xl bg-gradient-to-r from-red-600/20 via-red-500/10 to-red-600/20 border border-red-500/20"
      >
        <Sparkles className="w-4 h-4 text-red-400" />
        <span className="text-sm font-medium text-red-300">
          {SITE_SLOGAN}
        </span>
        <Sparkles className="w-4 h-4 text-red-400" />
      </motion.div>

      {/* Main Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 border border-gray-800/50 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[21/9] md:aspect-[21/8] overflow-hidden"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-r",
                  slide.gradient,
                  "opacity-80"
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center px-6 md:px-12">
              <div className="max-w-xl">
                {slide.badge && (
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium mb-3"
                  >
                    {slide.badge}
                  </motion.span>
                )}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight"
                >
                  {slide.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-base md:text-lg text-white/90 font-medium mb-1"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-white/70 mb-4 hidden md:block"
                >
                  {slide.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href={slide.link}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                  >
                    {slide.cta}
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={() => {
            prevSlide();
            setIsAutoPlaying(false);
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            nextSlide();
            setIsAutoPlaying(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlaying(false);
              }}
              className={cn(
                "transition-all duration-300 rounded-full",
                index === currentSlide
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      </div>

      {/* Features Bar - 6 items in 2 rows on mobile, 3 rows on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-gray-700/50 transition-colors"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-medium text-white truncate">
                  {feature.title}
                </p>
                <p className="text-[10px] md:text-xs text-gray-500 truncate">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
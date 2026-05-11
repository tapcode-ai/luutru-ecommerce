"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BANNERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <section className="section-padding pb-0">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Banner Carousel */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-card border border-border group">
            <div className="relative aspect-[2/1] md:aspect-[2.4/1] overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {/* Gradient Background */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r",
                      BANNERS[currentSlide].color
                    )}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm md:text-base text-white/80 font-medium mb-2"
                    >
                      {BANNERS[currentSlide].subtitle}
                    </motion.p>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight"
                    >
                      {BANNERS[currentSlide].title}
                    </motion.h1>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link href={BANNERS[currentSlide].link}>
                        <Button
                          variant="gradient"
                          size="lg"
                          className="text-base"
                        >
                          Mua ngay
                          <Zap className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {BANNERS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === currentSlide
                        ? "w-8 bg-red-500"
                        : "bg-white/50 hover:bg-white/80"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Side Promotional Cards */}
          <div className="hidden lg:flex flex-col gap-4">
            {[
              {
                title: "Miễn phí vận chuyển",
                subtitle: "Cho đơn hàng trên 500K",
                gradient: "from-purple-600 to-purple-800",
                icon: "🚚",
              },
              {
                title: "Giảm thêm 10%",
                subtitle: "Khi thanh toán online",
                gradient: "from-blue-600 to-blue-800",
                icon: "💳",
              },
              {
                title: "Ưu đãi thành viên",
                subtitle: "Tích điểm đổi quà",
                gradient: "from-emerald-600 to-emerald-800",
                icon: "⭐",
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={cn(
                  "flex-1 rounded-2xl bg-gradient-to-r p-5 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-transform duration-200",
                  card.gradient
                )}
              >
                <span className="text-3xl">{card.icon}</span>
                <div>
                  <h3 className="text-white font-semibold text-base">
                    {card.title}
                  </h3>
                  <p className="text-white/70 text-sm">{card.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

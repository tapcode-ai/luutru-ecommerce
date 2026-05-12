"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  TrendingUp,
  Star,
  Shield,
  Truck,
  RefreshCw,
  HeadphonesIcon,
  Package,
  GraduationCap,
  Bot,
  Zap,
  Recycle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/product";
import { BRAND_VALUES } from "@/lib/constants";

const stats = [
  { label: "Local Brand", value: "100+", icon: Sparkles },
  { label: "Sản phẩm", value: "50.000+", icon: Package },
  { label: "Khách hàng", value: "1 Triệu+", icon: GraduationCap },
  { label: "Giao hàng", value: "2 Giờ", icon: Zap },
];

const commitments = [
  {
    icon: Shield,
    title: "Cam kết chính hãng",
    description: "100% sản phẩm local brand chính hãng, secondhand có kiểm định",
  },
  {
    icon: Truck,
    title: "Giao hàng siêu tốc",
    description: "Giao trong 2 giờ nội thành TP.HCM, Hà Nội",
  },
  {
    icon: RefreshCw,
    title: "Đổi trả dễ dàng",
    description: "Đổi trả trong 7 ngày, hoàn tiền 100%",
  },
  {
    icon: HeadphonesIcon,
    title: "Hỗ trợ tận tâm",
    description: "Hotline 24/7, Chat AI thông minh, giải đáp mọi thắc mắc",
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          fetch("http://localhost:3001/products?featured=true&_limit=8"),
          fetch(
            "http://localhost:3001/products?_sort=createdAt&_order=desc&_limit=8"
          ),
        ]);
        const featured = await featuredRes.json();
        const newest = await newRes.json();
        setFeaturedProducts(featured);
        setNewProducts(newest);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-6 md:space-y-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories */}
        <CategoriesSection />

        {/* Flash Sale */}
        <FlashSaleSection />

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg md:text-xl font-bold text-white">
                  Sản Phẩm Nổi Bật
                </h2>
              </div>
            </div>
            <Link
              href="/search?sort=popular"
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* Brand Values Section - Tại sao chọn Lưu Trữ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded-full" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-red-400" />
              <h2 className="text-lg md:text-xl font-bold text-white">
                Tại Sao Chọn Lưu Trữ?
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRAND_VALUES.map((value, index) => {
              const IconComponent = {
                Sparkles,
                Package,
                GraduationCap,
                Bot,
                Zap,
                Recycle,
              }[value.icon];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 hover:border-red-500/30 transition-all duration-300"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/20 to-red-800/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      {IconComponent && (
                        <IconComponent className="w-6 h-6 text-red-400" />
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Stats Section */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 text-center overflow-hidden group"
                >
                  {/* Background decoration */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-500/5 rounded-full group-hover:bg-red-500/10 transition-colors" />

                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-red-400" />
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* New Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg md:text-xl font-bold text-white">
                  Hàng Mới Về
                </h2>
              </div>
            </div>
            <Link
              href="/search?sort=newest"
              className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {newProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </section>

        {/* Commitments Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-700 rounded-full" />
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <h2 className="text-lg md:text-xl font-bold text-white">
                Cam Kết Của Chúng Tôi
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {commitments.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 hover:border-green-500/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600/20 to-green-800/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Top Rated Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-full" />
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg md:text-xl font-bold text-white">
                  Đánh Giá Cao
                </h2>
              </div>
            </div>
            <Link
              href="/search?sort=rating"
              className="flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
            >
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {featuredProducts
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 4)
                .map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
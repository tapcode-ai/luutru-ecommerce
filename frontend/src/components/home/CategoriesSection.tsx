"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shirt,
  Smartphone,
  Laptop,
  Home,
  BookOpen,
  Gamepad2,
  Watch,
  Car,
  Baby,
  Dumbbell,
  Camera,
  Headphones,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: "thoi-trang", name: "Thời Trang", icon: Shirt, color: "from-pink-500 to-rose-600" },
  { id: "dien-thoai", name: "Điện Thoại", icon: Smartphone, color: "from-blue-500 to-indigo-600" },
  { id: "may-tinh", name: "Máy Tính", icon: Laptop, color: "from-cyan-500 to-blue-600" },
  { id: "dien-gia-dung", name: "Đồ Gia Dụng", icon: Home, color: "from-emerald-500 to-green-600" },
  { id: "sach", name: "Sách", icon: BookOpen, color: "from-amber-500 to-orange-600" },
  { id: "do-choi", name: "Đồ Chơi", icon: Gamepad2, color: "from-violet-500 to-purple-600" },
  { id: "dong-ho", name: "Đồng Hồ", icon: Watch, color: "from-slate-500 to-gray-600" },
  { id: "xe-may", name: "Xe Máy", icon: Car, color: "from-red-500 to-rose-600" },
  { id: "me-be", name: "Mẹ & Bé", icon: Baby, color: "from-pink-400 to-pink-600" },
  { id: "the-thao", name: "Thể Thao", icon: Dumbbell, color: "from-lime-500 to-green-600" },
  { id: "may-anh", name: "Máy Ảnh", icon: Camera, color: "from-neutral-500 to-stone-600" },
  { id: "am-thanh", name: "Âm Thanh", icon: Headphones, color: "from-fuchsia-500 to-purple-600" },
];

export default function CategoriesSection() {
  const [showAll, setShowAll] = useState(false);
  const displayCategories = showAll ? categories : categories.slice(0, 8);

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded-full" />
          <h2 className="text-lg md:text-xl font-bold text-white">
            Danh Mục
          </h2>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          {showAll ? "Thu gọn" : "Xem thêm"}
          <ChevronRight
            className={cn(
              "w-4 h-4 transition-transform",
              showAll && "rotate-90"
            )}
          />
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
        {displayCategories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                href={`/category/${category.id}`}
                className="group flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl bg-gray-900/50 border border-gray-800/50 hover:border-gray-700/50 hover:bg-gray-800/50 transition-all duration-200"
              >
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-200",
                    category.color
                  )}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="text-[10px] md:text-xs text-gray-400 group-hover:text-white text-center transition-colors line-clamp-1">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
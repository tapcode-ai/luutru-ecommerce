"use client";

import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ProductSection from "@/components/product/ProductSection";
import { flashSaleProducts, trendingProducts, recommendedProducts, bestDealsProducts, electronicsProducts, fashionProducts } from "@/lib/mockData";

export default function HomePage() {
  return (
    <div className="pb-16 lg:pb-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories */}
      <CategoriesSection />

      {/* Flash Sale */}
      <FlashSaleSection
        products={flashSaleProducts}
        endTime="2026-05-15T23:59:59"
      />

      {/* Trending Products */}
      <ProductSection
        title="Sản phẩm thịnh hành"
        subtitle="Xu hướng mua sắm mới nhất"
        products={trendingProducts}
        link="/trending"
      />

      {/* Recommended Products */}
      <ProductSection
        title="Gợi ý cho bạn"
        subtitle="Sản phẩm phù hợp với sở thích của bạn"
        products={recommendedProducts}
        link="/recommended"
      />

      {/* Best Deals */}
      <ProductSection
        title="Ưu đãi tốt nhất"
        subtitle="Giá tốt nhất trong tuần"
        products={bestDealsProducts}
        link="/deals"
      />

      {/* Electronics */}
      <ProductSection
        title="Điện tử & Công nghệ"
        subtitle="Smartphone, laptop, phụ kiện chính hãng"
        products={electronicsProducts}
        link="/category/dien-tu"
      />

      {/* Fashion */}
      <ProductSection
        title="Thời trang"
        subtitle="Xu hướng thời trang mới nhất"
        products={fashionProducts}
        link="/category/thoi-trang"
      />
    </div>
  );
}

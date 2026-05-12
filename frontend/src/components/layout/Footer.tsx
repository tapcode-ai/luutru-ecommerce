"use client";

import Link from "next/link";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Youtube,
  Twitter,
  Instagram,
  ChevronRight,
  Shield,
  Truck,
  RefreshCw,
  HeadphonesIcon,
  Sparkles,
  Package,
  GraduationCap,
  Bot,
  Zap,
  Recycle,
} from "lucide-react";
import { SITE_NAME, SITE_SLOGAN, SITE_DESCRIPTION } from "@/lib/constants";

const footerLinks = {
  "Về Lưu Trữ": [
    { label: "Giới thiệu", href: "#" },
    { label: "Local Brand Partner", href: "#" },
    { label: "Tuyển dụng", href: "#" },
    { label: "Chính sách bảo mật", href: "#" },
    { label: "Điều khoản sử dụng", href: "#" },
  ],
  "Hỗ trợ khách hàng": [
    { label: "Trung tâm trợ giúp", href: "#" },
    { label: "Hướng dẫn mua hàng", href: "#" },
    { label: "Phương thức thanh toán", href: "#" },
    { label: "Chính sách đổi trả", href: "#" },
    { label: "Giao hàng & Vận chuyển", href: "#" },
  ],
  "Danh mục sản phẩm": [
    { label: "Local Brand", href: "/category/local-brand" },
    { label: "Secondhand Nhập Khẩu", href: "/category/secondhand" },
    { label: "Thời trang nam", href: "/category/thoi-trang-nam" },
    { label: "Thời trang nữ", href: "/category/thoi-trang-nu" },
    { label: "Điện thoại & Phụ kiện", href: "/category/dien-thoai" },
    { label: "Máy tính & Laptop", href: "/category/may-tinh" },
  ],
  "Khám phá": [
    { label: "Flash Sale", href: "/flash-sale" },
    { label: "Sản phẩm bán chạy", href: "/search?sort=popular" },
    { label: "Hàng mới về", href: "/search?sort=newest" },
    { label: "Đánh giá cao", href: "/search?sort=rating" },
    { label: "Blog thời trang", href: "#" },
  ],
};

const contactInfo = [
  { icon: MapPin, text: "123 Nguyễn Huệ, Quận 1, TP.HCM" },
  { icon: Phone, text: "1900 1234 56" },
  { icon: Mail, text: "support@luutru.vn" },
];

const socialLinks = [
  { icon: Facebook, href: "#", color: "hover:text-blue-500" },
  { icon: Youtube, href: "#", color: "hover:text-red-500" },
  { icon: Twitter, href: "#", color: "hover:text-sky-400" },
  { icon: Instagram, href: "#", color: "hover:text-pink-500" },
];

const features = [
  { icon: Truck, title: "Miễn phí vận chuyển", desc: "Cho đơn từ 150K" },
  { icon: RefreshCw, title: "Đổi trả 7 ngày", desc: "Hoàn tiền 100%" },
  { icon: Shield, title: "Bảo mật thanh toán", desc: "An toàn tuyệt đối" },
  { icon: HeadphonesIcon, title: "Hỗ trợ 24/7", desc: "Hotline & Chat" },
];

const brandValues = [
  { icon: Sparkles, label: "Local Brand Chuẩn" },
  { icon: Package, label: "Secondhand Nhập Khẩu" },
  { icon: GraduationCap, label: "Giá Sinh Viên" },
  { icon: Bot, label: "AI Gợi Ý" },
  { icon: Zap, label: "Giao Nhanh 2H" },
  { icon: Recycle, label: "Thời Trang Bền Vững" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-8">
      {/* Brand Values Strip */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-red-600/5 via-transparent to-red-600/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
            {brandValues.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs md:text-sm text-gray-400"
                >
                  <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg"
                >
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">
                      {feature.title}
                    </p>
                    <p className="text-[10px] text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/20">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white block leading-tight">
                  {SITE_NAME}
                </span>
                <span className="text-[11px] text-red-400 font-medium block leading-tight">
                  {SITE_SLOGAN}
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {SITE_DESCRIPTION}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Icon className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="text-gray-400">{item.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    className={`w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 ${social.color} hover:bg-gray-700 transition-all`}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1 group"
                    >
                      <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} {SITE_NAME}. Tất cả quyền được bảo
              lưu.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Điều khoản sử dụng
              </Link>
              <Link
                href="#"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
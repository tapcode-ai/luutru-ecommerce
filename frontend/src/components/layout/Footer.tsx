"use client";

import Link from "next/link";
import { Store, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12 lg:mt-16">
      <div className="section-container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">{SITE_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Nền tảng mua sắm trực tuyến hàng đầu Việt Nam. Cam kết sản phẩm
              chính hãng, giá tốt nhất và giao hàng toàn quốc.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-red-500 hover:text-white transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Trang chủ", href: "/" },
                { label: "Sản phẩm", href: "/products" },
                { label: "Flash Sale", href: "/flash-sale" },
                { label: "Khuyến mãi", href: "/promotions" },
                { label: "Blog", href: "/blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Trung tâm trợ giúp", href: "/help" },
                { label: "Chính sách đổi trả", href: "/return-policy" },
                { label: "Chính sách bảo mật", href: "/privacy" },
                { label: "Điều khoản dịch vụ", href: "/terms" },
                { label: "Liên hệ", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-400 shrink-0" />
                <a
                  href="tel:19001000"
                  className="text-sm text-muted-foreground hover:text-red-400 transition-colors"
                >
                  1900 1000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-400 shrink-0" />
                <a
                  href="mailto:info@luutru.com"
                  className="text-sm text-muted-foreground hover:text-red-400 transition-colors"
                >
                  info@luutru.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2024 {SITE_NAME}. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Thanh toán an toàn
              </span>
              <div className="flex gap-2">
                {["VISA", "MC", "JCB", "VNPAY"].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

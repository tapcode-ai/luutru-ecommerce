"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { getItemCount } = useCartStore();
  const { wishlist } = useUserStore();
  const { toggleSearch } = useUIStore();

  const navItems = [
    {
      label: "Trang chủ",
      icon: Home,
      href: "/",
      badge: null,
    },
    {
      label: "Tìm kiếm",
      icon: Search,
      href: "#",
      onClick: toggleSearch,
      badge: null,
    },
    {
      label: "Yêu thích",
      icon: Heart,
      href: "/wishlist",
      badge: wishlist.length > 0 ? wishlist.length : null,
    },
    {
      label: "Giỏ hàng",
      icon: ShoppingCart,
      href: "#",
      onClick: () => useCartStore.getState().toggleCart(),
      badge: getItemCount() > 0 ? getItemCount() : null,
    },
    {
      label: "Tài khoản",
      icon: User,
      href: "/account",
      badge: null,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          const content = (
            <div className="flex flex-col items-center gap-0.5 relative">
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-red-400"
                      : "text-muted-foreground group-hover:text-white"
                  )}
                />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] transition-colors",
                  isActive
                    ? "text-red-400 font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex-1 flex items-center justify-center h-full group"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex-1 flex items-center justify-center h-full group"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

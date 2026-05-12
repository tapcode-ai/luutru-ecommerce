"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Package,
  Menu,
  X,
  ChevronDown,
  LogIn,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { useUIStore } from "@/store/uiStore";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SearchOverlay from "@/components/search/SearchOverlay";

export default function TopHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { getItemCount, toggleCart } = useCartStore();
  const { isAuthenticated, user, wishlist } = useUserStore();
  const { isMobileMenuOpen, toggleMobileMenu, isSearchOpen, toggleSearch } =
    useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openSearchOverlay = () => setIsSearchOverlayOpen(true);
  const closeSearchOverlay = () => setIsSearchOverlayOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-lg shadow-black/10"
            : "bg-background"
        )}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 -ml-2 text-white hover:text-red-400 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/20">
                <Store className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-white hidden sm:block">
                {SITE_NAME}
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4" ref={searchRef}>
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  onFocus={openSearchOverlay}
                  readOnly
                  className="w-full h-11 pl-5 pr-12 rounded-2xl bg-secondary border-border focus:border-red-500 text-sm cursor-pointer"
                />
                <button
                  onClick={openSearchOverlay}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center hover:from-red-700 hover:to-red-800 transition-all duration-200"
                >
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search - Mobile */}
              <button
                onClick={openSearchOverlay}
                className="md:hidden p-2 text-white hover:text-red-400 transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Login/User */}
              {isAuthenticated ? (
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs text-muted-foreground">Tài khoản</p>
                    <p className="text-sm font-medium text-white truncate max-w-[100px]">
                      {user?.name}
                    </p>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg shadow-red-500/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-medium hidden lg:inline">
                    Đăng nhập
                  </span>
                </Link>
              )}

              {/* Orders */}
              <Link
                href="/orders"
                className="hidden lg:flex flex-col items-center px-3 py-2 rounded-xl hover:bg-secondary transition-colors group"
              >
                <Package className="w-5 h-5 text-white group-hover:text-red-400 transition-colors" />
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Đơn hàng
                </span>
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative hidden sm:flex flex-col items-center px-3 py-2 rounded-xl hover:bg-secondary transition-colors group"
              >
                <Heart className="w-5 h-5 text-white group-hover:text-red-400 transition-colors" />
                {wishlist.length > 0 && (
                  <Badge
                    variant="flash"
                    className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[9px]"
                  >
                    {wishlist.length}
                  </Badge>
                )}
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  Yêu thích
                </span>
              </Link>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary transition-colors group"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-white group-hover:text-red-400 transition-colors" />
                  {getItemCount() > 0 && (
                    <Badge
                      variant="flash"
                      className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-[10px]"
                    >
                      {getItemCount()}
                    </Badge>
                  )}
                </div>
                <span className="hidden lg:block text-sm font-medium text-white">
                  Giỏ hàng
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search (legacy - keep for backward compatibility) */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden pb-3"
              >
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    onFocus={() => {
                      toggleSearch();
                      openSearchOverlay();
                    }}
                    readOnly
                    className="w-full h-11 pl-5 pr-12 rounded-2xl bg-secondary border-border cursor-pointer"
                  />
                  <button
                    onClick={() => {
                      toggleSearch();
                      openSearchOverlay();
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center"
                  >
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOverlayOpen} onClose={closeSearchOverlay} />
    </>
  );
}
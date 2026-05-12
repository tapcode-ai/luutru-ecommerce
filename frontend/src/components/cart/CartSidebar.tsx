"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Trash2, Plus, Minus, Truck, Tag, Percent, Clock, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, cn } from "@/lib/utils";

const FREE_SHIP_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

function getEstimatedDelivery(): string {
  const now = new Date();
  const deliveryDate = new Date(now);
  deliveryDate.setDate(deliveryDate.getDate() + 3 + Math.floor(Math.random() * 3));
  return deliveryDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
  });
}

export default function CartSidebar() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, totalPrice, itemCount } =
    useCartStore();

  // Listen for open-cart custom event from TopHeader
  useEffect(() => {
    const handleOpenCart = () => setOpen(true);
    window.addEventListener("open-cart", handleOpenCart);
    return () => window.removeEventListener("open-cart", handleOpenCart);
  }, [setOpen]);

  const shippingFee = totalPrice >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = totalPrice + shippingFee;
  const remainingForFreeShip = Math.max(0, FREE_SHIP_THRESHOLD - totalPrice);
  const estimatedDelivery = getEstimatedDelivery();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-white" />
                <h2 className="text-lg font-semibold text-white">
                  Giỏ hàng ({itemCount})
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white hover:bg-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free ship progress */}
            {items.length > 0 && (
              <div className={cn(
                "px-4 py-3 border-b border-border shrink-0",
                remainingForFreeShip > 0
                  ? "bg-gradient-to-r from-orange-500/10 to-red-500/10"
                  : "bg-gradient-to-r from-green-500/10 to-emerald-500/10"
              )}>
                <div className="flex items-center gap-2 text-xs mb-2">
                  <Truck className={cn(
                    "w-3.5 h-3.5",
                    remainingForFreeShip > 0 ? "text-orange-400" : "text-green-400"
                  )} />
                  {remainingForFreeShip > 0 ? (
                    <span className="text-orange-400">
                      Miễn phí vận chuyển cho đơn từ {formatPrice(FREE_SHIP_THRESHOLD)}
                    </span>
                  ) : (
                    <span className="text-green-400 font-medium">
                      🎉 Bạn đã được miễn phí vận chuyển!
                    </span>
                  )}
                </div>
                {remainingForFreeShip > 0 && (
                  <>
                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((totalPrice / FREE_SHIP_THRESHOLD) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Cần thêm <span className="text-orange-400 font-medium">{formatPrice(remainingForFreeShip)}</span> để được freeship
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Giỏ hàng trống</p>
                  <Button
                    variant="gradient"
                    className="mt-4"
                    onClick={() => setOpen(false)}
                  >
                    Mua sắm ngay
                  </Button>
                </div>
              ) : (
                items.map((item) => {
                  const itemTotal = item.product.price * item.quantity;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 p-3 rounded-xl bg-secondary/50 border border-border group"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        {item.product.discount && (
                          <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-br-lg font-medium">
                            -{item.product.discount}%
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white line-clamp-1">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatPrice(item.product.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 bg-secondary rounded-lg border border-border">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-white hover:text-red-400 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium text-white w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center text-white hover:text-red-400 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-red-400">
                              {formatPrice(itemTotal)}
                            </span>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="shrink-0 p-4 border-t border-border bg-card space-y-3">
                {/* Price breakdown */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="text-white font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Phí vận chuyển
                    </span>
                    <span className={cn(
                      "font-medium",
                      shippingFee === 0 ? "text-green-500" : "text-white"
                    )}>
                      {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                    </span>
                  </div>
                  {items.some(item => item.product.oldPrice) && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" />
                        Tiết kiệm
                      </span>
                      <span className="text-green-500 font-medium">
                        -{formatPrice(
                          items.reduce((sum, item) => {
                            const old = item.product.oldPrice || item.product.price;
                            return sum + (old - item.product.price) * item.quantity;
                          }, 0)
                        )}
                      </span>
                    </div>
                  )}

                  {/* Estimated Delivery */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Dự kiến giao hàng
                    </span>
                    <span className="text-white">{estimatedDelivery}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Vận chuyển từ
                    </span>
                    <span className="text-white">Hồ Chí Minh</span>
                  </div>

                  <div className="border-t border-border pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-white">Tổng thanh toán</span>
                      <span className="text-xl font-bold text-red-500">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                    {shippingFee === 0 && (
                      <p className="text-[10px] text-green-500 mt-0.5 flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Miễn phí vận chuyển
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() => setOpen(false)}
                  >
                    Tiếp tục mua
                  </Button>
                  <Link href="/checkout" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="gradient" className="w-full rounded-xl">
                      Thanh toán
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
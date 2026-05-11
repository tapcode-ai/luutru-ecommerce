"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  ChevronRight,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [step, setStep] = useState<"cart" | "checkout" | "complete">("cart");

  const shippingFee = totalPrice >= 500000 ? 0 : 30000;
  const grandTotal = totalPrice + shippingFee;

  if (step === "complete") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Đặt hàng thành công!
          </h2>
          <p className="text-muted-foreground mb-6">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                clearCart();
                setStep("cart");
              }}
            >
              <a href="/">Tiếp tục mua sắm</a>
            </Button>
            <Button className="rounded-xl bg-gradient-to-r from-red-600 to-red-500" asChild>
              <a href="/orders">Theo dõi đơn hàng</a>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 py-8 md:py-12">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              {step === "cart" ? "Giỏ hàng" : "Thanh toán"}
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="section-container py-6">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Giỏ hàng trống
            </h3>
            <p className="text-muted-foreground mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng.
            </p>
            <Button asChild className="rounded-xl">
              <a href="/">Mua sắm ngay</a>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-2xl border border-border p-4 flex gap-4"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-secondary shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 bg-secondary/50 rounded-lg border border-border">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeItem(item.product.id);
                            } else {
                              updateQuantity(item.product.id, item.quantity - 1);
                            }
                          }}
                          className="p-2 hover:text-red-400 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-2 hover:text-red-400 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-red-500">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24 space-y-4">
                <h3 className="font-semibold text-white text-lg">
                  Tổng đơn hàng
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span className="text-white">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span className={cn(shippingFee === 0 ? "text-green-500" : "text-white")}>
                      {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-white">Tổng cộng</span>
                      <span className="font-bold text-xl text-red-500">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                {step === "checkout" && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">
                        Địa chỉ giao hàng
                      </label>
                      <Input
                        placeholder="Nhập địa chỉ của bạn"
                        className="bg-secondary/50 border-border"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">
                        Phương thức thanh toán
                      </label>
                      <div className="space-y-2">
                        {[
                          { id: "cod", label: "Thanh toán khi nhận hàng", icon: Truck },
                          { id: "bank", label: "Chuyển khoản ngân hàng", icon: CreditCard },
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-xl border transition-all",
                              paymentMethod === method.id
                                ? "border-red-500 bg-red-500/10"
                                : "border-border hover:border-red-500/50"
                            )}
                          >
                            <method.icon className="w-5 h-5 text-red-500" />
                            <span className="text-sm text-white">{method.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-500" />
                  Thông tin của bạn được bảo mật
                </div>

                {step === "cart" ? (
                  <Button
                    className="w-full rounded-xl h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/25"
                    onClick={() => setStep("checkout")}
                  >
                    Tiến hành thanh toán
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    className="w-full rounded-xl h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/25"
                    onClick={() => setStep("complete")}
                  >
                    Đặt hàng
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

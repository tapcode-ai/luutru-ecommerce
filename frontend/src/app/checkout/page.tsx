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
  Percent,
  Building,
  Wallet,
  Check,
  Package,
  Clock,
  Phone,
  User,
  Home,
  ChevronLeft,
  Sparkles,
  Banknote,
  ExternalLink,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn } from "@/lib/utils";
import { PaymentMethod } from "@/types/order";

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
    year: "numeric",
  });
}

interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note: string;
}

const BANK_INFO = {
  bank: "Vietcombank",
  accountNumber: "1234567890",
  accountName: "LUUTRU SHOP",
  branch: "Hồ Chí Minh",
};

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, totalPrice, itemCount, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [step, setStep] = useState<"cart" | "checkout" | "complete">("cart");
  const [createdOrderId, setCreatedOrderId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: "",
    phone: "",
    address: "",
    city: "Hồ Chí Minh",
    district: "",
    ward: "",
    note: "",
  });

  const shippingFee = totalPrice >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  const grandTotal = totalPrice + shippingFee;
  const totalSavings = items.reduce((sum, item) => {
    const old = item.product.oldPrice || item.product.price;
    return sum + (old - item.product.price) * item.quantity;
  }, 0);

  const updateShippingInfo = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    const order = await createOrder({
      cartItems: items,
      shippingAddress: shippingInfo,
      paymentMethod,
    });
    setCreatedOrderId(order.id);
    clearCart();
    setStep("complete");
  };

  const handleCopyAccount = () => {
    const text = `${BANK_INFO.bank}\nSTK: ${BANK_INFO.accountNumber}\nChủ TK: ${BANK_INFO.accountName}\nChi nhánh: ${BANK_INFO.branch}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVNPayPayment = () => {
    // Mô phỏng redirect VNPay
    const vnpayUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${grandTotal * 100}&vnp_Command=pay&vnp_CurrCode=VND&vnp_TxnRef=${Date.now()}&vnp_OrderInfo=Thanh+toan+don+hang+Luutru&vnp_OrderType=other&vnp_Locale=vn&vnp_ReturnUrl=${encodeURIComponent(window.location.origin + "/checkout?vnpay_return=1")}`;
    window.open(vnpayUrl, "_blank");
  };

  if (step === "complete") {
    const order = useOrderStore.getState().getOrderById(createdOrderId);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Đặt hàng thành công! 🎉
          </h2>
          <p className="text-muted-foreground mb-2">
            Cảm ơn bạn đã mua hàng tại Luutru Shop.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Mã đơn hàng:{" "}
            <span className="text-white font-medium">#{createdOrderId}</span>
          </p>

          {/* Payment instructions for non-COD */}
          {paymentMethod !== "cod" && (
            <div className="bg-card rounded-2xl border border-border p-4 mb-4 text-left">
              <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Hướng dẫn thanh toán
              </h3>
              {paymentMethod === "momo" && (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>1. Mở ứng dụng <span className="text-white">MoMo</span></p>
                  <p>2. Chọn "Chuyển tiền"</p>
                  <p>3. Nhập số điện thoại: <span className="text-white font-medium">0909 123 456</span></p>
                  <p>4. Nhập số tiền: <span className="text-white font-medium">{formatPrice(grandTotal)}</span></p>
                  <p>5. Nội dung chuyển khoản: <span className="text-white font-medium">{createdOrderId}</span></p>
                </div>
              )}
              {paymentMethod === "vnpay" && (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>1. Nhấn nút "Thanh toán VNPay" bên dưới</p>
                  <p>2. Chọn ngân hàng hoặc ví điện tử</p>
                  <p>3. Hoàn tất giao dịch trên cổng VNPay</p>
                  <p className="text-yellow-500 text-xs mt-2">
                    * Đơn hàng sẽ được xác nhận sau khi thanh toán thành công
                  </p>
                </div>
              )}
              {paymentMethod === "bank" && (
                <div className="space-y-3">
                  <div className="bg-secondary/50 rounded-xl p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ngân hàng</span>
                      <span className="text-white font-medium">{BANK_INFO.bank}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Số tài khoản</span>
                      <span className="text-white font-medium">{BANK_INFO.accountNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Chủ tài khoản</span>
                      <span className="text-white font-medium">{BANK_INFO.accountName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Chi nhánh</span>
                      <span className="text-white font-medium">{BANK_INFO.branch}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Số tiền</span>
                      <span className="text-red-500 font-bold">{formatPrice(grandTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nội dung CK</span>
                      <span className="text-yellow-500 font-medium">{createdOrderId}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl"
                    onClick={handleCopyAccount}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-500" />
                        Đã sao chép
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Sao chép thông tin
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Order info */}
          {order && (
            <div className="bg-card rounded-2xl border border-border p-4 mb-6 text-left">
              <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-red-500" />
                Thông tin giao hàng
              </h3>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p>
                  <span className="text-white">{order.shippingAddress.fullName}</span> -{" "}
                  {order.shippingAddress.phone}
                </p>
                <p>
                  {order.shippingAddress.address}, {order.shippingAddress.ward},{" "}
                  {order.shippingAddress.district}, {order.shippingAddress.city}
                </p>
                <p className="flex items-center gap-1 text-green-500">
                  <Clock className="w-3.5 h-3.5" />
                  Dự kiến giao hàng: 3-5 ngày làm việc
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  Phương thức thanh toán:{" "}
                  <span className="text-white">
                    {paymentMethod === "cod" ? "COD" : paymentMethod === "momo" ? "MoMo" : paymentMethod === "vnpay" ? "VNPay" : "Chuyển khoản"}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => (window.location.href = "/")}
            >
              Tiếp tục mua sắm
            </Button>
            <Button
              className="rounded-xl bg-gradient-to-r from-red-600 to-red-500"
              onClick={() => (window.location.href = "/orders")}
            >
              Theo dõi đơn hàng
            </Button>
          </div>

          {/* VNPay button */}
          {paymentMethod === "vnpay" && (
            <Button
              className="w-full rounded-xl h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/25 mt-4"
              onClick={handleVNPayPayment}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Thanh toán VNPay ngay
            </Button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 py-6 md:py-10">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              {step === "checkout" && (
                <button
                  onClick={() => setStep("cart")}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              )}
              <h1 className="text-2xl md:text-4xl font-bold text-white">
                {step === "cart" ? "Giỏ hàng" : "Thanh toán"}
              </h1>
            </div>
            {/* Steps indicator */}
            <div className="flex items-center gap-2 mt-3">
              {["cart", "checkout", "complete"].map((s, idx) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                      step === s
                        ? "bg-white text-red-600"
                        : step === "cart" && s === "checkout" ||
                            step === "checkout" && s === "complete"
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-white/50"
                    )}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={cn(
                      "text-xs hidden md:block",
                      step === s ? "text-white font-medium" : "text-white/50"
                    )}
                  >
                    {s === "cart"
                      ? "Giỏ hàng"
                      : s === "checkout"
                        ? "Thanh toán"
                        : "Hoàn tất"}
                  </span>
                  {idx < 2 && <div className="w-6 h-px bg-white/20" />}
                </div>
              ))}
            </div>
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
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {step === "cart" ? (
                <>
                  {/* Free ship progress */}
                  <div className="bg-card rounded-2xl border border-border p-4">
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Truck className="w-4 h-4 text-orange-400" />
                      <span className="text-muted-foreground">
                        {shippingFee === 0 ? (
                          <span className="text-green-500 font-medium">
                            🎉 Bạn được miễn phí vận chuyển!
                          </span>
                        ) : (
                          <>
                            Miễn phí vận chuyển cho đơn từ{" "}
                            <span className="text-white font-medium">
                              {formatPrice(FREE_SHIP_THRESHOLD)}
                            </span>
                          </>
                        )}
                      </span>
                    </div>
                    {shippingFee > 0 && (
                      <>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min((totalPrice / FREE_SHIP_THRESHOLD) * 100, 100)}%`,
                            }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Cần thêm{" "}
                          <span className="text-orange-400 font-medium">
                            {formatPrice(FREE_SHIP_THRESHOLD - totalPrice)}
                          </span>{" "}
                          để được freeship
                        </p>
                      </>
                    )}
                  </div>

                  {/* Cart Items */}
                  {items.map((item, index) => {
                    const itemTotal = item.product.price * item.quantity;
                    const itemOldTotal =
                      (item.product.oldPrice || item.product.price) * item.quantity;
                    const itemSavings = itemOldTotal - itemTotal;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-card rounded-2xl border border-border p-4 flex gap-4 group"
                      >
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-secondary shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                          {item.product.discount && (
                            <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-br-lg font-medium">
                              -{item.product.discount}%
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white truncate">
                            {item.product.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-semibold text-red-500">
                              {formatPrice(item.product.price)}
                            </span>
                            {item.product.oldPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(item.product.oldPrice)}
                              </span>
                            )}
                          </div>
                          {itemSavings > 0 && (
                            <p className="text-xs text-green-500 mt-0.5">
                              Tiết kiệm: {formatPrice(itemSavings)}
                            </p>
                          )}
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
                                {formatPrice(itemTotal)}
                              </span>
                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="p-2 text-muted-foreground hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              ) : (
                /* Shipping Form */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Shipping Info */}
                  <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                    <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-500" />
                      Thông tin giao hàng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1.5 block">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Nhập họ và tên"
                            value={shippingInfo.fullName}
                            onChange={(e) =>
                              updateShippingInfo("fullName", e.target.value)
                            }
                            className="bg-secondary/50 border-border pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1.5 block">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Nhập số điện thoại"
                            value={shippingInfo.phone}
                            onChange={(e) =>
                              updateShippingInfo("phone", e.target.value)
                            }
                            className="bg-secondary/50 border-border pl-10"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-muted-foreground mb-1.5 block">
                          Địa chỉ <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Số nhà, tên đường"
                            value={shippingInfo.address}
                            onChange={(e) =>
                              updateShippingInfo("address", e.target.value)
                            }
                            className="bg-secondary/50 border-border pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1.5 block">
                          Tỉnh/Thành phố
                        </label>
                        <Input
                          value={shippingInfo.city}
                          readOnly
                          className="bg-secondary/50 border-border text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1.5 block">
                          Quận/Huyện
                        </label>
                        <Input
                          placeholder="Nhập quận/huyện"
                          value={shippingInfo.district}
                          onChange={(e) =>
                            updateShippingInfo("district", e.target.value)
                          }
                          className="bg-secondary/50 border-border"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1.5 block">
                          Phường/Xã
                        </label>
                        <Input
                          placeholder="Nhập phường/xã"
                          value={shippingInfo.ward}
                          onChange={(e) =>
                            updateShippingInfo("ward", e.target.value)
                          }
                          className="bg-secondary/50 border-border"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1.5 block">
                          Ghi chú
                        </label>
                        <Input
                          placeholder="Ghi chú cho người giao hàng"
                          value={shippingInfo.note}
                          onChange={(e) =>
                            updateShippingInfo("note", e.target.value)
                          }
                          className="bg-secondary/50 border-border"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                    <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-red-500" />
                      Phương thức thanh toán
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          id: "cod" as PaymentMethod,
                          label: "Thanh toán khi nhận hàng (COD)",
                          icon: Banknote,
                          desc: "Nhận hàng và thanh toán bằng tiền mặt",
                          badge: "Phổ biến",
                        },
                        {
                          id: "bank" as PaymentMethod,
                          label: "Chuyển khoản ngân hàng",
                          icon: Building,
                          desc: "Chuyển khoản qua tài khoản ngân hàng",
                        },
                        {
                          id: "momo" as PaymentMethod,
                          label: "Ví MoMo",
                          icon: Wallet,
                          desc: "Thanh toán qua ví điện tử MoMo",
                          badge: "Hot",
                        },
                        {
                          id: "vnpay" as PaymentMethod,
                          label: "VNPay",
                          icon: CreditCard,
                          desc: "Thanh toán qua cổng VNPay (ATM, Visa, Master)",
                          badge: "Nhanh",
                        },
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={cn(
                            "w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left relative",
                            paymentMethod === method.id
                              ? "border-red-500 bg-red-500/10"
                              : "border-border hover:border-red-500/50"
                          )}
                        >
                          {method.badge && (
                            <span className="absolute -top-2 -right-2 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white font-medium">
                              {method.badge}
                            </span>
                          )}
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                              paymentMethod === method.id
                                ? "bg-red-500/20"
                                : "bg-secondary"
                            )}
                          >
                            <method.icon
                              className={cn(
                                "w-5 h-5",
                                paymentMethod === method.id
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-white">
                                {method.label}
                              </span>
                              {paymentMethod === method.id && (
                                <Check className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {method.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                    <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-red-500" />
                      Sản phẩm đã chọn ({itemCount})
                    </h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary shrink-0">
                            <img
                              src={item.product.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              x{item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-white shrink-0">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Order Summary */}
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
                    <span className="text-white">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Phí vận chuyển
                    </span>
                    <span
                      className={cn(
                        shippingFee === 0 ? "text-green-500" : "text-white"
                      )}
                    >
                      {shippingFee === 0
                        ? "Miễn phí"
                        : formatPrice(shippingFee)}
                    </span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5" />
                        Tiết kiệm
                      </span>
                      <span className="text-green-500">
                        -{formatPrice(totalSavings)}
                      </span>
                    </div>
                  )}

                  {/* Estimated Delivery */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Dự kiến giao hàng
                    </span>
                    <span className="text-white">{getEstimatedDelivery()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Vận chuyển từ
                    </span>
                    <span className="text-white">Hồ Chí Minh</span>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-white">Tổng cộng</span>
                      <span className="font-bold text-xl text-red-500">
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                    {shippingFee === 0 && (
                      <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Miễn phí vận chuyển
                      </p>
                    )}
                  </div>
                </div>

                {step === "checkout" && (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-3 border border-green-500/20">
                    <div className="flex items-center gap-2 text-xs text-green-400">
                      <Sparkles className="w-4 h-4" />
                      <span>Đơn hàng của bạn đã sẵn sàng!</span>
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
                    onClick={handlePlaceOrder}
                  >
                    <Check className="w-4 h-4 mr-2" />
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
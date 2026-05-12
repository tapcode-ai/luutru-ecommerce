"use client";

import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  CreditCard,
  ChevronLeft,
  Phone,
  User,
  Home,
  Banknote,
  Wallet,
  Building,
  AlertCircle,
  Ban,
  ShoppingBag,
  Copy,
  Percent,
  Box,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useOrderStore } from "@/store/orderStore";
import { Button } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import { OrderStatus } from "@/types/order";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: any; desc: string }> = {
  pending: {
    label: "Chờ xác nhận",
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
    icon: Clock,
    desc: "Đơn hàng đang chờ được xác nhận từ người bán",
  },
  packing: {
    label: "Đang đóng gói",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
    icon: Box,
    desc: "Người bán đang đóng gói sản phẩm để chuẩn bị giao",
  },
  shipping: {
    label: "Đang giao",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
    icon: Truck,
    desc: "Đơn hàng đang được vận chuyển đến bạn",
  },
  delivered: {
    label: "Đã giao",
    color: "text-green-500 bg-green-500/10 border-green-500/30",
    icon: CheckCircle,
    desc: "Đơn hàng đã được giao thành công",
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-red-500 bg-red-500/10 border-red-500/30",
    icon: XCircle,
    desc: "Đơn hàng đã bị hủy",
  },
};

const STATUS_STEPS: { status: OrderStatus; label: string; icon: any }[] = [
  { status: "pending", label: "Chờ xác nhận", icon: Clock },
  { status: "packing", label: "Đang đóng gói", icon: Box },
  { status: "shipping", label: "Đang giao", icon: Truck },
  { status: "delivered", label: "Đã giao", icon: CheckCircle },
];

const PAYMENT_LABELS: Record<string, string> = {
  cod: "COD - Thanh toán khi nhận hàng",
  momo: "Ví MoMo",
  vnpay: "VNPay",
  bank: "Chuyển khoản ngân hàng",
};

const PAYMENT_ICONS: Record<string, any> = {
  cod: Banknote,
  momo: Wallet,
  vnpay: CreditCard,
  bank: Building,
};

export default function OrderDetailPage() {
  const params = useParams();
  const { getOrderById, cancelOrder } = useOrderStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const order = getOrderById(params.id as string);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Không tìm thấy đơn hàng
          </h3>
          <p className="text-muted-foreground mb-6">
            Mã đơn hàng không tồn tại hoặc đã bị xóa
          </p>
          <Button asChild className="rounded-xl">
            <Link href="/orders">Quay lại đơn hàng</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;
  const PaymentIcon = PAYMENT_ICONS[order.paymentMethod];
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === order.status);

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 py-6 md:py-10">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/orders"
              className="inline-flex items-center gap-1 text-white/70 hover:text-white mb-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Quay lại đơn hàng</span>
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3">
              Theo dõi đơn hàng
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-white/80 text-sm font-medium">
                Mã đơn: #{order.id}
              </span>
              <button
                onClick={handleCopyId}
                className="text-white/50 hover:text-white transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border",
                statusConfig.color
              )}>
                <StatusIcon className="w-4 h-4" />
                {statusConfig.label}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-container py-6 space-y-4">
        {/* ORDER TRACKING TIMELINE */}
        {order.status !== "cancelled" ? (
          <div className="bg-card rounded-2xl border border-border p-5 md:p-6 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/5 to-transparent rounded-bl-full" />

            <h3 className="font-semibold text-white text-lg mb-6 flex items-center gap-2 relative z-10">
              <Package className="w-5 h-5 text-red-500" />
              Trạng thái đơn hàng
            </h3>

            {/* Timeline */}
            <div className="relative z-10">
              {/* Progress bar background */}
              <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gray-700/50" />

              {/* Progress bar fill */}
              <motion.div
                initial={{ height: 0 }}
                animate={{
                  height: `${currentStepIndex >= 0 ? ((currentStepIndex) / (STATUS_STEPS.length - 1)) * 100 : 0}%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute left-[19px] top-0 w-[2px] bg-gradient-to-b from-red-500 via-red-500 to-green-500"
              />

              {/* Steps */}
              <div className="space-y-0">
                {STATUS_STEPS.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const isLast = idx === STATUS_STEPS.length - 1;

                  return (
                    <motion.div
                      key={step.status}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className={cn(
                        "flex items-start gap-4 relative pb-8",
                        isLast && "pb-0"
                      )}
                    >
                      {/* Step circle */}
                      <div className="relative z-10">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500",
                            isCompleted
                              ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30"
                              : "bg-gray-800 border-2 border-gray-700"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <StepIcon className="w-4 h-4 text-gray-500" />
                          )}
                        </motion.div>
                      </div>

                      {/* Step content */}
                      <div className="flex-1 pt-1.5">
                        <div className="flex items-center gap-2">
                          <h4
                            className={cn(
                              "text-base font-semibold transition-colors",
                              isCompleted
                                ? "text-white"
                                : "text-gray-500"
                            )}
                          >
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium"
                            >
                              Đang xử lý
                            </motion.span>
                          )}
                          {isCompleted && !isCurrent && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>

                        {/* Description */}
                        <p
                          className={cn(
                            "text-sm mt-0.5 transition-colors",
                            isCurrent
                              ? "text-muted-foreground"
                              : isCompleted
                                ? "text-green-500/60"
                                : "text-gray-600"
                          )}
                        >
                          {isCurrent
                            ? STATUS_CONFIG[step.status].desc
                            : isCompleted
                              ? "Hoàn thành"
                              : "Chưa đến"}
                        </p>

                        {/* Current step extra info */}
                        {isCurrent && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-2 flex items-center gap-2 text-xs"
                          >
                            <span className="text-yellow-500 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {order.status === "pending" && "Đang chờ xác nhận từ người bán"}
                              {order.status === "packing" && "Sản phẩm đang được đóng gói cẩn thận"}
                              {order.status === "shipping" && "Dự kiến giao trong 3-5 ngày"}
                              {order.status === "delivered" && "Cảm ơn bạn đã mua hàng!"}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Cancelled notice */
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Đơn hàng đã bị hủy</h3>
            <p className="text-sm text-muted-foreground">
              Đã hủy vào{" "}
              {new Date(order.updatedAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}

        {/* Shipping Info */}
        <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
          <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Thông tin giao hàng
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-white">{order.shippingAddress.fullName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-white">{order.shippingAddress.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <Home className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-white">
                {order.shippingAddress.address}, {order.shippingAddress.ward},{" "}
                {order.shippingAddress.district}, {order.shippingAddress.city}
              </span>
            </div>
            {order.shippingAddress.note && (
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{order.shippingAddress.note}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
          <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-500" />
            Phương thức thanh toán
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <PaymentIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-white font-medium">{PAYMENT_LABELS[order.paymentMethod]}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {order.paymentMethod === "cod"
                  ? "Thanh toán khi nhận hàng"
                  : "Vui lòng thanh toán theo hướng dẫn"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
          <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-red-500" />
            Sản phẩm đã mua ({order.items.length})
          </h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                  <img src={item.productImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{item.productName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-red-500 font-semibold">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-xs text-muted-foreground">x{item.quantity}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-white shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
          <h3 className="font-semibold text-white text-lg mb-4">
            Chi tiết thanh toán
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tạm tính</span>
              <span className="text-white">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                Phí vận chuyển
              </span>
              <span className={cn(order.shippingFee === 0 ? "text-green-500" : "text-white")}>
                {order.shippingFee === 0 ? "Miễn phí" : formatPrice(order.shippingFee)}
              </span>
            </div>
            {order.totalSavings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" />
                  Tiết kiệm
                </span>
                <span className="text-green-500">-{formatPrice(order.totalSavings)}</span>
              </div>
            )}
            <div className="border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-white">Tổng cộng</span>
                <span className="font-bold text-xl text-red-500">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {order.status === "pending" && (
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => setShowCancelModal(true)}
            >
              <Ban className="w-4 h-4 mr-2" />
              Hủy đơn hàng
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={handleCopyId}
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Đã sao chép
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Sao chép mã đơn
              </>
            )}
          </Button>
          <Button asChild className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-red-500">
            <Link href="/">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Mua thêm
            </Link>
          </Button>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full"
          >
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white">Xác nhận hủy đơn</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Bạn có chắc muốn hủy đơn hàng #{order.id}?
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setShowCancelModal(false)}
              >
                Giữ lại
              </Button>
              <Button
                className="flex-1 rounded-xl bg-red-500 hover:bg-red-600"
                onClick={() => {
                  cancelOrder(order.id);
                  setShowCancelModal(false);
                }}
              >
                <Ban className="w-4 h-4 mr-2" />
                Hủy đơn
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
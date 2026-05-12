"use client";

import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronRight,
  Search,
  ShoppingBag,
  AlertCircle,
  Ban,
  Box,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useOrderStore } from "@/store/orderStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn } from "@/lib/utils";
import { OrderStatus } from "@/types/order";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending: { label: "Chờ xác nhận", color: "text-yellow-500 bg-yellow-500/10", icon: Clock },
  packing: { label: "Đang đóng gói", color: "text-blue-500 bg-blue-500/10", icon: Box },
  shipping: { label: "Đang giao", color: "text-purple-500 bg-purple-500/10", icon: Truck },
  delivered: { label: "Đã giao", color: "text-green-500 bg-green-500/10", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "text-red-500 bg-red-500/10", icon: XCircle },
};

const STATUS_TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ xác nhận", value: "pending" },
  { label: "Đang đóng gói", value: "packing" },
  { label: "Đang giao", value: "shipping" },
  { label: "Đã giao", value: "delivered" },
  { label: "Đã hủy", value: "cancelled" },
];

export default function OrdersPage() {
  const { orders, cancelOrder, fetchOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId);
    setShowCancelModal(null);
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
            <h1 className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Package className="w-8 h-8" />
              Đơn hàng của tôi
            </h1>
            <p className="text-white/70 mt-1">
              Quản lý và theo dõi tất cả đơn hàng của bạn
            </p>
          </motion.div>
        </div>
      </div>

      <div className="section-container py-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-card border-border pl-10"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab.value
                  ? "bg-red-500 text-white"
                  : "bg-card text-muted-foreground hover:text-white border border-border"
              )}
            >
              {tab.label}
              {tab.value !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({orders.filter((o) => o.status === tab.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {orders.length === 0 ? "Chưa có đơn hàng nào" : "Không tìm thấy đơn hàng"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {orders.length === 0
                ? "Bắt đầu mua sắm để có đơn hàng đầu tiên"
                : "Thử tìm kiếm với từ khóa khác"}
            </p>
            <Button asChild className="rounded-xl">
              <a href="/">Mua sắm ngay</a>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const statusConfig = STATUS_CONFIG[order.status];
              const StatusIcon = statusConfig.icon;
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/orders/${order.id}`}>
                    <div className="bg-card rounded-2xl border border-border p-4 hover:border-red-500/30 transition-all group cursor-pointer">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            #{order.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                          statusConfig.color
                        )}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-10 h-10 rounded-lg overflow-hidden bg-secondary border-2 border-card"
                            >
                              <img
                                src={item.productImage}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-10 h-10 rounded-lg bg-secondary border-2 border-card flex items-center justify-center text-xs text-muted-foreground">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">
                            {order.items[0]?.productName}
                            {order.items.length > 1 && ` và ${order.items.length - 1} sản phẩm khác`}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors shrink-0" />
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>
                            {order.paymentMethod === "cod"
                              ? "COD"
                              : order.paymentMethod === "momo"
                                ? "MoMo"
                                : order.paymentMethod === "vnpay"
                                  ? "VNPay"
                                  : "Chuyển khoản"}
                          </span>
                          <span>•</span>
                          <span>{order.items.reduce((s, i) => s + i.quantity, 0)} sản phẩm</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            Tổng:{" "}
                            <span className="text-lg font-bold text-red-500">
                              {formatPrice(order.total)}
                            </span>
                          </span>
                          {order.status === "pending" && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setShowCancelModal(order.id);
                              }}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors"
                            >
                              Hủy
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
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
                Bạn có chắc muốn hủy đơn hàng #{showCancelModal}?
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setShowCancelModal(null)}
              >
                Giữ lại
              </Button>
              <Button
                className="flex-1 rounded-xl bg-red-500 hover:bg-red-600"
                onClick={() => handleCancelOrder(showCancelModal)}
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
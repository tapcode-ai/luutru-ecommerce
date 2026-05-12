"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Package,
  Heart,
  LogOut,
  Clock,
  ShoppingBag,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Loader2,
  CheckCircle,
  Store,
  Truck,
  XCircle,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useOrderStore } from "@/store/orderStore";
import { SITE_NAME } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { updateUserProfile } from "@/lib/mockDataHelper";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useUserStore();
  const { orders, fetchOrders, loading } = useOrderStore();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wishlist">(
    "profile"
  );
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setEditName(user?.name || "");
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const result = updateUserProfile(user?.id || "", {
        fullName: editName,
        phone: editPhone,
      });
      if (result.success) {
        setSaveMessage("Cập nhật thành công!");
        setEditing(false);
        useUserStore.getState().setUser(
          {
            ...user!,
            name: editName,
          },
          undefined
        );
      } else {
        setSaveMessage("Cập nhật thất bại");
      }
    } catch {
      setSaveMessage("Có lỗi xảy ra");
    }
    setSaving(false);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: any }> = {
      pending: { label: "Chờ xác nhận", color: "text-yellow-400 bg-yellow-400/10", icon: Clock },
      confirmed: { label: "Đã xác nhận", color: "text-blue-400 bg-blue-400/10", icon: CheckCircle },
      shipping: { label: "Đang giao", color: "text-purple-400 bg-purple-400/10", icon: Truck },
      delivered: { label: "Đã giao", color: "text-green-400 bg-green-400/10", icon: CheckCircle },
      cancelled: { label: "Đã hủy", color: "text-red-400 bg-red-400/10", icon: XCircle },
    };
    const info = statusMap[status] || statusMap.pending;
    const Icon = info.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${info.color}`}
      >
        <Icon className="w-3 h-3" />
        {info.label}
      </span>
    );
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const tabs = [
    { id: "profile" as const, label: "Thông tin", icon: User },
    { id: "orders" as const, label: "Đơn hàng", icon: Package },
    { id: "wishlist" as const, label: "Yêu thích", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/20">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{user.name}</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-400"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Thông tin cá nhân
                </h2>
                {!editing ? (
                  <button
                    onClick={() => {
                      setEditName(user.name);
                      setEditPhone("");
                      setEditing(true);
                    }}
                    className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300"
                  >
                    <Edit3 className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                    Hủy
                  </button>
                )}
              </div>

              {saveMessage && (
                <div className="flex items-center gap-2 p-3 mb-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  {saveMessage}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Họ và tên
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <p className="text-white">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Email
                  </label>
                  <p className="text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Số điện thoại
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="Chưa cập nhật"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  ) : (
                    <p className="text-white flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {user.phone || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Ngày tham gia
                  </label>
                  <p className="text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                {editing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Lưu thay đổi
                  </button>
                )}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 rounded-xl border border-gray-800 text-red-400 hover:bg-gray-800/50 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-semibold text-white mb-4">
              Đơn hàng của tôi
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="block bg-gray-900/50 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-400">
                          Mã đơn:{" "}
                          <span className="text-white font-mono">
                            #{order.id.slice(0, 8)}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      {order.items.slice(0, 3).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden"
                        >
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">
                        {order.items.length} sản phẩm
                      </p>
                      <p className="text-base font-bold text-red-400">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">
                  Chưa có đơn hàng nào
                </h3>
                <p className="text-gray-500 mb-6">
                  Hãy mua sắm và quay lại đây để theo dõi đơn hàng
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all"
                >
                  <Store className="w-4 h-4" />
                  Mua sắm ngay
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">
                Sản phẩm yêu thích
              </h2>
              <Link
                href="/wishlist"
                className="text-sm text-red-400 hover:text-red-300"
              >
                Xem tất cả
              </Link>
            </div>
            <p className="text-gray-500 text-sm">
              Quản lý danh sách sản phẩm yêu thích của bạn
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
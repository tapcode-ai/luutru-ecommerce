"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Store, Loader2, AlertCircle } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { SITE_NAME } from "@/lib/constants";
import { loginUser } from "@/lib/mockDataHelper";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      const result = loginUser(email, password);
      const { user, token } = result.data;

      setUser(
        {
          id: user.id,
          email: user.email,
          name: user.fullName || user.email.split("@")[0],
          avatar: user.avatar || "",
          createdAt: user.createdAt || new Date().toISOString(),
        },
        token
      );

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Đăng nhập thất bại");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/30">
              <Store className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{SITE_NAME}</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-2">Đăng nhập</h1>
          <p className="text-gray-400 mb-6">
            Chào mừng bạn quay trở lại!
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <p className="text-xs text-gray-500 text-center mb-3">
              Tài khoản dùng thử
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setEmail("admin@luutru.com");
                  setPassword("admin123");
                }}
                className="w-full text-left px-3 py-2 bg-gray-700/30 rounded-lg text-xs text-gray-400 hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-gray-300 font-medium">Admin:</span>{" "}
                admin@luutru.com / admin123
              </button>
              <button
                onClick={() => {
                  setEmail("user@luutru.com");
                  setPassword("user123");
                }}
                className="w-full text-left px-3 py-2 bg-gray-700/30 rounded-lg text-xs text-gray-400 hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-gray-300 font-medium">User:</span>{" "}
                user@luutru.com / user123
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
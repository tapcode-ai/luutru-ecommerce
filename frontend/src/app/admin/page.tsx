"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { getProducts, getProductById, getCategories } from "@/lib/mockDataHelper";
import { products as mockProducts } from "@/lib/mockData";

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number;
  images: string[];
  categoryId: string;
  stock: number;
  isFlashSale: boolean;
  featured: boolean;
  tags: string[];
  brand: string;
}

const defaultForm: ProductForm = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  oldPrice: 0,
  images: [""],
  categoryId: "",
  stock: 0,
  isFlashSale: false,
  featured: false,
  tags: [],
  brand: "",
};

const CATEGORIES = [
  { id: "thoi-trang", name: "Thời Trang" },
  { id: "dien-thoai", name: "Điện Thoại" },
  { id: "thiet-bi-dien-tu", name: "Thiết Bị Điện Tử" },
  { id: "may-tinh-bang", name: "Máy Tính Bảng" },
  { id: "giay-dep", name: "Giày Dép" },
  { id: "dong-ho", name: "Đồng Hồ" },
  { id: "may-anh", name: "Máy Ảnh" },
  { id: "laptop", name: "Laptop" },
  { id: "nuoc-hoa", name: "Nước Hoa" },
  { id: "phu-kien", name: "Phụ Kiện" },
  { id: "sach", name: "Sách" },
  { id: "lam-dep", name: "Làm Đẹp" },
  { id: "gia-dung", name: "Gia Dụng" },
];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const result = getProducts();
      setProducts(result.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      showNotification("error", "Không thể tải danh sách sản phẩm");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : generateSlug(name),
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addImageUrl = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const updateImageUrl = (index: number, url: string) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages[index] = url;
      return { ...prev, images: newImages };
    });
  };

  const removeImageUrl = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const openAddForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice || product.price,
      images: product.images.length > 0 ? product.images : [""],
      categoryId: product.categoryId,
      stock: product.stock,
      isFlashSale: product.isFlashSale || false,
      featured: product.featured || false,
      tags: product.tags || [],
      brand: product.brand || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryId) {
      showNotification("error", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setSaving(true);
    try {
      const productData = {
        ...form,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice) || Number(form.price),
        stock: Number(form.stock),
        images: form.images.filter((img) => img.trim() !== ""),
        rating: 0,
        soldCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingId) {
        // Update in mock data
        const idx = mockProducts.findIndex((p) => p.id === editingId);
        if (idx !== -1) {
          Object.assign(mockProducts[idx], productData);
        }
        showNotification("success", "Cập nhật sản phẩm thành công!");
      } else {
        const newProduct = {
          id: String(Date.now()),
          ...productData,
        } as Product;
        mockProducts.push(newProduct);
        showNotification("success", "Thêm sản phẩm thành công!");
      }

      setShowForm(false);
      fetchProducts();
    } catch (error) {
      showNotification("error", "Lỗi khi lưu sản phẩm");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const idx = mockProducts.findIndex((p) => p.id === id);
      if (idx !== -1) {
        mockProducts.splice(idx, 1);
      }
      showNotification("success", "Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (error) {
      showNotification("error", "Lỗi khi xóa sản phẩm");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "₫";
  };

  const getCategoryName = (id: string) => {
    const cat = CATEGORIES.find((c) => c.id === id);
    return cat?.name || id;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Quản Lý Sản Phẩm
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {products.length} sản phẩm
            </p>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setShowForm(false)}
            />
            <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto z-10">
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="slug-cua-san-pham"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Mô tả sản phẩm"
                  />
                </div>

                {/* Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Giá bán (₫) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          price: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Giá gốc (₫)
                    </label>
                    <input
                      type="number"
                      value={form.oldPrice}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          oldPrice: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Category & Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.categoryId}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          categoryId: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Chọn danh mục</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Số lượng tồn kho
                    </label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          stock: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Thương hiệu
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, brand: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Nhập thương hiệu"
                  />
                </div>

                {/* Flash Sale & Featured */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFlashSale}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          isFlashSale: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Flash Sale
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          featured: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Nổi bật
                    </span>
                  </label>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hình ảnh (URLs)
                  </label>
                  {form.images.map((url, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      {form.images.length > 1 && (
                        <button
                          onClick={() => removeImageUrl(index)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addImageUrl}
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 mt-1"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Thêm ảnh
                  </button>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full text-xs"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTag()}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Thêm tag..."
                    />
                    <button
                      onClick={addTag}
                      className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm hover:bg-gray-200"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                      Sản phẩm
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                      Danh mục
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                      Giá
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                      Tồn kho
                    </th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                      Trạng thái
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <React.Fragment key={product.id}>
                      <tr
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                        onClick={() =>
                          setExpandedProduct(
                            expandedProduct === product.id ? null : product.id
                          )
                        }
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                ID: {product.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {getCategoryName(product.categoryId)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800 dark:text-gray-200">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              product.stock > 50
                                ? "bg-green-50 dark:bg-green-900/20 text-green-600"
                                : product.stock > 0
                                ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600"
                                : "bg-red-50 dark:bg-red-900/20 text-red-600"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {product.isFlashSale && (
                              <span className="inline-flex px-1.5 py-0.5 bg-red-500 text-white rounded text-xs font-bold">
                                SALE
                              </span>
                            )}
                            {product.featured && (
                              <span className="inline-flex px-1.5 py-0.5 bg-blue-500 text-white rounded text-xs font-bold">
                                HOT
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditForm(product);
                              }}
                              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(product.id);
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedProduct(
                                  expandedProduct === product.id
                                    ? null
                                    : product.id
                                );
                              }}
                              className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                              {expandedProduct === product.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedProduct === product.id && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-4 bg-gray-50 dark:bg-gray-800/50"
                          >
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 mb-1">Mô tả</p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {product.description || "Chưa có mô tả"}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">
                                  Tags / Thương hiệu
                                </p>
                                <div className="space-y-1">
                                  {product.tags && product.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {product.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {product.brand && (
                                    <p className="text-gray-600 dark:text-gray-400">
                                      Thương hiệu: {product.brand}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">
                                  Giá gốc / Đã bán
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  Giá gốc:{" "}
                                  {product.oldPrice
                                    ? formatPrice(product.oldPrice)
                                    : "---"}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                  Đã bán: {product.soldCount}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-sm text-gray-400">
              {searchQuery
                ? "Thử tìm kiếm với từ khóa khác"
                : "Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
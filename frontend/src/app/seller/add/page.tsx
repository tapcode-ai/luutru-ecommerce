"use client";

import { motion } from "framer-motion";
import {
  Store,
  Package,
  Upload,
  X,
  ChevronLeft,
  Save,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Tag,
  FileText,
  Layers,
  Plus,
} from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSellerStore } from "@/store/sellerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice, cn } from "@/lib/utils";

const CATEGORIES = [
  "Thời trang",
  "Điện tử",
  "Đồ gia dụng",
  "Mỹ phẩm",
  "Thực phẩm",
  "Sách",
  "Thể thao",
  "Phụ kiện",
];

interface FormData {
  name: string;
  price: string;
  oldPrice: string;
  stock: string;
  description: string;
  category: string;
  images: string[];
  status: "active" | "inactive";
}

const INITIAL_FORM: FormData = {
  name: "",
  price: "",
  oldPrice: "",
  stock: "",
  description: "",
  category: "",
  images: [],
  status: "active",
};

export default function AddProductPage() {
  const router = useRouter();
  const { addProduct } = useSellerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setForm((prev) => ({
          ...prev,
          images: [...prev.images, dataUrl].slice(0, 5),
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!form.name.trim()) newErrors.name = "Vui lòng nhập tên sản phẩm";
    else if (form.name.length < 5) newErrors.name = "Tên sản phẩm phải có ít nhất 5 ký tự";

    if (!form.price) newErrors.price = "Vui lòng nhập giá";
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = "Giá không hợp lệ";

    if (form.oldPrice && (isNaN(Number(form.oldPrice)) || Number(form.oldPrice) <= Number(form.price)))
      newErrors.oldPrice = "Giá cũ phải lớn hơn giá hiện tại";

    if (!form.stock) newErrors.stock = "Vui lòng nhập số lượng tồn kho";
    else if (isNaN(Number(form.stock)) || Number(form.stock) < 0)
      newErrors.stock = "Số lượng không hợp lệ";

    if (!form.description.trim()) newErrors.description = "Vui lòng nhập mô tả sản phẩm";
    else if (form.description.length < 20)
      newErrors.description = "Mô tả phải có ít nhất 20 ký tự";

    if (!form.category) newErrors.category = "Vui lòng chọn danh mục";

    if (form.images.length === 0) newErrors.images = "Vui lòng upload ít nhất 1 ảnh";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    addProduct({
      name: form.name.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock: Number(form.stock),
      description: form.description.trim(),
      category: form.category,
      images: form.images,
      status: form.status,
    });

    setShowSuccess(true);
    setTimeout(() => {
      router.push("/seller");
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Đăng bán thành công! 🎉
          </h2>
          <p className="text-muted-foreground">
            Sản phẩm của bạn đã được đăng lên cửa hàng.
          </p>
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
            <Link
              href="/seller"
              className="inline-flex items-center gap-1 text-white/70 hover:text-white mb-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Quay lại Seller Center</span>
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Package className="w-8 h-8" />
              Đăng bán sản phẩm
            </h1>
            <p className="text-white/70 mt-1">
              Điền đầy đủ thông tin để đăng sản phẩm lên cửa hàng
            </p>
          </motion.div>
        </div>
      </div>

      <div className="section-container py-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Product Name */}
              <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-red-500" />
                  Thông tin cơ bản
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="VD: Áo thun nam cotton cao cấp"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className={cn(
                        "bg-secondary/50 border-border",
                        errors.name && "border-red-500"
                      )}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {form.name.length}/100 ký tự
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">
                        Giá bán (₫) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.price}
                          onChange={(e) => updateField("price", e.target.value)}
                          className={cn(
                            "bg-secondary/50 border-border pl-10",
                            errors.price && "border-red-500"
                          )}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                      )}
                      {form.price && !errors.price && (
                        <p className="text-xs text-green-500 mt-1">
                          Giá niêm yết: {formatPrice(Number(form.price))}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">
                        Giá cũ (₫)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.oldPrice}
                          onChange={(e) => updateField("oldPrice", e.target.value)}
                          className={cn(
                            "bg-secondary/50 border-border pl-10",
                            errors.oldPrice && "border-red-500"
                          )}
                        />
                      </div>
                      {errors.oldPrice && (
                        <p className="text-xs text-red-500 mt-1">{errors.oldPrice}</p>
                      )}
                      {form.price && form.oldPrice && Number(form.oldPrice) > Number(form.price) && (
                        <p className="text-xs text-green-500 mt-1">
                          Giảm: {Math.round((1 - Number(form.price) / Number(form.oldPrice)) * 100)}%
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Số lượng tồn kho <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0"
                        value={form.stock}
                        onChange={(e) => updateField("stock", e.target.value)}
                        className={cn(
                          "bg-secondary/50 border-border pl-10",
                          errors.stock && "border-red-500"
                        )}
                      />
                    </div>
                    {errors.stock && (
                      <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-red-500" />
                  Mô tả sản phẩm
                </h3>
                <div>
                  <textarea
                    placeholder="Mô tả chi tiết về sản phẩm, chất liệu, kích thước, hướng dẫn sử dụng..."
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={6}
                    className={cn(
                      "w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground outline-none resize-none transition-colors focus:border-red-500/50",
                      errors.description && "border-red-500"
                    )}
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {form.description.length} ký tự (tối thiểu 20)
                  </p>
                </div>
              </div>

              {/* Images */}
              <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-red-500" />
                  Hình ảnh sản phẩm
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-secondary group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {form.images.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-red-500/50 transition-colors flex flex-col items-center justify-center gap-1 bg-secondary/30"
                    >
                      <Upload className="w-6 h-6 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Upload ảnh</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {errors.images && (
                  <p className="text-xs text-red-500 mt-2">{errors.images}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Tối đa 5 ảnh. Định dạng: JPG, PNG, WEBP
                </p>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-4">
              {/* Category */}
              <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-red-500" />
                  Danh mục
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => updateField("category", cat)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all",
                        form.category === cat
                          ? "bg-red-500/10 text-red-500 border border-red-500/30"
                          : "bg-secondary/50 text-muted-foreground hover:text-white border border-border"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-2">{errors.category}</p>
                )}
              </div>

              {/* Status */}
              <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                  <Store className="w-5 h-5 text-red-500" />
                  Trạng thái
                </h3>
                <div className="space-y-2">
                  {[
                    { value: "active" as const, label: "Đăng bán ngay", desc: "Sản phẩm sẽ hiển thị ngay trên cửa hàng" },
                    { value: "inactive" as const, label: "Lưu nháp", desc: "Sản phẩm sẽ được lưu và không hiển thị" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField("status", opt.value)}
                      className={cn(
                        "w-full text-left p-3 rounded-xl text-sm transition-all",
                        form.status === opt.value
                          ? "bg-red-500/10 text-red-500 border border-red-500/30"
                          : "bg-secondary/50 text-muted-foreground hover:text-white border border-border"
                      )}
                    >
                      <p className="font-medium">{opt.label}</p>
                      <p className="text-xs mt-0.5 opacity-70">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-card rounded-2xl border border-border p-5 md:p-6">
                <h3 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-500" />
                  Xem trước
                </h3>
                <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-secondary">
                    {form.images[0] ? (
                      <img src={form.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium line-clamp-2">
                      {form.name || "Tên sản phẩm"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {form.price && (
                        <span className="text-sm font-semibold text-red-500">
                          {formatPrice(Number(form.price))}
                        </span>
                      )}
                      {form.oldPrice && Number(form.oldPrice) > Number(form.price) && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(Number(form.oldPrice))}
                        </span>
                      )}
                    </div>
                    {form.category && (
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        {form.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl h-12 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/25"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang đăng...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Đăng bán sản phẩm
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
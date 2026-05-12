// Helper để chuyển đổi dữ liệu từ mockData sang các định dạng cần thiết
import { products, categories, reviews } from "./mockData";
import { Product } from "@/types/product";

// ============ USERS ============
export const mockUsers = [
  {
    id: "user-1",
    email: "admin@luutru.com",
    password: "admin123",
    fullName: "Admin Lưu Trữ",
    phone: "0912345678",
    avatar: "",
    role: "admin",
    addresses: [
      {
        id: "addr-1",
        fullName: "Admin Lưu Trữ",
        phone: "0912345678",
        address: "123 Nguyễn Huệ",
        city: "Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
        isDefault: true,
      },
    ],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "user-2",
    email: "user@luutru.com",
    password: "user123",
    fullName: "Nguyễn Văn A",
    phone: "0987654321",
    avatar: "",
    role: "user",
    addresses: [],
    createdAt: "2026-02-15T00:00:00.000Z",
    updatedAt: "2026-02-15T00:00:00.000Z",
  },
];

// ============ PRODUCT HELPERS ============
export function searchProducts(query: string, limit = 8): Product[] {
  if (!query.trim()) return [];
  const searchLower = query.toLowerCase();
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchLower) ||
      p.brand?.toLowerCase().includes(searchLower) ||
      p.tags?.some((t) => t.toLowerCase().includes(searchLower))
  );
  return filtered.slice(0, limit);
}

export function getProducts(params?: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  isFlashSale?: boolean;
}) {
  let filtered = [...products];

  if (params) {
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    if (params.category) {
      filtered = filtered.filter((p) => p.categoryId === params.category);
    }

    if (params.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= params.maxPrice!);
    }

    if (params.minRating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= params.minRating!);
    }

    if (params.inStock) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    if (params.featured) {
      filtered = filtered.filter((p) => p.featured);
    }

    if (params.isFlashSale) {
      filtered = filtered.filter((p) => p.isFlashSale);
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case "price_asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "newest":
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "best_seller":
          filtered.sort((a, b) => b.soldCount - a.soldCount);
          break;
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating);
          break;
      }
    }
  }

  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return {
    success: true,
    data: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  };
}

export function getProductBySlug(slug: string) {
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error("Không tìm thấy sản phẩm");
  return { success: true, data: product };
}

export function getProductById(id: string) {
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error("Không tìm thấy sản phẩm");
  return { success: true, data: product };
}

export function getFeaturedProducts() {
  return {
    success: true,
    data: products.filter((p) => p.featured),
  };
}

export function getFlashSales() {
  return {
    success: true,
    data: products.filter((p) => p.isFlashSale),
  };
}

export function getNewArrivals(limit = 10) {
  const sorted = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return { success: true, data: sorted.slice(0, limit) };
}

export function getProductsByCategory(slug: string) {
  return {
    success: true,
    data: products.filter((p) => p.categoryId === slug),
  };
}

export function getRelatedProducts(id: string, limit = 8) {
  const current = products.find((p) => p.id === id);
  if (!current) return { success: true, data: [] };
  const related = products.filter(
    (p) => p.categoryId === current.categoryId && p.id !== id
  );
  return { success: true, data: related.slice(0, limit) };
}

export function getCategories() {
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    count: products.filter((p) => p.categoryId === cat.id).length,
  }));
}

export function getReviewsByProduct(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

// ============ AUTH HELPERS ============
export function loginUser(email: string, password: string) {
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Email hoặc mật khẩu không đúng");
  const token = "fake-jwt-token-" + user.id + "-" + Date.now();
  return {
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        addresses: user.addresses,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    },
  };
}

export function registerUser(data: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}) {
  const existing = mockUsers.find((u) => u.email === data.email);
  if (existing) throw new Error("Email này đã được đăng ký");

  const newUser = {
    id: "user-" + Date.now(),
    email: data.email,
    password: data.password,
    fullName: data.fullName,
    phone: data.phone,
    avatar: "",
    role: "user" as const,
    addresses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);

  const token = "fake-jwt-token-" + newUser.id + "-" + Date.now();
  return {
    success: true,
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        phone: newUser.phone,
        avatar: newUser.avatar,
        role: newUser.role,
        addresses: newUser.addresses,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
      token,
    },
  };
}

export function updateUserProfile(
  userId: string,
  data: { fullName?: string; phone?: string }
) {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error("Không tìm thấy người dùng");
  if (data.fullName) user.fullName = data.fullName;
  if (data.phone) user.phone = data.phone;
  return { success: true, message: "Cập nhật thành công!" };
}

// ============ CART HELPERS ============
interface CartItemData {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

const userCarts: Record<string, CartItemData[]> = {};

export function getCart(userId: string) {
  const items = userCarts[userId] || [];
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = totalPrice >= 500000 ? 0 : 30000;
  return {
    success: true,
    data: {
      id: "cart-" + userId,
      userId,
      items,
      totals: {
        totalPrice,
        shippingFee,
        grandTotal: totalPrice + shippingFee,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      },
      updatedAt: new Date().toISOString(),
    },
  };
}

export function addToCart(userId: string, productId: string, quantity: number) {
  if (!userCarts[userId]) userCarts[userId] = [];
  const product = products.find((p) => p.id === productId);
  if (!product) throw new Error("Không tìm thấy sản phẩm");

  const existing = userCarts[userId].find(
    (item) => item.productId === productId
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    userCarts[userId].push({
      id: "cart-item-" + Date.now(),
      productId,
      product,
      quantity,
      addedAt: new Date().toISOString(),
    });
  }

  return getCart(userId);
}

export function updateCartItem(
  userId: string,
  productId: string,
  quantity: number
) {
  if (!userCarts[userId]) userCarts[userId] = [];
  const item = userCarts[userId].find(
    (item) => item.productId === productId
  );
  if (item) item.quantity = quantity;
  return getCart(userId);
}

export function removeFromCart(userId: string, productId: string) {
  if (userCarts[userId]) {
    userCarts[userId] = userCarts[userId].filter(
      (item) => item.productId !== productId
    );
  }
  return getCart(userId);
}

export function clearCart(userId: string) {
  userCarts[userId] = [];
  return getCart(userId);
}

// ============ ORDER HELPERS ============
interface OrderData {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  shippingFee: number;
  grandTotal: number;
  shippingAddress: Record<string, string>;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

const userOrders: Record<string, OrderData[]> = {};

export function createOrder(
  userId: string,
  data: {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: Record<string, string>;
    paymentMethod: string;
    note?: string;
  }
) {
  if (!userOrders[userId]) userOrders[userId] = [];

  const orderItems = data.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      productName: product?.name || "Sản phẩm",
      productImage: product?.images?.[0] || "",
      price: product?.price || 0,
      quantity: item.quantity,
    };
  });

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = total >= 500000 ? 0 : 30000;

  const order: OrderData = {
    id: "order-" + Date.now(),
    userId,
    items: orderItems,
    total,
    shippingFee,
    grandTotal: total + shippingFee,
    shippingAddress: data.shippingAddress,
    paymentMethod: data.paymentMethod,
    paymentStatus: "pending",
    status: "pending",
    note: data.note,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  userOrders[userId].push(order);

  // Clear cart after order
  clearCart(userId);

  return { success: true, data: order };
}

export function getMyOrders(userId: string) {
  return { success: true, data: userOrders[userId] || [] };
}

export function getOrderById(userId: string, orderId: string) {
  const orders = userOrders[userId] || [];
  const order = orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Không tìm thấy đơn hàng");
  return { success: true, data: order };
}

export function cancelOrder(userId: string, orderId: string) {
  const orders = userOrders[userId] || [];
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();
  }
  return { success: true, data: order };
}
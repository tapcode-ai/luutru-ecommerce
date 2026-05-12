import { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_JSON_SERVER_URL || "http://localhost:3001";

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, token } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Có lỗi xảy ra");
  }

  return data;
}

// ============ AUTH API ============
export const authApi = {
  login: (email: string, password: string) =>
    request<ApiResponse<AuthResponse>>("/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  register: (data: { email: string; password: string; fullName: string; phone: string }) =>
    request<ApiResponse<AuthResponse>>("/auth/register", {
      method: "POST",
      body: data,
    }),

  getProfile: (token: string) =>
    request<ApiResponse<UserProfile>>("/auth/profile", { token }),

  updateProfile: (token: string, data: { fullName?: string; phone?: string; avatar?: string }) =>
    request<ApiResponse<UserProfile>>("/auth/profile", {
      method: "PUT",
      body: data,
      token,
    }),

  addAddress: (token: string, data: AddressInput) =>
    request<ApiResponse<Address>>("/auth/addresses", {
      method: "POST",
      body: data,
      token,
    }),

  updateAddress: (token: string, addressId: string, data: Partial<AddressInput>) =>
    request<ApiResponse<Address>>(`/auth/addresses/${addressId}`, {
      method: "PUT",
      body: data,
      token,
    }),

  deleteAddress: (token: string, addressId: string) =>
    request<ApiResponse<null>>(`/auth/addresses/${addressId}`, {
      method: "DELETE",
      token,
    }),
};

// ============ PRODUCTS API ============
export const productsApi = {
  getAll: async (params?: ProductFilterParams) => {
    // Fetch all products from json-server
    const products: Product[] = await request<Product[]>("/products");
    
    // Apply filters client-side
    let filtered = [...products];

    if (params) {
      // Search by name
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower) ||
          p.tags?.some(t => t.toLowerCase().includes(searchLower))
        );
      }

      // Filter by category
      if (params.category) {
        filtered = filtered.filter(p => p.categoryId === params.category);
      }

      // Filter by price range
      if (params.minPrice !== undefined) {
        filtered = filtered.filter(p => p.price >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        filtered = filtered.filter(p => p.price <= params.maxPrice!);
      }

      // Filter by minimum rating
      if (params.minRating !== undefined) {
        filtered = filtered.filter(p => p.rating >= params.minRating!);
      }

      // Filter in stock
      if (params.inStock) {
        filtered = filtered.filter(p => p.stock > 0);
      }

      // Sorting
      if (params.sortBy) {
        switch (params.sortBy) {
          case "price_asc":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "price_desc":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "newest":
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

    // Pagination
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
    } as PaginatedResponse<Product>;
  },

  getBySlug: async (slug: string) => {
    const products: Product[] = await request<Product[]>("/products");
    const product = products.find(p => p.slug === slug);
    if (!product) throw new Error("Không tìm thấy sản phẩm");
    return { success: true, data: product } as ApiResponse<Product>;
  },

  getById: async (id: string) => {
    const product = await request<Product>(`/products/${id}`);
    return { success: true, data: product } as ApiResponse<Product>;
  },

  getFeatured: async () => {
    const products: Product[] = await request<Product[]>("/products");
    const featured = products.filter(p => p.featured);
    return { success: true, data: featured } as ApiResponse<Product[]>;
  },

  getFlashSales: async () => {
    const products: Product[] = await request<Product[]>("/products");
    const flashSales = products.filter(p => p.isFlashSale);
    return { success: true, data: flashSales } as ApiResponse<Product[]>;
  },

  getNewArrivals: async () => {
    const products: Product[] = await request<Product[]>("/products");
    const sorted = [...products].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return { success: true, data: sorted.slice(0, 10) } as ApiResponse<Product[]>;
  },

  getByCategory: async (slug: string) => {
    const products: Product[] = await request<Product[]>("/products");
    const filtered = products.filter(p => p.categoryId === slug);
    return { success: true, data: filtered } as ApiResponse<Product[]>;
  },

  getRelated: async (id: string, limit?: number) => {
    const products: Product[] = await request<Product[]>("/products");
    const current = products.find(p => p.id === id);
    if (!current) return { success: true, data: [] } as ApiResponse<Product[]>;
    const related = products.filter(
      p => p.categoryId === current.categoryId && p.id !== id
    );
    return {
      success: true,
      data: related.slice(0, limit || 8),
    } as ApiResponse<Product[]>;
  },

  getCategories: async () => {
    const categories = await request<Category[]>("/categories");
    const products: Product[] = await request<Product[]>("/products");
    const result = categories.map(cat => ({
      name: cat.name,
      slug: cat.slug,
      count: products.filter(p => p.categoryId === cat.id).length,
    }));
    return { success: true, data: result } as ApiResponse<Category[]>;
  },

  getShippingInfo: (total: number) =>
    Promise.resolve({
      success: true,
      data: {
        shippingFee: total >= 500000 ? 0 : 30000,
        freeShipThreshold: 500000,
        isFreeShip: total >= 500000,
        remainingForFree: total >= 500000 ? 0 : 500000 - total,
      },
    } as ApiResponse<ShippingInfo>),
};

// ============ CART API ============
export const cartApi = {
  getCart: (token: string) =>
    request<ApiResponse<CartResponse>>("/cart", { token }),

  addItem: (token: string, productId: string, quantity: number) =>
    request<ApiResponse<CartResponse>>("/cart/items", {
      method: "POST",
      body: { productId, quantity },
      token,
    }),

  updateItem: (token: string, productId: string, quantity: number) =>
    request<ApiResponse<CartResponse>>(`/cart/items/${productId}`, {
      method: "PUT",
      body: { quantity },
      token,
    }),

  removeItem: (token: string, productId: string) =>
    request<ApiResponse<CartResponse>>(`/cart/items/${productId}`, {
      method: "DELETE",
      token,
    }),

  clearCart: (token: string) =>
    request<ApiResponse<Cart>>("/cart", {
      method: "DELETE",
      token,
    }),
};

// ============ ORDERS API ============
export const ordersApi = {
  create: (token: string, data: CreateOrderInput) =>
    request<ApiResponse<Order>>("/orders", {
      method: "POST",
      body: data,
      token,
    }),

  getMyOrders: (token: string) =>
    request<ApiResponse<Order[]>>("/orders/my-orders", { token }),

  getById: (token: string, id: string) =>
    request<ApiResponse<Order>>(`/orders/${id}`, { token }),

  cancel: (token: string, id: string) =>
    request<ApiResponse<Order>>(`/orders/${id}/cancel`, {
      method: "PUT",
      token,
    }),
};

// ============ TYPES ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatar?: string;
  role: "user" | "seller" | "admin";
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export interface AddressInput {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault?: boolean;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface CartResponse extends Cart {
  totals: {
    totalPrice: number;
    shippingFee: number;
    grandTotal: number;
    itemCount: number;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  shippingFee: number;
  grandTotal: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    note?: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface CreateOrderInput {
  items: { productId: string; quantity: number }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    note?: string;
  };
  paymentMethod: string;
  note?: string;
}

export interface ProductFilterParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "best_seller" | "rating";
  page?: number;
  limit?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface ShippingInfo {
  shippingFee: number;
  freeShipThreshold: number;
  isFreeShip: boolean;
  remainingForFree: number;
}
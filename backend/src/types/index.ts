// ============ PRODUCT TYPES ============
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  categorySlug: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  flashSaleEnd?: string;
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  categorySlug: string;
  brand?: string;
  stock: number;
  specifications?: Record<string, string>;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSalePrice?: number;
  flashSaleEnd?: string;
}

// ============ USER TYPES ============
export interface User {
  id: string;
  email: string;
  password: string;
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

export interface RegisterDTO {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

// ============ CART TYPES ============
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface AddToCartDTO {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDTO {
  quantity: number;
}

// ============ ORDER TYPES ============
export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "bank" | "momo" | "vnpay";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
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
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDTO {
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
  paymentMethod: PaymentMethod;
  note?: string;
}

// ============ API RESPONSE TYPES ============
export interface ApiResponse<T = unknown> {
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

// ============ SEARCH/FILTER TYPES ============
export interface ProductFilter {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "best_seller" | "rating";
  page?: number;
  limit?: number;
}

// ============ JWT PAYLOAD ============
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}
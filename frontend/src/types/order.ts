export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  note: string;
}

export type PaymentMethod = "cod" | "momo" | "vnpay" | "bank";
export type OrderStatus = "pending" | "packing" | "shipping" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  totalSavings: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  note?: string;
}
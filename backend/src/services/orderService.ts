import { v4 as uuidv4 } from "uuid";
import { Order, CreateOrderDTO, OrderStatus, PaymentStatus } from "../types";
import { mockOrders } from "./mockData";
import { productService } from "./productService";

let orders: Order[] = [...mockOrders];

const FREE_SHIP_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

export const orderService = {
  create(userId: string, dto: CreateOrderDTO): Order {
    // Validate products and calculate total
    let totalPrice = 0;
    const orderItems = dto.items.map((item) => {
      const product = productService.getById(item.productId);
      if (!product) {
        throw new Error(`Sản phẩm ${item.productId} không tồn tại`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Sản phẩm ${product.name} không đủ số lượng`);
      }
      totalPrice += product.price * item.quantity;
      return {
        productId: product.id,
        productName: product.name,
        productImage: product.images[0],
        price: product.price,
        quantity: item.quantity,
      };
    });

    const shippingFee = totalPrice >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;

    const order: Order = {
      id: `order-${uuidv4().slice(0, 8)}`,
      userId,
      items: orderItems,
      totalPrice,
      shippingFee,
      grandTotal: totalPrice + shippingFee,
      shippingAddress: dto.shippingAddress,
      paymentMethod: dto.paymentMethod,
      paymentStatus: dto.paymentMethod === "cod" ? "pending" : "pending",
      status: "pending",
      note: dto.note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(order);
    return order;
  },

  getById(id: string): Order | undefined {
    return orders.find((o) => o.id === id);
  },

  getByUser(userId: string): Order[] {
    return orders
      .filter((o) => o.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getAll(): Order[] {
    return [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  updateStatus(id: string, status: OrderStatus): Order | null {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    orders[index] = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    return orders[index];
  },

  updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Order | null {
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    orders[index] = {
      ...orders[index],
      paymentStatus,
      updatedAt: new Date().toISOString(),
    };

    return orders[index];
  },

  cancel(id: string, userId: string): Order | null {
    const order = orders.find((o) => o.id === id && o.userId === userId);
    if (!order) return null;

    if (order.status !== "pending" && order.status !== "confirmed") {
      throw new Error("Không thể hủy đơn hàng đang giao");
    }

    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();
    return order;
  },

  getStats() {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "pending").length;
    const confirmed = orders.filter((o) => o.status === "confirmed").length;
    const shipping = orders.filter((o) => o.status === "shipping").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const revenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.grandTotal, 0);

    return {
      total,
      pending,
      confirmed,
      shipping,
      delivered,
      cancelled,
      revenue,
    };
  },
};
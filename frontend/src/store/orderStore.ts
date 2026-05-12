import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderItem, ShippingAddress, PaymentMethod, OrderStatus } from '@/types/order';
import { CartItem } from '@/types/product';
import { useSellerStore } from './sellerStore';
import { useUserStore } from './userStore';

const FREE_SHIP_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;
const API_URL = "http://localhost:3001";

function generateOrderId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LUUTRU';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function calculateShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
}

interface OrderStore {
  orders: Order[];
  loading: boolean;
  createOrder: (params: {
    cartItems: CartItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  fetchOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,

      createOrder: async ({ cartItems, shippingAddress, paymentMethod }) => {
        const subtotal = cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        const totalSavings = cartItems.reduce((sum, item) => {
          const old = item.product.oldPrice || item.product.price;
          return sum + (old - item.product.price) * item.quantity;
        }, 0);
        const shippingFee = calculateShippingFee(subtotal);
        const total = subtotal + shippingFee;

        const items: OrderItem[] = cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.images[0],
          price: item.product.price,
          quantity: item.quantity,
        }));

        const user = useUserStore.getState().user;
        const orderId = generateOrderId();

        const newOrder: Order = {
          id: orderId,
          items,
          shippingAddress,
          paymentMethod,
          status: "pending",
          subtotal,
          shippingFee,
          totalSavings,
          total,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Lưu vào json-server
        try {
          const orderPayload = {
            id: orderId,
            userId: user?.id || "guest",
            items: items.map(item => ({
              productId: item.productId,
              name: item.productName,
              price: item.price,
              quantity: item.quantity,
              image: item.productImage,
            })),
            totalAmount: total,
            shippingAddress: `${shippingAddress.address}, ${shippingAddress.ward}, ${shippingAddress.district}, ${shippingAddress.city}`,
            phone: shippingAddress.phone,
            paymentMethod,
            status: "pending",
            note: shippingAddress.note || "",
            createdAt: newOrder.createdAt,
            updatedAt: newOrder.updatedAt,
          };

          await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload),
          });
        } catch (err) {
          console.error("Failed to save order to server:", err);
        }

        // Tự động giảm tồn kho trong sellerStore
        const sellerStore = useSellerStore.getState();
        cartItems.forEach((cartItem) => {
          const sellerProduct = sellerStore.products.find(
            (p) => p.name === cartItem.product.name
          );
          if (sellerProduct) {
            const newStock = sellerProduct.stock - cartItem.quantity;
            const newStatus = newStock <= 0 ? 'out_of_stock' : sellerProduct.status;
            sellerStore.updateProduct(sellerProduct.id, {
              stock: Math.max(0, newStock),
              sales: sellerProduct.sales + cartItem.quantity,
              status: newStatus,
            });
          }
        });

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId: string, status: OrderStatus) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          ),
        }));
      },

      cancelOrder: async (orderId: string) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (order) {
          const sellerStore = useSellerStore.getState();
          order.items.forEach((item) => {
            const sellerProduct = sellerStore.products.find(
              (p) => p.name === item.productName
            );
            if (sellerProduct) {
              const newStock = sellerProduct.stock + item.quantity;
              const newStatus = newStock > 0 ? 'active' : sellerProduct.status;
              sellerStore.updateProduct(sellerProduct.id, {
                stock: newStock,
                sales: Math.max(0, sellerProduct.sales - item.quantity),
                status: newStatus,
              });
            }
          });

          // Đồng bộ lên json-server
          try {
            await fetch(`${API_URL}/orders/${orderId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                status: "cancelled",
                updatedAt: new Date().toISOString(),
              }),
            });
          } catch (err) {
            console.error("Failed to sync cancel order to server:", err);
          }
        }

        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status: "cancelled" as OrderStatus, updatedAt: new Date().toISOString() }
              : order
          ),
        }));
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((order) => order.id === orderId);
      },

      getOrdersByStatus: (status: OrderStatus) => {
        return get().orders.filter((order) => order.status === status);
      },

      fetchOrders: async () => {
        set({ loading: true });
        try {
          const user = useUserStore.getState().user;
          if (!user) return;
          const res = await fetch(`${API_URL}/orders?userId=${user.id}`);
          const serverOrders = await res.json();
          
          // Chuyển đổi từ format json-server sang format Order
          const convertedOrders: Order[] = serverOrders.map((o: any) => ({
            id: o.id,
            items: (o.items || []).map((item: any) => ({
              productId: item.productId,
              productName: item.name || item.productName,
              productImage: item.image || item.productImage,
              price: item.price,
              quantity: item.quantity,
            })),
            shippingAddress: {
              fullName: o.shippingAddress?.fullName || "",
              phone: o.phone || "",
              address: o.shippingAddress?.address || o.shippingAddress || "",
              city: o.shippingAddress?.city || "Hồ Chí Minh",
              district: o.shippingAddress?.district || "",
              ward: o.shippingAddress?.ward || "",
              note: o.note || "",
            },
            paymentMethod: o.paymentMethod || "cod",
            status: o.status || "pending",
            subtotal: o.totalAmount || o.total || 0,
            shippingFee: o.shippingFee || 0,
            totalSavings: o.totalSavings || 0,
            total: o.totalAmount || o.total || 0,
            createdAt: o.createdAt,
            updatedAt: o.updatedAt,
          }));

          set({ orders: convertedOrders, loading: false });
        } catch (err) {
          console.error("Failed to fetch orders:", err);
          set({ loading: false });
        }
      },
    }),
    {
      name: 'luutru-orders',
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);
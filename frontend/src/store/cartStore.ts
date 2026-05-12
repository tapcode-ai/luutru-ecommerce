import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/product';
import { cartApi } from '@/lib/api';
import { useUserStore } from './userStore';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  totalPrice: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  setOpen: (open: boolean) => void;
  getTotal: () => number;
  getItemCount: () => number;
  syncFromServer: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalPrice: 0,
      itemCount: 0,
      loading: false,
      error: null,

      syncFromServer: async () => {
        const token = useUserStore.getState().token;
        if (!token) return;

        try {
          set({ loading: true });
          const response = await cartApi.getCart(token);
          const data = response.data;
          if (data) {
            const items = data.items.map((item: any) => ({
              id: item.id,
              productId: item.productId,
              product: item.product,
              quantity: item.quantity,
              userId: data.userId,
            }));
            const totalPrice = items.reduce(
              (total: number, item: CartItem) => total + item.product.price * item.quantity,
              0
            );
            const itemCount = items.reduce(
              (count: number, item: CartItem) => count + item.quantity,
              0
            );
            set({ items, totalPrice, itemCount, loading: false });
          }
        } catch (error) {
          console.error('Failed to sync cart from server:', error);
          set({ loading: false });
        }
      },

      addItem: async (product: Product, quantity = 1) => {
        const token = useUserStore.getState().token;

        if (token) {
          try {
            set({ loading: true });
            await cartApi.addItem(token, product.id, quantity);
            await get().syncFromServer();
            return;
          } catch (error) {
            console.error('Failed to add item to server cart:', error);
          }
        }

        // Fallback to local cart
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id
          );
          let newItems: CartItem[];
          if (existingItem) {
            newItems = state.items.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            newItems = [
              ...state.items,
              {
                id: `cart-${Date.now()}`,
                productId: product.id,
                product,
                quantity,
                userId: 'guest',
              },
            ];
          }
          const totalPrice = newItems.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          );
          const itemCount = newItems.reduce(
            (count, item) => count + item.quantity,
            0
          );
          return { items: newItems, totalPrice, itemCount, loading: false };
        });
      },

      removeItem: async (productId: string) => {
        const token = useUserStore.getState().token;

        if (token) {
          try {
            set({ loading: true });
            await cartApi.removeItem(token, productId);
            await get().syncFromServer();
            return;
          } catch (error) {
            console.error('Failed to remove item from server cart:', error);
          }
        }

        set((state) => {
          const newItems = state.items.filter((item) => item.productId !== productId);
          const totalPrice = newItems.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          );
          const itemCount = newItems.reduce(
            (count, item) => count + item.quantity,
            0
          );
          return { items: newItems, totalPrice, itemCount, loading: false };
        });
      },

      updateQuantity: async (productId: string, quantity: number) => {
        if (quantity <= 0) {
          await get().removeItem(productId);
          return;
        }

        const token = useUserStore.getState().token;

        if (token) {
          try {
            set({ loading: true });
            await cartApi.updateItem(token, productId, quantity);
            await get().syncFromServer();
            return;
          } catch (error) {
            console.error('Failed to update item in server cart:', error);
          }
        }

        set((state) => {
          const newItems = state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );
          const totalPrice = newItems.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
          );
          const itemCount = newItems.reduce(
            (count, item) => count + item.quantity,
            0
          );
          return { items: newItems, totalPrice, itemCount, loading: false };
        });
      },

      clearCart: async () => {
        const token = useUserStore.getState().token;

        if (token) {
          try {
            set({ loading: true });
            await cartApi.clearCart(token);
          } catch (error) {
            console.error('Failed to clear server cart:', error);
          }
        }

        set({ items: [], totalPrice: 0, itemCount: 0, loading: false });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open: boolean) => set({ isOpen: open }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'luutru-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
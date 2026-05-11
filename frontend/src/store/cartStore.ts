import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types/product';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  totalPrice: number;
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setOpen: (open: boolean) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      totalPrice: 0,
      itemCount: 0,

      addItem: (product: Product, quantity = 1) => {
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
          return { items: newItems, totalPrice, itemCount };
        });
      },

      removeItem: (productId: string) => {
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
          return { items: newItems, totalPrice, itemCount };
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
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
          return { items: newItems, totalPrice, itemCount };
        });
      },

      clearCart: () => set({ items: [], totalPrice: 0, itemCount: 0 }),
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

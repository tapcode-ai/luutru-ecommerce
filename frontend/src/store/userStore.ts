import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';
import { Product } from '@/types/product';

interface UserStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  wishlist: string[];
  wishlistProducts: Product[];
  setUser: (user: User | null, token?: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  toggleWishlist: (productId: string) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      wishlist: [],
      wishlistProducts: [],

      setUser: (user: User | null, token?: string | null) => {
        set({
          user,
          token: token !== undefined ? token : get().token,
          isAuthenticated: !!user,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          wishlist: [],
          wishlistProducts: [],
        });
      },

      toggleWishlist: (productId: string) => {
        const { wishlist } = get();
        if (wishlist.includes(productId)) {
          set({
            wishlist: wishlist.filter((id) => id !== productId),
            wishlistProducts: get().wishlistProducts.filter((p) => p.id !== productId),
          });
        } else {
          set({ wishlist: [...wishlist, productId] });
        }
      },

      addToWishlist: (product: Product) => {
        const { wishlist, wishlistProducts } = get();
        if (!wishlist.includes(product.id)) {
          set({
            wishlist: [...wishlist, product.id],
            wishlistProducts: [...wishlistProducts, product],
          });
        }
      },

      removeFromWishlist: (productId: string) => {
        const { wishlist, wishlistProducts } = get();
        set({
          wishlist: wishlist.filter((id) => id !== productId),
          wishlistProducts: wishlistProducts.filter((p) => p.id !== productId),
        });
      },

      isInWishlist: (productId: string) => {
        return get().wishlist.includes(productId);
      },
    }),
    {
      name: 'luutru-user',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        wishlist: state.wishlist,
        wishlistProducts: state.wishlistProducts,
      }),
    }
  )
);
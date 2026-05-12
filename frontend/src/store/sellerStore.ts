import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

export interface SellerProduct {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
  description: string;
  images: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  sales: number;
  rating: number;
  reviewCount: number;
}

function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'SP';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface SellerStore {
  products: SellerProduct[];
  addProduct: (product: Omit<SellerProduct, 'id' | 'createdAt' | 'updatedAt' | 'sales' | 'rating' | 'reviewCount'>) => SellerProduct;
  updateProduct: (id: string, updates: Partial<SellerProduct>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => SellerProduct | undefined;
  getTotalSales: () => number;
  getTotalRevenue: () => number;
  getActiveProducts: () => number;
  getOutOfStockProducts: () => number;
}

export const useSellerStore = create<SellerStore>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (productData) => {
        const newProduct: SellerProduct = {
          ...productData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sales: 0,
          rating: 0,
          reviewCount: 0,
        };

        set((state) => ({
          products: [newProduct, ...state.products],
        }));

        return newProduct;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      getProductById: (id) => {
        return get().products.find((p) => p.id === id);
      },

      getTotalSales: () => {
        return get().products.reduce((sum, p) => sum + p.sales, 0);
      },

      getTotalRevenue: () => {
        return get().products.reduce((sum, p) => sum + p.sales * p.price, 0);
      },

      getActiveProducts: () => {
        return get().products.filter((p) => p.status === 'active').length;
      },

      getOutOfStockProducts: () => {
        return get().products.filter((p) => p.status === 'out_of_stock').length;
      },
    }),
    {
      name: 'luutru-seller',
    }
  )
);
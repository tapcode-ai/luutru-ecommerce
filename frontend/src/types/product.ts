export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  images: string[];
  rating: number;
  soldCount: number;
  stock: number;
  featured: boolean;
  isFlashSale: boolean;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  products?: Product[];
}

export interface ProductSection {
  id: string;
  title: string;
  subtitle?: string;
  type: 'flash-sale' | 'trending' | 'recommended' | 'best-deals' | 'category';
  products: Product[];
  link?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  userId: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  userId: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

import { v4 as uuidv4 } from "uuid";
import { Product, CreateProductDTO, UpdateProductDTO, ProductFilter, PaginatedResponse } from "../types";
import { mockProducts } from "./mockData";

// In-memory database
let products: Product[] = [...mockProducts];

const FREE_SHIP_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

export const productService = {
  getAll(filter: ProductFilter): PaginatedResponse<Product> {
    let filtered = [...products];

    // Search
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filter.category) {
      filtered = filtered.filter(
        (p) =>
          p.categorySlug === filter.category ||
          p.category.toLowerCase() === filter.category?.toLowerCase()
      );
    }

    // Price range
    if (filter.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filter.minPrice!);
    }
    if (filter.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filter.maxPrice!);
    }

    // In stock
    if (filter.inStock) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    // Sorting
    switch (filter.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "best_seller":
        filtered.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default: featured first, then newest
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
    }

    // Pagination
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  getById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
  },

  getBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug);
  },

  getFeatured(): Product[] {
    return products.filter((p) => p.isFeatured).slice(0, 8);
  },

  getFlashSales(): Product[] {
    return products.filter(
      (p) => p.isFlashSale && p.flashSaleEnd && new Date(p.flashSaleEnd) > new Date()
    );
  },

  getNewArrivals(): Product[] {
    return products
      .filter((p) => p.isNew)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 8);
  },

  getByCategory(categorySlug: string): Product[] {
    return products.filter((p) => p.categorySlug === categorySlug);
  },

  getRelated(productId: string, limit: number = 4): Product[] {
    const product = products.find((p) => p.id === productId);
    if (!product) return [];
    return products
      .filter(
        (p) =>
          p.id !== productId && p.categorySlug === product.categorySlug
      )
      .slice(0, limit);
  },

  create(dto: CreateProductDTO): Product {
    const now = new Date().toISOString();
    const slug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const product: Product = {
      id: `prod-${uuidv4().slice(0, 8)}`,
      name: dto.name,
      slug: `${slug}-${Date.now()}`,
      description: dto.description,
      price: dto.price,
      oldPrice: dto.oldPrice,
      discount: dto.oldPrice
        ? Math.round(((dto.oldPrice - dto.price) / dto.oldPrice) * 100)
        : undefined,
      images: dto.images,
      category: dto.category,
      categorySlug: dto.categorySlug,
      brand: dto.brand,
      rating: 0,
      reviewCount: 0,
      soldCount: 0,
      stock: dto.stock,
      isNew: true,
      isFeatured: false,
      specifications: dto.specifications,
      createdAt: now,
      updatedAt: now,
    };

    products.unshift(product);
    return product;
  },

  update(id: string, dto: UpdateProductDTO): Product | null {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const updated = {
      ...products[index],
      ...dto,
      discount: dto.oldPrice
        ? Math.round(((dto.oldPrice - (dto.price || products[index].price)) / dto.oldPrice) * 100)
        : products[index].discount,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updated;
    return updated;
  },

  delete(id: string): boolean {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },

  getCategories() {
    const cats = new Map<string, { name: string; slug: string; count: number }>();
    products.forEach((p) => {
      const existing = cats.get(p.categorySlug);
      if (existing) {
        existing.count++;
      } else {
        cats.set(p.categorySlug, {
          name: p.category,
          slug: p.categorySlug,
          count: 1,
        });
      }
    });
    return Array.from(cats.values());
  },

  getShippingFee(totalPrice: number): number {
    return totalPrice >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
  },

  getFreeShipThreshold(): number {
    return FREE_SHIP_THRESHOLD;
  },
};
import { Request, Response } from "express";
import { productService } from "../services/productService";
import { ApiResponse, ProductFilter } from "../types";

export const productController = {
  getAll(req: Request, res: Response<ApiResponse>) {
    try {
      const filter: ProductFilter = {
        search: req.query.search as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        inStock: req.query.inStock === "true",
        sortBy: req.query.sortBy as ProductFilter["sortBy"],
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
      };

      const result = productService.getAll(filter);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy danh sách sản phẩm",
      });
    }
  },

  getById(req: Request, res: Response<ApiResponse>) {
    try {
      const product = productService.getById(req.params.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy sản phẩm",
        });
      }
      return res.json({ success: true, data: product });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy thông tin sản phẩm",
      });
    }
  },

  getBySlug(req: Request, res: Response<ApiResponse>) {
    try {
      const product = productService.getBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy sản phẩm",
        });
      }
      return res.json({ success: true, data: product });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy thông tin sản phẩm",
      });
    }
  },

  getFeatured(req: Request, res: Response<ApiResponse>) {
    try {
      const products = productService.getFeatured();
      return res.json({ success: true, data: products });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy sản phẩm nổi bật",
      });
    }
  },

  getFlashSales(req: Request, res: Response<ApiResponse>) {
    try {
      const products = productService.getFlashSales();
      return res.json({ success: true, data: products });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy sản phẩm flash sale",
      });
    }
  },

  getNewArrivals(req: Request, res: Response<ApiResponse>) {
    try {
      const products = productService.getNewArrivals();
      return res.json({ success: true, data: products });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy sản phẩm mới",
      });
    }
  },

  getByCategory(req: Request, res: Response<ApiResponse>) {
    try {
      const products = productService.getByCategory(req.params.slug);
      return res.json({ success: true, data: products });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy sản phẩm theo danh mục",
      });
    }
  },

  getRelated(req: Request, res: Response<ApiResponse>) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 4;
      const products = productService.getRelated(req.params.id, limit);
      return res.json({ success: true, data: products });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy sản phẩm liên quan",
      });
    }
  },

  getCategories(req: Request, res: Response<ApiResponse>) {
    try {
      const categories = productService.getCategories();
      return res.json({ success: true, data: categories });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy danh mục",
      });
    }
  },

  create(req: Request, res: Response<ApiResponse>) {
    try {
      const product = productService.create(req.body);
      return res.status(201).json({
        success: true,
        data: product,
        message: "Thêm sản phẩm thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi thêm sản phẩm",
      });
    }
  },

  update(req: Request, res: Response<ApiResponse>) {
    try {
      const product = productService.update(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy sản phẩm",
        });
      }
      return res.json({
        success: true,
        data: product,
        message: "Cập nhật sản phẩm thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi cập nhật sản phẩm",
      });
    }
  },

  delete(req: Request, res: Response<ApiResponse>) {
    try {
      const deleted = productService.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy sản phẩm",
        });
      }
      return res.json({
        success: true,
        message: "Xóa sản phẩm thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi xóa sản phẩm",
      });
    }
  },

  getShippingInfo(req: Request, res: Response<ApiResponse>) {
    try {
      const totalPrice = req.query.total ? Number(req.query.total) : 0;
      const shippingFee = productService.getShippingFee(totalPrice);
      const freeShipThreshold = productService.getFreeShipThreshold();

      return res.json({
        success: true,
        data: {
          shippingFee,
          freeShipThreshold,
          isFreeShip: shippingFee === 0,
          remainingForFree: Math.max(0, freeShipThreshold - totalPrice),
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi tính phí vận chuyển",
      });
    }
  },
};
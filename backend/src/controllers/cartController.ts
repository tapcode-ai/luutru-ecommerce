import { Request, Response } from "express";
import { cartService } from "../services/cartService";
import { ApiResponse } from "../types";

export const cartController = {
  getCart(req: Request, res: Response<ApiResponse>) {
    try {
      const cart = cartService.getCart(req.user!.userId);
      const totals = cartService.getCartTotal(cart);
      return res.json({
        success: true,
        data: { ...cart, totals },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy giỏ hàng",
      });
    }
  },

  addItem(req: Request, res: Response<ApiResponse>) {
    try {
      const { productId, quantity } = req.body;

      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          error: "Thông tin sản phẩm không hợp lệ",
        });
      }

      const cart = cartService.addItem(req.user!.userId, {
        productId,
        quantity,
      });
      const totals = cartService.getCartTotal(cart);

      return res.json({
        success: true,
        data: { ...cart, totals },
        message: "Thêm vào giỏ hàng thành công",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || "Lỗi khi thêm vào giỏ hàng",
      });
    }
  },

  updateItem(req: Request, res: Response<ApiResponse>) {
    try {
      const { quantity } = req.body;
      const cart = cartService.updateItem(
        req.user!.userId,
        req.params.productId,
        { quantity }
      );
      const totals = cartService.getCartTotal(cart);

      return res.json({
        success: true,
        data: { ...cart, totals },
        message: "Cập nhật giỏ hàng thành công",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || "Lỗi khi cập nhật giỏ hàng",
      });
    }
  },

  removeItem(req: Request, res: Response<ApiResponse>) {
    try {
      const cart = cartService.removeItem(
        req.user!.userId,
        req.params.productId
      );
      const totals = cartService.getCartTotal(cart);

      return res.json({
        success: true,
        data: { ...cart, totals },
        message: "Xóa sản phẩm khỏi giỏ hàng thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi xóa sản phẩm khỏi giỏ hàng",
      });
    }
  },

  clearCart(req: Request, res: Response<ApiResponse>) {
    try {
      const cart = cartService.clearCart(req.user!.userId);
      return res.json({
        success: true,
        data: cart,
        message: "Đã xóa toàn bộ giỏ hàng",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi xóa giỏ hàng",
      });
    }
  },
};
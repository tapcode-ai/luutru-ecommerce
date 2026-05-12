import { Request, Response } from "express";
import { orderService } from "../services/orderService";
import { ApiResponse } from "../types";

export const orderController = {
  create(req: Request, res: Response<ApiResponse>) {
    try {
      const { items, shippingAddress, paymentMethod, note } = req.body;

      if (!items || !items.length) {
        return res.status(400).json({
          success: false,
          error: "Giỏ hàng trống",
        });
      }

      if (!shippingAddress || !paymentMethod) {
        return res.status(400).json({
          success: false,
          error: "Vui lòng điền đầy đủ thông tin giao hàng",
        });
      }

      const order = orderService.create(req.user!.userId, {
        items,
        shippingAddress,
        paymentMethod,
        note,
      });

      return res.status(201).json({
        success: true,
        data: order,
        message: "Đặt hàng thành công",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || "Đặt hàng thất bại",
      });
    }
  },

  getById(req: Request, res: Response<ApiResponse>) {
    try {
      const order = orderService.getById(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy đơn hàng",
        });
      }

      // Only allow owner or admin to view
      if (order.userId !== req.user!.userId && req.user!.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Bạn không có quyền xem đơn hàng này",
        });
      }

      return res.json({ success: true, data: order });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy thông tin đơn hàng",
      });
    }
  },

  getMyOrders(req: Request, res: Response<ApiResponse>) {
    try {
      const orders = orderService.getByUser(req.user!.userId);
      return res.json({ success: true, data: orders });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy danh sách đơn hàng",
      });
    }
  },

  getAll(req: Request, res: Response<ApiResponse>) {
    try {
      const orders = orderService.getAll();
      return res.json({ success: true, data: orders });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy danh sách đơn hàng",
      });
    }
  },

  cancel(req: Request, res: Response<ApiResponse>) {
    try {
      const order = orderService.cancel(req.params.id, req.user!.userId);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy đơn hàng hoặc không thể hủy",
        });
      }
      return res.json({
        success: true,
        data: order,
        message: "Hủy đơn hàng thành công",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || "Hủy đơn hàng thất bại",
      });
    }
  },

  updateStatus(req: Request, res: Response<ApiResponse>) {
    try {
      const { status } = req.body;
      const order = orderService.updateStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy đơn hàng",
        });
      }
      return res.json({
        success: true,
        data: order,
        message: "Cập nhật trạng thái đơn hàng thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi cập nhật trạng thái đơn hàng",
      });
    }
  },

  getStats(req: Request, res: Response<ApiResponse>) {
    try {
      const stats = orderService.getStats();
      return res.json({ success: true, data: stats });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy thống kê đơn hàng",
      });
    }
  },
};
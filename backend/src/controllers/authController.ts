import { Request, Response } from "express";
import { userService } from "../services/userService";
import { ApiResponse } from "../types";

export const authController = {
  register(req: Request, res: Response<ApiResponse>) {
    try {
      const { email, password, fullName, phone } = req.body;

      if (!email || !password || !fullName || !phone) {
        return res.status(400).json({
          success: false,
          error: "Vui lòng điền đầy đủ thông tin",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: "Mật khẩu phải có ít nhất 6 ký tự",
        });
      }

      const result = userService.register({ email, password, fullName, phone });
      return res.status(201).json({
        success: true,
        data: result,
        message: "Đăng ký thành công",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        error: error.message || "Đăng ký thất bại",
      });
    }
  },

  login(req: Request, res: Response<ApiResponse>) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Vui lòng nhập email và mật khẩu",
        });
      }

      const result = userService.login({ email, password });
      return res.json({
        success: true,
        data: result,
        message: "Đăng nhập thành công",
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        error: error.message || "Đăng nhập thất bại",
      });
    }
  },

  getProfile(req: Request, res: Response<ApiResponse>) {
    try {
      const user = userService.getById(req.user!.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy người dùng",
        });
      }
      return res.json({ success: true, data: user });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi lấy thông tin người dùng",
      });
    }
  },

  updateProfile(req: Request, res: Response<ApiResponse>) {
    try {
      const { fullName, phone, avatar } = req.body;
      const user = userService.updateProfile(req.user!.userId, {
        fullName,
        phone,
        avatar,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy người dùng",
        });
      }

      return res.json({
        success: true,
        data: user,
        message: "Cập nhật thông tin thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi cập nhật thông tin",
      });
    }
  },

  addAddress(req: Request, res: Response<ApiResponse>) {
    try {
      const address = userService.addAddress(req.user!.userId, req.body);
      if (!address) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy người dùng",
        });
      }
      return res.status(201).json({
        success: true,
        data: address,
        message: "Thêm địa chỉ thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi thêm địa chỉ",
      });
    }
  },

  updateAddress(req: Request, res: Response<ApiResponse>) {
    try {
      const address = userService.updateAddress(
        req.user!.userId,
        req.params.addressId,
        req.body
      );
      if (!address) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy địa chỉ",
        });
      }
      return res.json({
        success: true,
        data: address,
        message: "Cập nhật địa chỉ thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi cập nhật địa chỉ",
      });
    }
  },

  deleteAddress(req: Request, res: Response<ApiResponse>) {
    try {
      const deleted = userService.deleteAddress(
        req.user!.userId,
        req.params.addressId
      );
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: "Không tìm thấy địa chỉ",
        });
      }
      return res.json({
        success: true,
        message: "Xóa địa chỉ thành công",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Lỗi khi xóa địa chỉ",
      });
    }
  },
};
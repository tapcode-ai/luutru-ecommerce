import { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import { ApiResponse, JwtPayload } from "../types";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Vui lòng đăng nhập để tiếp tục",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = userService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: "Token không hợp lệ hoặc đã hết hạn",
    });
  }

  req.user = decoded;
  next();
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = userService.verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Vui lòng đăng nhập để tiếp tục",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Bạn không có quyền thực hiện hành động này",
      });
    }

    next();
  };
};
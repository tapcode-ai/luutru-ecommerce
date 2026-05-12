import { Router } from "express";
import { orderController } from "../controllers/orderController";
import { authMiddleware, requireRole } from "../middleware/auth";

const router = Router();

// Protected routes
router.post("/", authMiddleware, orderController.create);
router.get("/my-orders", authMiddleware, orderController.getMyOrders);
router.get("/stats", authMiddleware, requireRole("admin"), orderController.getStats);
router.get("/:id", authMiddleware, orderController.getById);
router.put("/:id/cancel", authMiddleware, orderController.cancel);

// Admin routes
router.get("/", authMiddleware, requireRole("admin"), orderController.getAll);
router.put("/:id/status", authMiddleware, requireRole("admin"), orderController.updateStatus);

export default router;
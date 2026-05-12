import { Router } from "express";
import { productController } from "../controllers/productController";
import { authMiddleware, requireRole } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", productController.getAll);
router.get("/featured", productController.getFeatured);
router.get("/flash-sales", productController.getFlashSales);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/categories", productController.getCategories);
router.get("/shipping-info", productController.getShippingInfo);
router.get("/category/:slug", productController.getByCategory);
router.get("/related/:id", productController.getRelated);
router.get("/slug/:slug", productController.getBySlug);
router.get("/:id", productController.getById);

// Admin/Seller routes
router.post("/", authMiddleware, requireRole("admin", "seller"), productController.create);
router.put("/:id", authMiddleware, requireRole("admin", "seller"), productController.update);
router.delete("/:id", authMiddleware, requireRole("admin"), productController.delete);

export default router;
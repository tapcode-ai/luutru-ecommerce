import { Router } from "express";
import { authController } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);
router.post("/addresses", authMiddleware, authController.addAddress);
router.put("/addresses/:addressId", authMiddleware, authController.updateAddress);
router.delete("/addresses/:addressId", authMiddleware, authController.deleteAddress);

export default router;
import { Router } from "express";
import { cartController } from "../controllers/cartController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.put("/items/:productId", cartController.updateItem);
router.delete("/items/:productId", cartController.removeItem);
router.delete("/", cartController.clearCart);

export default router;
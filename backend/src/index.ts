import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "https://luutru-shop-217.netlify.app"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    data: {
      status: "running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint không tồn tại",
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    error: "Lỗi máy chủ nội bộ",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Luutru API Server running on http://localhost:${PORT}`);
  console.log(`📦 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏓 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
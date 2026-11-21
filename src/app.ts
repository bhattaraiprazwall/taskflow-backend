import express from "express";
import helmet from "helmet";
import cors from "cors";
import { healthRoutes } from "./modules/health/health.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { taskRoutes } from "./modules/tasks/task.routes.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// API Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Centralized 404 and error handling
app.use(notFoundHandler);
app.use(errorHandler);

export { app };

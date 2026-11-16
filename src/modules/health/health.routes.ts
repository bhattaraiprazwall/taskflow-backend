import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API is running",
  });
});

router.get("/db", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: "Database is connected",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error instanceof Error ? error.message : error);
    res.status(503).json({
      success: false,
      message: "Database is unavailable",
      database: "disconnected",
    });
  }
});

export const healthRoutes = router;

import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  const isProduction = env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? "Internal server error" : (err.message || "An unexpected error occurred"),
    ...(isProduction ? {} : { stack: err.stack }),
  });
}

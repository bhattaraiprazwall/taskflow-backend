import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

export class HttpError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 500,
    public errors?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function errorHandler(
  err: Error | HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode =
    "statusCode" in err && typeof err.statusCode === "number"
      ? err.statusCode
      : res.statusCode >= 400
      ? res.statusCode
      : 500;

  const isProduction = env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? "Internal server error" : (err.message || "An unexpected error occurred"),
    ...("errors" in err && err.errors ? { errors: err.errors } : {}),
    ...(isProduction ? {} : { stack: err.stack }),
  });
}

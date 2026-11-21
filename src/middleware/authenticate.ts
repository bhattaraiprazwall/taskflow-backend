import type { Request, Response, NextFunction } from "express";
import { HttpError } from "./error-handler.js";
import { verifyAccessToken } from "../utils/token.js";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new HttpError("Authorization header is missing", 401));
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    return next(
      new HttpError(
        "Invalid authorization format. Format must be 'Bearer <token>'",
        401
      )
    );
  }

  const token = parts[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    next();
  } catch (_err) {
    // Never expose raw JWT errors or internal details to the client
    next(new HttpError("Invalid or expired token", 401));
  }
}

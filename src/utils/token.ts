import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateAccessToken(userId: string): string {
  return jwt.sign(
    { type: "access" },
    env.ACCESS_TOKEN_SECRET,
    {
      subject: userId,
      issuer: "taskflow-api",
      audience: "taskflow-app",
      expiresIn: env.ACCESS_TOKEN_TTL_SECONDS,
      algorithm: "HS256",
    }
  );
}

export function generateRefreshToken(): { rawToken: string; tokenHash: string } {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  return { rawToken, tokenHash };
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export interface AccessTokenPayload {
  sub: string;
  type: string;
  iss?: string;
  aud?: string;
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET, {
    algorithms: ["HS256"],
    issuer: "taskflow-api",
    audience: "taskflow-app",
  });

  if (typeof decoded === "string" || decoded.type !== "access" || !decoded.sub) {
    throw new Error("Invalid token claims");
  }

  return {
    sub: decoded.sub,
    type: decoded.type,
    iss: decoded.iss,
    aud: decoded.aud as string | undefined,
  };
}

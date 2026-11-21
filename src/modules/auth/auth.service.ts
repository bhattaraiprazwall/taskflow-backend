import argon2 from "argon2";
import * as authRepository from "./auth.repository.js";
import type {
  RegisterInput,
  LoginInput,
  RefreshInput,
  LogoutInput,
} from "./auth.schema.js";
import type { SafeUser } from "./auth.repository.js";
import { HttpError } from "../../middleware/error-handler.js";
import { Prisma } from "../../generated/prisma/client.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../../utils/token.js";
import { env } from "../../config/env.js";

export async function register(input: RegisterInput): Promise<SafeUser> {
  const existingUser = await authRepository.findUserByEmail(input.email);
  if (existingUser) {
    throw new HttpError("Email is already registered", 409);
  }

  const passwordHash = await argon2.hash(input.password, {
    type: argon2.argon2id,
  });

  try {
    return await authRepository.createUser({
      name: input.name,
      email: input.email,
      passwordHash,
    });
  } catch (error) {
    // Handle database unique-constraint race condition (e.g. concurrent registration with same email)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new HttpError("Email is already registered", 409);
    }
    throw error;
  }
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: SafeUser;
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const user = await authRepository.findUserWithPasswordByEmail(input.email);
  if (!user) {
    throw new HttpError("Invalid email or password", 401);
  }

  const isPasswordValid = await argon2.verify(user.passwordHash, input.password);
  if (!isPasswordValid) {
    throw new HttpError("Invalid email or password", 401);
  }

  const accessToken = generateAccessToken(user.id);
  const { rawToken, tokenHash } = generateRefreshToken();

  const expiresAt = new Date(
    Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
  );

  await authRepository.createRefreshSession({
    tokenHash,
    expiresAt,
    userId: user.id,
  });

  const { passwordHash: _, ...safeUser } = user;

  return {
    accessToken,
    refreshToken: rawToken,
    tokenType: "Bearer",
    expiresIn: env.ACCESS_TOKEN_TTL_SECONDS,
    user: safeUser,
  };
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export async function refresh(input: RefreshInput): Promise<RefreshResult> {
  const tokenHash = hashToken(input.refreshToken);
  const session = await authRepository.findRefreshSessionByTokenHash(tokenHash);

  if (!session) {
    throw new HttpError("Invalid or expired refresh token", 401);
  }

  const now = new Date();
  if (session.revokedAt !== null || session.expiresAt <= now) {
    throw new HttpError("Invalid or expired refresh token", 401);
  }

  const { rawToken, tokenHash: newRefreshTokenHash } = generateRefreshToken();
  const newExpiresAt = new Date(
    now.getTime() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
  );

  const rotated = await authRepository.rotateRefreshSession({
    sessionId: session.id,
    now,
    newSession: {
      tokenHash: newRefreshTokenHash,
      expiresAt: newExpiresAt,
      userId: session.userId,
    },
  });

  if (!rotated) {
    throw new HttpError("Invalid or expired refresh token", 401);
  }

  const accessToken = generateAccessToken(session.userId);

  return {
    accessToken,
    refreshToken: rawToken,
    tokenType: "Bearer",
    expiresIn: env.ACCESS_TOKEN_TTL_SECONDS,
  };
}

export async function getCurrentUser(userId: string): Promise<SafeUser> {
  const user = await authRepository.findUserById(userId);
  if (!user) {
    throw new HttpError("User not found or deactivated", 401);
  }
  return user;
}

export async function logout(input: LogoutInput): Promise<void> {
  const tokenHash = hashToken(input.refreshToken);
  await authRepository.revokeRefreshSessionByTokenHash(tokenHash);
}


import argon2 from "argon2";
import * as authRepository from "./auth.repository.js";
import type { RegisterInput } from "./auth.schema.js";
import type { SafeUser } from "./auth.repository.js";
import { HttpError } from "../../middleware/error-handler.js";
import { Prisma } from "../../generated/prisma/client.js";


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

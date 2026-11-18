import { prisma } from "../../lib/prisma.js";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<SafeUser> {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      emailVerifiedAt: true,
      createdAt: true,
    },
  });
}

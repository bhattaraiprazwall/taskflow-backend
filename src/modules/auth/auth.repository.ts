import { prisma } from "../../lib/prisma.js";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}

export interface UserWithPassword extends SafeUser {
  passwordHash: string;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
}

export async function findUserById(id: string): Promise<SafeUser | null> {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerifiedAt: true,
      createdAt: true,
    },
  });
}

export async function findUserWithPasswordByEmail(
  email: string
): Promise<UserWithPassword | null> {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      passwordHash: true,
      emailVerifiedAt: true,
      createdAt: true,
    },
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

export async function createRefreshSession(data: {
  tokenHash: string;
  expiresAt: Date;
  userId: string;
}) {
  return prisma.refreshSession.create({
    data,
  });
}

export async function findRefreshSessionByTokenHash(tokenHash: string) {
  return prisma.refreshSession.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      expiresAt: true,
      revokedAt: true,
      userId: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          emailVerifiedAt: true,
          createdAt: true,
        },
      },
    },
  });
}

export async function rotateRefreshSession(params: {
  sessionId: string;
  now: Date;
  newSession: {
    tokenHash: string;
    expiresAt: Date;
    userId: string;
  };
}): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const result = await tx.refreshSession.updateMany({
      where: {
        id: params.sessionId,
        revokedAt: null,
        expiresAt: { gt: params.now },
      },
      data: {
        revokedAt: params.now,
        lastUsedAt: params.now,
      },
    });

    if (result.count !== 1) {
      return false;
    }

    await tx.refreshSession.create({
      data: params.newSession,
    });

    return true;
  });
}

export async function revokeRefreshSessionByTokenHash(
  tokenHash: string,
  revokedAt: Date = new Date()
): Promise<number> {
  const result = await prisma.refreshSession.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt,
    },
  });

  return result.count;
}


import { prisma } from "../../lib/prisma.js";
import type { TaskStatus, TaskPriority } from "../../generated/prisma/client.js";

export interface CreateTaskData {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt?: Date | null;
  userId: string;
}

const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
};

export async function createTask(data: CreateTaskData) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueAt: data.dueAt,
      userId: data.userId,
    },
    select: taskSelect,
  });
}

export async function findTasksByUserId(userId: string) {
  return prisma.task.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: taskSelect,
  });
}

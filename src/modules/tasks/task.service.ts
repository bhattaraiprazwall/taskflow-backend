import * as taskRepository from "./task.repository.js";
import type { CreateTaskInput } from "./task.schema.js";

export async function createTask(userId: string, input: CreateTaskInput) {
  const dueAt = input.dueAt ? new Date(input.dueAt) : null;
  const description = input.description ? input.description.trim() : null;

  return taskRepository.createTask({
    title: input.title,
    description: description || null,
    status: input.status,
    priority: input.priority,
    dueAt,
    userId,
  });
}

export async function listTasks(userId: string) {
  return taskRepository.findTasksByUserId(userId);
}

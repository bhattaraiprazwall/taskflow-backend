import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.code === "invalid_type"
          ? "Title is required and must be a string"
          : "Invalid title",
    })
    .trim()
    .min(1, "Title is required")
    .max(160, "Title must not exceed 160 characters"),
  description: z
    .string()
    .trim()
    .max(5000, "Description must not exceed 5000 characters")
    .optional()
    .nullable(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "COMPLETED"])
    .optional()
    .default("TODO"),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional()
    .default("MEDIUM"),
  dueAt: z
    .string()
    .datetime({ message: "dueAt must be a valid ISO 8601 datetime string" })
    .optional()
    .nullable(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

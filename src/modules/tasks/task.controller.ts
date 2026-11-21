import type { Request, Response, NextFunction } from "express";
import * as taskService from "./task.service.js";
import { HttpError } from "../../middleware/error-handler.js";

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.id) {
      throw new HttpError("Unauthorized", 401);
    }

    const task = await taskService.createTask(req.user.id, req.body);
    res.status(201).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
}

export async function listTasks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.id) {
      throw new HttpError("Unauthorized", 401);
    }

    const tasks = await taskService.listTasks(req.user.id);
    res.status(200).json({
      success: true,
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
}

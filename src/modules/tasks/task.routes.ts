import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { createTaskSchema } from "./task.schema.js";
import * as taskController from "./task.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  validateBody(createTaskSchema),
  taskController.createTask
);
router.get("/", authenticate, taskController.listTasks);

export const taskRoutes = router;

import { Router } from "express";
import { validateBody } from "../../middleware/validate.js";
import { registerSchema } from "./auth.schema.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);

export const authRoutes = router;

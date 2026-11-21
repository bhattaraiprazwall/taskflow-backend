import { Router } from "express";
import { validateBody } from "../../middleware/validate.js";
import { authenticate } from "../../middleware/authenticate.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
} from "./auth.schema.js";
import * as authController from "./auth.controller.js";

const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.post("/refresh", validateBody(refreshSchema), authController.refresh);
router.post("/logout", validateBody(logoutSchema), authController.logout);
router.get("/me", authenticate, authController.getMe);

export const authRoutes = router;

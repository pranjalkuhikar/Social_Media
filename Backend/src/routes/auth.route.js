import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import {
  validate,
  registerSchema,
  loginSchema,
} from "../middlewares/validateUser.js";
const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/logout", logout);

export default router;

import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { adminLogin } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);   // 🔥 ALL ROLES
router.post("/admin/login", adminLogin);
export default router;

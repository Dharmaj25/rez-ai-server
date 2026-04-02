import express from "express";

import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.get("/me", authenticate, authController.getOnboardingDetails);
router.post("/send-otp", authenticate, authController.sendOtp);
router.post("/verify-otp", authenticate, authController.verifyOtp);

export default router;
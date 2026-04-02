import express from "express";
import { getOnboardingDetails, sendOtp, verifyOtp } from "../controllers/auth.controller.js";
import { sendOtpValidator, verifyOtpValidator } from "../validations/auth.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authenticate, getOnboardingDetails);
router.post("/send-otp", authenticate, sendOtpValidator, sendOtp);
router.post("/verify-otp", authenticate, verifyOtpValidator, verifyOtp);

export default router;
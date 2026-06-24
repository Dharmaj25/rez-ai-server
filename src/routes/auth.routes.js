import express from "express";
import {
    getOnboardingDetails, sendOtp, verifyOtp,
    refreshAccessToken, resendOtp, setPassword,
    login, requestPasswordReset, validateResetToken,
    resetPassword
} from "../controllers/auth.controller.js";
import {
    emailValidator, passwordValidator, verifyOtpValidator,
    loginValidator, resetPasswordValidator
} from "../validations/auth.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.get("/me", authenticate, getOnboardingDetails);

router.post("/refresh", refreshAccessToken);
router.post("/send-otp", emailValidator, sendOtp);
router.post("/verify-otp", verifyOtpValidator, verifyOtp);
router.post("/resend-otp", emailValidator, resendOtp)
router.post("/set-password", passwordValidator, setPassword)

router.post("/login", loginValidator, login);

router.post("/forgot-password", emailValidator, requestPasswordReset);
router.get("/reset-password/validate", validateResetToken);
router.post("/reset-password", resetPasswordValidator, resetPassword)

export default router;
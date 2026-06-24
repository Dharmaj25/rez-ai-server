import { fetchOnboardingDetails, sendOtpAndSave, checkOtp, resendOtpAndUpdate, savePassword, checkEmailPassword, saveResetToken, checkResetToken, resetUserPassword } from "../services/auth.service.js"
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/mailer.utils.js";

export const getOnboardingDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        const userData = await fetchOnboardingDetails(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User details found",
            data: userData
        });
    }
    catch (error) {
        console.log("Error in fetching onboarding details : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const sendOtp = async (req, res) => {
    try {
        const email = req.body.email;
        const otpSent = await sendOtpAndSave(email);

        if (!otpSent) {
            return res.status(409).json({ success: false, message: "Email is already registered" });
        }

        return res.status(200).json({
            success: true,
            message: "Otp sent to user's email",
        });

    } catch (error) {
        console.error("Internal Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again later."
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const validatedUser = await checkOtp(email, otp);

        if (!validatedUser) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            })
        }

        return res.status(200).json({
            success: true,
            message: "OTP Validated successfully",
        })
    }
    catch (error) {
        console.log("Error in otp validation : ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};

export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Refresh token missing"
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });

        return res.status(200).json({
            success: true,
            message: "Access token refreshed",
            accessToken: newAccessToken
        });

    } catch (error) {
        console.log("Error refreshing token:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token",
            code: "REFRESH_TOKEN_INVALID"
        });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const otpSent = await resendOtpAndUpdate(email);

        if (!otpSent) {
            return res.status(400).json({
                success: false,
                message: "Email is not registered"
            })
        }

        return res.status(200).json({
            success: false,
            message: "Otp re-sent to user's email"
        })
    }
    catch (err) {
        console.log("Error sending OTP: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const setPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const updatedUser = await savePassword(email, password);

        if (!updatedUser) {
            return res.status(400).json({
                success: false,
                message: "Email not registered"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Password updted successfully"
        })
    }
    catch (err) {
        console.log("Error setting passwrod: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error occured"
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userStatus = await checkEmailPassword(email, password);

        if (!userStatus) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or passwrord"
            })
        }

        const accessToken = await jwt.sign({ id: userStatus._id, email: userStatus.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
        const refreshToken = await jwt.sign({ id: userStatus._id, email: userStatus.email, type: "refresh" }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: accessToken,
            data: userStatus
        });
    }
    catch (err) {
        console.log("Error logging in : ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const randomToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(randomToken).digest("hex");
        const resetToken = { tokenHash, expiresAt: new Date(Date.now() + 30 * 60 * 1000) };

        const resetTokenSaved = await saveResetToken(email, resetToken);

        if (resetTokenSaved) {
            const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${randomToken}`;

            await sendEmail({
                to: email,
                subject: "Reset Your Password",
                html: `
                <h2>Password Reset Request</h2>
                <p>We received a request to reset your password.</p>
                <p>
                    <a href="${resetLink}">
                        Reset Password
                    </a>
                </p>
                <p>
                    This link will expire in 30 minutes.
                </p>
                <p>
                    If you did not request this, you can safely ignore this email.
                </p>
            `
            });
        }

        return res.status(200).json({
            success: true,
            message: "If an account exists with this email address, a password reset link has been sent."
        });
    }
    catch (err) {
        console.log("Error sending reset link: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};

export const validateResetToken = async (req, res) => {
    const token = req.query.token;
    const isTokenValid = await checkResetToken(token);

    if (!isTokenValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired token"
        })
    }

    return res.status(200).json({
        success: true,
        message: "Valid reset token"
    });
}

export const resetPassword = async (token, password) => {   
    const passwordUpdated = await resetUserPassword()
}   
import mongoose from "mongoose";

import { fetchOnboardingDetails, sendOtpAndSave } from "../services/auth.service.js"

//Returns the important flags to check for user's onboarding progress 
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

//Send's otp to user's email
export const sendOtp = async (req, res) => {
    try {
        const userId = req.user.id;
        const email = req.body.email;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const updatedUser = await sendOtpAndSave(userId, email);

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Otp sent to user's email",
        });

    } catch (error) {
        // Any error in sendEmail or the DB update ends up here
        console.error("Internal Error:", error); 
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again later."
        });
    }
};

//matches the otp sent by user , if not matched send not matched, if matched,
//update users flag isOtpVerified to true , and onBoardingStep to 1
export const verifyOtp = async () => {

}


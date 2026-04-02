import { fetchOnboardingDetails, sendOtpAndSave, checkOtp } from "../services/auth.service.js"

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
        const userId = req.user.id;
        const email = req.body.email;

        const updatedUser = await sendOtpAndSave(userId, email);

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
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
        const userId = req.user.id
        const otp = req.body.otp

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required"
            })
        }

        const isOtpValid = await checkOtp(userId, otp);

        if (!isOtpValid) {
            return res.staus(400).json({
                success: false,
                message: "Incorrect OTP. Please try again"
            })
        }
        
        return res.status(200).json({
            success: true,
            message : "OTP Validated successfully"
        })
    }
    catch (error) {
        console.log("Error in otp validation : ", error);
        return res.status(500).json({
            success: false,
            mesasge: "Internal server error"
        })
    }
};

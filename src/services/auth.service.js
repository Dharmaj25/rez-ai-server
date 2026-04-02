import userModel from "../models/user.model.js"
import { generateOTP } from "../utils/crypto.util.js";
import { sendEmail } from "../utils/mailer.utils.js";

export const fetchOnboardingDetails = async (id) => {
    const user = await userModel.
        findById(id, { isEmailVerified: 1, isOnBoardingCompleted: 1, onBoardingStep: 1 }).
        lean();
    return user;
}

export const sendOtpAndSave = async (id, email) => {
    const otp = generateOTP();
    const htmlContent = `<h1>Your OTP is: ${otp}</h1><p>It expires in 5 minutes.</p>`;

    await sendEmail({
        to: email,
        subject: "Verify Your Email",
        html: htmlContent
    });

    const updatedUser = await userModel.findByIdAndUpdate(id, {
        email,
        otp: {
            code: otp,
            expiresAt: Date.now() + 5 * 60 * 1000
        }
    }, { new: true });

    return updatedUser;
};

export const checkOtp = async (id, otp) => {
    const user = await userModel.findByIdAnd(id);
    if(!user || !user.otp || user.otp.code != otp || user.otp.expiresAt < Date.now()){
        return false
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, {
        isEmailVerified : true,
        onBoardingStep : 1,
        $unset : {otp : ""}
    }, {new: true})

    return true;
}

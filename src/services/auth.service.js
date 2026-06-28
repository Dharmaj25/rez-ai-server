import userModel from "../models/user.model.js"
import { generateOTP } from "../utils/crypto.util.js";
import { sendEmail } from "../utils/mailer.utils.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const sendOtpAndSave = async (email) => {
    const user = await userModel.findOne({ email });
    if (!user) {
        const otp = generateOTP();
        const htmlContent = `<h1>Your OTP is: ${otp}</h1><p>It expires in 5 minutes.</p>`;
        await sendEmail({
            to: email,
            subject: "Verify Your Email",
            html: htmlContent
        });

        const hashedOtp = await bcrypt.hash(otp.toString(), 10);

        const insertedUser = await userModel.create({
            email,
            otp: {
                code: hashedOtp,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                attempts: 1
            },
            accountSetupStep: "OTP_VERIFICATION"
        });

        return insertedUser;
    }
    else {
        return user;
    }
};

export const checkOtp = async (email, otp) => {

    const user = await userModel.findOne({ email });

    if (!user || !user.otp) {
        return false
    }

    const isOtpMatched = await bcrypt.compare(otp.toString(), user.otp.code);

    if (!isOtpMatched || user.otp.expiresAt < new Date()) {
        return false
    }

    const updatedUser = await userModel.findOneAndUpdate({ email }, {
        isEmailVerified: true,
        $unset: { otp: "" },
        accountSetupStep: "PASSWORD_SETUP"
    },
        { new: true }
    )

    return updatedUser;
}

export const resendOtpAndUpdate = async (email) => {
    const user = await userModel.findOne({ email });

    if (!user || !user.otp) {
        return false
    }

    const otp = generateOTP().toString();

    const htmlContent = `<h1>Your OTP is: ${otp}</h1><p>It expires in 5 minutes.</p>`;

    await sendEmail({
        to: email,
        subject: "Verify Your Email",
        html: htmlContent
    });

    const hashedOtp = await bcrypt.hash(otp, 10);
    const updatedUser = await userModel.findOneAndUpdate({ email },
        {
            $set: {
                "otp.code": hashedOtp,
                "otp.expiresAt": new Date(Date.now() + 5 * 60 * 1000),
            },
            $inc: {
                "otp.attempts": 1
            }
        }
        , {
            new: true
        });

    return updatedUser;
}

export const savePassword = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await userModel.findOneAndUpdate({ email }, {
        passwordHash: hashedPassword,
        accountSetupStep: "PERSONAL_DETAILS"
    }, { new: true });

    return updatedUser;
}

export const checkEmailPassword = async (email, password) => {
    const user = await userModel.findOne({ email }).select('passwordHash _id email isEmailVerified accountSetupStep onboarding');

    if (!user) {
        return false;
    }

    const passwordMatched = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatched) {
        return false;
    }

    return {
        _id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        accountSetupStep: user.accountSetupStep,
        onboarding: user.onboarding,
    };
};


export const saveResetToken = async (email, resetToken) => {
    const updatedUser = await userModel.findOneAndUpdate(
        { email },
        {
            $set: {
                "resetPassword.tokenHash": resetToken.tokenHash,
                "resetPassword.expiresAt": resetToken.expiresAt
            }
        },
        { new: true }
    );

    return updatedUser;
};

export const checkResetToken = async (token) => {
    const tokennHash = crypto.createHash("sha256").update(token || "").digest("hex");

    const user = await userModel.findOne({
        "resetPassword.tokenHash": tokennHash,
        "resetPassword.expiresAt": { $gt: new Date() }
    });

    return user;
}

export const resetUserPassword = async (token, password) => {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
        "resetPassword.tokenHash": tokenHash,
        "resetPassword.expiresAt": { $gt: new Date() }
    });

    if (!user) {
        return false;
    }

    const newPasswordHash = await bcrypt.hash(password, 10);

    const updatedUser = await userModel.findByIdAndUpdate(user._id, {
        $set: {
            "passwordHash": newPasswordHash
        },
        $unset: {
            resetPassword: 1
        }
    }, { new: true })

    return updatedUser;
}
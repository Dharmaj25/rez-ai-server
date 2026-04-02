import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        authProvider: {
            type: String,
            enum: ["local", "google", "github", "linkedin"],
            default: "local"
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        otp: {
            code: {
                type: String
            },
            expiresAt: {
                type: Date
            }
        },
        isOnBoardingCompleted: {
            type: Boolean,
            default: false
        },
        onBoardingStep: {
            type: Number,
            default: 0
        },
        personal_details: {
            first_name: {
                type: String,
                required: true,
                trim: true
            },
            last_name: {
                type: String,
                required: true,
                trim: true
            },
            country: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            phone: {
                country_code: {
                    type: String
                },
                number: {
                    type: String
                }
            },
        },
        professional_details: {
            career_level: String,
            industry: String,
            skills: [String],
            total_experience: String,
            current_role: String,
            highest_education: String,
            graduation_year: String,
            linkedin_profile: String,
            portfolio: String
        },
        career_target: {
            target_role: {
                type: String,
                required: true
            },
            pitch: String
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema)

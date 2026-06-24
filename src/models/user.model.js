import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true
        },

        passwordHash: {
            type: String
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

        resetPassword: {
            tokenHash: String,
            expiresAt: Date
        },

        otp: {
            code: {
                type: String
            },
            expiresAt: {
                type: Date
            },
            attempts: {
                type: Number,
                default: 0
            }
        },

        accountSetupStep: {
            type: String,
            enum: [
                "OTP_VERIFICATION",
                "PASSWORD_SETUP",
                "PERSONAL_DETAILS",
                "COMPLETED"
            ],
            default: "OTP_VERIFICATION"
        },

        onboarding: {
            personalCompleted: {
                type: Boolean,
                default: false
            },

            professionalCompleted: {
                type: Boolean,
                default: false
            },

            careerCompleted: {
                type: Boolean,
                default: false
            }
        },


        personalDetails: {
            first_name: {
                type: String,
                trim: true
            },

            last_name: {
                type: String,
                trim: true
            },

            country: {
                type: String,
                trim: true
            },

            state: {
                type: String,
                trim: true
            },

            city: {
                type: String,
                trim: true
            },

            phone: {
                country_code: {
                    type: String
                },

                number: {
                    type: String
                }
            }
        },


        professionalDetails: {
            career_level: {
                type: String
            },

            industry: {
                type: String
            },

            skills: [
                {
                    type: String
                }
            ],

            total_experience: {
                type: Number
            },

            current_role: {
                type: String
            },

            highest_education: {
                type: String
            },

            graduation_year: {
                type: Number
            },

            linkedin_profile: {
                type: String
            },

            portfolio: {
                type: String
            }
        },


        careerTarget: {
            target_role: {
                type: String
            },

            pitch: {
                type: String
            }
        }
    },
    {
        timestamps: true
    }
);


export default mongoose.model("User", userSchema);
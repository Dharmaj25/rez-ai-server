import express from "express";
import { updatePersonalDetails, updateProfessionalDetails, updateCareerSummary } from "../controllers/user.controller.js";
import { personalDetailsValidator, professionalDetailsValidator, careerSummaryValidator } from "../validations/user.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.patch("/onboarding/personal", personalDetailsValidator, updatePersonalDetails);
userRouter.patch("/onboarding/professional", authenticate,professionalDetailsValidator, updateProfessionalDetails);
userRouter.patch("/onboarding/career", authenticate, careerSummaryValidator, updateCareerSummary);

export default userRouter;
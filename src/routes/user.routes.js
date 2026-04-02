import express from "express";
import { updatePersonalDetails, updateProfessionalDetails, updateCareerSummary } from "../controllers/user.controller.js";
import { personalDetailsValidator, professionalDetailsValidator, careerSummaryValidator } from "../validations/user.validator";
import { authenticate } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/onboarding/personal", authenticate, personalDetailsValidator, updatePersonalDetails);
userRouter.post("/onboarding/professioanl", authenticate, professionalDetailsValidator, updateProfessionalDetails);
userRouter.post("/onboarding/perosnal", authenticate, careerSummaryValidator, updateCareerSummary);
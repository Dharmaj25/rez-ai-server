import { body, validationResult } from "express-validator";

// --- Constants ---
const NAME_REGEX = /^[a-zA-Z\s.'-]+$/;
const LOCATION_REGEX = /^[a-zA-Z\s.'\-&,]+$/;
const INDUSTRY_REGEX = /^[a-zA-Z0-9\s.&()/+-]+$/;
const SKILL_REGEX = /^[a-zA-Z0-9\s.+#/()-]+$/;

const CURRENT_YEAR = new Date().getFullYear();

const CAREER_LEVELS = ["student", "junior", "mid", "senior", "lead"];
const EDUCATION_LEVELS = ["high school", "bachelor's degree", "master's degree", "phd", "self-taught"];

// --- Helpers ---
const formatFieldName = (field) => field.replace(/_/g, " ");

// --- Centralized Error Handler ---
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

// --- Reusable Validator ---
const textFieldValidator = (isRequired, field, regex) => {
    let validator = body(field).trim();

    if (isRequired) {
        validator = validator
            .notEmpty()
            .withMessage(`${formatFieldName(field)} is required`)
            .bail();
    } else {
        validator = validator.optional({ checkFalsy: true });
    }

    return validator
        .matches(regex)
        .withMessage(`${formatFieldName(field)} contains invalid characters`)
        .escape();
};

// --- Personal Details Validator ---
export const personalDetailsValidator = [
    textFieldValidator(true, "first_name", NAME_REGEX),
    textFieldValidator(true, "last_name", NAME_REGEX),

    textFieldValidator(true, "country", LOCATION_REGEX),
    textFieldValidator(true, "state", LOCATION_REGEX),
    textFieldValidator(true, "city", LOCATION_REGEX),

    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .bail()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage("Invalid email format"),

    body("country_code")
        .trim()
        .notEmpty().withMessage("Country code is required")
        .bail()
        .matches(/^\+\d{1,4}$/).withMessage("Invalid country code"),

    body("number")
        .trim()
        .notEmpty().withMessage("Phone number is required")
        .bail()
        .matches(/^\d{7,15}$/).withMessage("Invalid phone number"),

    handleValidationErrors
];

// --- Professional Details Validator ---
export const professionalDetailsValidator = [
    body("career_level")
        .trim()
        .notEmpty().withMessage("Career level is required")
        .bail()
        .isIn(CAREER_LEVELS)
        .withMessage(`Invalid career level. Valid options: ${CAREER_LEVELS.join(", ")}`),

    textFieldValidator(true, "industry", INDUSTRY_REGEX),

    body("skills")
        .notEmpty().withMessage("At least one skill is required")
        .bail()
        .isArray({ min: 1, max: 20 })
        .withMessage("Skills must be an array of 1 to 20 items"),

    body("skills.*")
        .trim()
        .isLength({ min: 2, max: 30 }).withMessage("Each skill must be 2-30 characters")
        .bail()
        .matches(SKILL_REGEX).withMessage("Skill contains invalid characters")
        .escape(),

    body("total_experience")
        .notEmpty().withMessage("Total experience is required")
        .bail()
        .isInt({ min: 0, max: 40 })
        .withMessage("Experience must be between 0 and 40 years"),

    body("current_role")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage("Role must be 2-50 characters")
        .matches(/^[a-zA-Z0-9\s.\-/]+$/).withMessage("Role contains invalid characters")
        .escape(),

    body("highest_education")
        .trim()
        .notEmpty().withMessage("Highest education is required")
        .bail()
        .isIn(EDUCATION_LEVELS)
        .withMessage(`Invalid education. Valid: ${EDUCATION_LEVELS.join(", ")}`),

    body("graduation_year")
        .notEmpty().withMessage("Graduation year is required")
        .bail()
        .isInt({ min: 1950, max: CURRENT_YEAR })
        .withMessage(`Graduation year should be between 1950 and ${CURRENT_YEAR}`),

    body("linkedin_profile")
        .optional({ checkFalsy: true })
        .trim()
        .isURL().withMessage("Must be a valid URL")
        .bail()
        .custom((v) => /^https?:\/\/(www\.)?linkedin\.com\/.+$/i.test(v))
        .withMessage("Must be a valid LinkedIn profile URL"),

    body("portfolio")
        .optional({ checkFalsy: true })
        .trim()
        .isURL().withMessage("Must be a valid portfolio URL"),

    handleValidationErrors
];

// --- Career Summary Validator ---
export const careerSummaryValidator = [
    body("target_role")
        .trim()
        .notEmpty().withMessage("Target role is required")
        .bail()
        .isLength({ min: 2, max: 50 })
        .withMessage("Target role must be 2-50 characters")
        .escape(),

    body("pitch")
        .trim()
        .notEmpty().withMessage("Professional pitch is required")
        .bail()
        .isLength({ min: 3, max: 500 })
        .withMessage("Professional pitch must be 3-500 characters")
        .escape(),

    handleValidationErrors
];
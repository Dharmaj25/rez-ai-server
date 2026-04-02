import { body, validationResult } from "express-validator";

const nameRegex = /^[A-Za-z\s]+$/;

const validateTextField = async (field, label, req) => {
    await body(field)
        .trim()
        .notEmpty()
        .withMessage(`${label} is required`)
        .matches(nameRegex)
        .withMessage(`${label} cannot contain any special characters or numbers`)
        .run(req);
};

export const personalDetailsValidator = async (req, res, next) => {
    await Promise.all([
        validateTextField("first_name", "First name", req),
        validateTextField("last_name", "Last name", req),
        validateTextField("country", "Country", req),
        validateTextField("state", "State", req),
        validateTextField("city", "City", req),
    ]);

    await body("country_code")
        .notEmpty().withMessage("Country code is required")
        .matches(/^\+\d{1,4}$/)
        .withMessage("Invalid country code")
        .run(req);

    await body("phone_number")
        .notEmpty().withMessage("Phone Number is required")
        .matches(/^\d{7,15}$/)
        .withMessage("Invalid phone number")
        .run(req);

    await body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Minimum 8 characters")
        .run(req);

    await body("confirm_password")
        .notEmpty().withMessage("Confirm password is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
        .run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: errors.array()
        });
    }

    next();
};

export const professionalDetailsValidator = async (req, res, next) => {

}

export const careerSummaryValidator = async (req, res, next) => {

}
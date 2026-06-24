const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const emailValidator = (req, res, next) => {
    const { email } = req.body || {};

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        })
    }

    next();
}

export const verifyOtpValidator = (req, res, next) => {
    const { otp, email } = req.body || {};

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" })
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        })
    }

    if (!otp || otp.toString().trim().length == 0) {
        return res.status(400).json({ success: false, message: "Otp is required" })
    }

    next();
}

export const passwordValidator = (req, res, next) => {
    const { email, password, confirmPassword } = req.body || {};

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    if (!password) {
        return res.status(400).json({
            success: false,
            message: "Password is required"
        });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password and confirm password should be same"
        });
    }

    next();
};

export const loginValidator = (req, res, next) => {
    const { email, password } = req.body || {};

    if (!email || email.toString().trim().length == 0 || !password || password.toString().trim().length == 0) {
        return res.status(400).json({
            success: false,
            message: "Email and password cannot be empty"
        })
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        })
    }

    next();
}

export const resetPasswordValidator = async (req, res, next) => {
    const { token, password, confirmPassword } = req.body || {}

    if (!token || token.toString().trim().length == 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid token"
        })
    }

    if (!password || password.toString().trim().length == 0) {
        return res.status(400).json({
            success: false,
            message: "Password is required"
        })
    }

    if (!confirmPassword || confirmPassword !== password) {
        return res.status(400).json({
            success: false,
            message: "Password and confirm password should be same"
        })
    }

    next();
}
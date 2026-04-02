export const sendOtpValidator = (req,res,next) => {
    const {email} = req.body;
    if(!email){
        return res.status(400).json({success: false, message : "Email is required"});
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        return res.status(400).json({
            success: false,
            message : "Invalid email format"
        })
    }

    next()
}

export const verifyOtpValidator = (req,res,next) => {
    const {otp} = req.body;

    if(!otp){
        return res.status(400).json({
            success: false,
            message : "Otp is required"
        })
    }

    next();
}
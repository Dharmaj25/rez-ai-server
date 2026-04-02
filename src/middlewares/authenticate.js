import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
    const authHeader = req.header["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token missing"
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedPayload) => {

        if (err) {
            return res.status(403).json({
                success: false,
                message: "Invalid or expired token"
            })
        }

        if (!decodedPayload.id || !mongoose.Types.ObjectId.isValid(decodedPayload.id)) {
            return res.status(401).json({
                success: false,
                message: "Invalid session data",
            })
        }

        req.user = decodedPayload;
        next();
    })
}
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token missing"
        });
    }

    try {
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedPayload.id || !mongoose.Types.ObjectId.isValid(decodedPayload.id)) {
            return res.status(401).json({
                success: false,
                message: "Invalid session data",
            });
        }

        req.user = decodedPayload;
        next();

    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};
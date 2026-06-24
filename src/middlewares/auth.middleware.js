import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access token missing"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        req.user = {id: decoded.id};
        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};
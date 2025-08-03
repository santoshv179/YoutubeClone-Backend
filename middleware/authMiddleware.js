import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
    let token;

    // ✅ Check if Authorization header is present
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token
            token = req.headers.authorization.split(" ")[1];

            // ✅ Check if token is still missing
            if (!token) {
                return res.status(401).json({ message: "Not authorized, no token" });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request
            req.user = await User.findById(decoded.id).select("-password");

            return next();
        } catch (error) {
            console.error("Invalid token:", error.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    //  If no Authorization header at all
    return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
};
